import { defineStore } from 'pinia'
import api from '@/services/api'
import apiPhp from '@/services/apiPhp'

/**
 * Retorna o nome do mês em português baseado no número (1-12)
 * @param {number} mes - Número do mês (1 = Janeiro)
 * @returns {string} Nome do mês
 */
function obterNomeMes(mes) {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return meses[(mes || 1) - 1] || 'Mês'
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    pagarReceber: [],
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
     * @deprecated THorse - servidor offline
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

        // Garantir estrutura de dados válida como array
        let dados
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data
        } else if (Array.isArray(resposta)) {
          dados = resposta
        } else if (resposta && typeof resposta === 'object') {
          dados = [resposta]
        } else {
          dados = []
        }

        this.pagarReceber = dados
        console.log(`✅ Dados de pagar/receber carregados:`, this.pagarReceber)
        return this.pagarReceber
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar dados de pagar/receber'
        console.error(`❌ Erro ao buscar pagar/receber:`, error)
        return null
      } finally {
        this.loading = false
      }
    },

    // ========== SALDOS BANCÁRIOS ==========
    /**
     * Busca saldos bancários por empresa
     * @deprecated THorse - servidor offline
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
     * @deprecated THorse - servidor offline
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
     * @deprecated THorse - servidor offline
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
     * @deprecated THorse - servidor offline
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
     * Carrega todos os dados do dashboard via endpoint consolidado PHP
     * Substitui as 5 chamadas THorse separadas por 1 chamada ao PHP
     *
     * GET /financeiro/dashboard-financeiro
     *
     * @param {number} idempresa - ID da empresa
     * @param {number} [mes] - Mês para filtrar (1-12, opcional)
     * @param {number} [ano] - Ano para filtrar (2000-2100, opcional)
     */
    async carregarDadosDashboard(idempresa, mes, ano) {
      this.loading = true
      this.error = null
      try {
        const params = {}
        if (idempresa) params.id_empresa = idempresa
        if (mes) params.mes = mes
        if (ano) params.ano = ano

        const response = await apiPhp.get('/financeiro/dashboard-financeiro', { params })
        // apiPhp interceptor NÃO desembrulha objetos simples (só paginação com current_page)
        // então response.data é o objeto direto: { total_a_pagar, total_a_receber, ... }
        const data = response.data?.data || response.data

        // --- Mapear resposta PHP para o estado existente ---

        // pagarReceber[0]: HomeView lê pagarvencido, pagardodia, pagarrestantemes,
        // recebervencido, receberdodia, receberrestantemes
        // PHP não fornece breakdown vencido/dia/restante, então total vai em "restante"
        this.pagarReceber = [{
          pagarvencido: [{ saldo: 0, qtd_titulos: 0 }],
          pagardodia: [{ saldo: 0, qtd_titulos: 0 }],
          pagarrestantemes: [{ saldo: data.total_a_pagar || 0, qtd_titulos: 0 }],
          recebervencido: [{ saldo: 0, qtd_titulos: 0 }],
          receberdodia: [{ saldo: 0, qtd_titulos: 0 }],
          receberrestantemes: [{ saldo: data.total_a_receber || 0, qtd_titulos: 0 }]
        }]

        // saldosBancarios[0]: HomeView lê saldototal e saldosbancario[]
        this.saldosBancarios = [{
          saldototal: data.saldo_contas_correntes || 0,
          saldosbancario: []
        }]

        // fluxoCaixaMensal[0]: HomeView lê nomemes, receber, pagar, saldofinal
        const fluxo = data.fluxo_caixa_mes || {}
        const nomeMes = obterNomeMes(data.mes_referencia)

        this.fluxoCaixaMensal = [{
          nomemes: nomeMes,
          receber: fluxo.entradas || 0,
          pagar: fluxo.saidas || 0,
          saldofinal: fluxo.resultado || 0,
          saldoinicial: 0
        }]

        // fluxoCaixaDiario: PHP não fornece dados diários (apenas mensal)
        this.fluxoCaixaDiario = []

        // pagRecDocLoc: PHP não fornece breakdown por tipo documento / local cobrança
        this.pagRecDocLoc = {
          tipodocumento: { receber: [], pagar: [] },
          localcobranca: { receber: [], pagar: [] }
        }

        console.log(`[Dashboard PHP] Dados carregados para ${nomeMes}/${data.ano_referencia || ano}`)
        return true
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erro ao carregar dashboard'
        console.error('[Dashboard PHP] Erro:', error)
        return false
      } finally {
        this.loading = false
      }
    }
  }
})