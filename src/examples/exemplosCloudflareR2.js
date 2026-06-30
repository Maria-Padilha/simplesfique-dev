/**
 * Exemplo de Como Usar o Cloudflare R2 no SimplesFique
 * Este arquivo contém exemplos práticos de integração
 */

// =====================================================
// 1. EXEMPLO: Usar o Store no Componente
// =====================================================

// Em qualquer view/componente Vue:
import { useR2Store } from '@/stores/APIs/r2'

export const exemploUsarStore = {
  setup() {
    const r2Store = useR2Store()

    const handleUploadProduto = async (event) => {
      const file = event.target.files[0]

      // Fazer upload com entidade 'produto'
      const resultado = await r2Store.fazerUpload(file, 'produto')

      if (resultado.sucesso) {
        console.log('URL do arquivo:', resultado.url)
        console.log('Caminho no R2:', resultado.path)
        // Agora você pode salvar a URL no banco de dados
      }
    }

    return { handleUploadProduto, r2Store }
  }
}

// =====================================================
// 2. EXEMPLO: Usar o Serviço Diretamente
// =====================================================

import { uploadArquivoR2, deletarArquivoR2 } from '@/services/cloudflareR2'

export const exemploUsarServico = async () => {
  // Upload com callback de progresso
  const resultado = await uploadArquivoR2(
    arquivo,
    'boleto',
    'boleto-123.pdf',
    (percentual) => {
      console.log(`Upload: ${percentual}%`)
    }
  )

  if (resultado.sucesso) {
    // Deletar arquivo quando necessário
    await deletarArquivoR2(resultado.path)
  }
}

// =====================================================
// 3. EXEMPLO: Integração com Store de Produto
// =====================================================

export const exemploProdutoIntegracao = {
  setup() {
    const r2Store = useR2Store()
    const produtoStore = useProdutoStore()

    const salvarProdutoComImagem = async (produtoData, imagemFile) => {
      try {
        // 1. Fazer upload da imagem
        const imagemResult = await r2Store.fazerUpload(
          imagemFile,
          'produto'
        )

        if (!imagemResult.sucesso) {
          console.error('Erro no upload:', imagemResult.erro)
          return
        }

        // 2. Adicionar URL ao objeto de produto
        produtoData.imagemUrl = imagemResult.url
        produtoData.imagemCaminhoR2 = imagemResult.path

        // 3. Salvar produto com a URL da imagem
        const resultado = await produtoStore.cadastrarProduto(produtoData)

        return resultado
      } catch (error) {
        console.error('Erro ao salvar produto:', error)
      }
    }

    return { salvarProdutoComImagem }
  }
}

// =====================================================
// 4. EXEMPLO: Integração com Store de Boleto
// =====================================================

export const exemploBoletoIntegracao = {
  setup() {
    const r2Store = useR2Store()
    const boletoStore = useBoletoStore()

    const salvarBoletoComPDF = async (boletoData, pdfFile) => {
      try {
        // 1. Fazer upload do PDF
        const pdfResult = await r2Store.fazerUpload(
          pdfFile,
          'boleto'
        )

        if (!pdfResult.sucesso) {
          throw new Error(pdfResult.erro)
        }

        // 2. Adicionar URL ao objeto de boleto
        boletoData.pdfUrl = pdfResult.url
        boletoData.pdfCaminhoR2 = pdfResult.path

        // 3. Salvar boleto com a URL do PDF
        return await boletoStore.cadastrarBoleto(boletoData)
      } catch (error) {
        console.error('Erro ao salvar boleto:', error)
        throw error
      }
    }

    return { salvarBoletoComPDF }
  }
}

// =====================================================
// 5. EXEMPLO: Listar Arquivos de uma Entidade
// =====================================================

export const exemploListarArquivos = {
  setup() {
    const r2Store = useR2Store()

    const listarImagensDosProdutos = async () => {
      try {
        await r2Store.listarArquivos('produto')

        console.log('Arquivos encontrados:', r2Store.arquivos)
        console.log('Total:', r2Store.arquivos.length)
      } catch (error) {
        console.error('Erro ao listar:', error)
      }
    }

    return { listarImagensDosProdutos }
  }
}

// =====================================================
// 6. EXEMPLO: Download de Arquivo
// =====================================================

