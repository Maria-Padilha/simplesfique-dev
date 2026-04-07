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
    terminais: [],
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

    // ========== TERMINAL DE VENDAS ==========

    /**
     * LISTAR TERMINAIS
     *
     * @return {Promise<void>}
     */
    async listarTerminais() {
      this.loading = true
      const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada'))
      const idEmpresa = empresaSelecionada?.id

      if (!idEmpresa) {
        toast.error('Empresa não selecionada')
        this.loading = false
        return
      }

      try {
        const response = await api.get(`/terminalven/${idEmpresa}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.terminais = response.data?.data || response.data || []
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar terminais'
        console.error('Erro ao listar terminais:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * OBTER TERMINAL POR ID
     *
     * @param {number} id
     * @return {Promise<Object|null>}
     */
    async obterTerminal(id) {
      this.loading = true
      const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada'))
      const idEmpresa = empresaSelecionada?.id

      try {
        const response = await api.get(`/terminalven/${idEmpresa}/id/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.errorMessage = ''
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar terminal'
        console.error('Erro ao obter terminal:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * CADASTRAR TERMINAL
     *
     * @param {Object} data
     * @return {Promise<Object|null>}
     */
    async cadastrarTerminal(data) {
      this.loading = true
      const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada'))
      const idEmpresa = empresaSelecionada?.id

      try {
        const response = await api.post(`/terminalven/${idEmpresa}`, { 
          data: [{ idempresa: idEmpresa, ...data }] 
        }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Terminal cadastrado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar terminal'
        console.error('Erro ao cadastrar terminal:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * ALTERAR TERMINAL
     *
     * @param {number} id
     * @param {Object} data
     * @return {Promise<Object|null>}
     */
    async alterarTerminal(id, data) {
      this.loading = true
      const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada'))
      const idEmpresa = empresaSelecionada?.id

      try {
        const response = await api.put(`/terminalven/${idEmpresa}/id/${id}`, { 
          data: [{ idempresa: idEmpresa, ...data }] 
        }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Terminal atualizado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao alterar terminal'
        console.error('Erro ao alterar terminal:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * DELETAR TERMINAL
     *
     * @param {number} id
     * @return {Promise<boolean>}
     */
    async deletarTerminal(id) {
      this.loading = true
      const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada'))
      const idEmpresa = empresaSelecionada?.id

      try {
        await api.delete(`/terminalven/${idEmpresa}/id/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Terminal deletado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return true
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao deletar terminal'
        console.error('Erro ao deletar terminal:', error)
        toast.error(this.errorMessage)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})
