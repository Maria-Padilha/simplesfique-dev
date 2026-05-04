import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { toast } from 'vue3-toastify'

// Mapeia tipo_alarme da vstb_agenda
// 1 = Data específica, 2 = Dia(s) da semana específico(s)
export const TIPOS_ALARME = [
  { label: 'Data específica', value: 1, icon: 'mdi-calendar' },
  { label: 'Dia(s) da semana', value: 2, icon: 'mdi-calendar-week' },
]

// Mapeia notificar da vstb_agenda
// 1 = 15min antes, 2 = 30min antes, 3 = 1hora antes
export const OPCOES_NOTIFICAR = [
  { label: '15 minutos antes', value: 1 },
  { label: '30 minutos antes', value: 2 },
  { label: '1 hora antes', value: 3 },
]

// Dias da semana (campos individuais da vstb_agenda)
export const DIAS_SEMANA_CAMPOS = [
  { label: 'Dom', field: 'domingo' },
  { label: 'Seg', field: 'segunda' },
  { label: 'Ter', field: 'terca' },
  { label: 'Qua', field: 'quarta' },
  { label: 'Qui', field: 'quinta' },
  { label: 'Sex', field: 'sexta' },
  { label: 'Sáb', field: 'sabado' },
]

// Tipo do contato (vstb_contato.tipo)
// U = Público, V = Privado
export const TIPOS_CONTATO = [
  { label: 'Privado (só você)', value: 'V', icon: 'mdi-lock-outline', color: 'blue' },
  { label: 'Público (todos veem)', value: 'U', icon: 'mdi-earth', color: 'green' },
]

export const useAgendaStore = defineStore('agenda', () => {
  const loading = ref(false)
  const compromissos = ref([])

  const getToken = () => localStorage.getItem('token')

  const normalizarDados = (dados) => {
    if (Array.isArray(dados)) return dados.map(item => normalizarDados(item))
    if (typeof dados === 'object' && dados !== null) {
      const normalizado = {}
      for (const [key, value] of Object.entries(dados)) {
        normalizado[key.toLowerCase()] = value
      }
      return normalizado
    }
    return dados
  }

  // GET /agendacontatonot
  const listarCompromissos = async () => {
    loading.value = true
    try {
      const response = await api.get('/agendacontatonot', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      const dados = response.data?.data || response.data
      compromissos.value = normalizarDados(Array.isArray(dados) ? dados : [])
    } catch (error) {
      console.error('Erro ao listar compromissos:', error)
    } finally {
      loading.value = false
    }
  }

  // POST /agendacontatonot
  const adicionarCompromisso = async (dados) => {
    loading.value = true
    try {
      const response = await api.post('/agendacontatonot', dados, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      toast.success('Compromisso salvo com sucesso!')
      await listarCompromissos()
      return response.data
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar compromisso.'
      toast.error(msg)
      return null
    } finally {
      loading.value = false
    }
  }

  // PUT /agendacontatonot/:id
  const editarCompromisso = async (id, dados) => {
    loading.value = true
    try {
      const response = await api.put(`/agendacontatonot/${id}`, dados, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      toast.success('Compromisso atualizado com sucesso!')
      await listarCompromissos()
      return response.data
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao atualizar compromisso.'
      toast.error(msg)
      return null
    } finally {
      loading.value = false
    }
  }

  // DELETE /agendacontatonot/:id
  const excluirCompromisso = async (id) => {
    loading.value = true
    try {
      await api.delete(`/agendacontatonot/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      toast.success('Compromisso excluído!')
      compromissos.value = compromissos.value.filter(c => c.id !== id)
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao excluir compromisso.'
      toast.error(msg)
    } finally {
      loading.value = false
    }
  }

  // Próximos compromissos (tipo_alarme=1, data_notificacao >= hoje)
  const proximosCompromissos = computed(() => {
    const agora = new Date()
    agora.setHours(0, 0, 0, 0)
    return [...compromissos.value]
      .filter(c => {
        if (c.tipo_alarme === 2) return true // por dia da semana: sempre exibe
        const dataComp = new Date(c.data_notificacao + 'T00:00:00')
        return dataComp >= agora
      })
      .sort((a, b) => {
        if (a.tipo_alarme === 2 && b.tipo_alarme === 2) return 0
        if (a.tipo_alarme === 2) return 1
        if (b.tipo_alarme === 2) return -1
        return new Date(a.data_notificacao) - new Date(b.data_notificacao)
      })
  })

  // Para o calendário: agrupados por data_notificacao
  const compromissosPorData = computed(() => {
    const mapa = {}
    compromissos.value.forEach(c => {
      if (c.tipo_alarme === 1 && c.data_notificacao) {
        if (!mapa[c.data_notificacao]) mapa[c.data_notificacao] = []
        mapa[c.data_notificacao].push(c)
      }
    })
    return mapa
  })

  // Badge: eventos nos próximos 7 dias ou recorrentes por dia da semana
  const quantidadeProximos = computed(() => {
    const agora = new Date()
    agora.setHours(0, 0, 0, 0)
    const limite = new Date(agora)
    limite.setDate(limite.getDate() + 7)
    return compromissos.value.filter(c => {
      if (c.tipo_alarme === 2) return true
      const dataComp = new Date(c.data_notificacao + 'T00:00:00')
      return dataComp >= agora && dataComp <= limite
    }).length
  })

  return {
    loading,
    compromissos,
    proximosCompromissos,
    compromissosPorData,
    quantidadeProximos,
    listarCompromissos,
    adicionarCompromisso,
    editarCompromisso,
    excluirCompromisso,
  }
})
