import { defineStore } from "pinia"
import apiPhp from "@/services/apiPhp"
import { toast } from "vue3-toastify"

export const useAgendaContatoStore = defineStore('agendacontato', {
  state: () => ({
    loading: false,
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
     * GET /manutencao/agendas?nome=**&telefone=*
     */
    async listarContatos(params = {}) {
      this.loading = true
      try {
        const response = await apiPhp.get('/manutencao/agendas', { params })
        const dados = response.data?.data ?? response.data ?? []
        this.contatos = this.normalizarDados(Array.isArray(dados) ? dados : [])
      } catch (error) {
        // silent — não exibe erro em listagem
      } finally {
        this.loading = false
      }
    },

    /**
     * Cadastrar contato
     * POST /manutencao/agendas
     * Payload: { nome, telefone, tipo }
     */
    async cadastrarContato(dados) {
      this.loading = true
      try {
        const response = await apiPhp.post('/manutencao/agendas', dados)
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
     * PUT /manutencao/agendas/:id
     * Payload: { nome, telefone, tipo }
     */
    async editarContato(id, dados) {
      this.loading = true
      try {
        const response = await apiPhp.put(`/manutencao/agendas/${id}`, dados)
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
     * DELETE /manutencao/agendas/:id
     */
    async excluirContato(id) {
      this.loading = true
      try {
        await apiPhp.delete(`/manutencao/agendas/${id}`)
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
