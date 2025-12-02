<template>
  <div class="media-show-component">
    <!-- Imagem Principal -->
    <div v-if="imageKey" class="image-container">
      <!-- Estado de Carregamento -->
      <div v-if="loading" class="loading-state">
        <v-skeleton-loader
          type="image"
          :height="height"
          :width="width"
          class="rounded"
        ></v-skeleton-loader>
        <div v-if="showLoadingText" class="text-center mt-2">
          <v-progress-circular
            indeterminate
            size="20"
            color="primary"
            class="mr-2"
          ></v-progress-circular>
          <span class="text-caption">Carregando imagem...</span>
        </div>
      </div>

      <!-- Imagem Carregada -->
      <div v-else-if="signedUrl && !error" class="image-display">
        <v-img
          :src="signedUrl"
          :alt="alt || 'Imagem'"
          :height="height"
          :width="width"
          :cover="cover"
          :contain="contain"
          :class="imageClass"
          class="rounded cursor-pointer"
          @click="openModal"
          @error="handleImageError"
          @load="handleImageLoad"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                indeterminate
                color="grey-lighten-5"
              ></v-progress-circular>
            </div>
          </template>
        </v-img>
        
        <!-- Overlay com ações (opcional) -->
        <div v-if="showActions" class="image-overlay">
          <v-btn
            icon="mdi-eye"
            size="small"
            color="white"
            variant="elevated"
            @click="openModal"
            class="mr-2"
          ></v-btn>
          
          <v-btn
            v-if="allowDownload"
            icon="mdi-download"
            size="small"
            color="white"
            variant="elevated"
            @click="downloadImage"
            class="mr-2"
          ></v-btn>
          
          <v-btn
            v-if="allowCopyUrl"
            icon="mdi-link"
            size="small"
            color="white"
            variant="elevated"
            @click="copyUrl"
          ></v-btn>
        </div>
      </div>

      <!-- Estado de Erro -->
      <div v-else-if="error" class="error-state">
        <v-card
          variant="outlined"
          :height="height"
          :width="width"
          class="d-flex align-center justify-center flex-column rounded"
        >
          <v-icon
            icon="mdi-image-broken-variant"
            size="48"
            color="error"
            class="mb-2"
          ></v-icon>
          <p class="text-body-2 text-error text-center mb-2">
            {{ error }}
          </p>
          
          <v-btn
            v-if="allowRetry"
            size="small"
            color="primary"
            variant="outlined"
            @click="loadImage"
            prepend-icon="mdi-refresh"
          >
            Tentar Novamente
          </v-btn>
        </v-card>
      </div>

      <!-- Placeholder quando não há key -->
      <div v-if="!imageKey" class="no-image-state">
        <v-card
          variant="outlined"
          :height="height"
          :width="width"
          class="d-flex align-center justify-center flex-column rounded"
        >
          <v-icon
            icon="mdi-image-off-outline"
            size="48"
            color="grey"
            class="mb-2"
          ></v-icon>
          <p class="text-body-2 text-grey text-center">
            {{ noImageText }}
          </p>
        </v-card>
      </div>
    </div>

    <!-- Modal de Visualização -->
    <v-dialog v-model="modalOpen" max-width="90vw" max-height="90vh">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Visualizar Imagem</span>
          <div class="d-flex gap-2">
            <v-btn
              v-if="allowDownload"
              icon="mdi-download"
              size="small"
              variant="text"
              @click="downloadImage"
            ></v-btn>
            
            <v-btn
              v-if="allowCopyUrl"
              icon="mdi-link"
              size="small"
              variant="text"
              @click="copyUrl"
            ></v-btn>
            
            <v-btn
              icon="mdi-close"
              size="small"
              variant="text"
              @click="modalOpen = false"
            ></v-btn>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-img
            v-if="signedUrl"
            :src="signedUrl"
            :alt="alt || 'Imagem'"
            contain
            class="modal-image"
            style="max-height: 70vh;"
          ></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>

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
import { ref, reactive, watch, onMounted, defineProps, defineEmits, defineExpose } from 'vue'
import { mediaApi } from './api.js'

