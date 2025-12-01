import { defineStore } from "pinia"
import api from "@/services/api"
import { toast } from "vue3-toastify"

export const useCCustoStore = defineStore('ccusto', {
  state: () => ({
    loading: false,
    token: localStorage.getItem('token'),
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
        const response = await api.get('/ccusto', {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        // Extrair o array 'data' da resposta
        const dados = response.data.data || response.data
        this.centrosCusto = this.normalizarDados(dados)
        this.errorMessage = ''

        console.log('Centros de custo encontrados:', this.centrosCusto)
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar centros de custo'
        console.error('Erro ao listar centros de custo:', error)
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
        const response = await api.get(`/ccusto/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.errorMessage = ''
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao obter centro de custo'
        console.error('Erro ao obter centro de custo:', error)
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
        const response = await api.get(`/ccustoclas/${idClassificador}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.errorMessage = ''
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Classificação inválida'
        console.error('Erro ao verificar classificador:', error)
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
        const response = await api.post('/ccusto', { data: [ccustoData] }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Centro de custo cadastrado com sucesso!'
        this.errorMessage = ''
        toast.success('Centro de custo cadastrado com sucesso!')

        await this.listarCCusto()
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao cadastrar centro de custo'
        console.error('Erro ao cadastrar centro de custo:', error)
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
        const response = await api.put(`/ccusto/${id}`, { data: [ccustoData] }, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Centro de custo alterado com sucesso!'
        this.errorMessage = ''
        toast.success('Centro de custo alterado com sucesso!')

        await this.listarCCusto()
        return response.data
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao alterar centro de custo'
        console.error('Erro ao alterar centro de custo:', error)
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
        await api.delete(`/ccusto/${id}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        this.successMessage = 'Centro de custo deletado com sucesso!'
        this.errorMessage = ''
        toast.success('Centro de custo deletado com sucesso!')

        await this.listarCCusto()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao deletar centro de custo'
        console.error('Erro ao deletar centro de custo:', error)
        toast.error(this.errorMessage)
      } finally {
        this.loading = false
      }
    },

    /**
     * BUSCAR PREVISÃO DE DÉBITOS
     * GET /ccustoprev/:idempresa?dtini=YYYY-MM-DD&dtfim=YYYY-MM-DD&id_ccusto=X
     *
     * @param {Object} params - { idEmpresa, dtini, dtfim, id_ccusto (opcional) }
     * @return {Promise<Array>}
     */
    async buscarPrevisaoDebitos({ idEmpresa, dtini, dtfim, id_ccusto }) {
      this.loading = true

      try {
        // Construir URL com parâmetros
        let url = `/ccustoprev/${idEmpresa}?dtini=${dtini}&dtfim=${dtfim}`
        
        // Adicionar id_ccusto se for diferente de 'todos'
        if (id_ccusto && id_ccusto !== 'todos') {
          url += `&id_ccusto=${id_ccusto}`
        }

        console.log('🔍 Buscando previsão de débitos:', url)

        const response = await api.get(url, {
          headers: { Authorization: `Bearer ${this.token}` }
        })

        // Extrair dados da resposta
        const dados = response.data.data || response.data
        const previsoes = this.normalizarDados(dados)
        
        console.log('✅ Previsões encontradas:', previsoes?.length || 0)
        
        this.errorMessage = ''
        return previsoes
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar previsão de débitos'
        console.error('❌ Erro ao buscar previsão:', error)
        toast.error(this.errorMessage)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
