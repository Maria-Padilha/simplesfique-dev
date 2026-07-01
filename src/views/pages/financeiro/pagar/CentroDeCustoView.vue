<template>
  <top-all-pages icon="mdi-file-tree">
    <template #titulo>Centro de Custo</template>
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
      <!-- Lista de Centros de Custo -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
        <v-card-text class="pa-4">
          <div class="d-flex justify-space-between align-center mb-3 gap-2">
            <BotaoExpandTransition
                :formulario-aberto="formularioAberto"
                texto-abrir="Novo Centro de Custo"
                texto-fechar="Cancelar"
                @toggle="toggleFormulario"
            />
          </div>

          <!-- Formulário Expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                  {{ editando ? 'Editar Centro de Custo' : 'Novo Centro de Custo' }}
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row>
                      <!-- Classificação (Obrigatório) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.id_classificador"
                            label="Classificação *"
                            :rules="[rules.required]"
                            maxlength="10"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-barcode"
                        ></v-text-field>
                      </v-col>

                      <!-- Descrição (Obrigatório) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.desccentrocusto"
                            label="Descrição *"
                            :rules="[rules.required]"
                            maxlength="60"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-text"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn
                      color="grey"
                      variant="text"
                      @click="cancelarFormulario"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                      color="var(--text-color-laranja)"
                      :loading="loading"
                      :disabled="!formValido"
                      @click="salvarCentroCusto"
                      variant="flat"
                      class="text-white"
                  >
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela de Centros de Custo -->
          <TabelaPadrao
              :formulario-aberto="formularioAberto"
              :headers="headers"
              :items="centrosCustoFiltrados"
              :loading="loading"
              :search="search"
              @update:search="(value) => search = value"
              search-label="Pesquisar Centro de Custo"
              item-key="id"
              no-data-icon="mdi-file-tree-outline"
              no-data-text="Nenhum centro de custo cadastrado"
              :show-custom-action="false"
              delete-dialog-message="Esta ação não pode ser desfeita."
              delete-item-display-field="desccentrocusto"
              @edit-item="editarCentroCusto"
              @confirm-delete="excluirCentroCusto"
          ></TabelaPadrao>
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

      <!-- Modal de Exportação -->
      <ExportacaoModal
          v-model="modalExportacaoAberto"
          :dados="centrosCustoFiltrados"
          :filtros="{}"
          nome-relatorio="Centros de Custo"
          @exportar-pdf="() => {}"
          @exportar-csv="() => {}"
          @exportar-excel="() => {}"
          @imprimir="() => {}"
      ></ExportacaoModal>

      <!-- Modal de Preview do PDF -->
      <PdfPreviewModal
          v-model="modalPreviewPDF"
          :html-content="previewHTMLContent"
          :nome-relatorio="dadosPDFAtual?.nomeRelatorio || 'Centros_de_Custo'"
      />

      <!-- Modal de Acesso Negado -->
      <AcessoNegadoModal
          v-model="acessoNegadoModal"
          :nome-programa="'Cadastro de Centro de Custo'"
          :tipo-acesso="tipoAcessoNegado"
      />
    </template>
  </top-all-pages>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import { usePermissoes } from '@/utils/usePermissoes'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExportacaoModal from '@/components/base/modais/ExportacaoModal.vue'
import PdfPreviewModal from '@/components/base/modais/PdfPreviewModal.vue'
import AcessoNegadoModal from '@/components/base/modais/AcessoNegadoModal.vue'

// ID do programa desta tela
const ID_PROGRAMA = 'FFIN003C'

const themeStore = useThemeStore()
const ccustoStore = useCCustoStore()
// eslint-disable-next-line no-unused-vars
const { podeVisualizar, podeIncluir, podeAlterar, podeExcluir, podeExportar, podePDF } = usePermissoes()

// Modal de acesso negado
const acessoNegadoModal = ref(false)
const tipoAcessoNegado = ref('')

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Modais
const modalExportacaoAberto = ref(false)
const modalPreviewPDF = ref(false)
const previewHTMLContent = ref('')
const dadosPDFAtual = ref(null)

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Classificação', key: 'id_classificador', sortable: true },
  { title: 'Descrição', key: 'desccentrocusto', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Dados do formulário
const formData = reactive({
  id: null,
  id_classificador: '',
  desccentrocusto: '',
})

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

// Computed
const centrosCusto = computed(() => ccustoStore.centrosCusto || [])
const loading = computed(() => ccustoStore.loading)

const centrosCustoFiltrados = computed(() => {
  const dados = centrosCusto.value || []
  return Array.isArray(dados) ? dados : []
})

// Ciclo de vida
onMounted(async () => {
  // Verificar se o usuário tem permissão para visualizar este programa
  if (!podeVisualizar(ID_PROGRAMA)) {
    console.warn('[CentroDeCustoView] Usuário sem permissão para visualizar')
    tipoAcessoNegado.value = 'visualizar'
    acessoNegadoModal.value = true
    return
  }

  await ccustoStore.listarCCusto()
})

// Métodos
const toggleFormulario = () => {
  // Verificar permissão para incluir
  if (!formularioAberto.value && !podeIncluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'incluir'
    acessoNegadoModal.value = true
    return
  }

  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    abrirFormulario()
  }
}

const abrirFormulario = () => {
  editando.value = false
  resetarForm()
  formularioAberto.value = true
}

const editarCentroCusto = (item) => {
  // Verificar permissão para alterar
  if (!podeAlterar(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'alterar'
    acessoNegadoModal.value = true
    return
  }

  editando.value = true
  Object.assign(formData, {
    id: item.id,
    id_classificador: item.id_classificador,
    desccentrocusto: item.desccentrocusto,
  })
  formularioAberto.value = true
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(formData, {
    id: null,
    id_classificador: '',
    desccentrocusto: '',
  })

  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const salvarCentroCusto = async () => {
  try {
    if (editando.value) {
      await ccustoStore.alterarCCusto(formData.id, {
        id_classificador: formData.id_classificador,
        desccentrocusto: formData.desccentrocusto,
      })
    } else {
      await ccustoStore.cadastrarCCusto({
        id_classificador: formData.id_classificador,
        desccentrocusto: formData.desccentrocusto,
      })
    }
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar:', error)
  }
}

const excluirCentroCusto = async (item) => {
  // Verificar permissão para excluir
  if (!podeExcluir(ID_PROGRAMA)) {
    tipoAcessoNegado.value = 'excluir'
    acessoNegadoModal.value = true
    return
  }

  try {
    await ccustoStore.deletarCCusto(item.id)
  } catch (error) {
    console.error('Erro ao excluir:', error)
  }
}


</script>