export const exemploDownloadArquivo = {
  setup() {
    const r2Store = useR2Store()

    const downloadBoleto = async (caminhoNoR2) => {
      try {
        await r2Store.fazerDownload(
          caminhoNoR2,
          'boleto-123.pdf'
        )
      } catch (error) {
        console.error('Erro no download:', error)
      }
    }

    return { downloadBoleto }
  }
}

// =====================================================
// 7. EXEMPLO: Deletar Arquivo
// =====================================================

export const exemploDeletarArquivo = {
  setup() {
    const r2Store = useR2Store()

    const excluirImagemProduto = async (caminhoNoR2) => {
      try {
        await r2Store.deletarArquivo(caminhoNoR2)
        console.log('Arquivo excluído com sucesso')
      } catch (error) {
        console.error('Erro ao excluir:', error)
      }
    }

    return { excluirImagemProduto }
  }
}

// =====================================================
// 8. EXEMPLO: Tratamento de Erros
// =====================================================

export const exemploTratamentoErros = {
  setup() {
    const r2Store = useR2Store()

    const uploadComTratamentoErro = async (file) => {
      const resultado = await r2Store.fazerUpload(file, 'outro')

      // O store já mostra toast com erro
      if (!resultado.sucesso) {
        // Você pode fazer lógica adicional aqui
        if (resultado.erro.includes('muito grande')) {
          // Arquivo é grande demais
          mostrarMensagemCompressaoDica()
        }
        return false
      }

      return true
    }

    return { uploadComTratamentoErro }
  }
}

// =====================================================
// 9. EXEMPLO: Componente de Upload Reutilizável
// =====================================================

export const componenteUploadReutilizavel = {
  props: {
    entidade: {
      type: String,
      required: true,
      // valores: 'produto', 'boleto', 'outro'
    }
  },
  emits: ['upload-sucesso', 'upload-erro'],
  setup(props, { emit }) {
    const r2Store = useR2Store()
    const arquivos = ref([])

    const handleFileUpload = async (event) => {
      const file = event.target.files[0]

      const resultado = await r2Store.fazerUpload(file, props.entidade)

      if (resultado.sucesso) {
        arquivos.value.push({
          nome: resultado.nomeArquivo,
          url: resultado.url,
          path: resultado.path,
          size: resultado.size
        })
        emit('upload-sucesso', resultado)
      } else {
        emit('upload-erro', resultado.erro)
      }
    }

    return { handleFileUpload, arquivos }
  }
}

// =====================================================
// 10. EXEMPLO: Monitorar Progresso de Upload
// =====================================================

export const exemploMonitorarProgresso = {
  setup() {
    const r2Store = useR2Store()
    const progress = computed(() => r2Store.progresso)
    const isLoading = computed(() => r2Store.loading)

    const uploadComProgresso = async (file) => {
      // O progresso é atualizado automaticamente
      await r2Store.fazerUpload(file, 'produto')

      console.log('Progresso final:', progress.value)
    }

    return { uploadComProgresso, progress, isLoading }
  }
}

// =====================================================
// CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE
// =====================================================

/*
Adicione estas variáveis ao seu arquivo .env:

VUE_APP_R2_ACCOUNT_ID=12345678901234567890
VUE_APP_R2_ACCESS_KEY_ID=d1234567890abcdef1234567890abcde
VUE_APP_R2_SECRET_ACCESS_KEY=abcdefghijklmnopqrstuvwxyz0123456789abcd
VUE_APP_R2_BUCKET_NAME=simples-fique
VUE_APP_R2_ENDPOINT_URL=https://12345678901234567890.r2.cloudflarestorage.com
VUE_APP_R2_PUBLIC_URL=https://cdn.yourdomain.com
*/

// =====================================================
// ESTRUTURA DE PASTAS NO R2 APÓS UPLOADS
// =====================================================

/*
bucket/
├── produto/
│   ├── 1609459200000-iphone-12.jpg
│   ├── 1609459234567-iphone-13.jpg
│   └── 1609459268901-samsung-a52.jpg
├── boleto/
│   ├── 1609459300000-boleto-001.pdf
│   ├── 1609459334567-boleto-002.pdf
│   └── 1609459368901-boleto-003.pdf
└── outro/
    ├── 1609459400000-documento.docx
    └── 1609459434567-relatorio.xlsx

Cada arquivo é armazenado com timestamp no nome para evitar conflitos:
{entidade}/{timestamp}-{nome_original}
*/

