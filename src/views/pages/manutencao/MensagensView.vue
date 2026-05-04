<template>
  <top-all-pages icon="mdi-message-text-outline">
    <template #titulo>
      Mensagens
    </template>

    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition :formulario-aberto="formularioAberto" @toggle="toggleFormulario">
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Nova Mensagem' }}</template>
          </botao-expand-transition>

          <!-- Formulário expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px" />
                  {{ editando ? 'Editar Mensagem' : 'Nova Mensagem' }}
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row dense>
                      <!-- Título -->
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.titulo"
                          label="Título *"
                          :rules="[rules.required]"
                          maxlength="60"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-text-short"
                        />
                      </v-col>

                      <!-- Mensagem -->
                      <v-col cols="12">
                        <v-textarea
                          v-model="form.mensagem"
                          label="Mensagem *"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-text"
                          rows="5"
                          auto-grow
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer />
                  <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                  <v-btn
                    color="var(--text-color-laranja)"
                    :loading="loading"
                    :disabled="!formValido"
                    variant="flat"
                    class="text-white"
                    @click="salvarMensagem"
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
            search-label="Pesquisar mensagem"
            item-key="id"
            no-data-icon="mdi-message-off-outline"
            no-data-text="Nenhuma mensagem cadastrada"
            delete-item-display-field="titulo"
            @edit-item="editarMensagem"
            @confirm-delete="excluirMensagem"
          />
        </v-card-text>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useApiStore } from '@/stores/APIs/api'
import api from '@/services/api'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const apiStore = useApiStore()

const empresaSelecionada = JSON.parse(localStorage.getItem('empresaSelecionada'))
const idEmp = empresaSelecionada?.id ?? null
const token = localStorage.getItem('token')

const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = computed(() => apiStore.loading)
const mensagens = ref([])

const form = reactive({
  id: null,
  titulo: '',
  mensagem: '',
})

const rules = {
  required: (v) => !!v || 'Campo obrigatório'
}

const headers = [
  { title: 'Título', key: 'titulo', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const itensFiltrados = computed(() => {
  const dados = mensagens.value || []
  return Array.isArray(dados) ? dados : []
})

function toggleFormulario() {
  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    editando.value = false
    resetarForm()
    formularioAberto.value = true
  }
}

function cancelarFormulario() {
  formularioAberto.value = false
  resetarForm()
}

function resetarForm() {
  form.id = null
  form.titulo = ''
  form.mensagem = ''
  editando.value = false
  formRef.value?.resetValidation()
}

function editarMensagem(item) {
  form.id = item.id
  form.titulo = item.titulo
  form.mensagem = item.mensagem
  editando.value = true
  formularioAberto.value = true
}

async function carregarMensagens() {
  try {
    const response = await api.get(`/msg/${idEmp}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    mensagens.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('Erro ao carregar mensagens:', error)
  }
}

async function salvarMensagem() {
  const { id, ...payload } = form

  if (editando.value) {
    await apiStore.executarAcao('msg', 'put', { data: [payload] }, `${idEmp}/${id}`)
  } else {
    await apiStore.executarAcao('msg', 'post', { data: [{ id_empresa: idEmp, ...payload }] })
  }

  if (!apiStore.errorMessage) {
    cancelarFormulario()
    await carregarMensagens()
  }
}

async function excluirMensagem(item) {
  await apiStore.executarAcao('msg', 'delete', null, `${idEmp}/${item.id}`)
  await carregarMensagens()
}

onMounted(async () => {
  await carregarMensagens()
})
</script>
