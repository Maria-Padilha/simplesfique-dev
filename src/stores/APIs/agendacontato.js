import { defineStore } from "pinia"
import api from "@/services/api"
import { toast } from "vue3-toastify"

export const useAgendaContatoStore = defineStore('agendacontato', {
  state: () => ({
    loading: false,
    token: localStorage.getItem('token'),
    contatos: [],
  }),

  actions: {
    normalizarDados(dados) {
      if (Array.isArray(dados)) return dados.map(item => this.normalizarDados(item))
      if (typeof dados === 'object' && dados !== null) {
        const normalizado = {}
        for (const [key, value] of Object.entries(dados)) {
          normalizado[key.toLowerCase()] = value
        }
        return normalizado
      }
      return dados
    },

    /**
     * Listar contatos
     * GET /agendacontato?nome=**&telefone=*
     */
    async listarContatos(params = {}) {
      this.loading = true
      try {
        const query = new URLSearchParams()
        if (params.nome) query.append('nome', params.nome)
        if (params.telefone) query.append('telefone', params.telefone)
        const qs = query.toString()
        const url = `/agendacontato${qs ? '?' + qs : ''}`
        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        const dados = response.data.data || response.data
        this.contatos = this.normalizarDados(Array.isArray(dados) ? dados : [])
      } catch (error) {
        console.error('Erro ao listar contatos da agenda:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Cadastrar contato
     * POST /agendacontato
     * Payload: { nome, telefone, tipo }
     */
    async cadastrarContato(dados) {
      this.loading = true
      try {
        const response = await api.post('/agendacontato', { data: [dados] }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        toast.success('Contato salvo com sucesso!')
        await this.listarContatos()
        return response.data
      } catch (error) {
        const msg = error.response?.data?.message || 'Erro ao salvar contato.'
        toast.error(msg)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Editar contato
     * PUT /agendacontato/:id
     * Payload: { data: [{ nome, telefone, tipo }] }
     */
    async editarContato(id, dados) {
      this.loading = true
      try {
        const response = await api.put(`/agendacontato/${id}`, { data: [dados] }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        toast.success('Contato atualizado com sucesso!')
        await this.listarContatos()
        return response.data
      } catch (error) {
        const msg = error.response?.data?.message || 'Erro ao editar contato.'
        toast.error(msg)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Excluir contato
     * DELETE /agendacontato/:id
     */
    async excluirContato(id) {
      this.loading = true
      try {
        await api.delete(`/agendacontato/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        toast.success('Contato excluído!')
        this.contatos = this.contatos.filter(c => c.id !== id)
      } catch (error) {
        const msg = error.response?.data?.message || 'Erro ao excluir contato.'
        toast.error(msg)
      } finally {
        this.loading = false
      }
    },
  }
})
