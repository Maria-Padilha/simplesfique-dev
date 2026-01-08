<template>
  <top-all-pages icon="mdi-file-tree">
    <template #titulo>Centro de Custo</template>
    <template #section>
      <!-- Lista de Centros de Custo -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
        <v-card-text class="pa-4">
          <BotaoExpandTransition
              :formulario-aberto="formularioAberto"
              texto-abrir="Novo Centro de Custo"
              texto-fechar="Cancelar"
              @toggle="toggleFormulario"
          />

          <!-- Formulário Expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="2">
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
                            class="custom-text-field"
                            prepend-inner-icon="mdi-barcode"
                            @blur="validarClassificador"
                            :loading="classificadorValidando"
                            :error-messages="classificadorValido === false ? [mensagemClassificador] : []"
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
                            class="custom-text-field"
                            prepend-inner-icon="mdi-text"
                            :disabled="classificadorValido !== true"
                            :hint="classificadorValido !== true ? 'Valide a classificação primeiro' : ''"
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
    </template>
  </top-all-pages>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCCustoStore } from '@/stores/APIs/ccusto'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const themeStore = useThemeStore()
const ccustoStore = useCCustoStore()

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

// Estado de validação da classificação
const classificadorValidando = ref(false)
const classificadorValido = ref(null)
const mensagemClassificador = ref('')

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
  await ccustoStore.listarCCusto()
})

// Métodos
const toggleFormulario = () => {
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
  try {
    await ccustoStore.deletarCCusto(item.id)
  } catch (error) {
    console.error('Erro ao excluir:', error)
  }
}

// Métodos de validação
const validarClassificador = async () => {
  if (!formData.id_classificador || formData.id_classificador.trim() === '') {
    classificadorValido.value = null
    mensagemClassificador.value = ''
    formData.desccentrocusto = ''
    formData.id = null
    return
  }

  classificadorValidando.value = true
  try {
    const resultado = await ccustoStore.verificarClassificador(formData.id_classificador)
    classificadorValido.value = true
    mensagemClassificador.value = 'Classificação válida'

    // Se o classificador já existe, preenche a descrição automaticamente
    if (resultado && resultado.data) {
      // Trata tanto array quanto objeto
      let dados = resultado.data
      if (Array.isArray(dados) && dados.length > 0) {
        dados = dados[0]
      }

      // Normaliza os dados
      dados = ccustoStore.normalizarDados(dados)
      formData.desccentrocusto = dados.desccentrocusto || ''
      formData.id = dados.id || null  // ✅ Preenche o ID se existir
      editando.value = !!dados.id  // ✅ Ativa modo edição se tiver ID
    }
  } catch (error) {
    classificadorValido.value = false
    mensagemClassificador.value = ccustoStore.errorMessage || 'Classificação inválida'
    formData.desccentrocusto = ''
    formData.id = null
    editando.value = false
  } finally {
    classificadorValidando.value = false
  }
}
</script>
