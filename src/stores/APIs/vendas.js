import { defineStore } from 'pinia'
import api from '@/services/api'
import { toast } from 'vue3-toastify'

export const useVendasStore = defineStore('vendas', {
  state: () => ({
    loading: false,
    token: localStorage.getItem('token'),
    errorMessage: '',
    successMessage: '',
    motivosPerda: [],
  }),

  actions: {

    // ========== MOTIVO DE PERDA DE ORÇAMENTO ==========

    /**
     * LISTAR MOTIVOS DE PERDA DE ORÇAMENTO
     *
     * @return {Promise<void>}
     */
    async listarMPO() {
      this.loading = true

      try {
        const response = await api.get('/mpo', {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.motivosPerda = response.data?.data || response.data || []
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar motivos de perda'
        console.error('Erro ao listar motivos de perda:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * CADASTRAR MOTIVO DE PERDA DE ORÇAMENTO
     *
     * @param {Object} data - { codigo, descricao }
     * @return {Promise<Object|null>}
     */
    async cadastrarMPO(data) {
      this.loading = true

      try {
        const response = await api.post('/mpo', { data: [data] }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Motivo de perda cadastrado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar motivo de perda'
        console.error('Erro ao cadastrar motivo de perda:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * ALTERAR MOTIVO DE PERDA DE ORÇAMENTO
     *
     * @param {number} id
     * @param {Object} data - { codigo, descricao }
     * @return {Promise<Object|null>}
     */
    async alterarMPO(id, data) {
      this.loading = true

      try {
        const response = await api.put(`/mpo/${id}`, { data: [data] }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Motivo de perda atualizado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao alterar motivo de perda'
        console.error('Erro ao alterar motivo de perda:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * DELETAR MOTIVO DE PERDA DE ORÇAMENTO
     *
     * @param {number} id
     * @return {Promise<void>}
     */
    async deletarMPO(id) {
      this.loading = true

      try {
        await api.delete(`/mpo/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Motivo de perda excluído com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao excluir motivo de perda'
        console.error('Erro ao excluir motivo de perda:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },
  }
})
