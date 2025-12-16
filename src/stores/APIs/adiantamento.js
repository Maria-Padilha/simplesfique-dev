import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAdiantamentoStore = defineStore('adiantamento', {
  state: () => ({
    adiantamentos: [],
    loading: false
  }),

  actions: {
    /**
     * Buscar adiantamentos de clientes com filtros
     * @param {number} idEmpresa - ID da empresa
     * @param {string} dtini - Data inicial (YYYY-MM-DD)
     * @param {string} dtfim - Data final (YYYY-MM-DD)
     * @param {number|null} idCliente - ID do cliente (opcional)
     * @returns {Promise<Array>}
     */
    async buscarAdiantamentos(idEmpresa, dtini, dtfim, idCliente = null) {
      this.loading = true

      try {
        const token = localStorage.getItem('token')
        
        // Construir URL
        let url = `/adtcliente/${idEmpresa}/dtini/${dtini}/dtfim/${dtfim}`
        
        // Adicionar query param se idCliente for informado
        if (idCliente) {
          url += `?idcliente=${idCliente}`
        }

        console.log('Chamando API:', url)

        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Retornar resposta completa { saldoanterior: [...], data: [...], records: N }
        const resultado = response.data || response
        
        // Atualizar state com os dados
        if (resultado.data && Array.isArray(resultado.data)) {
          this.adiantamentos = resultado.data
        } else {
          this.adiantamentos = []
        }
        
        console.log('Adiantamentos carregados:', this.adiantamentos.length)
        return resultado
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
      const token = localStorage.getItem('token')

      try {
        const response = await api.post('/adtcliente', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
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
      const token = localStorage.getItem('token')

      try {
        const response = await api.put(`/adtcliente/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        console.error('Erro ao atualizar adiantamento:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Excluir adiantamento
     * @param {number} idEmpresa - ID da empresa
     * @param {number} id - ID do adiantamento
     * @returns {Promise}
     */
    async excluirAdiantamento(idEmpresa, id) {
      this.loading = true
      const token = localStorage.getItem('token')

      try {
        const response = await api.delete(`/adtcliente/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
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
     * @param {number} idEmpresa - ID da empresa
     * @param {string} dtini - Data inicial (YYYY-MM-DD)
     * @param {string} dtfim - Data final (YYYY-MM-DD)
     * @param {number|null} idFornecedor - ID do fornecedor (opcional)
     * @returns {Promise<Array>}
     */
    async buscarAdiantamentosFornecedores(idEmpresa, dtini, dtfim, idFornecedor = null) {
      this.loading = true

      try {
        const token = localStorage.getItem('token')
        
        // Construir URL
        let url = `/adtfornecedor/${idEmpresa}/dtini/${dtini}/dtfim/${dtfim}`
        
        // Adicionar query param se idFornecedor for informado
        if (idFornecedor) {
          url += `?idfornecedor=${idFornecedor}`
        }

        console.log('Chamando API de fornecedores:', url)

        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        })

        // Retornar resposta completa { saldoanterior: [...], data: [...], records: N }
        const resultado = response.data || response
        
        // Atualizar state com os dados
        if (resultado.data && Array.isArray(resultado.data)) {
          this.adiantamentos = resultado.data
        } else {
          this.adiantamentos = []
        }
        
        console.log('Adiantamentos de fornecedores carregados:', this.adiantamentos.length)
        return resultado
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
      const token = localStorage.getItem('token')

      try {
        const response = await api.post('/adtfornecedor', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
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
      const token = localStorage.getItem('token')

      try {
        const response = await api.put(`/adtfornecedor/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        console.error('Erro ao atualizar adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Excluir adiantamento de fornecedor
     * @param {number} idEmpresa - ID da empresa
     * @param {number} id - ID do adiantamento
     * @returns {Promise}
     */
    async excluirAdiantamentoFornecedor(idEmpresa, id) {
      this.loading = true
      const token = localStorage.getItem('token')

      try {
        const response = await api.delete(`/adtfornecedor/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        console.error('Erro ao excluir adiantamento de fornecedor:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})

