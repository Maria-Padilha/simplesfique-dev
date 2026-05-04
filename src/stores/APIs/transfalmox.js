import { defineStore } from "pinia"
import api from "@/services/api"
import { toast } from "vue3-toastify"

export const useTransfAlmoxStore = defineStore('transfalmox', {
  state: () => ({
    loading: false,
    errorMessage: '',
    successMessage: '',

    transferencias: [],
    transferencia: null,
  }),

  actions: {
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return { Authorization: `Bearer ${token}` }
    },

    /**
     * Listar transferências por empresa
     * GET /transfalmox/:idemp
     */
    async listarTransferencias(idemp) {
      this.loading = true
      try {
        const response = await api.get(`/transfalmox/${idemp}`, {
          headers: this.getAuthHeaders()
        })
        const dados = response.data?.data || response.data
        this.transferencias = Array.isArray(dados) ? dados : (dados ? [dados] : [])
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao listar transferências.'
        console.error('Erro ao listar transferências:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * Buscar transferência por id
     * GET /transfalmox/:idemp/:id
     */
    async buscarTransferencia(idemp, id) {
      this.loading = true
      try {
        const response = await api.get(`/transfalmox/${idemp}/${id}`, {
          headers: this.getAuthHeaders()
        })
        const dados = response.data?.data || response.data
        const dadosNormalizados = Array.isArray(dados) ? dados[0] : dados

        if (dadosNormalizados?.item && !dadosNormalizados?.itens) {
          const transferenciaLista = this.transferencias.find(t => Number(t.id) === Number(id)) || {}
          this.transferencia = {
            ...transferenciaLista,
            ...dadosNormalizados,
            id: transferenciaLista.id || id,
            id_empresa: transferenciaLista.id_empresa || idemp,
            itens: Array.isArray(dadosNormalizados.item) ? dadosNormalizados.item : [],
          }
        } else {
          this.transferencia = dadosNormalizados
        }

        this.errorMessage = ''
        return this.transferencia
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Transferência não encontrada.'
        console.error('Erro ao buscar transferência:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Cadastrar/Enviar transferência
     * POST /transfalmox/env
     */
    async cadastrarTransferencia(payload) {
      this.loading = true
      try {
        const response = await api.post('/transfalmox/env', payload, {
          headers: this.getAuthHeaders()
        })
        toast.success('Transferência registrada com sucesso!')
        this.errorMessage = ''
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao registrar transferência.'
        console.error('Erro ao registrar transferência:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Confirmar recebimento de transferência
     * POST /transfalmox/rec
     */
    async receberTransferencia(payload) {
      this.loading = true
      try {
        const response = await api.post('/transfalmox/rec', payload, {
          headers: this.getAuthHeaders()
        })
        toast.success('Recebimento confirmado com sucesso!')
        this.errorMessage = ''
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao confirmar recebimento.'
        console.error('Erro ao confirmar recebimento:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Excluir transferência
     * DELETE /transfalmox/:idemp/:id
     */
    async excluirTransferencia(idemp, id) {
      this.loading = true
      try {
        await api.delete(`/transfalmox/${idemp}/${id}`, {
          headers: this.getAuthHeaders()
        })
        toast.success('Transferência excluída com sucesso!')
        this.transferencias = this.transferencias.filter(t => Number(t.id) !== Number(id))
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao excluir transferência.'
        console.error('Erro ao excluir transferência:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },
  }
})
