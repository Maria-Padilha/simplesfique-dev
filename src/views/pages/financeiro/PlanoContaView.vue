<template>
  <top-all-pages icon="mdi-file-tree">
    <template #titulo>Plano de Conta</template>
    <template #section>
      <!-- Lista de Planos de Conta -->
      <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
        <v-card-text class="pa-4">
          <BotaoExpandTransition
              :formulario-aberto="formularioAberto"
              texto-abrir="Novo Plano de Conta"
              texto-fechar="Cancelar"
              @toggle="toggleFormulario"
          />

          <!-- Formulário Expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="2">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                  {{ editando ? 'Editar Plano de Conta' : 'Novo Plano de Conta' }}
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row>
                      <!-- ID Classificador (Obrigatório) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.id_classificador"
                            label="ID Classificador *"
                            :rules="[rules.required]"
                            maxlength="20"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-barcode"
                            hint="Código único do plano de conta"
                        ></v-text-field>
                      </v-col>

                      <!-- Descrição da Conta (Obrigatório) -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.descconta"
                            label="Descrição da Conta *"
                            :rules="[rules.required]"
                            maxlength="60"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-text"
                        ></v-text-field>
                      </v-col>

                      <!-- Tipo da Conta -->
                      <v-col cols="12" md="6">
                        <v-select
                            v-model="formData.tipo_conta"
                            :items="tiposPlano"
                            label="Tipo da Conta"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-format-list-bulleted-type"
                        ></v-select>
                      </v-col>

                      <!-- Natureza -->
                      <v-col cols="12" md="6">
                        <v-select
                            v-model="formData.natureza"
                            :items="naturezasPlano"
                            label="Natureza"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-nature"
                        ></v-select>
                      </v-col>

                      <!-- Nível -->
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="formData.nivel"
                            label="Nível"
                            type="number"
                            variant="outlined"
                            density="compact"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-format-list-numbered"
                            hint="Nível hierárquico do plano de conta"
                        ></v-text-field>
                      </v-col>

                      <!-- Ativo -->
                      <v-col cols="12" md="6">
                        <v-switch
                            v-model="formData.ativo"
                            label="Ativo"
                            color="var(--text-color-laranja)"
                            true-value="S"
                            false-value="N"
                            class="custom-switch"
                        ></v-switch>
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
                      @click="salvarPlanoConta"
                      variant="flat"
                      class="text-white"
                  >
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela de Planos de Conta -->
          <TabelaPadrao
              :formulario-aberto="formularioAberto"
              :headers="headers"
              :items="planosContaFiltrados"
              :loading="loading"
              :search="search"
              @update:search="(value) => search = value"
              search-label="Pesquisar Plano de Conta"
              item-key="id"
              no-data-icon="mdi-file-tree-outline"
              no-data-text="Nenhum plano de conta cadastrado"
              :show-custom-action="false"
              delete-dialog-message="Esta ação não pode ser desfeita."
              delete-item-display-field="descconta"
              @edit-item="editarPlanoConta"
              @confirm-delete="excluirPlanoConta"
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
  </top-all-pages>>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const themeStore = useThemeStore()
const financeiroStore = useFinanceiroStore()

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')

// Estado dos dados
const planosConta = ref([])

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Classificador', key: 'id_classificador', sortable: true },
  { title: 'Descrição', key: 'descconta', sortable: true },
  { title: 'Tipo', key: 'tipo_conta', sortable: true },
  { title: 'Natureza', key: 'natureza', sortable: true },
  { title: 'Nível', key: 'nivel', sortable: true },
  { title: 'Ativo', key: 'ativo', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Opções para selects
const tiposPlano = [
  { title: 'Sintético', value: 'S' },
  { title: 'Analítico', value: 'A' }
]

const naturezasPlano = [
  { title: 'Credora', value: 'C' },
  { title: 'Devedora', value: 'D' },
]

// Dados do formulário
const formData = reactive({
  id: null,
  id_classificador: '',
  descconta: '',
  tipo_conta: 'A',
  natureza: 'C',
  nivel: null,
  ativo: 'S'
})

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

// Computed
const loading = computed(() => financeiroStore.loading)

const planosContaFiltrados = computed(() => {
  const dados = planosConta.value || []
  return Array.isArray(dados) ? dados : []
})



// Ciclo de vida
onMounted(async () => {
  await carregarPlanosConta()
})

// Métodos
const carregarPlanosConta = async () => {
  try {
    const dados = await financeiroStore.buscarPlanosConta()
    planosConta.value = dados
  } catch (error) {
    console.error('Erro ao carregar planos de conta:', error)
    mostrarMensagem('Erro ao carregar planos de conta', 'error')
  }
}

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

const editarPlanoConta = (item) => {
  editando.value = true
  Object.assign(formData, {
    id: item.id,
    id_classificador: item.id_classificador || '',
    descconta: item.descconta || '',
    tipo_conta: item.tipo_conta || 'A', // Garantir que seja 'S' ou 'A'
    natureza: item.natureza || 'C', // Garantir que seja 'C' ou 'D'
    nivel: item.nivel || null,
    ativo: item.ativo || 'S' // Garantir que seja 'S' ou 'N'
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
    descconta: '',
    tipo_conta: 'A',
    natureza: 'C',
    nivel: null,
    ativo: 'S'
  })

  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const salvarPlanoConta = async () => {
  try {
    // Garantir que sempre enviamos apenas as siglas
    const dadosParaSalvar = {
      id_classificador: formData.id_classificador,
      descconta: formData.descconta,
      tipo_conta: formData.tipo_conta, // 'S' ou 'A'
      natureza: formData.natureza, // 'C' ou 'D'
      nivel: formData.nivel,
      ativo: formData.ativo // 'S' ou 'N'
    }

    // Validar que os valores estão corretos (apenas siglas)
    if (!['S', 'A'].includes(dadosParaSalvar.tipo_conta)) {
      dadosParaSalvar.tipo_conta = 'A' // Default para Analítico
    }

    if (!['C', 'D'].includes(dadosParaSalvar.natureza)) {
      dadosParaSalvar.natureza = 'C' // Default para Credora
    }

    if (!['S', 'N'].includes(dadosParaSalvar.ativo)) {
      dadosParaSalvar.ativo = 'S' // Default para Ativo
    }

    if (editando.value) {
      await financeiroStore.atualizarPlanoConta(formData.id, dadosParaSalvar)
      mostrarMensagem('Plano de conta atualizado com sucesso!', 'success')
    } else {
      await financeiroStore.criarPlanoConta(dadosParaSalvar)
      mostrarMensagem('Plano de conta cadastrado com sucesso!', 'success')
    }

    await carregarPlanosConta()
    cancelarFormulario()
  } catch (error) {
    console.error('Erro ao salvar plano de conta:', error)
    mostrarMensagem('Erro ao salvar plano de conta', 'error')
  }
}

const excluirPlanoConta = async (item) => {
  try {
    await financeiroStore.deletarPlanoConta(item.id)
    await carregarPlanosConta()
    mostrarMensagem('Plano de conta excluído com sucesso!', 'success')
  } catch (error) {
    console.error('Erro ao excluir plano de conta:', error)
    mostrarMensagem('Erro ao excluir plano de conta', 'error')
  }
}

const mostrarMensagem = (mensagem, tipo) => {
  snackbar.message = mensagem
  snackbar.color = tipo
  snackbar.show = true
}
</script>

<style scoped>
.custom-text-field :deep(.v-field) {
  background-color: rgba(var(--v-theme-surface), 0.7);
}

.custom-switch :deep(.v-switch__thumb) {
  color: var(--text-color-laranja);
}
</style>
