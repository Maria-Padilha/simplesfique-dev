import { defineStore } from "pinia"
import apiPhp from "@/services/apiPhp"
import { toast } from "vue3-toastify"

export const useCCustoStore = defineStore('ccusto', {
  state: () => ({
    loading: false,
    errorMessage: '',
    successMessage: '',
    centrosCusto: [],
  }),

  actions: {
    /**
     * NORMALIZAR DADOS DA API
     * Converte campos em maiúsculas para minúsculas
     */
    normalizarDados(dados) {
      if (Array.isArray(dados)) {
        return dados.map(item => this.normalizarDados(item))
      }

      if (typeof dados === 'object' && dados !== null) {
        const normalizado = {}
        for (const [key, value] of Object.entries(dados)) {
          const novaChave = key.toLowerCase()
          normalizado[novaChave] = value
        }
        return normalizado
      }

      return dados
    },

    /**
     * LISTAR CENTROS DE CUSTO
     *
     * @return {Promise<void>}
     */
    async listarCCusto() {
      this.loading = true

      try {
        const res = await apiPhp.get('/financeiro/centro-custos')

        const dados = res.data?.data ?? res.data
        this.centrosCusto = this.normalizarDados(dados)
        this.errorMessage = ''
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar centros de custo'
      } finally {
        this.loading = false
      }
    },

    /**
     * OBTER CENTRO DE CUSTO POR ID
     *
     * @param {number} id
     * @return {Promise<void>}
     */
    async obterCCusto(id) {
      this.loading = true

      try {
        const res = await apiPhp.get(`/financeiro/centro-custos/${id}`)

        this.errorMessage = ''
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao obter centro de custo'
      } finally {
        this.loading = false
      }
    },

    /**
     * VERIFICAR CLASSIFICADOR
     * Valida se a classificação está correta antes de cadastrar/editar
     *
     * @param {string} idClassificador
     * @return {Promise<Object>}
     */
    async verificarClassificador(idClassificador) {
      try {
        const res = await apiPhp.get(`/financeiro/centro-custos/classificadores/${idClassificador}`)

        this.errorMessage = ''
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Classificação inválida'
        throw error
      }
    },

    /**
     * CADASTRAR CENTRO DE CUSTO
     *
     * @param {Object} ccustoData
     * @return {Promise<void>}
     */
    async cadastrarCCusto(ccustoData) {
      this.loading = true

      try {
        const res = await apiPhp.post('/financeiro/centro-custos', ccustoData)

        this.successMessage = 'Centro de custo cadastrado com sucesso!'
        this.errorMessage = ''
        toast.success('Centro de custo cadastrado com sucesso!')

        await this.listarCCusto()
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar centro de custo'
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * ALTERAR CENTRO DE CUSTO
     *
     * @param {number} id
     * @param {Object} ccustoData
     * @return {Promise<void>}
     */
    async alterarCCusto(id, ccustoData) {
      this.loading = true

      try {
        const res = await apiPhp.put(`/financeiro/centro-custos/${id}`, ccustoData)

        this.successMessage = 'Centro de custo alterado com sucesso!'
        this.errorMessage = ''
        toast.success('Centro de custo alterado com sucesso!')

        await this.listarCCusto()
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao alterar centro de custo'
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * DELETAR CENTRO DE CUSTO
     *
     * @param {number} id
     * @return {Promise<void>}
     */
    async deletarCCusto(id) {
      this.loading = true

      try {
        await apiPhp.delete(`/financeiro/centro-custos/${id}`)

        this.successMessage = 'Centro de custo deletado com sucesso!'
        this.errorMessage = ''
        toast.success('Centro de custo deletado com sucesso!')

        await this.listarCCusto()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao deletar centro de custo'
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * BUSCAR PREVISÃO DE DÉBITOS
     * GET /financeiro/centro-custos/previsao?dtini=...&dtfim=...&id_ccusto=...
     *
     * @param {Object} params - { idEmpresa, dtini, dtfim, id_ccusto (opcional) }
     * @return {Promise<Array>}
     */
    async buscarPrevisaoDebitos({ dtini, dtfim, id_ccusto }) {
      this.loading = true

      try {
        const params = { dtini, dtfim }

        if (id_ccusto && id_ccusto !== 'todos') {
          params.id_ccusto = id_ccusto
        }

        const res = await apiPhp.get('/financeiro/centro-custos/previsao', { params })

        const dados = res.data?.data ?? res.data
        const previsoes = this.normalizarDados(dados)

        this.errorMessage = ''
        return previsoes
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar previsão de débitos'
        toast.error(this.errorMessage)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * BUSCAR PARÂMETROS DE CENTRO DE CUSTO
     * Verifica se a empresa utiliza centro de custo (utiliza_ccusto)
     *
     * @return {Promise<Object>}
     */
    async buscarParametrosCCusto() {
      this.loading = true

      try {
        const res = await apiPhp.get('/financeiro/centro-custo-parametros/parametro')

        this.errorMessage = ''
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar parâmetros de centro de custo'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * BUSCAR DÉBITOS REALIZADOS POR CENTRO DE CUSTO
     * Lista os débitos já realizados por centro de custo
     *
     * @param {number} idEmpresa
     * @param {string} dtini - Data inicial (YYYY-MM-DD)
     * @param {string} dtfim - Data final (YYYY-MM-DD)
     * @return {Promise<Array>}
     */
    async buscarDebitosRealizados(idEmpresa, dtini, dtfim) {
      this.loading = true

      try {
        const res = await apiPhp.get('/financeiro/centro-custos/realizado', {
          params: { dtini, dtfim }
        })

        this.errorMessage = ''
        return res.data?.data ?? res.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar débitos realizados'
        toast.error(this.errorMessage)
        return []
      } finally {
        this.loading = false
      }
    }
  }
})
