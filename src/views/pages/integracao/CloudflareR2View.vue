<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-cloud-upload" class="mr-3"></v-icon>
          Teste Cloudflare R2
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <!-- Status de Configuração -->
        <v-alert
          v-if="!estaConfigurado"
          type="warning"
          title="Cloudflare R2 Não Configurado"
          class="mb-4"
        >
          <p class="text-body-2 mb-2">As variáveis de ambiente do Cloudflare R2 não foram configuradas.</p>
          <p class="text-caption">Configure as seguintes variáveis em seu arquivo .env:</p>
          <ul class="text-caption">
            <li>CLOUDFLARE_ACCOUNT_ID</li>
            <li>CLOUDFLARE_ACCESS_KEY_ID</li>
            <li>CLOUDFLARE_SECRET_ACCESS_KEY</li>
            <li>CLOUDFLARE_BUCKET_NAME</li>
          </ul>
        </v-alert>

        <v-alert
          v-else
          type="success"
          title="Cloudflare R2 Configurado"
          class="mb-4"
        >
          <p class="text-body-2">Bucket: <strong>{{ configuracoes.bucketName }}</strong></p>
        </v-alert>

        <!-- Formulário de Upload -->
        <v-card class="background-card mb-6" elevation="2">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-upload" class="mr-2"></v-icon>
            Upload de Arquivo
          </v-card-title>
          <v-card-text class="pa-4">
            <v-form ref="formUploadRef">
              <!-- Seleção de Entidade -->
              <v-select
                v-model="selecionarEntidade"
                :items="entidadeOpcoes"
                label="Selecionar origem da requisição"
                outlined
                dense
                class="mb-4"
                item-title="label"
                item-value="value"
              >
                <template v-slot:prepend-inner>
                  <v-icon>mdi-folder-open</v-icon>
                </template>
              </v-select>

              <!-- Seleção de Arquivo -->
              <div class="mb-4">
                <v-file-input
                  v-model="arquivoSelecionado"
                  label="Selecionar arquivo"
                  outlined
                  dense
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  show-size
                  class="mb-2"
                >
                  <template v-slot:prepend-inner>
                    <v-icon>mdi-file</v-icon>
                  </template>
                </v-file-input>
                <p class="text-caption" style="color: var(--text-color)">
                  Formatos aceitos: Imagens, PDF, Word, Excel | Máximo: 100MB
                </p>
              </div>

              <!-- Preview da Imagem -->
              <div v-if="previewArquivo" class="mb-4">
                <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">Preview:</p>
                <v-card class="background-primary pa-2" elevation="1">
                  <img
                    v-if="ehImagem"
                    :src="previewArquivo"
                    alt="Preview"
                    style="max-width: 100%; max-height: 300px; border-radius: 4px"
                  />
                  <div v-else class="d-flex align-center justify-center" style="min-height: 200px">
                    <div class="text-center">
                      <v-icon size="48" class="mb-2">mdi-file</v-icon>
                      <p class="text-body-2">Arquivo não é uma imagem</p>
                    </div>
                  </div>
                </v-card>
              </div>

              <!-- Barra de Progresso -->
              <v-progress-linear
                v-if="loading && progresso > 0"
                :value="progresso"
                class="mb-4"
              ></v-progress-linear>

              <!-- Botão de Upload -->
              <v-btn
                color="var(--text-color-laranja)"
                :loading="loading"
                :disabled="!arquivoSelecionado || loading"
                @click="fazerUpload"
                variant="flat"
                class="text-white"
              >
                <v-icon icon="mdi-upload" class="mr-2"></v-icon>
                {{ loading ? 'Enviando...' : 'Fazer Upload' }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- Resultado do Upload -->
        <v-card
          v-if="urlArquivo"
          class="background-card mb-6"
          elevation="2"
        >
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-check-circle" class="mr-2" style="color: var(--text-color-laranja)"></v-icon>
            Upload Realizado com Sucesso
          </v-card-title>
          <v-card-text class="pa-4">
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <p class="text-subtitle-2 mb-1" style="color: var(--text-color)">URL Pública:</p>
                <v-card class="background-primary pa-3">
                  <p class="text-body-2 text-break" style="color: var(--text-color)">
                    {{ urlArquivo }}
                  </p>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-subtitle-2 mb-1" style="color: var(--text-color)">Caminho no R2:</p>
                <v-card class="background-primary pa-3">
                  <p class="text-body-2 text-break" style="color: var(--text-color)">
                    {{ caminhoArquivo }}
                  </p>
                </v-card>
              </v-col>
            </v-row>

            <!-- Preview Final -->
            <div v-if="ehImagemUpload" class="mb-4">
              <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">Arquivo Armazenado:</p>
              <v-card class="background-primary pa-2" elevation="1">
                <img
                  :src="urlArquivo"
                  alt="Arquivo Armazenado"
                  style="max-width: 100%; max-height: 400px; border-radius: 4px"
                  @error="onImagemErro"
                />
              </v-card>
            </div>

            <!-- Botões de Ação -->
            <div class="d-flex gap-2">
              <v-btn
                color="primary"
                variant="outlined"
                @click="copiarUrlParaClipboard"
              >
                <v-icon icon="mdi-content-copy" class="mr-2"></v-icon>
                Copiar URL
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                variant="outlined"
                @click="limparUpload"
              >
                <v-icon icon="mdi-close" class="mr-2"></v-icon>
                Limpar
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Informações de Técnicas -->
        <v-card class="background-card" elevation="2">
          <v-card-title class="text-h6 pa-4">
            <v-icon icon="mdi-information" class="mr-2"></v-icon>
            Informações Técnicas
          </v-card-title>
          <v-card-text class="pa-4">
            <!-- IDs SaaS e Empresa -->
            <v-row class="mb-6">
              <v-col cols="12" md="4">
                <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">ID SaaS:</p>
                <v-card class="background-primary pa-3">
                  <p class="text-body-2 text-break font-weight-bold" style="color: var(--text-color-laranja)">
                    {{ r2Store.idSaas }}
                  </p>
                  <p class="text-caption">ID da conta/organização</p>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">ID Empresa:</p>
                <v-card class="background-primary pa-3">
                  <p class="text-body-2 text-break font-weight-bold" style="color: var(--text-color-laranja)">
                    {{ r2Store.idEmpresa }}
                  </p>
                  <p class="text-caption">ID da empresa selecionada</p>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">Entidade:</p>
                <v-card class="background-primary pa-3">
                  <p class="text-body-2 text-break font-weight-bold" style="color: var(--text-color-laranja)">
                    {{ selecionarEntidade }}
                  </p>
                  <p class="text-caption">Uso: Será prefixado no caminho</p>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">Arquivo Selecionado:</p>
                <v-card class="background-primary pa-3">
                  <p class="text-body-2" style="color: var(--text-color)">
                    {{
                      Array.isArray(arquivoSelecionado)
                        ? arquivoSelecionado[0]?.name || 'Nenhum'
                        : arquivoSelecionado?.name || 'Nenhum'
                    }}
                  </p>
                  <p class="text-caption" v-if="arquivoSelecionado">
                    Tamanho: {{
                      formatarTamanho(
                        Array.isArray(arquivoSelecionado)
                          ? arquivoSelecionado[0]?.size
                          : arquivoSelecionado?.size
                      )
                    }}
                  </p>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">Entidade Selecionada:</p>
                <v-card class="background-primary pa-3">
                  <p class="text-body-2" style="color: var(--text-color)">
                    {{ selecionarEntidade }}
                  </p>
                  <p class="text-caption">
                    Uso: Será prefixado no caminho do arquivo no R2
                  </p>
                </v-card>
              </v-col>
            </v-row>

            <div class="mt-6">
              <p class="text-subtitle-2 mb-2" style="color: var(--text-color)">Estrutura de Pastas do R2:</p>
              <v-card class="background-primary pa-3">
                <pre style="color: var(--text-color); margin: 0; overflow-x: auto"><code>bucket/
├── {{ r2Store.idSaas }}/
│   └── {{ r2Store.idEmpresa }}/
│       ├── produto/
│       │   ├── 1609459200000-iphone-12.jpg
│       │   └── 1609459234567-iphone-13.jpg
│       ├── boleto/
│       │   ├── 1609459300000-boleto-001.pdf
│       │   └── 1609459334567-boleto-002.pdf
│       └── outro/
│           ├── 1609459400000-documento.docx
│           └── 1609459434567-relatorio.xlsx</code></pre>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useR2Store } from '@/stores/APIs/r2'
import useR2 from '@/utils/useR2'

