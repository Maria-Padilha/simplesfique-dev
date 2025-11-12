# MediaShow Component

Componente para exibir imagens salvas no R2 usando URLs pré-assinadas. Faz requisição com a key da imagem e obtém URL temporária (válida por 1 dia) para visualização.

## Como Usar

### 1. Uso Básico

```vue
<template>
  <div>
    <!-- Exibição simples -->
    <MediaShow
      image-key="minha-imagem-key-123"
      height="200"
      width="300"
    />
    
    <!-- Com ações -->
    <MediaShow
      image-key="minha-imagem-key-456"
      height="150"
      show-actions
      :allow-download="true"
      :allow-copy-url="true"
      @load-success="onImageLoaded"
      @load-error="onImageError"
      @image-click="onImageClick"
    />
  </div>
</template>

<script setup>
import MediaShow from '@/components/base/menu/MediaShow.vue'

const onImageLoaded = (data) => {
  console.log('Imagem carregada:', data.key)
  console.log('URL obtida:', data.url)
}

const onImageError = (error) => {
  console.error('Erro ao carregar imagem:', error.message)
}

const onImageClick = (data) => {
  console.log('Imagem clicada:', data.key)
}
</script>
```

### 2. Em Tabelas (TabelaPadrao)

```vue
<template>
  <TabelaPadrao
    :headers="headers"
    :items="items"
    :loading="loading"
  >
    <!-- Slot para coluna de imagem -->
    <template #item.imagem="{ item }">
      <MediaShow
        :image-key="item.key_imagem"
        height="60"
        width="60"
        :show-actions="false"
        :show-loading-text="false"
        no-image-text="Sem imagem"
      />
    </template>
  </TabelaPadrao>
</template>
```

### 3. Modal de Visualização Controlado

```vue
<template>
  <div>
    <MediaShow
      ref="mediaShowRef"
      :image-key="selectedImageKey"
      height="100"
      :auto-load="false"
    />
    
    <v-btn @click="loadAndShowImage">Ver Imagem</v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mediaShowRef = ref()
const selectedImageKey = ref('minha-key')

const loadAndShowImage = async () => {
  await mediaShowRef.value.loadImage()
  mediaShowRef.value.openModal()
}
</script>
```

## Props Disponíveis

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `imageKey` | String | '' | **Key da imagem** (obrigatório para carregar) |
| `height` | String/Number | 200 | Altura da imagem |
| `width` | String/Number | 'auto' | Largura da imagem |
| `cover` | Boolean | true | Usar cover (preencher container) |
| `contain` | Boolean | false | Usar contain (manter proporção) |
| `imageClass` | String | '' | Classes CSS adicionais |
| `alt` | String | '' | Texto alternativo |
| `noImageText` | String | 'Nenhuma imagem disponível' | Texto quando não há imagem |
| `showActions` | Boolean | false | Mostrar botões de ação (overlay) |
| `showLoadingText` | Boolean | true | Mostrar texto "Carregando..." |
| `allowDownload` | Boolean | true | Permitir download da imagem |
| `allowCopyUrl` | Boolean | true | Permitir copiar URL |
| `allowRetry` | Boolean | true | Mostrar botão "Tentar Novamente" |
| `autoLoad` | Boolean | true | Carregar automaticamente quando key muda |

## Eventos Disponíveis

| Evento | Parâmetros | Descrição |
|--------|------------|-----------|
| `load-success` | `{ key, url, response }` | Imagem carregada com sucesso |
| `load-error` | `{ key, error, message }` | Erro ao carregar imagem |
| `image-click` | `{ key, url }` | Imagem foi clicada |

## Métodos Expostos

| Método | Descrição | Retorno |
|--------|-----------|---------|
| `loadImage()` | Carrega/recarrega a imagem | Promise |
| `openModal()` | Abre modal de visualização | - |
| `downloadImage()` | Inicia download da imagem | Promise |
| `copyUrl()` | Copia URL para clipboard | Promise |

## Propriedades Reativas Expostas

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `signedUrl` | String | URL pré-assinada atual |
| `loading` | Boolean | Estado de carregamento |
| `error` | String | Mensagem de erro atual |

## Estados Visuais

