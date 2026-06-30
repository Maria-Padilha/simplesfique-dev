import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import {
  uploadArquivoR2,
  downloadArquivoR2,
  deletarArquivoR2,
  listarArquivosR2,
  obterConfiguracoesR2,
  obterIdSaas,
  obterIdEmpresa
} from '@/services/cloudflareR2'

export const useR2Store = defineStore('r2', () => {
  // State
  const loading = ref(false)
  const progresso = ref(0)
  const erro = ref(null)
  const mensagem = ref(null)
  const arquivo = ref(null)
  const entidade = ref('outro')
  const urlArquivo = ref(null)
  const caminhoArquivo = ref(null)
  const arquivos = ref([])
  const configuracoes = ref(obterConfiguracoesR2())
  const idSaas = ref(obterIdSaas())
  const idEmpresa = ref(obterIdEmpresa())

  // Computed
  const estaConfigurado = computed(() => configuracoes.value.configurado)
  const porcentagemProgresso = computed(() => progresso.value)

  /**
   * Faz upload de arquivo
   * @param {File} file - Arquivo a ser enviado
   * @param {string} nomeEntidade - Nome da entidade (produto, boleto, outro)
   */
  const fazerUpload = async (file, nomeEntidade = 'outro') => {
    try {
      loading.value = true
      erro.value = null
      mensagem.value = null
      progresso.value = 0

      if (!file) {
        erro.value = 'Nenhum arquivo selecionado'
        toast.error(erro.value)
        return { sucesso: false, erro: erro.value }
      }

      if (!estaConfigurado.value) {
        erro.value = 'Credenciais Cloudflare R2 não configuradas. Verifique o .env'
        toast.error(erro.value)
        return { sucesso: false, erro: erro.value }
      }

      const resultado = await uploadArquivoR2(
        file,
        nomeEntidade
      )

      if (resultado.sucesso) {
        urlArquivo.value = resultado.url
        caminhoArquivo.value = resultado.caminho
        arquivo.value = file
        progresso.value = 100
        mensagem.value = `"${file.name}" enviado com sucesso!`
        toast.success(mensagem.value)
        return resultado
      } else {
        erro.value = resultado.erro || 'Erro ao fazer upload'
        toast.error(erro.value)
        return { sucesso: false, erro: erro.value }
      }
    } catch (error) {
      erro.value = error.message
      toast.error(erro.value)
      return { sucesso: false, erro: error.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Faz download de arquivo
   * @param {string} caminho - Caminho do arquivo no R2
   */
  const fazerDownload = async (caminho) => {
    try {
      loading.value = true
      erro.value = null

      const resultado = await downloadArquivoR2(caminho)

      if (resultado.sucesso) {
        toast.success('Download iniciado!')
      } else {
        erro.value = resultado.erro
        toast.error(erro.value)
      }
    } catch (error) {
      erro.value = error.message
      toast.error(erro.value)
    } finally {
      loading.value = false
    }
  }

  /**
   * Deleta arquivo do R2
   * @param {string} caminho - Caminho do arquivo no R2
   */
  const deletarArquivo = async (caminho) => {
    try {
      loading.value = true
      erro.value = null

      await deletarArquivoR2(caminho)

      urlArquivo.value = null
      caminhoArquivo.value = null
      arquivo.value = null
      mensagem.value = 'Arquivo deletado com sucesso'
      toast.success(mensagem.value)
      return true
    } catch (error) {
      erro.value = error.message
      toast.error(erro.value)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Lista arquivos de uma entidade
   * @param {string} nomeEntidade - Nome da entidade
   */
  const listarArquivos = async (nomeEntidade) => {
    try {
      loading.value = true
      erro.value = null

      const resultado = await listarArquivosR2(nomeEntidade)
      arquivos.value = resultado
      mensagem.value = `${resultado.length} arquivo(s) encontrado(s)`
    } catch (error) {
      erro.value = error.message
      arquivos.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpa os estados
   */
  const limpar = () => {
    arquivo.value = null
    urlArquivo.value = null
    caminhoArquivo.value = null
    progresso.value = 0
    erro.value = null
    mensagem.value = null
    entidade.value = 'outro'
  }

  /**
   * Atualiza as configurações do R2
   */
  const atualizarConfiguracoes = () => {
    configuracoes.value = obterConfiguracoesR2()
    idSaas.value = obterIdSaas()
    idEmpresa.value = obterIdEmpresa()
  }

  return {
    // State
    loading,
    progresso,
    erro,
    mensagem,
    arquivo,
    entidade,
    urlArquivo,
    caminhoArquivo,
    arquivos,
    configuracoes,
    idSaas,
    idEmpresa,

    // Computed
    estaConfigurado,
    porcentagemProgresso,

    // Actions
    fazerUpload,
    fazerDownload,
    deletarArquivo,
    listarArquivos,
    limpar,
    atualizarConfiguracoes
  }
})

