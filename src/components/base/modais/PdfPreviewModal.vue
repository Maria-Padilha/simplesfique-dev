<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    fullscreen
  >
    <v-card class="d-flex flex-column" style="height: 100vh;">
      <v-card-title class="pa-4 d-flex justify-space-between align-center pdf-preview-header">
        <div class="d-flex align-center">
          <v-icon icon="mdi-file-pdf-box" color="error" class="mr-2"></v-icon>
          <span>Pré-visualização do PDF</span>
        </div>
        <div class="d-flex gap-2">
          <v-btn
            color="var(--text-color-laranja)"
            variant="flat"
            class="text-white"
            prepend-icon="mdi-download"
            @click="baixarPDF"
            :loading="gerando"
          >
            Baixar PDF
          </v-btn>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="fechar"
          ></v-btn>
        </div>
      </v-card-title>

      <v-card-text class="pa-0 flex-grow-1 overflow-auto pdf-preview-background">
        <div class="d-flex justify-center py-8 px-4">
          <!-- Container estilo página A4 -->
          <div
            ref="pdfContainer"
            class="pdf-page-preview"
            :class="{ 'pdf-page-landscape': isLandscape }"
            v-html="htmlContent"
          ></div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'
import { toast } from 'vue3-toastify'

const props = defineProps({
  modelValue: Boolean,
  htmlContent: String,
  nomeRelatorio: {
    type: String,
    default: 'Relatorio'
  }
})

const emit = defineEmits(['update:modelValue'])

const pdfContainer = ref(null)
const gerando = ref(false)

// Detectar se o conteúdo está em landscape
const isLandscape = computed(() => {
  return props.htmlContent?.includes('size: A4 landscape') ||
         props.htmlContent?.includes('landscape')
})

const fechar = () => {
  emit('update:modelValue', false)
}

const baixarPDF = async () => {
  try {
    if (!pdfContainer.value) {
      toast.error('Erro ao capturar conteúdo do PDF')
      return
    }

    gerando.value = true
    toast.info('Gerando PDF, aguarde...')

    // Aguardar um pouco para garantir renderização completa
    await new Promise(resolve => setTimeout(resolve, 500))

    // Configurações do html2pdf
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `${props.nomeRelatorio.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: pdfContainer.value.scrollWidth,
        windowHeight: pdfContainer.value.scrollHeight
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: isLandscape.value ? 'landscape' : 'portrait'
      }
    }

    // Gerar e baixar PDF a partir do container de preview
    await html2pdf().set(opt).from(pdfContainer.value).save()

    toast.success('PDF gerado com sucesso!')

    // Fechar modal após baixar
    fechar()

  } catch (err) {
    console.error('❌ Erro ao baixar PDF:', err)
    toast.error('Erro ao gerar PDF')
  } finally {
    gerando.value = false
  }
}
</script>

<style scoped>
.pdf-preview-header {
  background: var(--bg-color-secondary);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.pdf-preview-background {
  background: #525659;
}

/* Estilo de página A4 para preview do PDF */
.pdf-page-preview {
  background: #ffffff !important;
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(0, 0, 0, 0.15);
  page-break-after: always;
}

/* Estilo para landscape */
.pdf-page-preview.pdf-page-landscape {
  width: 297mm;
  min-height: 210mm;
}

/* Garantir que o conteúdo interno tenha fundo branco */
.pdf-page-preview :deep(*) {
  background-color: inherit;
}

.pdf-page-preview :deep(body) {
  background: #ffffff !important;
}

/* Responsivo para telas menores */
@media (max-width: 900px) {
  .pdf-page-preview {
    width: 100%;
    min-height: auto;
    padding: 15mm;
    transform: scale(0.9);
    transform-origin: top center;
  }
}
</style>

