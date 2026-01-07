import { defineStore } from 'pinia'
import api from '@/services/api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    pagarReceber: {
      pagarmeses: 0,
      receberemeses: 0,
      detalhes: []
    },
    saldosBancarios: [],
    loading: false,
    error: null
  }),

  actions: {
    // Função auxiliar para obter headers com token
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    },

    // ========== PAGAR/RECEBER ==========
    /**
     * Busca dados de contas a pagar e receber por empresa
     * @param {number} idempresa - ID da empresa
     */
    async buscarPagarReceber(idempresa) {
      this.loading = true
      this.error = null
      try {
        const url = `/pagarreceber/${idempresa}`
        const headers = this.getAuthHeaders()

        console.log('📤 Requisição GET:', url)
        console.log('🔐 Headers:', headers)

        const response = await api.get(url, { headers })

        console.log('✅ Resposta recebida:', response.data)

        const resposta = response.data

        // Garantir estrutura de dados válida
        let dados
        if (resposta && resposta.data) {
          dados = resposta.data
        } else if (resposta && typeof resposta === 'object') {
          dados = resposta
        } else {
          dados = {}
        }

        this.pagarReceber = dados

        console.log('✨ Dados de Pagar/Receber armazenados:', this.pagarReceber)
        return this.pagarReceber
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar dados de pagar/receber'
        console.error('❌ Erro ao buscar pagar/receber:', error)
        console.error('   Status:', error.response?.status)
        console.error('   Mensagem:', error.message)
        return null
      } finally {
        this.loading = false
      }
    },

    // ========== SALDOS BANCÁRIOS ==========
    /**
     * Busca saldos bancários por empresa
     * @param {number} idempresa - ID da empresa
     */
    async buscarSaldosBancarios(idempresa) {
      this.loading = true
      this.error = null
      try {
        const url = `/saldosbancario/${idempresa}`
        const headers = this.getAuthHeaders()

        console.log('📤 Requisição GET:', url)
        console.log('🔐 Headers:', headers)

        const response = await api.get(url, { headers })

        console.log('✅ Resposta recebida:', response.data)

        const resposta = response.data

        // Garantir que seja um array válido
        let dados
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data
        } else if (Array.isArray(resposta)) {
          dados = resposta
        } else if (resposta && typeof resposta === 'object' && !resposta.data) {
          dados = [resposta]
        } else {
          dados = []
        }

        this.saldosBancarios = dados

        console.log('✨ Saldos Bancários armazenados:', this.saldosBancarios)
        return this.saldosBancarios
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar saldos bancários'
        console.error('❌ Erro ao buscar saldos bancários:', error)
        console.error('   Status:', error.response?.status)
        console.error('   Mensagem:', error.message)
        return null
      } finally {
        this.loading = false
      }
    },

    // ========== CARREGAR TODOS OS DADOS ==========
    /**
     * Carrega todos os dados do dashboard
     * @param {number} idempresa - ID da empresa
     */
    async carregarDadosDashboard(idempresa) {
      console.log('🚀 Iniciando carregamento do dashboard para empresa:', idempresa)
      try {
        const resultados = await Promise.all([
          this.buscarPagarReceber(idempresa),
          this.buscarSaldosBancarios(idempresa)
        ])

        console.log('🎉 Todos os dados do dashboard carregados com sucesso!')
        console.log('   Pagar/Receber:', resultados[0])
        console.log('   Saldos Bancários:', resultados[1])

        return true
      } catch (error) {
        console.error('❌ Erro ao carregar dados do dashboard:', error)
        return false
      }
    }
  }
})

