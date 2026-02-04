import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAcessoStore = defineStore('acesso', {
  state: () => ({
    loading: false,
    token: localStorage.getItem('token'),
    acessos: [], // Array de acessos do usuário
    errorMessage: '',
    successMessage: ''
  }),

  getters: {
    // Obter todos os acessos
    getAcessos: (state) => state.acessos,

    // Verificar se o usuário tem acesso a um programa específico
    temAcesso: (state) => (idPrograma, tipoAcesso = 'visualizar') => {
      if (!idPrograma) {
        console.warn('[AcessoStore] temAcesso chamado sem idPrograma')
        return false
      }

      const acesso = state.acessos.find(a => a.id_programa === idPrograma)

      if (!acesso) {
        console.warn(`[AcessoStore] Programa ${idPrograma} não encontrado nos acessos`)
        return false
      }

      // Se pedir visualizar, apenas retorna true se tiver permissão
      if (tipoAcesso === 'visualizar') {
        const temPerm = acesso.visualizar === 'S'
        console.log(`[AcessoStore] Verificando ${idPrograma}.visualizar: ${temPerm}`)
        return temPerm
      }

      // Para outros tipos de acesso
      const temPerm = acesso[tipoAcesso] === 'S'
      console.log(`[AcessoStore] Verificando ${idPrograma}.${tipoAcesso}: ${temPerm}`)
      return temPerm
    },

    // Obter acesso de um programa específico
    getAcessoPrograma: (state) => (idPrograma) => {
      return state.acessos.find(a => a.id_programa === idPrograma)
    },

    // Obter acessos por módulo
    getAcessosPorModulo: (state) => (modulo) => {
      // Os acessos serão filtrados por módulo baseado no prefixo do id_programa
      // Exemplo: FFIN (Financeiro), FVEN (Vendas), etc
      return state.acessos.filter(a => a.id_programa.startsWith(modulo))
    }
  },

  actions: {
    // Buscar acessos do usuário na empresa selecionada
    async buscarAcessos(idEmpresa) {
      this.loading = true

      console.log('[AcessoStore] Iniciando buscarAcessos com idEmpresa:', idEmpresa)

      try {
        console.log('[AcessoStore] Fazendo requisição GET /useraccess/' + idEmpresa)

        const response = await api.get(`/useraccess/${idEmpresa}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        console.log('[AcessoStore] Resposta recebida:', response.data)

        // Armazenar acessos
        this.acessos = Array.isArray(response.data?.data) ? response.data.data : response.data
        this.errorMessage = ''

        console.log('[AcessoStore] Acessos armazenados:', this.acessos)
        console.log('[AcessoStore] Total de programas:', this.acessos.length)

        // Salvar no localStorage para acesso rápido
        localStorage.setItem('usuarioAcessos', JSON.stringify(this.acessos))
        console.log('[AcessoStore] Acessos salvos no localStorage')

        return this.acessos
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar acessos'
        console.error('[AcessoStore] Erro ao buscar acessos:', error)
        console.error('[AcessoStore] Status:', error.response?.status)
        console.error('[AcessoStore] Dados do erro:', error.response?.data)
        return null
      } finally {
        this.loading = false
      }
    },

    // Carregar acessos do localStorage
    carregarAcessosLocal() {
      console.log('[AcessoStore] Carregando acessos do localStorage...')
      const acessosLocal = localStorage.getItem('usuarioAcessos')

      if (acessosLocal) {
        try {
          this.acessos = JSON.parse(acessosLocal)
          console.log('[AcessoStore] Acessos carregados do localStorage:', this.acessos)
          console.log('[AcessoStore] Total de programas:', this.acessos.length)
          return this.acessos
        } catch (e) {
          console.error('[AcessoStore] Erro ao parsear acessos do localStorage:', e)
          return null
        }
      }

      console.log('[AcessoStore] Nenhum acesso encontrado no localStorage')
      return null
    },

    // Atualizar acessos de um programa
    async atualizarAcessosPrograma(idGrupoUsuario, programas) {
      this.loading = true

      try {
        // Enviar todos os programas com suas permissões
        const payload = {
          id_grupousuario: idGrupoUsuario,
          programas: programas
        }

        const response = await api.post(`/grupousuarioprog`, payload, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        this.successMessage = 'Acessos atualizados com sucesso'
        console.log('Acessos atualizados:', response.data)

        // Recarregar acessos
        await this.buscarAcessos(idGrupoUsuario)

        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao atualizar acessos'
        console.error('Erro ao atualizar acessos:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // Limpar acessos
    limparAcessos() {
      this.acessos = []
      localStorage.removeItem('usuarioAcessos')
    },

    // DEBUG: Mostrar estado atual
    debug() {
      console.group('[AcessoStore] Estado Atual')
      console.log('Loading:', this.loading)
      console.log('Token:', this.token ? 'Presente' : 'Ausente')
      console.log('Total de Acessos:', this.acessos.length)
      console.log('Acessos:', this.acessos)
      console.log('Error:', this.errorMessage)
      console.log('Success:', this.successMessage)
      console.log('localStorage.usuarioAcessos:', localStorage.getItem('usuarioAcessos') ? 'Presente' : 'Ausente')
      console.log('localStorage.id_grupousuario:', localStorage.getItem('id_grupousuario'))
      console.groupEnd()
    }
  }
})