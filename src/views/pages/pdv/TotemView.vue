<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-monitor-multiple" class="mr-3"></v-icon>
          Totem
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Totem"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Expandable Form -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Totem' : 'Novo Totem' }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.descricao"
                        label="Descrição"
                        :rules="rules.required"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.url"
                        label="URL"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="formData.porta"
                        label="Porta"
                        type="number"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-switch
                        v-model="formData.ativo"
                        label="Ativo"
                        color="var(--text-color-laranja)"
                      ></v-switch>
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
                  @click="salvarTotem"
                  variant="flat"
                  class="text-white"
                >
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Data Table -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="itemsFiltrados"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar Totem"
          item-key="id"
          no-data-icon="mdi-monitor-multiple-outline"
          no-data-text="Nenhum totem cadastrado"
          delete-item-display-field="descricao"
          @edit-item="editarTotem"
          @confirm-delete="excluirTotem"
        >
          <template #[`item.ativo`]="{ item }">
            <v-chip :color="item.ativo ? 'green' : 'red'" text-color="white" small>
              {{ item.ativo ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()

const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = ref(false)

const totems = ref([])

const formData = reactive({
  id: null,
  descricao: '',
  url: '',
  porta: null,
  ativo: true
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Descrição', key: 'descricao', sortable: true },
  { title: 'URL', key: 'url', sortable: true },
  { title: 'Porta', key: 'porta', sortable: true },
  { title: 'Status', key: 'ativo', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const itemsFiltrados = computed(() => {
  const dados = totems.value || []
  if (!Array.isArray(dados)) return []

  if (!search.value) return dados

  return dados.filter(item => {
    const searchLower = search.value.toLowerCase()
    return (
      (item.descricao && item.descricao.toLowerCase().includes(searchLower)) ||
      (item.url && item.url.toLowerCase().includes(searchLower)) ||
      (item.id && item.id.toString().includes(searchLower))
    )
  })
})

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    cancelarFormulario()
  }
}

const cancelarFormulario = () => {
  formRef.value?.resetValidation()
  resetFormData()
  editando.value = false
}

const resetFormData = () => {
  formData.id = null
  formData.descricao = ''
  formData.url = ''
  formData.porta = null
  formData.ativo = true
}

const editarTotem = (item) => {
  editando.value = true
  formData.id = item.id
  formData.descricao = item.descricao
  formData.url = item.url
  formData.porta = item.porta
  formData.ativo = item.ativo
  formularioAberto.value = true
  formRef.value?.resetValidation()
}

const salvarTotem = async () => {
  if (!formRef.value.validate()) return

  loading.value = true
  try {
    // Simulação de API call - substitua por chamada real
    if (editando.value) {
      // Atualizar
      console.log('Atualizando totem:', formData)
      const index = totems.value.findIndex(t => t.id === formData.id)
      if (index !== -1) {
        totems.value[index] = { ...formData }
      }
    } else {
      // Criar novo
      console.log('Criando novo totem:', formData)
      const novoId = Math.max(...totems.value.map(t => t.id || 0), 0) + 1
      totems.value.push({
        id: novoId,
        ...formData
      })
    }

    cancelarFormulario()
    formularioAberto.value = false
  } catch (error) {
    console.error('Erro ao salvar totem:', error)
  } finally {
    loading.value = false
  }
}

const excluirTotem = async (item) => {
  loading.value = true
  try {
    // Simulação de API call - substitua por chamada real
    console.log('Deletando totem:', item)
    totems.value = totems.value.filter(t => t.id !== item.id)
  } catch (error) {
    console.error('Erro ao deletar totem:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    // Simular dados iniciais
    totems.value = [
      {
        id: 1,
        descricao: 'Totem Principal',
        url: 'http://localhost',
        porta: 3000,
        ativo: true
      },
      {
        id: 2,
        descricao: 'Totem Secundário',
        url: 'http://192.168.1.100',
        porta: 3001,
        ativo: false
      }
    ]
  } catch (error) {
    console.error('Erro ao carregar totems:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Adicione estilos específicos do totem aqui se necessário */
</style>
