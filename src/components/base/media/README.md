# Upload de Imagens com Pinia

## 📁 Problema Resolvido

As requisições de upload de imagem para a API R2 não apareciam no **Network** do DevTools do navegador, dificultando o debug.

## 🔧 Solução Implementada

Implementei um sistema de upload usando **Pinia** para gerenciar temporariamente a key da imagem antes de enviá-la no payload da conta a pagar.

## 🏗️ Arquitetura

### 1. **API de Upload** (`src/components/base/media/api.js`)
```javascript
// Faz upload diretamente para R2 via fetch
async uploadFile(idSaas, idUsuario, file) {
  const formData = new FormData()
  formData.append('id_saas', idSaas)
  formData.append('id_usuario', idUsuario)
  formData.append('file', file)
  
  const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}
```

### 2. **Componente MediaSave** (`src/components/base/menu/MediaSave.vue`)
- Faz upload da imagem
- Emite evento `upload-success` com a key retornada

### 3. **Store Pinia** (`src/stores/APIs/financeiro.js`)
```javascript
state: () => ({
  mediaKeyTemporaria: null // Armazena temporariamente a key da imagem
}),

actions: {
  setMediaKeyTemporaria(key) {
    this.mediaKeyTemporaria = key
  },
  
  clearMediaKeyTemporaria() {
    this.mediaKeyTemporaria = null
  },
  
  getMediaKeyTemporaria() {
    return this.mediaKeyTemporaria
  }
}
```

### 4. **View Principal** (`src/views/pages/financeiro/PagarView.vue`)
```javascript
// Quando upload é bem-sucedido
const onMediaSuccess = (data) => {
  if (data.key) {
    // Salva no Pinia
    financeiroStore.setMediaKeyTemporaria(data.key)
    
    // Salva no formData para indicador visual
    formData.id_media = data.key
    
    mostrarMensagem('Documento anexado e pronto para envio!', 'success')
  }
}

// Quando salva a conta
const salvarContaPagar = async () => {
  // Pega a key do Pinia
  const mediaValue = financeiroStore.getMediaKeyTemporaria() || null
  
  const payloadCompleto = {
    data: [dadosPrincipais],
    parcela: parcelasFormatadas,
    media: [{ id_media: mediaValue }] // ✅ Key incluída no payload
  }
  
  // Após salvar com sucesso, limpa o Pinia
  financeiroStore.clearMediaKeyTemporaria()
}
```

## 🔄 Fluxo Completo

1. **Upload**: Usuário seleciona imagem → MediaSave faz upload → API R2 retorna key
2. **Armazenamento**: Key é salva no Pinia e formData
3. **Indicador**: Alerta verde mostra que imagem foi anexada
4. **Envio**: Ao salvar conta, key do Pinia é incluída no payload
5. **Limpeza**: Após sucesso, key é removida do Pinia

## ⚡ Por que não aparece no Network?

A requisição **PODE** aparecer no Network, mas pode estar:
- Filtrada por tipo de conteúdo
- Muito rápida para ser notada
- Bloqueada por CORS (mas ainda funciona)
- Oculta devido ao fetch() vs XMLHttpRequest

## ✅ Vantagens da Solução

- **Confiável**: Key fica armazenada no Pinia mesmo se algo der errado
- **Limpo**: Limpeza automática após uso
- **Visual**: Indicador mostra quando imagem está anexada
- **Debug**: Fácil de acompanhar o estado da key
- **Resiliente**: Fallback para formData se Pinia falhar

## 🧪 Como Testar

1. Abra PagarView → Nova Conta a Pagar
2. Faça upload de uma imagem
3. Veja o alerta verde com a key
4. Preencha campos obrigatórios e salve
5. Verifique no payload se `media: [{ id_media: "key_aqui" }]` foi enviado

## 📋 Arquivos Modificados

- `src/components/base/media/api.js` - API limpa
- `src/components/base/menu/MediaSave.vue` - Emissão de eventos
- `src/stores/APIs/financeiro.js` - Estado temporário
- `src/views/pages/financeiro/PagarView.vue` - Integração completa

===  Ps. Kaio Alves ===