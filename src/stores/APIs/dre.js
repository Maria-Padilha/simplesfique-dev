import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiPhp from '@/services/apiPhp'
import { toast } from 'vue3-toastify'

export const useDreStore = defineStore('dre', () => {
  // Dados da DRE
  const dreData = ref([])
  const loading = ref(false)

  /**
   * Buscar movimentações de DRE
   * @param {Object} params - Parâmetros da busca
   * @param {Number} params.id - ID do modelo DRE
   * @param {Number} params.idEmpresa - ID da empresa
   * @param {Number} params.idAno - Ano de referência
   * @param {Number} params.idMes - Mês de referência
   * @param {Number} params.regime - Regime: 1=Competência, 2=Caixa
   * @returns {Promise}
   */
  const buscarMovimentacoesDRE = async ({ id, idEmpresa, idAno, idMes, regime = 1 }) => {
    if (!id || !idEmpresa || !idAno || !idMes) {
      toast.error('Parâmetros obrigatórios: ID, Empresa, Ano e Mês')
      throw new Error('Parâmetros obrigatórios não fornecidos')
    }

    if (!regime || ![1, 2].includes(regime)) {
      toast.error('Regime inválido. Use 1 para Competência ou 2 para Caixa')
      throw new Error('Regime inválido')
    }

    loading.value = true
    try {
      const response = await apiPhp.get(`/financeiro/dre-detalhes/${id}`, {
        params: {
          id_ano: idAno,
          id_mes: idMes,
          regime
        }
      })
      
      dreData.value = response.data ?? []
      return dreData.value
    } catch (error) {
      toast.error('Erro ao buscar movimentações de DRE')
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    dreData,
    loading,
    buscarMovimentacoesDRE
  }
})