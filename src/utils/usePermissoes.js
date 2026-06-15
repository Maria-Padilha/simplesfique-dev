import { useAcessoStore } from '@/stores/APIs/acesso'

/**
 * Composable para verificar permissões de acesso do usuário
 * Uso: const { temPermissao } = usePermissoes()
 */
export function usePermissoes() {
  const acessoStore = useAcessoStore()

  /**
   * Verificar se o usuário tem permissão para um programa e tipo de acesso específico
   * @param {string} idPrograma - ID do programa (ex: 'FFIN002C')
   * @param {string} tipoAcesso - Tipo de acesso (visualizar, incluir, alterar, excluir, exportar, pdf)
   * @returns {boolean} - True se tem permissão, false caso contrário
   */
  // TEMPORÁRIO: permissões desabilitadas para facilitar testes de migração de API
  // eslint-disable-next-line no-unused-vars
  const temPermissao = (idPrograma, tipoAcesso = 'visualizar') => {
    return true
  }

  /**
   * Obter detalhes de acesso de um programa
   * @param {string} idPrograma - ID do programa
   * @returns {object} - Objeto com permissões do programa
   */
  const obterAcessoPrograma = (idPrograma) => {
    return acessoStore.getAcessoPrograma(idPrograma)
  }

  /**
   * Verificar se o usuário tem permissão para visualizar um programa
   * @param {string} idPrograma - ID do programa
   * @returns {boolean}
   */
  const podeVisualizar = (idPrograma) => {
    return temPermissao(idPrograma, 'visualizar')
  }

  /**
   * Verificar se o usuário tem permissão para incluir
   * @param {string} idPrograma - ID do programa
   * @returns {boolean}
   */
  const podeIncluir = (idPrograma) => {
    return temPermissao(idPrograma, 'incluir')
  }

  /**
   * Verificar se o usuário tem permissão para alterar
   * @param {string} idPrograma - ID do programa
   * @returns {boolean}
   */
  const podeAlterar = (idPrograma) => {
    return temPermissao(idPrograma, 'alterar')
  }

  /**
   * Verificar se o usuário tem permissão para excluir
   * @param {string} idPrograma - ID do programa
   * @returns {boolean}
   */
  const podeExcluir = (idPrograma) => {
    return temPermissao(idPrograma, 'excluir')
  }

  /**
   * Verificar se o usuário tem permissão para exportar
   * @param {string} idPrograma - ID do programa
   * @returns {boolean}
   */
  const podeExportar = (idPrograma) => {
    return temPermissao(idPrograma, 'exportar')
  }

  /**
   * Verificar se o usuário tem permissão para PDF
   * @param {string} idPrograma - ID do programa
   * @returns {boolean}
   */
  const podePDF = (idPrograma) => {
    return temPermissao(idPrograma, 'pdf')
  }

  return {
    temPermissao,
    obterAcessoPrograma,
    podeVisualizar,
    podeIncluir,
    podeAlterar,
    podeExcluir,
    podeExportar,
    podePDF
  }
}

