<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-file-tree" class="mr-3"></v-icon>
          Centro de Custo
        </div>
      </v-card-title>
    </v-card>

    <!-- Lista de Centros de Custo -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <v-btn
          color="var(--text-color-laranja)"
          @click="toggleFormulario()"
          :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
          variant="flat"
          class="mb-3 ml-3 text-white"
          >
          {{ formularioAberto ? 'Cancelar' : 'Novo Centro de Custo' }}
        </v-btn>

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

        <!-- Campo de Pesquisa e Tabela - Só aparecem quando formulário está fechado -->
        <v-expand-transition>
          <div v-if="!formularioAberto">
            <v-text-field
              v-model="search"
              label="Pesquisar Centro de Custo"
              width="480"
              append-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="mb-2 ml-3 custom-text-field ">
            </v-text-field>
            <v-data-table
              :headers="headers"
              :items="centrosCustoFiltrados"
              :loading="loading"
              item-key="id"
              class="elevation-1 background-secondary"
            >

              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="primary"
                  variant="text"
                  @click="editarCentroCusto(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  variant="text"
                  @click="confirmarExclusao(item)"
                ></v-btn>
              </template>

              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon icon="mdi-file-tree-outline" size="64" class="mb-2 opacity-60" :color="themeStore.darkMode ? '#ffff' : ''"></v-icon>
                  <p class="text-body-1">Nenhum centro de custo cadastrado</p>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="dialogExclusao" max-width="400px">
      <v-card class="background-secondary">
        <v-card-title class="text-h6">
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o centro de custo "{{ itemParaExcluir?.descricao }}"?
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="dialogExclusao = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="loading"
            @click="excluirCentroCusto"
          >
            Excluir
          </v-btn>
        </v-card-actions>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useCCustoStore } from '@/stores/APIs/ccusto'

const themeStore = useThemeStore()
const ccustoStore = useCCustoStore()

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const dialogExclusao = ref(false)
const itemParaExcluir = ref(null)
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

  if (!Array.isArray(dados)) return []
  if (!search.value) return dados

  const termo = search.value.toLowerCase()
  return dados.filter(cc =>
    (cc.id_classificador && cc.id_classificador.toLowerCase().includes(termo)) ||
    (cc.desccentrocusto && cc.desccentrocusto.toLowerCase().includes(termo))
  )
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

const confirmarExclusao = (item) => {
  itemParaExcluir.value = item
  dialogExclusao.value = true
}

const excluirCentroCusto = async () => {
  try {
    await ccustoStore.deletarCCusto(itemParaExcluir.value.id)
    dialogExclusao.value = false
    itemParaExcluir.value = null
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
