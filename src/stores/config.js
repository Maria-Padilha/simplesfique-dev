import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store para gerenciar as seções/abas de configuração
 * Cada seção corresponde a um componente diferente que será renderizado
 */
export const useConfigStore = defineStore('config', () => {

  /**
   * SECOES_CONFIG - Define todas as seções/abas de configuração
   * 
   * Cada seção contém:
   * - id: identificador único (usado para saber qual componente renderizar)
   * - titulo: nome exibido na lista de menu
   * - icon: ícone MDI
   * - componente: nome do componente a renderizar (sem .vue, match com arquivo)
   * - descricao: descrição breve da seção
   */
  const secoesConfig = ref([
    {
      id: 'geral',
      titulo: 'Geral',
      icon: 'mdi-cog',
      componente: 'ConfigGeral',
      descricao: 'Configurações gerais do sistema'
    },
    {
      id: 'parametrofinanceiro',
      titulo: 'Parâmetro Financeiro',
      icon: 'mdi-calculator',
      componente: 'ConfigParametroFinanceiro',
      descricao: 'Configurações financeiras'
    }
  ]);

  /**
   * Estado reativo para controlar qual seção está ativa
   */
  const secaoAtiva = ref('geral');

  /**
   * GETTERS
   */

  const getSecoesConfig = () => secoesConfig.value;

  const getSecaoAtiva = () => secaoAtiva.value;

  const getSecaoAtivaObj = () => {
    return secoesConfig.value.find(s => s.id === secaoAtiva.value);
  };

  /**
   * ACTIONS
   */

  /**
   * Define qual seção está ativa
   * @param {string} id - ID da seção
   */
  const ativarSecao = (id) => {
    const secao = secoesConfig.value.find(s => s.id === id);
    if (secao) {
      secaoAtiva.value = id;
    } else {
      console.warn(`Seção com ID "${id}" não encontrada`);
    }
  };

  return {
    secoesConfig,
    secaoAtiva,
    getSecoesConfig,
    getSecaoAtiva,
    getSecaoAtivaObj,
    ativarSecao
  };
});
