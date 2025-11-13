<template>
  <div class="media-save-component">
    <!-- Upload de Arquivo Único -->
    <v-card variant="outlined" class="pa-4">
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-cloud-upload" class="mr-2" color="primary"></v-icon>
        Upload de Imagem
      </v-card-title>
      
      <v-card-text>
        <!-- Área de Drop/Upload -->
        <div
          class="upload-area"
          :class="{ 
            'drag-over': isDragOver,
            'has-file': selectedFile,
            'uploading': uploading
          }"
          @drop="handleDrop"
          @dragover.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            style="display: none"
          />
          
          <div v-if="!selectedFile && !uploading" class="upload-content text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-cloud-upload-outline</v-icon>
            <p class="text-h6 mb-2">Clique ou arraste uma imagem</p>
            <p class="text-body-2 text-grey">Formatos aceitos: JPG, PNG, GIF, WEBP</p>
            <p class="text-caption text-grey">Tamanho máximo: 100MB</p>
          </div>
          
          <!-- Preview da Imagem Selecionada -->
          <div v-else-if="selectedFile && !uploading" class="file-preview text-center">
            <v-img
              v-if="imagePreview"
              :src="imagePreview"
              max-height="200"
              max-width="300"
              class="mx-auto mb-3"
              cover
            ></v-img>
            <p class="text-body-1 mb-2">{{ selectedFile.name }}</p>
            <p class="text-caption text-grey">{{ formatFileSize(selectedFile.size) }}</p>
            
            <div class="mt-4 d-flex gap-2 justify-center">
              <v-btn
                color="success"
                variant="elevated"
                @click="uploadFile"
                :disabled="uploading"
                prepend-icon="mdi-upload"
              >
                Fazer Upload
              </v-btn>
              <v-btn
                color="grey"
                variant="outlined"
                @click="clearFile"
                :disabled="uploading"
                prepend-icon="mdi-close"
              >
                Remover
              </v-btn>
            </div>
          </div>
          
          <!-- Estado de Upload -->
          <div v-else-if="uploading" class="upload-progress text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              class="mb-4"
            ></v-progress-circular>
            <p class="text-h6 mb-2">Fazendo upload...</p>
            <p class="text-body-2 text-grey">{{ selectedFile?.name }}</p>
          </div>
        </div>
        
        <!-- Resultado do Upload -->
        <v-expand-transition>
          <div v-if="uploadResult" class="mt-4">
            <v-alert
              :type="uploadResult.success ? 'success' : 'error'"
              variant="tonal"
              class="mb-3"
            >
              <div class="d-flex align-center">
                <v-icon 
                  :icon="uploadResult.success ? 'mdi-check-circle' : 'mdi-alert-circle'"
                  class="mr-2"
                ></v-icon>
                <span>{{ uploadResult.message }}</span>
              </div>
            </v-alert>
            
            <!-- Informações do Arquivo Enviado -->
            <v-card v-if="uploadResult.success && uploadResult.data" variant="outlined" class="pa-3">
              <div class="d-flex align-center justify-space-between">
                <div>
                  <p class="text-body-1 font-weight-medium mb-1">Arquivo Enviado</p>
                  <p class="text-caption text-grey mb-2">Key: {{ uploadResult.data.key }}</p>
                  
                  <div class="d-flex gap-2">
                    <v-btn
                      size="small"
                      color="primary"
                      variant="outlined"
                      @click="copyToClipboard(uploadResult.data.key)"
                      prepend-icon="mdi-content-copy"
                    >
                      Copiar Key
                    </v-btn>
                    
                    <v-btn
                      v-if="uploadResult.data.url"
                      size="small"
                      color="info"
                      variant="outlined"
                      :href="uploadResult.data.url"
                      target="_blank"
                      prepend-icon="mdi-open-in-new"
                    >
                      Visualizar
                    </v-btn>
                  </div>
                </div>
                
                <v-btn
                  icon="mdi-close"
                  size="small"
                  variant="text"
                  @click="clearResult"
                ></v-btn>
              </div>
            </v-card>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- Snackbar para feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineProps, defineEmits, defineExpose } from 'vue'
import { mediaApi } from '@/components/base/media/api.js'

// Props
const props = defineProps({
  // ID do SaaS (obrigatório)
  idSaas: {
    type: String,
    required: true
  },
  // ID do usuário (obrigatório)  
  idUsuario: {
    type: String,
    required: true
  },
  // Função callback que será chamada quando o upload retornar uma key
  onUploadSuccess: {
    type: Function,
    default: null
  },
  // Tipos de arquivo aceitos
  accept: {
    type: String,
    default: 'image/*'
  },
  // Tamanho máximo em bytes (100MB por padrão)
  maxSize: {
    type: Number,
    default: 100 * 1024 * 1024 // 100MB
  }
})

