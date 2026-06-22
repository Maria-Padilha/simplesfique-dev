import { defineStore } from 'pinia'
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