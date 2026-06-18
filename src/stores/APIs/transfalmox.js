import { defineStore } from 'pinia'
import apiPhp from '@/services/apiPhp'
import { toast } from 'vue3-toastify'

export const useTransfAlmoxStore = defineStore('transfalmox', {
  state: () => ({
    loading: false,
    errorMessage: '',
    successMessage: '',
    dados: [],
  }),

  actions: {
    /**
     * Listar transferências almoxarifado (PHP)
     * GET /estoque/transferencia-almoxarifados
     */
    async listarTransferencias() {
      this.loading = true
      try {
        const response = await apiPhp.get('/estoque/transferencia-almoxarifados')
        this.dados = response.data || []
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao listar transferências'
        console.error('Erro ao listar transferências:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * Buscar transferência por ID (PHP)
     * GET /estoque/transferencia-almoxarifados/{id}/{idEmpresa}
     */
    async buscarTransferencia(idEmpresa, id) {
      this.loading = true
      try {
        const response = await apiPhp.get(`/estoque/transferencia-almoxarifados/${idEmpresa}/${id}`)
        this.errorMessage = ''
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar transferência'
        console.error('Erro ao buscar transferência:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Cadastrar transferência (PHP)
     * POST /estoque/transferencia-almoxarifados
     */
    async cadastrarTransferencia(data) {
      this.loading = true
      try {
        const response = await apiPhp.post('/estoque/transferencia-almoxarifados', data)
        this.successMessage = 'Transferência cadastrada com sucesso!'
        toast.success(this.successMessage)
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar transferência'
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Receber transferência (PHP)
     * POST /estoque/transferencia-almoxarifados/{idEmpresa}/{id}/receber
     */
    async receberTransferencia(idEmpresa, id) {
      this.loading = true
      try {
        const response = await apiPhp.post(`/estoque/transferencia-almoxarifados/${idEmpresa}/${id}/receber`)
        this.successMessage = 'Transferência recebida com sucesso!'
        toast.success(this.successMessage)
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao receber transferência'
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Excluir transferência (PHP)
     * DELETE /estoque/transferencia-almoxarifados/{idEmpresa}/{id}
     */
    async excluirTransferencia(idEmpresa, id) {
      this.loading = true
      try {
        await apiPhp.delete(`/estoque/transferencia-almoxarifados/${idEmpresa}/${id}`)
        this.successMessage = 'Transferência excluída com sucesso!'
        toast.success(this.successMessage)
        return true
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao excluir transferência'
        toast.error(this.errorMessage)
        return false
      } finally {
        this.loading = false
      }
    },
  }
})