// Props
const props = defineProps({
  // Key da imagem (obrigatório se não for placeholder)
  imageKey: {
    type: String,
    default: ''
  },
  // Dimensões
  height: {
    type: [String, Number],
    default: 200
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  // Comportamento da imagem
  cover: {
    type: Boolean,
    default: true
  },
  contain: {
    type: Boolean,
    default: false
  },
  // Classes CSS adicionais
  imageClass: {
    type: String,
    default: ''
  },
  // Texto alternativo
  alt: {
    type: String,
    default: ''
  },
  // Texto quando não há imagem
  noImageText: {
    type: String,
    default: 'Nenhuma imagem disponível'
  },
  // Controles visuais
  showActions: {
    type: Boolean,
    default: false
  },
  showLoadingText: {
    type: Boolean,
    default: true
  },
  // Funcionalidades
  allowDownload: {
    type: Boolean,
    default: true
  },
  allowCopyUrl: {
    type: Boolean,
    default: true
  },
  allowRetry: {
    type: Boolean,
    default: true
  },
  // Carregamento automático
  autoLoad: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['load-success', 'load-error', 'image-click'])

// Refs
const signedUrl = ref('')
const loading = ref(false)
const error = ref('')
const modalOpen = ref(false)

// States
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Configuração da API (importada do módulo centralizado)

// Métodos
const loadImage = async () => {
  if (!props.imageKey) {
    error.value = 'Key da imagem não fornecida'
    return
  }

  try {
    loading.value = true
    error.value = ''
    signedUrl.value = ''
    
    console.log('Buscando URL pré-assinada para key:', props.imageKey)
    
    // Fazer requisição usando API centralizada
    const responseData = await mediaApi.getSignedUrl(props.imageKey)
    
    if (responseData.success) {
      // A API retorna signedUrl diretamente no root da resposta
      signedUrl.value = responseData.signedUrl || responseData.signed_url
      
      if (!signedUrl.value) {
        throw new Error('URL não retornada pela API')
      }
      
      console.log('URL pré-assinada obtida com sucesso')
      console.log('Expires at:', responseData.expiresAt)
      emit('load-success', {
        key: props.imageKey,
        url: signedUrl.value,
        expiresAt: responseData.expiresAt,
        response: responseData
      })
      
    } else {
      throw new Error(responseData.message || 'Erro ao obter URL da imagem')
    }
    
  } catch (err) {
    console.error('Erro ao carregar imagem:', err)
    error.value = err.message || 'Erro ao carregar imagem'
    signedUrl.value = ''
    
    emit('load-error', {
      key: props.imageKey,
      error: err,
      message: error.value
    })
    
  } finally {
    loading.value = false
  }
}

const openModal = () => {
  if (signedUrl.value) {
    modalOpen.value = true
    emit('image-click', {
      key: props.imageKey,
      url: signedUrl.value
    })
  }
}

const downloadImage = async () => {
  if (!signedUrl.value) return
  
  try {
    const response = await fetch(signedUrl.value)
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `imagem-${props.imageKey || 'download'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showMessage('Download iniciado!', 'success')
    
  } catch (err) {
    console.error('Erro no download:', err)
    showMessage('Erro ao fazer download', 'error')
  }
}

const copyUrl = async () => {
  if (!signedUrl.value) return
  
  try {
    await navigator.clipboard.writeText(signedUrl.value)
    showMessage('URL copiada para a área de transferência!', 'success')
  } catch (err) {
    console.error('Erro ao copiar URL:', err)
    showMessage('Erro ao copiar URL', 'error')
  }
}

const handleImageError = () => {
  error.value = 'Erro ao carregar a imagem'
  signedUrl.value = ''
}

const handleImageLoad = () => {
  console.log('Imagem carregada com sucesso')
}

const showMessage = (message, color) => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Watchers
watch(() => props.imageKey, (newKey) => {
  if (newKey && props.autoLoad) {
    loadImage()
  } else if (!newKey) {
    signedUrl.value = ''
    error.value = ''
    loading.value = false
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  if (props.imageKey && props.autoLoad) {
    loadImage()
  }
})

// Expor métodos para uso externo
defineExpose({
  loadImage,
  openModal,
  downloadImage,
  copyUrl,
  signedUrl,
  loading,
  error
})
</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
}

.image-display {
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-display:hover .image-overlay {
  opacity: 1;
}

.loading-state,
.error-state,
.no-image-state {
  display: inline-block;
}

.cursor-pointer {
  cursor: pointer;
}

.modal-image {
  width: 100%;
}

/* Responsividade */
@media (max-width: 600px) {
  .image-overlay {
    opacity: 1;
  }
  
  .modal-image {
    max-height: 60vh;
  }
}
</style>
