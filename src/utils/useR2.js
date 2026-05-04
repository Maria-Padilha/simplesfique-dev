/**
 * Composable para uso do Cloudflare R2 em qualquer view/componente
 *
 * Uso básico:
 *   const { upload, download, deletar, listar, loading, erro } = useR2('produto')
 *   await upload(file)
 *
 * Entidades disponíveis: 'produto' | 'boleto' | 'outro'
 */

import { computed } from 'vue'
import { useR2Store } from '@/stores/APIs/r2'

/**
 * @param {'produto'|'boleto'|'outro'} entidadePadrao - Origem da imagem/arquivo
 */
export const useR2 = (entidadePadrao = 'outro') => {
  const r2Store = useR2Store()

  // ── Estado exposto ──────────────────────────────────────────────────────────
  const loading         = computed(() => r2Store.loading)
  const erro            = computed(() => r2Store.erro)
  const mensagem        = computed(() => r2Store.mensagem)
  const urlArquivo      = computed(() => r2Store.urlArquivo)
  const caminhoArquivo  = computed(() => r2Store.caminhoArquivo)
  const progresso       = computed(() => r2Store.progresso)
  const estaConfigurado = computed(() => r2Store.estaConfigurado)
  const configuracoes   = computed(() => r2Store.configuracoes)

  // ── Ações ───────────────────────────────────────────────────────────────────

  /**
   * Faz upload de um arquivo para o R2
   * @param {File} file - Arquivo a ser enviado
   * @param {string} [entidade] - Sobrescreve a entidade padrão
   * @returns {Promise<{sucesso: boolean, url: string, caminho: string}>}
   *
   * @example
   * const { url, caminho } = await upload(file)
   * const { url } = await upload(file, 'boleto')   // sobrescreve
   */
  const upload = async (file, entidade = entidadePadrao) => {
    return r2Store.fazerUpload(file, entidade)
  }

  /**
   * Faz download de um arquivo do R2 gerando presigned URL
   * @param {string} caminho - Caminho do arquivo no bucket
   *
   * @example
   * await download('1/1/produto/1234-imagem.jpg')
   */
  const download = async (caminho) => {
    return r2Store.fazerDownload(caminho)
  }

  /**
   * Deleta um arquivo do R2
   * @param {string} caminho - Caminho do arquivo no bucket
   *
   * @example
   * await deletar('1/1/produto/1234-imagem.jpg')
   */
  const deletar = async (caminho) => {
    return r2Store.deletarArquivo(caminho)
  }

  /**
   * Lista arquivos de uma entidade no R2
   * @param {string} [entidade] - Sobrescreve a entidade padrão
   * @returns {Promise<Array>}
   *
   * @example
   * const arquivos = await listar()
   */
  const listar = async (entidade = entidadePadrao) => {
    return r2Store.listarArquivos(entidade)
  }

  /**
   * Limpa o estado do store (url, caminho, erro, etc.)
   */
  const limpar = () => r2Store.limpar()

  return {
    // Estado
    loading,
    erro,
    mensagem,
    urlArquivo,
    caminhoArquivo,
    progresso,
    estaConfigurado,
    configuracoes,

    // Ações
    upload,
    download,
    deletar,
    listar,
    limpar
  }
}

// ── Entidades predefinidas (atalhos prontos) ────────────────────────────────────

/** Composable pré-configurado para a entidade produto */
export const useR2Produto = () => useR2('produto')

/** Composable pré-configurado para a entidade boleto */
export const useR2Boleto = () => useR2('boleto')

/** Composable pré-configurado para a entidade outro */
export const useR2Outro = () => useR2('outro')

export default useR2

