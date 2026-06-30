import { defineStore } from 'pinia'
import apiPhp from '@/services/apiPhp'
import { toast } from 'vue3-toastify'

export const useAdiantamentoStore = defineStore('adiantamento', {
  state: () => ({
    adiantamentos: [],
    loading: false,
    errorMessage: '',
    successMessage: ''
  }),

  actions: {
    /**
     * Buscar adiantamentos de clientes com filtros
     * @param {number} idEmpresa - ID da empresa (vem do JWT, mantido para compatibilidade)
     * @param {string} dtini - Data inicial (YYYY-MM-DD)
     * @param {string} dtfim - Data final (YYYY-MM-DD)
     * @param {number|null} idCliente - ID do cliente (opcional)
     * @returns {Promise<Object>}
     */
    async buscarAdiantamentos(idEmpresa, dtini, dtfim, idCliente = null) {
      this.loading = true

      try {
        const params = { data_ini: dtini, data_fim: dtfim }
        if (idCliente) params.cliente = idCliente

        const res = await apiPhp.get('/adiantamento-clientes', { params })

        const dados = res.data?.data ?? res.data ?? []
        this.adiantamentos = Array.isArray(dados) ? dados : []

        return { data: this.adiantamentos }
      } catch (error) {
        console.error('Erro ao buscar adiantamentos:', error)
        this.adiantamentos = []
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Criar novo adiantamento
     * @param {Object} payload - Dados do adiantamento
     * @returns {Promise}
     */
    async criarAdiantamento(payload) {
      this.loading = true

      try {
        const res = await apiPhp.post('/adiantamento-clientes', payload)
        return res.data?.data ?? res.data
      } catch (error) {
        console.error('Erro ao criar adiantamento:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Atualizar adiantamento existente
     * @param {number} id - ID do adiantamento
     * @param {Object} payload - Dados atualizados
     * @returns {Promise}
     */
    async atualizarAdiantamento(id, payload) {
      this.loading = true

      try {
        const res = await apiPhp.put(`/adiantamento-clientes/${id}`, payload)
        return res.data?.data ?? res.data
      } catch (error) {
        console.error('Erro ao atualizar adiantamento:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Excluir adiantamento
     * @param {number} idEmpresa - ID da empresa (mantido para compatibilidade de assinatura)
     * @param {number} id - ID do adiantamento
     * @returns {Promise}
     */
    async excluirAdiantamento(idEmpresa, id) {
      this.loading = true

      try {
        const res = await apiPhp.delete(`/adiantamento-clientes/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        console.error('Erro ao excluir adiantamento:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== FORNECEDORES ====================

    /**
     * Buscar adiantamentos de fornecedores com filtros
     * @param {number} idEmpresa - ID da empresa (vem do JWT, mantido para compatibilidade)
     * @param {string} dtini - Data inicial (YYYY-MM-DD)
     * @param {string} dtfim - Data final (YYYY-MM-DD)
     * @param {number|null} idFornecedor - ID do fornecedor (opcional)
     * @returns {Promise<Object>}
     */
    async buscarAdiantamentosFornecedores(idEmpresa, dtini, dtfim, idFornecedor = null) {
      this.loading = true

      try {
        const params = { data_ini: dtini, data_fim: dtfim }
        if (idFornecedor) params.fornecedor = idFornecedor

        const res = await apiPhp.get('/adiantamento-fornecedors', { params })

        const dados = res.data?.data ?? res.data ?? []
        this.adiantamentos = Array.isArray(dados) ? dados : []

        return { data: this.adiantamentos }
      } catch (error) {
        console.error('Erro ao buscar adiantamentos de fornecedores:', error)
        this.adiantamentos = []
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Criar novo adiantamento de fornecedor
     * @param {Object} payload - Dados do adiantamento
     * @returns {Promise}
     */
    async criarAdiantamentoFornecedor(payload) {
      this.loading = true

      try {
        const res = await apiPhp.post('/adiantamento-fornecedors', payload)
        return res.data?.data ?? res.data
      } catch (error) {
        console.error('Erro ao criar adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Atualizar adiantamento de fornecedor existente
     * @param {number} id - ID do adiantamento
     * @param {Object} payload - Dados atualizados
     * @returns {Promise}
     */
    async atualizarAdiantamentoFornecedor(id, payload) {
      this.loading = true

      try {
        const res = await apiPhp.put(`/adiantamento-fornecedors/${id}`, payload)
        return res.data?.data ?? res.data
      } catch (error) {
        console.error('Erro ao atualizar adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Excluir adiantamento de fornecedor
     * @param {number} idEmpresa - ID da empresa (mantido para compatibilidade de assinatura)
     * @param {number} id - ID do adiantamento
     * @returns {Promise}
     */
    async excluirAdiantamentoFornecedor(idEmpresa, id) {
      this.loading = true

      try {
        const res = await apiPhp.delete(`/adiantamento-fornecedors/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        console.error('Erro ao excluir adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Buscar adiantamento de fornecedor por ID
     * @param {number} id - ID do adiantamento
     * @returns {Promise}
     */
    async buscarAdiantamentoFornecedorPorId(id) {
      this.loading = true

      try {
        const res = await apiPhp.get(`/adiantamento-fornecedors/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        console.error('Erro ao buscar adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ==================== AÇÕES PHP (aprovado/recusar) ====================

    /**
     * Aprovar adiantamento fornecedor (PHP)
     * POST /financeiro/adiantamento-fornecedors/{id}/aprovar
     */
    async aprovarAdiantamentoFornecedorPhp(id, valor_autorizado = 0) {
      this.loading = true
      try {
        const response = await apiPhp.post(`/financeiro/adiantamento-fornecedors/${id}/aprovar`, {
          valor_autorizado
        })
        this.successMessage = 'Adiantamento aprovado com sucesso!'
        toast.success(this.successMessage)
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.erro || error.response?.data?.message || 'Erro ao aprovar adiantamento'
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Recusar adiantamento fornecedor (PHP)
     * POST /financeiro/adiantamento-fornecedors/{id}/recusar
     */
    async recusarAdiantamentoFornecedorPhp(id) {
      this.loading = true
      try {
        const response = await apiPhp.post(`/financeiro/adiantamento-fornecedors/${id}/recusar`)
        this.successMessage = 'Adiantamento recusado com sucesso!'
        toast.success(this.successMessage)
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.erro || error.response?.data?.message || 'Erro ao recusar adiantamento'
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    // ==================== AÇÕES BLOQUEADAS (THorse offline) ====================

    /**
     * Pagar adiantamento de fornecedor completo
     * POST /api/v1/financeiro/adiantamento-fornecedors/{id}/pagar
     */
    async pagarAdiantamentoFornecedorCompleto(id, payload) {
      this.loading = true
      try {
        const response = await apiPhp.post(`/financeiro/adiantamento-fornecedors/${id}/pagar`, payload)
        return response.data?.data ?? response.data
      } catch (error) {
        console.error('Erro ao processar pagamento:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Aprovar adiantamento de fornecedor
     * POST /api/v1/financeiro/adiantamento-fornecedors/{id}/aprovar
     */
    async aprovarAdiantamentoFornecedor(id, valorSolicitado) {
      this.loading = true
      try {
        const response = await apiPhp.post(`/financeiro/adiantamento-fornecedors/${id}/aprovar`, {
          valor_solicitado: valorSolicitado
        })
        return response.data?.data ?? response.data
      } catch (error) {
        console.error('Erro ao aprovar adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Pagar adiantamento de fornecedor
     * POST /api/v1/financeiro/adiantamento-fornecedors/{id}/pagar
     */
    async pagarAdiantamentoFornecedor(id) {
      this.loading = true
      try {
        const response = await apiPhp.post(`/financeiro/adiantamento-fornecedors/${id}/pagar`)
        return response.data?.data ?? response.data
      } catch (error) {
        console.error('Erro ao pagar adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Recusar/Negar adiantamento de fornecedor
     * POST /api/v1/financeiro/adiantamento-fornecedors/{id}/recusar
     */
    async recusarAdiantamentoFornecedor(id) {
      this.loading = true
      try {
        const response = await apiPhp.post(`/financeiro/adiantamento-fornecedors/${id}/recusar`)
        return response.data?.data ?? response.data
      } catch (error) {
        console.error('Erro ao recusar adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})