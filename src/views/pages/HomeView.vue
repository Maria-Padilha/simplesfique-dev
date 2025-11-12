<template>
  <main class="my-12 mx-10">
    <v-container>
      <!-- Título -->
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 mb-6 text-center">
            <v-icon icon="mdi-test-tube" class="mr-3" color="primary"></v-icon>
            Teste de Componentes Media
          </h1>
          <v-divider class="mb-8"></v-divider>
        </v-col>
      </v-row>

      <!-- Seção 1: MediaSave - Upload de Imagens -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-8">
            <v-card-title class="bg-primary text-white">
              <v-icon icon="mdi-cloud-upload" class="mr-2"></v-icon>
              1. MediaSave - Upload de Imagens
            </v-card-title>
            
            <v-card-text class="pa-6">
              <MediaSave
                id-saas="123"
                id-usuario="456"
                :on-upload-success="handleUploadSuccess"
                @upload-success="onUploadComplete"
                @upload-error="onUploadError"
                @file-selected="onFileSelected"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Seção 2: MediaShow - Visualização de Imagens -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-8">
            <v-card-title class="bg-success text-white">
              <v-icon icon="mdi-eye" class="mr-2"></v-icon>
              2. MediaShow - Visualização de Imagens
            </v-card-title>
            
            <v-card-text class="pa-6">
              <!-- Input para testar com key manual -->
              <v-row class="mb-6">
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="testImageKey"
                    label="Key da Imagem para Teste"
                    placeholder="Digite uma key para testar..."
                    variant="outlined"
                    prepend-icon="mdi-key"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    color="success"
                    variant="elevated"
                    @click="loadTestImage"
                    :disabled="!testImageKey"
                    prepend-icon="mdi-magnify"
                    block
                  >
                    Carregar Imagem
                  </v-btn>
                </v-col>
              </v-row>
              
              <!-- MediaShow para teste manual -->
              <div v-if="testImageKey" class="mb-6">
                <h4 class="text-h6 mb-3">Teste Manual:</h4>
                <MediaShow
                  :image-key="testImageKey"
                  height="200"
                  width="300"
                  show-actions
                  @load-success="onImageLoadSuccess"
                  @load-error="onImageLoadError"
                  @image-click="onImageClick"
                />
              </div>
              
              <!-- MediaShow para imagem enviada -->
              <div v-if="uploadedImageKey" class="mb-6">
                <h4 class="text-h6 mb-3">Imagem Recém-Enviada:</h4>
                <MediaShow
                  :image-key="uploadedImageKey"
                  height="250"
                  width="350"
                  show-actions
                  @load-success="onImageLoadSuccess"
                  @load-error="onImageLoadError"
                  @image-click="onImageClick"
                />
              </div>
              
              <!-- Placeholder quando não há imagens -->
              <div v-if="!testImageKey && !uploadedImageKey" class="text-center py-8">
                <v-icon icon="mdi-image-search" size="64" color="grey" class="mb-4"></v-icon>
                <p class="text-h6 text-grey">
                  Faça upload de uma imagem acima ou digite uma key para testar
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Seção 3: Galeria de Teste -->
      <v-row v-if="galleryImages.length > 0">
        <v-col cols="12">
          <v-card>
            <v-card-title class="bg-info text-white">
              <v-icon icon="mdi-view-grid" class="mr-2"></v-icon>
              3. Galeria de Imagens Enviadas
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-row>
                <v-col
                  v-for="(image, index) in galleryImages"
                  :key="index"
                  cols="12" sm="6" md="4" lg="3"
                >
                  <v-card variant="outlined" class="pa-2">
                    <MediaShow
                      :image-key="image.key"
                      height="150"
                      width="100%"
                      show-actions
                      :show-loading-text="false"
                    />
                    
                    <v-card-text class="text-center pa-2">
                      <p class="text-caption text-grey">
                        {{ image.fileName }}
                      </p>
                      <p class="text-caption text-primary">
                        {{ image.key.substring(0, 20) }}...
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Log de Eventos -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="bg-warning text-white d-flex align-center justify-space-between">
              <div>
                <v-icon icon="mdi-console" class="mr-2"></v-icon>
                Log de Eventos
              </div>
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                @click="clearLogs"
              ></v-btn>
            </v-card-title>
            
            <v-card-text class="pa-0">
              <v-textarea
                :model-value="logsText"
                readonly
                variant="plain"
                rows="8"
                class="text-caption"
                style="font-family: 'Courier New', monospace;"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import MediaSave from '@/components/base/media/MediaSave.vue'
import MediaShow from '@/components/base/media/MediaShow.vue'

// Estados
const testImageKey = ref('')
const uploadedImageKey = ref('')
const galleryImages = ref([])
const eventLogs = ref([])

// Computed
const logsText = computed(() => {
  return eventLogs.value.join('\n')
})

// Funções de logging
const addLog = (message, type = 'INFO') => {
  const timestamp = new Date().toLocaleTimeString()
  eventLogs.value.push(`[${timestamp}] ${type}: ${message}`)
}

const clearLogs = () => {
  eventLogs.value = []
  addLog('Logs limpos')
}

// Handlers do MediaSave
const handleUploadSuccess = async (uploadData) => {
  addLog(`Callback chamado - Key: ${uploadData.key}`, 'SUCCESS')
  
  try {
    // Simular salvamento no banco
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simular sucesso (90% das vezes) ou erro (10% das vezes) para testar
    if (Math.random() > 0.1) {
      addLog('Imagem salva no banco com sucesso!', 'SUCCESS')
      
      // Adicionar à galeria
      galleryImages.value.push({
        key: uploadData.key,
        fileName: uploadData.file.name,
        uploadDate: new Date()
      })
      
    } else {
      // Simular erro para testar o auto-delete
      addLog('Simulando erro no callback para testar auto-delete...', 'ERROR')
      throw new Error('Erro simulado no salvamento do banco')
    }
    
  } catch (error) {
    addLog(`Erro no callback: ${error.message}`, 'ERROR')
    throw error // Re-throw para acionar o auto-delete
  }
}

const onUploadComplete = (data) => {
  addLog(`Upload completado - Key: ${data.key}, Arquivo: ${data.file.name}`, 'SUCCESS')
  uploadedImageKey.value = data.key
}

const onUploadError = (error) => {
  addLog(`Erro no upload: ${error.message || JSON.stringify(error)}`, 'ERROR')
}

const onFileSelected = (file) => {
  addLog(`Arquivo selecionado: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`, 'INFO')
}

// Handlers do MediaShow
const loadTestImage = () => {
  addLog(`Tentando carregar imagem com key: ${testImageKey.value}`, 'INFO')
}

const onImageLoadSuccess = (data) => {
  addLog(`Imagem carregada com sucesso - Key: ${data.key}`, 'SUCCESS')
}

const onImageLoadError = (error) => {
  addLog(`Erro ao carregar imagem - Key: ${error.key}, Erro: ${error.message}`, 'ERROR')
}

const onImageClick = (data) => {
  addLog(`Imagem clicada - Key: ${data.key}`, 'INFO')
}

// Inicialização
addLog('Tela de teste inicializada')
</script>