const themeStore = useThemeStore()
const r2Store    = useR2Store()

// ── Entidade selecionada via select ───────────────────────────────────────────
const selecionarEntidade = ref('outro')
const r2 = useR2(selecionarEntidade.value)

const { loading, urlArquivo, caminhoArquivo, progresso, estaConfigurado, configuracoes, limpar: limparR2 } = r2

// ── Arquivo ───────────────────────────────────────────────────────────────────
const arquivoSelecionado = ref(null)
const previewArquivo     = ref(null)

watch(arquivoSelecionado, (val) => {
  previewArquivo.value = null
  const file = Array.isArray(val) ? val[0] : val
  if (!file) return
  if (file.type?.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => { previewArquivo.value = e.target.result }
    reader.readAsDataURL(file)
  }
}, { deep: true })

const entidadeOpcoes = [
  { label: 'Produto', value: 'produto' },
  { label: 'Boleto',  value: 'boleto'  },
  { label: 'Outro',   value: 'outro'   }
]

const ehImagem = computed(() => {
  const file = Array.isArray(arquivoSelecionado.value)
    ? arquivoSelecionado.value[0]
    : arquivoSelecionado.value
  return file?.type?.startsWith('image/') || false
})

const ehImagemUpload = computed(() => r2Store.arquivo?.type?.startsWith('image/') || false)

// ── Ações ─────────────────────────────────────────────────────────────────────
const fazerUpload = async () => {
  const file = Array.isArray(arquivoSelecionado.value)
    ? arquivoSelecionado.value[0]
    : arquivoSelecionado.value
  if (!file) return
  await r2.upload(file, selecionarEntidade.value)
}

const copiarUrlParaClipboard = () => {
  if (urlArquivo.value) navigator.clipboard.writeText(urlArquivo.value)
}

const limparUpload = () => {
  limparR2()
  arquivoSelecionado.value = null
  previewArquivo.value = null
}

const onImagemErro = () => {}

const formatarTamanho = (bytes) => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round((bytes / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`
}
</script>

<style scoped>
pre { margin: 0; white-space: pre; }
</style>

