<template>
  <v-container class="operacao-view">
    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card class="pa-4">
          <v-card-title class="text-center text-h5">
            Teste de Impressão PDV
          </v-card-title>

          <div ref="printArea" class="receipt-content pa-4">
            <div class="text-center mb-4">
              <h2>CUPOM NÃO FISCAL</h2>
              <p>{{ currentDate }}</p>
            </div>

            <v-list lines="two">
              <v-list-item v-for="(item, index) in items" :key="index">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  Qtd: {{ item.quantity }} x R$ {{ item.price.toFixed(2) }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  R$ {{ (item.quantity * item.price).toFixed(2) }}
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <div class="text-right">
              <p class="text-h6">Total: R$ {{ total.toFixed(2) }}</p>
            </div>
          </div>

          <v-card-actions class="justify-center mt-4">
            <v-btn
                color="primary"
                prepend-icon="mdi-printer"
                @click="handlePrint"
            >
              Imprimir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const printArea = ref(null)

const currentDate = computed(() => {
  return new Date().toLocaleString('pt-BR')
})

const items = ref([
  { name: 'Produto 1', quantity: 2, price: 10.50 },
  { name: 'Produto 2', quantity: 1, price: 25.00 },
  { name: 'Produto 3', quantity: 3, price: 5.75 }
])

const total = computed(() => {
  return items.value.reduce((acc, item) => acc + (item.quantity * item.price), 0)
})

const handlePrint = () => {
  const content = printArea.value.innerHTML
  const printWindow = window.open('', '_blank')

  const openScriptTag = '<scr' + 'ipt>'
  const closeScriptTag = '</scr' + 'ipt>'

  printWindow.document.write([
    '<!DOCTYPE html>',
    '<html lang="pt-BR">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">', // importante
    '<title>Impressão PDV</title>',
    '<style>',
    '@page { size: 80mm; margin: 0; }',
    'html, body { width: 80mm; height: auto; margin: 0; padding: 0; }',
    'body { font-family: "Courier New", monospace; margin: 0; padding: 0; -webkit-print-color-adjust: exact; color: #000; }',
    '.receipt-content { width: 80mm; max-width: 80mm; box-sizing: border-box; font-size: 6mm; margin: 0 auto; color: #000; font-weight: 900; letter-spacing: 0.5px; line-height: 1.02; text-rendering: optimizeLegibility; -webkit-font-smoothing: none; filter: contrast(1.2); }',
    '.receipt-content h2 { font-size: 10.5mm; margin-bottom: 6px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }',
    '.receipt-content p, .receipt-content li { font-size: 7mm; font-weight: 900; text-shadow: 0 0 1.4px rgba(0,0,0,1); color: #000; }',
    '@media print {',
    '  html, body { width: 80mm !important; }',
    '  .receipt-content {',
    '    /* escala maior para leitura em térmica */',
    '    transform: scale(1.4);',
    '    transform-origin: 0 0;',
    '    /* ajustar largura base para compensar o scale */',
    '    width: calc(80mm / 1.4) !important;',
    '    max-width: calc(80mm / 1.4) !important;',
    '    font-weight: 900;',
    '    color: #000;',
    '    line-height: 1.0;',
    '    text-shadow: 0 0 1.6px rgba(0,0,0,1);',
    '    filter: contrast(1.25);',
    '  }',
    '  .receipt-content h2 { font-size: 10.8mm !important; }',
    '  .receipt-content p, .receipt-content li { font-size: 7.2mm !important; }',
    '}',
    '</style>',
    '</head>',
    '<body>',
    '<div class="receipt-content">',
    content,
    '</div>',
    openScriptTag,
    'window.onload = () => { window.print(); window.onafterprint = () => window.close(); }',
    closeScriptTag,
    '</body>',
    '</html>'
  ].join('\n'))

  printWindow.document.close()
}
</script>

<style scoped>
.operacao-view {
  padding: 1rem;
}

@media print {
  @page {
    size: 80mm; /* largura fixa da bobina */
    margin: 0;
  }

  html, body {
    width: 80mm;
    margin: 0;
    padding: 0;
  }

  .receipt-content {
    width: 80mm;
    max-width: 80mm;
    box-sizing: border-box;
    font-family: 'Courier New', monospace;
    font-size: 6mm;
    margin: 0 auto;
    color: #000;
    font-weight: 900;
    letter-spacing: 0.5px;
    line-height: 1.02;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: none;
    filter: contrast(1.2);
  }

  .receipt-content h2 {
    font-size: 10.5mm;
    margin-bottom: 6px;
    font-weight: 900;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .receipt-content p,
  .receipt-content li {
    font-size: 7mm;
    font-weight: 900;
    text-shadow: 0 0 1.4px rgba(0,0,0,1);
  }
}
</style>