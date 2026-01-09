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
    fluxoCaixaMensal: [],
    fluxoCaixaDiario: [],
    pagRecDocLoc: {
      tipodocumento: {
        receber: [],
        pagar: []
      },
      localcobranca: {
        receber: [],
        pagar: []
      }
    },
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

        console.log(`[${new Date().toLocaleString('pt-BR')}] GET ${url}`)

        const response = await api.get(url, { headers })

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
        return this.pagarReceber
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar dados de pagar/receber'
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

        console.log(`[${new Date().toLocaleString('pt-BR')}] GET ${url}`)

        const response = await api.get(url, { headers })

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
        return this.saldosBancarios
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar saldos bancários'
        console.error(`[${new Date().toLocaleString('pt-BR')}] Erro ao buscar saldos bancários:`, error)
        return null
      } finally {
        this.loading = false
      }
    },

    // ========== FLUXO DE CAIXA MENSAL ==========
    /**
     * Busca fluxo de caixa mensal por empresa
     * @param {number} idempresa - ID da empresa
     */
    async buscarFluxoCaixaMensal(idempresa) {
      this.loading = true
      this.error = null
      try {
        const url = `/fluxocaixamensal/${idempresa}`
        const headers = this.getAuthHeaders()

        console.log(`[${new Date().toLocaleString('pt-BR')}] GET ${url}`)

        const response = await api.get(url, { headers })

        const resposta = response.data

        // Garantir que seja um array válido
        let dados
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data
        } else if (Array.isArray(resposta) && resposta.length > 0 && resposta[0].data) {
          // Se vem como [{data: [...]}], extrair o array interno
          dados = resposta[0].data
        } else if (Array.isArray(resposta)) {
          dados = resposta
        } else if (resposta && typeof resposta === 'object' && !resposta.data) {
          dados = [resposta]
        } else {
          dados = []
        }

        this.fluxoCaixaMensal = dados
        return this.fluxoCaixaMensal
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar fluxo de caixa mensal'
        console.error(`[${new Date().toLocaleString('pt-BR')}] Erro ao buscar fluxo de caixa mensal:`, error)
        return null
      } finally {
        this.loading = false
      }
    },

    // ========== FLUXO DE CAIXA DIÁRIO ==========
    /**
     * Busca fluxo de caixa diário por empresa
     * @param {number} idempresa - ID da empresa
     */
    async buscarFluxoCaixaDiario(idempresa) {
      this.loading = true
      this.error = null
      try {
        const url = `/fluxocaixadiario/${idempresa}`
        const headers = this.getAuthHeaders()

        console.log(`[${new Date().toLocaleString('pt-BR')}] GET ${url}`)

        const response = await api.get(url, { headers })

        const resposta = response.data

        // Garantir que seja um array válido
        let dados
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data
        } else if (Array.isArray(resposta) && resposta.length > 0 && resposta[0].registros) {
          // Se vem como [{registros: [...]}], extrair o array interno
          dados = resposta[0].registros
        } else if (Array.isArray(resposta)) {
          dados = resposta
        } else if (resposta && typeof resposta === 'object' && !resposta.data) {
          dados = [resposta]
        } else {
          dados = []
        }

        this.fluxoCaixaDiario = dados
        return this.fluxoCaixaDiario
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar fluxo de caixa diário'
        console.error(`[${new Date().toLocaleString('pt-BR')}] Erro ao buscar fluxo de caixa diário:`, error)
        return null
      } finally {
        this.loading = false
      }
    },

    // ========== TÍTULOS A PAGAR/RECEBER POR LOCAL E DOCUMENTO ==========
    /**
     * Busca títulos a pagar/receber por local de cobrança e tipo de documento
     * @param {number} idempresa - ID da empresa
     */
    async buscarPagRecDocLoc(idempresa) {
      this.loading = true
      this.error = null
      try {
        const url = `/pagrecdocloc/${idempresa}`
        const headers = this.getAuthHeaders()

        console.log(`[${new Date().toLocaleString('pt-BR')}] GET ${url}`)

        const response = await api.get(url, { headers })

        const resposta = response.data

        // Estrutura da API:
        // [{
        //   rec_tpdocto: [{tipodocumento, saldo}],
        //   rec_localcob: [{localcobranca, saldo}],
        //   pag_tpdocto: [{tipodocumento, saldo}],
        //   pag_localcob: [{localcobranca, saldo}]
        // }, ...]

        let recTipoDocumento = {}
        let recLocalCobranca = {}
        let pagTipoDocumento = {}
        let pagLocalCobranca = {}

        if (Array.isArray(resposta)) {
          resposta.forEach(grupo => {
            // Processar Receber por Tipo de Documento
            if (grupo.rec_tpdocto && Array.isArray(grupo.rec_tpdocto)) {
              grupo.rec_tpdocto.forEach(registro => {
                const tipo = (registro.tipodocumento || '').trim()
                if (tipo) {
                  if (!recTipoDocumento[tipo]) {
                    recTipoDocumento[tipo] = 0
                  }
                  recTipoDocumento[tipo] += parseFloat(registro.saldo || 0)
                }
              })
            }

            // Processar Receber por Local de Cobrança
            if (grupo.rec_localcob && Array.isArray(grupo.rec_localcob)) {
              grupo.rec_localcob.forEach(registro => {
                const local = (registro.localcobranca || '').trim()
                if (local) {
                  if (!recLocalCobranca[local]) {
                    recLocalCobranca[local] = 0
                  }
                  recLocalCobranca[local] += parseFloat(registro.saldo || 0)
                }
              })
            }

            // Processar Pagar por Tipo de Documento
            if (grupo.pag_tpdocto && Array.isArray(grupo.pag_tpdocto)) {
              grupo.pag_tpdocto.forEach(registro => {
                const tipo = (registro.tipodocumento || '').trim()
                if (tipo) {
                  if (!pagTipoDocumento[tipo]) {
                    pagTipoDocumento[tipo] = 0
                  }
                  pagTipoDocumento[tipo] += parseFloat(registro.saldo || 0)
                }
              })
            }

            // Processar Pagar por Local de Cobrança
            if (grupo.pag_localcob && Array.isArray(grupo.pag_localcob)) {
              grupo.pag_localcob.forEach(registro => {
                const local = (registro.localcobranca || '').trim()
                if (local) {
                  if (!pagLocalCobranca[local]) {
                    pagLocalCobranca[local] = 0
                  }
                  pagLocalCobranca[local] += parseFloat(registro.saldo || 0)
                }
              })
            }
          })
        }

        // Converter objetos para arrays de objetos
        const recTipoDocumentoArray = Object.entries(recTipoDocumento).map(([tipo, saldo]) => ({
          tipodocumento: tipo,
          saldo: saldo
        }))

        const recLocalCobrancaArray = Object.entries(recLocalCobranca).map(([local, saldo]) => ({
          localcobranca: local,
          saldo: saldo
        }))

        const pagTipoDocumentoArray = Object.entries(pagTipoDocumento).map(([tipo, saldo]) => ({
          tipodocumento: tipo,
          saldo: saldo
        }))

        const pagLocalCobrancaArray = Object.entries(pagLocalCobranca).map(([local, saldo]) => ({
          localcobranca: local,
          saldo: saldo
        }))

        this.pagRecDocLoc = {
          tipodocumento: {
            receber: recTipoDocumentoArray,
            pagar: pagTipoDocumentoArray
          },
          localcobranca: {
            receber: recLocalCobrancaArray,
            pagar: pagLocalCobrancaArray
          }
        }

        return this.pagRecDocLoc
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar títulos por local e documento'
        console.error(`[${new Date().toLocaleString('pt-BR')}] Erro ao buscar pagar/receber por doc/loc:`, error)
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
      try {
        await Promise.all([
          this.buscarPagarReceber(idempresa),
          this.buscarSaldosBancarios(idempresa),
          this.buscarFluxoCaixaMensal(idempresa),
          this.buscarFluxoCaixaDiario(idempresa),
          this.buscarPagRecDocLoc(idempresa)
        ])
        return true
      } catch (error) {
        return false
      }
    }
  }
})

