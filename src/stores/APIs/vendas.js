import { defineStore } from 'pinia'
import api from '@/services/api'
import apiPhp from '@/services/apiPhp'
import { toast } from 'vue3-toastify'

export const useVendasStore = defineStore('vendas', {
  state: () => ({
    loading: false,
    token: localStorage.getItem('token'),
    errorMessage: '',
    successMessage: '',
    motivosPerda: [],
    terminais: [],
    ambientes: []
  }),

  actions: {
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return { Authorization: `Bearer ${token}` }
    },

    // ========== MOTIVO DE PERDA DE ORÇAMENTO ==========

    /**
     * LISTAR MOTIVOS DE PERDA DE ORÇAMENTO
     *
     * @return {Promise<void>}
     */
    async listarMPO() {
      this.loading = true

      try {
        const response = await apiPhp.get('/vendas/mpos')

        this.motivosPerda = response.data || []
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
        const response = await apiPhp.post('/vendas/mpos', data)

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
        const response = await apiPhp.put(`/vendas/mpos/${id}`, data)

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
        await apiPhp.delete(`/vendas/mpos/${id}`)

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

      try {
        const response = await apiPhp.get('/admin/terminais-venda')

        this.terminais = response.data || []
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

      try {
        const response = await apiPhp.get(`/admin/terminais-venda/${id}`)

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

      try {
        const response = await apiPhp.post('/admin/terminais-venda', data)

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

      try {
        const response = await apiPhp.put(`/admin/terminais-venda/${id}`, data)

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

      try {
        await apiPhp.delete(`/admin/terminais-venda/${id}`)

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
    },

    // ========== AMBIENTE DE VENDAS ==========

    /**
     * LISTAR AMBIENTES
     * @blocked: THorse offline e PHP tem API diferente (per-terminal)
     * Pendente de adaptação da view para PHP
     *
     * @return {Promise<void>}
     */
    async listarAmbientes() {
      this.loading = true

      try {
        const response = await api.get('/ambientes', {
          headers: this.getAuthHeaders()
        })

        this.ambientes = response.data?.data || response.data || []
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar ambientes'
        console.error('Erro ao listar ambientes:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * CADASTRAR AMBIENTE
     * @blocked: THorse offline e PHP tem API diferente (per-terminal)
     * Pendente de adaptação da view para PHP
     *
     * @param {Object} payload - { descambiente, imp_rede, imp_nome, imp_ipc, terminal: [...], grupo: [...] }
     * @return {Promise<Object|null>}
     */
    async cadastrarAmbiente(payload) {
      this.loading = true

      try {
        const terminal = payload.terminal || []
        const grupo = payload.grupo || []
        const flatPayload = { ...payload, terminal, grupo }
        delete flatPayload.idempresa

        // THorse espera wrapper Delphi { data: [{ ... }] }
        const response = await api.post('/ambientes', { data: [flatPayload] }, {
          headers: this.getAuthHeaders()
        })

        this.successMessage = 'Ambiente cadastrado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar ambiente'
        console.error('Erro ao cadastrar ambiente:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * ALTERAR AMBIENTE
     * @blocked: THorse offline e PHP tem API diferente (per-terminal)
     * Pendente de adaptação da view para PHP
     *
     * @param {number} id
     * @param {Object} payload - { descambiente, imp_rede, imp_nome, imp_ipc, terminal: [...], grupo: [...] }
     * @return {Promise<Object|null>}
     */
    async alterarAmbiente(id, payload) {
      this.loading = true

      try {
        const terminal = payload.terminal || []
        const grupo = payload.grupo || []
        const flatPayload = { ...payload, terminal, grupo }
        delete flatPayload.idempresa

        // THorse espera wrapper Delphi { data: [{ ... }] }
        const response = await api.put(`/ambientes/${id}`, { data: [flatPayload] }, {
          headers: this.getAuthHeaders()
        })

        this.successMessage = 'Ambiente atualizado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao alterar ambiente'
        console.error('Erro ao alterar ambiente:', error)
        toast.error(this.errorMessage)
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * DELETAR AMBIENTE
     * @blocked: THorse offline e PHP tem API diferente (per-terminal)
     * Pendente de adaptação da view para PHP
     *
     * @param {number} id
     * @return {Promise<boolean>}
     */
    async deletarAmbiente(id) {
      this.loading = true

      try {
        await api.delete(`/ambientes/${id}`, {
          headers: this.getAuthHeaders()
        })

        this.successMessage = 'Ambiente deletado com sucesso!'
        this.errorMessage = ''
        toast.success(this.successMessage)

        return true
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao deletar ambiente'
        console.error('Erro ao deletar ambiente:', error)
        toast.error(this.errorMessage)
        return false
      } finally {
        this.loading = false
      }
    },

    // ========== CUPOM FISCAL (PHP) ==========

    /**
     * Listar cupons fiscais
     * GET /vendas/cupom-fiscal
     */
    async listarCuponsFiscais(params = {}) {
      this.loading = true
      try {
        const res = await apiPhp.get('/vendas/cupom-fiscal', { params })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Erro ao listar cupons fiscais'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Obter cupom fiscal por ID
     * GET /vendas/cupom-fiscal/{id}
     */
    async obterCupomFiscal(id) {
      this.loading = true
      try {
        const res = await apiPhp.get(`/vendas/cupom-fiscal/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Erro ao obter cupom fiscal'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Criar cupom fiscal
     * POST /vendas/cupom-fiscal
     */
    async criarCupomFiscal(dados) {
      this.loading = true
      try {
        const res = await apiPhp.post('/vendas/cupom-fiscal', dados)
        this.successMessage = 'Cupom fiscal criado com sucesso!'
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Erro ao criar cupom fiscal'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Calcular cupom fiscal (pré-visualização)
     * POST /vendas/cupom-fiscal/calcular
     */
    async calcularCupomFiscal(dados) {
      this.loading = true
      try {
        const res = await apiPhp.post('/vendas/cupom-fiscal/calcular', dados)
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Erro ao calcular cupom fiscal'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Emitir cupom fiscal (persiste + salva XML no R2)
     * POST /vendas/cupom-fiscal/emitir
     */
    async emitirCupomFiscal(dados) {
      this.loading = true
      try {
        const res = await apiPhp.post('/vendas/cupom-fiscal/emitir', dados)
        this.successMessage = 'Cupom fiscal emitido com sucesso!'
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Erro ao emitir cupom fiscal'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Cancelar cupom fiscal
     * POST /vendas/cupom-fiscal/{id}/cancelar
     */
    async cancelarCupomFiscal(id) {
      this.loading = true
      try {
        const res = await apiPhp.post(`/vendas/cupom-fiscal/${id}/cancelar`, {})
        this.successMessage = 'Cupom fiscal cancelado com sucesso!'
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Erro ao cancelar cupom fiscal'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Obter XML do cupom fiscal
     * GET /vendas/cupom-fiscal/{id}/xml
     */
    async obterXmlCupomFiscal(id) {
      this.loading = true
      try {
        const res = await apiPhp.get(`/vendas/cupom-fiscal/${id}/xml`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error?.response?.data?.message || 'Erro ao obter XML do cupom fiscal'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})