// Emits
const emit = defineEmits(['upload-success', 'upload-error', 'file-selected'])

// Refs
const fileInput = ref(null)
const selectedFile = ref(null)
const imagePreview = ref('')
const isDragOver = ref(false)
const uploading = ref(false)

// States
const uploadResult = reactive({
  success: false,
  message: '',
  data: null
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Configuração da API (importada do módulo centralizado)

// Métodos
const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  const file = event.dataTransfer.files?.[0]
  if (file) {
    processFile(file)
  }
}

const processFile = (file) => {
  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    showMessage('Por favor, selecione apenas arquivos de imagem', 'error')
    return
  }
  
  // Validar tamanho
  if (file.size > props.maxSize) {
    showMessage(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(props.maxSize)}`, 'error')
    return
  }
  
  selectedFile.value = file
  createImagePreview(file)
  emit('file-selected', file)
  clearResult()
}

const createImagePreview = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result
  }
  reader.readAsDataURL(file)
}

const uploadFile = async () => {
  if (!selectedFile.value) return
  
  try {
    uploading.value = true
    clearResult()
    
    // Fazer upload usando API centralizada
    const responseData = await mediaApi.uploadFile(props.idSaas, props.idUsuario, selectedFile.value)
    
    // A API retorna { success: true, message: '...', file: { key, uploadDate } }
    if (responseData.success && responseData.file?.key) {
      // Upload realizado com sucesso
      uploadResult.success = true
      uploadResult.message = responseData.message || 'Upload realizado com sucesso!'
      uploadResult.data = responseData.file
      
      showMessage('Imagem enviada com sucesso!', 'success')
      
      // Emitir evento de sucesso
      emit('upload-success', {
        key: responseData.file.key,
        file: selectedFile.value,
        response: responseData.file
      })
      
      // Chamar callback se fornecido
      if (props.onUploadSuccess && typeof props.onUploadSuccess === 'function') {
        try {
          await props.onUploadSuccess({
            key: responseData.file.key,
            file: selectedFile.value,
            response: responseData.file
          })
        } catch (callbackError) {
          // **IMPORTANTE: Se o callback falhar, deletar a imagem que foi feita upload**
          try {
            await deleteUploadedFile(responseData.file.key)
            showMessage('Erro ao salvar no sistema. Imagem removida automaticamente.', 'error')
          } catch (deleteError) {
            showMessage('Erro ao salvar no sistema. Imagem pode precisar ser removida manualmente.', 'error')
          }
          
          // Limpar resultado de sucesso já que houve erro no callback
          clearResult()
        }
      }
      
    } else {
      // Erro no upload
      uploadResult.success = false
      uploadResult.message = responseData.message || responseData.error || 'Erro ao fazer upload'
      uploadResult.data = null
      
      showMessage('Erro ao enviar imagem', 'error')
      emit('upload-error', responseData)
    }
    
  } catch (error) {
    uploadResult.success = false
    uploadResult.message = 'Erro de conexão ou servidor indisponível'
    uploadResult.data = null
    
    showMessage('Erro de conexão', 'error')
    emit('upload-error', error)
    
  } finally {
    uploading.value = false
  }
}

const clearFile = () => {
  selectedFile.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const clearResult = () => {
  uploadResult.success = false
  uploadResult.message = ''
  uploadResult.data = null
}

const deleteUploadedFile = async (key) => {
  try {
    console.log('Deletando arquivo com key:', key)

    // Usar API centralizada para delete
    const responseData = await mediaApi.deleteFile(key)
    
    if (responseData.success) {
      console.log('Arquivo deletado com sucesso:', key)
      return true
    } else {
      console.error('Erro ao deletar arquivo:', responseData.message)
      throw new Error(responseData.message || 'Erro ao deletar arquivo')
    }
    
  } catch (error) {
    console.error('Erro na requisição de delete:', error)
    throw error
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showMessage('Key copiada para a área de transferência!', 'success')
  } catch (error) {
    console.error('Erro ao copiar:', error)
    showMessage('Erro ao copiar key', 'error')
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const showMessage = (message, color) => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Limpar dados ao montar
onMounted(() => {
  clearFile()
  clearResult()
})

// Expor métodos para uso externo se necessário
defineExpose({
  clearFile,
  clearResult,
  uploadFile,
  deleteUploadedFile,
  selectedFile,
  uploading
})
</script>

<style scoped>
.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.upload-area.drag-over {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: scale(1.02);
}

.upload-area.has-file {
  border-color: rgb(var(--v-theme-success));
  background-color: rgba(var(--v-theme-success), 0.04);
}

.upload-area.uploading {
  border-color: rgb(var(--v-theme-info));
  background-color: rgba(var(--v-theme-info), 0.04);
  cursor: not-allowed;
}

.upload-content, .file-preview, .upload-progress {
  width: 100%;
}

.file-preview img {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
