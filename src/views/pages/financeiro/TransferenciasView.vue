<template>
  <top-all-pages icon="mdi-swap-horizontal">
    <template #titulo>Transferências Financeiras</template>
    <template #acoes>
      <v-btn
          icon
          color="var(--text-color-laranja)"
          variant="outlined"
          size="small"
          :disabled="!podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA)"
          @click="modalExportacaoAberto = true"
      >
        <v-icon icon="mdi-printer"></v-icon>
        <v-tooltip activator="parent" location="top">
          {{ !podeExportar(ID_PROGRAMA) && !podePDF(ID_PROGRAMA) ? 'Sem permissão' : 'Imprimir / Exportar' }}
        </v-tooltip>
      </v-btn>
    </template>
    <template #section>
      <div>
        <!-- Conteúdo Principal -->
        <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
          <v-card-text class="pa-4">
            <!-- Botão Expandir Formulário -->
            <BotaoExpandTransition
                :formulario-aberto="formularioAberto"
                texto-abrir="Nova Transferência"
                texto-fechar="Cancelar"
                @toggle="toggleFormulario"
            />

            <!-- Formulário Expansível -->
            <v-expand-transition>
              <div v-if="formularioAberto">
                <v-card class="background-card mb-7" elevation="0">
                  <v-card-title class="text-h6 pa-4">
                    <v-icon icon="mdi-swap-horizontal" class="mr-2"></v-icon>
                    Nova Transferência
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <!-- Seletor de Tipo de Transferência -->
                    <v-row class="mb-4">
                      <v-col cols="12">
                        <v-select
                            v-model="tipoTransferencia"
                            label="Tipo de Transferência *"
                            :items="tiposTransferencia"
                            item-title="text"
                            item-value="value"
                            density="compact"
                            class="required-left-border"
                            variant="outlined"
                            hide-details="auto"
                            prepend-inner-icon="mdi-swap-horizontal"
                            :rules="[rules.required]"
                        ></v-select>
                      </v-col>
                    </v-row>

                    <!-- Componentes de Transferência Dinâmicos -->
                    <TransferenciaCaixaBanco
                        v-if="tipoTransferencia === 4"
                        @sucesso="onTransferenciaRealizada"
                    />
                    <TransferenciaIntercaixa
                        v-if="tipoTransferencia === 3"
                        @sucesso="onTransferenciaRealizada"
                    />
                    <TransferenciaBancoCaixa
                        v-if="tipoTransferencia === 2"
                        @sucesso="onTransferenciaRealizada"
                    />
                    <TransferenciaInterbancaria
                        v-if="tipoTransferencia === 1"
                        @sucesso="onTransferenciaRealizada"
                    />

                    <!-- Mensagem quando nenhum tipo selecionado -->
                    <v-alert
                        v-if="!tipoTransferencia"
                        type="info"
                        variant="tonal"
                        class="mt-4"
                    >
                      Selecione um tipo de transferência para continuar
                    </v-alert>
                  </v-card-text>
                </v-card>
              </div>
            </v-expand-transition>

            <!-- Tabela de Histórico -->
            <HistoricoTransferencias
                ref="historicoRef"
                :formulario-aberto="formularioAberto"
            />
          </v-card-text>
        </v-card>

        <!-- Snackbar de Feedback -->
        <v-snackbar
            v-model="snackbar.show"
            :color="snackbar.color"
            :timeout="3000"
            location="top"
        >
          {{ snackbar.message }}
        </v-snackbar>

        <!-- Modal de Exportação -->
        <ExportacaoModal
            v-model="modalExportacaoAberto"
            :dados="transferencias"
            :filtros="{}"
            nome-relatorio="Transferências Financeiras"
            @exportar-pdf="() => {}"
            @exportar-csv="() => {}"
            @exportar-excel="() => {}"
            @imprimir="() => {}"
        />

        <!-- Modal de Preview do PDF -->
        <PdfPreviewModal
            v-model="modalPreviewPDF"
            :html-content="previewHTMLContent"
            :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Transferencias'"
        />

        <!-- Modal de Acesso Negado -->
        <AcessoNegadoModal
            v-model="acessoNegadoModal"
            :nome-programa="'Rotina Transferências Financeira'"
            :tipo-acesso="tipoAcessoNegado"
        />
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { usePermissoes } from '@/utils/usePermissoes'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TransferenciaCaixaBanco from '@/components/base/transferencias/TransferenciaCaixaBanco.vue'
import TransferenciaIntercaixa from '@/components/base/transferencias/TransferenciaIntercaixa.vue'
import TransferenciaBancoCaixa from '@/components/base/transferencias/TransferenciaBancoCaixa.vue'
import TransferenciaInterbancaria from '@/components/base/transferencias/TransferenciaInterbancaria.vue'
import HistoricoTransferencias from '@/components/base/transferencias/HistoricoTransferencias.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
// eslint-disable-next-line no-unused-vars
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'

// ID do programa desta tela
// eslint-disable-next-line no-unused-vars
const ID_PROGRAMA = 'FFIN201E'

const themeStore = useThemeStore()
// eslint-disable-next-line no-unused-vars
const { podeVisualizar, podeIncluir, podeAlterar, podeExcluir, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
// eslint-disable-next-line no-unused-vars
const acessoNegadoModal = ref(false)
// eslint-disable-next-line no-unused-vars
const tipoAcessoNegado = ref('')

const formularioAberto = ref(false)
const tipoTransferencia = ref(null)
const historicoRef = ref(null)

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Modais de exportação
const modalExportacaoAberto = ref(false)
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

// Data
const transferencias = ref([])

const tiposTransferencia = [
  { text: 'Caixa → Banco', value: 4, icon: 'mdi-cash-fast' },
  { text: 'Intercaixa (Caixa → Caixa)', value: 3, icon: 'mdi-cash-sync' },
  { text: 'Banco → Caixa', value: 2, icon: 'mdi-bank-transfer-out' },
  { text: 'Interbancária (Banco → Banco)', value: 1, icon: 'mdi-bank-transfer' }
]

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const toggleFormulario = () => {
  // Verificar permissão para incluir
  if (!formularioAberto.value && !podeIncluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'incluir'
    acessoNegadoModal.value = true
    return
  }

  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    tipoTransferencia.value = null
  }
}

const onTransferenciaRealizada = () => {
  formularioAberto.value = false
  tipoTransferencia.value = null
  
  // Atualizar histórico
  if (historicoRef.value) {
    historicoRef.value.buscarTransferencias()
  }
  
  // Mostrar mensagem de sucesso
  snackbar.message = 'Transferência realizada com sucesso!'
  snackbar.color = 'success'
  snackbar.show = true
}
</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}

/* Estilização das tabs */
:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
}

:deep(.v-tab--selected) {
  color: var(--text-color-laranja);
}

:deep(.v-tabs-slider) {
  background-color: var(--text-color-laranja);
}
</style>
