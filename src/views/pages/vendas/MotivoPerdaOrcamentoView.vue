<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4" elevation="0">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-file-remove-outline" class="mr-3"></v-icon>
          Motivo de Perda de Orçamento
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary" elevation="0">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Motivo"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Formulário Expansível -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Motivo' : 'Novo Motivo' }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row dense>
                    <!-- Descrição -->
                    <v-col cols="4">
                      <v-text-field
                        v-model="formData.descricao"
                        label="Descrição *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field required-left-border"
                        prepend-inner-icon="mdi-text"
                        maxlength="100"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                <v-btn
                  color="var(--text-color-laranja)"
                  :loading="loading"
                  :disabled="!formValido"
                  @click="salvarMotivo"
                  variant="flat"
                  class="text-white"
                >
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Tabela -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="itensFiltrados"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar motivo"
          item-key="id"
          no-data-icon="mdi-file-remove-outline"
          no-data-text="Nenhum motivo cadastrado"
          delete-item-display-field="descricao"
          @edit-item="editarMotivo"
          @confirm-delete="excluirMotivo"
        ></TabelaPadrao>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useVendasStore } from '@/stores/APIs/vendas'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const vendasStore = useVendasStore()

const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = computed(() => vendasStore.loading)
const motivos = ref([])

const formData = reactive({
  id: null,
  descricao: ''
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const headers = [
  { title: 'Descrição', key: 'descricao', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const itensFiltrados = computed(() => {
  const dados = motivos.value || []
  return Array.isArray(dados) ? dados : []
})

function toggleFormulario() {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) resetFormulario()
}

function cancelarFormulario() {
  formularioAberto.value = false
  resetFormulario()
}

function resetFormulario() {
  formData.id = null
  formData.descricao = ''
  editando.value = false
  formRef.value?.resetValidation()
}

function editarMotivo(item) {
  formData.id = item.id
  formData.descricao = item.descricao
  editando.value = true
  formularioAberto.value = true
}

async function carregarMotivos() {
  await vendasStore.listarMPO()
  motivos.value = vendasStore.motivosPerda
}

async function salvarMotivo() {
  const { id, ...payload } = formData

  if (editando.value) {
    await vendasStore.alterarMPO(id, payload)
  } else {
    await vendasStore.cadastrarMPO(payload)
  }

  cancelarFormulario()
  await carregarMotivos()
}

async function excluirMotivo(item) {
  await vendasStore.deletarMPO(item.id)
  await carregarMotivos()
}

onMounted(async () => {
  await carregarMotivos()
})
</script>
