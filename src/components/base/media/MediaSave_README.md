# MediaSave Component

Componente para upload de imagens integrado com a API R2. Implementa a regra solicitada: **sempre que o POST de upload retornar uma key, dispara automaticamente uma função callback**.

## Como Usar

### 1. Importar o Componente

```vue
<template>
  <div>
    <MediaSave
      id-saas="123"
      id-usuario="456"
      :on-upload-success="handleUploadSuccess"
      @upload-success="onUploadComplete"
      @upload-error="onUploadError"
      @file-selected="onFileSelected"
    />
  </div>
</template>

<script setup>
import MediaSave from '@/components/base/menu/MediaSave.vue'

// Função callback que será executada automaticamente quando uma key for retornada
const handleUploadSuccess = async (uploadData) => {
  console.log('Key recebida:', uploadData.key)
  console.log('Arquivo:', uploadData.file.name)
  console.log('Resposta completa:', uploadData.response)
  
  // AQUI VOCÊ IMPLEMENTA SUA LÓGICA DE SALVAMENTO NO BANCO
  try {
    // Exemplo: salvar a key no banco de dados
    await salvarKeyNoBanco({
      key: uploadData.key,
      nomeArquivo: uploadData.file.name,
      tamanho: uploadData.file.size,
      tipo: uploadData.file.type
    })
    
    console.log('Key salva no banco com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar key no banco:', error)
    throw error // Isso fará o componente mostrar uma mensagem de warning
  }
}

// Eventos opcionais para monitoramento adicional
const onUploadComplete = (data) => {
  console.log('Upload completado via evento:', data)
}

const onUploadError = (error) => {
  console.error('Erro no upload:', error)
}

const onFileSelected = (file) => {
  console.log('Arquivo selecionado:', file.name)
}

// Função exemplo para salvar no banco (você deve implementar)
const salvarKeyNoBanco = async (dados) => {
  // Implementar chamada para sua API de banco de dados
  // Exemplo:
  // return await api.post('/salvar-imagem', dados)
}
</script>
```

### 2. Props Disponíveis

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|-----------|
| `idSaas` | String | ✅ | - | ID do SaaS para a API |
| `idUsuario` | String | ✅ | - | ID do usuário para a API |
| `onUploadSuccess` | Function | ❌ | null | **Callback principal** - executado quando key é retornada |
| `accept` | String | ❌ | "image/*" | Tipos de arquivo aceitos |
| `maxSize` | Number | ❌ | 100MB | Tamanho máximo em bytes |

### 3. Eventos Emitidos

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `upload-success` | `{ key, file, response }` | Emitido quando upload é concluído com sucesso |
| `upload-error` | `error` | Emitido quando há erro no upload |
| `file-selected` | `file` | Emitido quando um arquivo é selecionado |

### 4. Métodos Expostos

```vue
<template>
  <MediaSave ref="mediaSave" ... />
  <v-btn @click="limparArquivo">Limpar</v-btn>
</template>

<script setup>
import { ref } from 'vue'

const mediaSave = ref(null)

const limparArquivo = () => {
  mediaSave.value.clearFile()
}
</script>
```

| Método | Descrição |
|--------|-----------|
| `clearFile()` | Remove o arquivo selecionado |
| `clearResult()` | Limpa o resultado do upload |
| `uploadFile()` | Inicia o upload manualmente |

## Funcionamento da Regra Principal

### ✅ O que acontece quando o upload retorna uma key:

1. **Upload realizado** → API retorna `{ success: true, data: { key: "abc123" } }`
2. **Key detectada** → Componente identifica que há uma key na resposta
3. **Callback executado** → Chama automaticamente `onUploadSuccess(uploadData)`
4. **Salvamento** → Sua função salva a key no banco de dados
5. **Feedback** → Usuário recebe confirmação visual

### ⚠️ Tratamento de Erros:

- **Erro na API de upload** → Mostra mensagem de erro de upload
- **Erro no callback** → Mostra "Upload realizado, mas houve erro ao salvar no sistema"
- **Erro de rede** → Mostra "Erro de conexão"

## API Integrada

O componente está configurado para usar:

### Upload
- **Base URL**: `https://mediasapi.vstsolution.com`
- **Endpoint**: `/api/files/upload`
- **Método**: `POST`
- **Body**: `multipart/form-data` com `id_saas`, `id_usuario` e `file`

### Delete (Auto-executado em caso de erro no callback)
- **Endpoint**: `/api/files/delete`
- **Método**: `DELETE`
- **Body**: `application/json` com `id_saas`, `id_usuario` e `key`

## Sistema de Auto-Delete

**Regra implementada**: Se o callback `onUploadSuccess` falhar (lançar exceção), o componente automaticamente:

1. 🔄 **Detecta erro no callback**
2. 🗑️ **Chama API de delete** para remover a imagem
3. ⚠️ **Exibe mensagem de erro** informando que a imagem foi removida
4. 🧹 **Limpa resultado** de sucesso da interface

Isso garante que não fiquem imagens "órfãs" no R2 quando houver falha no salvamento no banco de dados.

## Recursos Visuais

- ✅ Drag & Drop de arquivos
- ✅ Preview de imagem antes do upload
- ✅ Progress indicator durante upload
- ✅ Validação de tipo e tamanho
- ✅ Cópia da key para clipboard
- ✅ Link para visualização da imagem
- ✅ Mensagens de feedback (snackbar)
- ✅ Estados visuais (hover, drag-over, uploading)
- ✅ **Auto-delete**: Remove automaticamente a imagem se callback falhar

## Validações Implementadas

- **Tipo de arquivo**: Apenas imagens (image/*)
- **Tamanho máximo**: 100MB (configurável)
- **Formato da resposta**: Valida se a API retornou success e key

Agora você só precisa implementar a função `handleUploadSuccess` com sua lógica específica de salvamento no banco! 🚀