### 1. Carregando
- Skeleton loader com animação
- Progress circular (opcional)
- Texto "Carregando imagem..."

### 2. Imagem Carregada
- Imagem com clique para modal
- Overlay com ações (hover)
- Botões: visualizar, download, copiar URL

### 3. Erro
- Ícone de imagem quebrada
- Mensagem de erro
- Botão "Tentar Novamente"

### 4. Sem Imagem
- Ícone de "sem imagem"
- Texto personalizável
- Estado neutral

## API Integrada

### Endpoint Usado
- **Base URL**: `https://mediasapi.vstsolution.com`
- **Endpoint**: `/api/files/get-signed-url`
- **Método**: `GET`
- **Query Params**: `key={imageKey}`

### Resposta Esperada
```json
{
  "success": true,
  "signedUrl": "https://7cbde877390a1bdecead74237ba17425.r2.cloudflarestorage.com/simplesfique/123/2025/11/1762889956298-231547e9-6vdxzv1bqlx41.png?X-Amz-Algorithm=...",
  "expiresAt": "2025-11-12T19:41:13.177Z"
}
```

## Funcionalidades

- ✅ **URL Pré-Assinada**: Obtém URLs temporárias (1 dia)
- ✅ **Carregamento Automático**: Auto-load quando key muda
- ✅ **Modal de Visualização**: Ampliação da imagem
- ✅ **Download de Imagem**: Download direto do R2
- ✅ **Cópia de URL**: Compartilhamento da URL
- ✅ **Estados Visuais**: Loading, erro, sem imagem
- ✅ **Responsivo**: Adaptável a diferentes telas
- ✅ **Overlay de Ações**: Botões aparecem no hover
- ✅ **Skeleton Loading**: Loading visual elegante
- ✅ **Retry Manual**: Botão para tentar novamente
- ✅ **Feedback Visual**: Snackbars informativos

## Exemplos de Uso

### 1. Galeria Simples
```vue
<template>
  <div class="gallery">
    <MediaShow
      v-for="image in images"
      :key="image.id"
      :image-key="image.key"
      height="200"
      width="200"
      show-actions
      class="ma-2"
    />
  </div>
</template>
```

### 2. Avatar/Profile Picture
```vue
<template>
  <MediaShow
    :image-key="user.avatar_key"
    height="80"
    width="80"
    cover
    :show-actions="false"
    no-image-text="Sem foto"
    class="rounded-circle"
  />
</template>
```

### 3. Preview em Formulário
```vue
<template>
  <div>
    <MediaSave
      :id-saas="saasId"
      :id-usuario="userId"
      @upload-success="handleUpload"
    />
    
    <MediaShow
      v-if="uploadedKey"
      :image-key="uploadedKey"
      height="200"
      class="mt-4"
    />
  </div>
</template>

<script setup>
const uploadedKey = ref('')

const handleUpload = (data) => {
  uploadedKey.value = data.key
}
</script>
```

### 4. Condicional com Loading
```vue
<template>
  <MediaShow
    :image-key="imageKey"
    :auto-load="false"
    height="300"
    @load-success="onLoad"
    @load-error="onError"
  />
</template>

<script setup>
const imageKey = ref('')

// Carregar quando necessário
const loadImage = () => {
  if (someCondition) {
    imageKey.value = 'minha-key'
  }
}
</script>
```

## Integração com MediaSave

```vue
<template>
  <div>
    <!-- Upload -->
    <MediaSave
      :id-saas="saasId"
      :id-usuario="userId"
      :on-upload-success="saveToDatabase"
      @upload-success="handleUploadSuccess"
    />
    
    <!-- Visualização -->
    <MediaShow
      v-if="savedImageKey"
      :image-key="savedImageKey"
      height="200"
      show-actions
      class="mt-4"
    />
  </div>
</template>

<script setup>
const savedImageKey = ref('')

const saveToDatabase = async (uploadData) => {
  // Salvar key no banco
  await api.post('/salvar-imagem', {
    key: uploadData.key,
    nome: uploadData.file.name
  })
}

const handleUploadSuccess = (data) => {
  savedImageKey.value = data.key
}
</script>
```

Pronto para usar! 🚀 O componente oferece visualização completa de imagens com URLs pré-assinadas do R2.