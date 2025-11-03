<template>
  <div class="pa-4">
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-cog" class="mr-3"></v-icon>
          Usuários
        </div>
      </v-card-title>
    </v-card>

    <v-card class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Usuário"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Usuário' : 'Novo Usuário' }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.nome"
                        label="Nome *"
                        :rules="[rules.required]"
                        maxlength="120"
                        variant="outlined"
                        density="compact"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-account"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="form.email"
                        label="E-mail *"
                        :rules="[rules.required, rules.email]"
                        maxlength="120"
                        variant="outlined"
                        density="compact"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-email"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-checkbox v-model="form.consolidar" label="Permite consolidar" true-value="S" false-value="N"></v-checkbox>
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
                  @click="salvarUsuario"
                  variant="flat"
                  class="text-white">
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Tabela de Usuários -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="usuarios"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar Usuário"
          item-key="id"
          no-data-icon="mdi-account-off"
          no-data-text="Nenhum usuário encontrado"
          :show-custom-action="false"
          delete-dialog-message="Esta ação não pode ser desfeita."
          delete-item-display-field="nome"
          @edit-item="editarUsuario"
          @confirm-delete="deletarUsuario"
        >
          <!-- Slots para formatação customizada -->
          <template v-slot:[`item.consolidar`]="{ item }">
            {{ item.consolidar === 'S' ? 'Sim' : 'Não' }}
          </template>
        </TabelaPadrao>

      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">{{ snackbar.message }}</v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'
import { useThemeStore } from '@/stores/config-temas/theme'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore();

// State
const usuarios = ref([])
const loading = ref(false)
const search = ref('')

// Formulário expansível
const formularioAberto = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const editando = ref(false)

const form = reactive({
  id_empresa: 1,
  id: null,
  nome: '',
  email: '',
  consolidar: 'N',
})

// Snackbar
const snackbar = reactive({ show:false, message:'', color:'success' })

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'E-mail', key: 'email', sortable: true },
  { title: 'Consolidar', key: 'consolidar', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false }
]

const rules = {
  required: (v) => !!v || 'Campo obrigatório',
  email: (v) => /\S+@\S+\.\S+/.test(v) || 'E-mail inválido'
}

// CRUD
const buscarUsuarios = async () => {
  loading.value = true
  try {
    const resp = await api.get('/usuario', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    const data = resp.data && resp.data.data ? resp.data.data : Array.isArray(resp.data) ? resp.data : []
    usuarios.value = data
  } catch (e) {
    console.error(e)
    usuarios.value = []
  } finally {
    loading.value = false
  }
}

const toggleFormulario = () => {
  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    editando.value = false
    resetarForm()
    formularioAberto.value = true
  }
}

const editarUsuario = (u) => {
  editando.value = true
  Object.assign(form, u)
  formularioAberto.value = true
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(form, {
    id_empresa: 1,
    id: null,
    nome: '',
    email: '',
    consolidar: 'N',
  })
  if (formRef.value) formRef.value.resetValidation()
}

const salvarUsuario = async () => {
  if (!formRef.value?.validate()) return
  loading.value = true
  try {
    const payload = { data: [ { ...form } ] }
    if (editando.value) {
      await api.put(`/usuario/${form.id}`, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      snackbar.message = 'Usuário atualizado com sucesso!'
    } else {
      await api.post('/usuario', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      snackbar.message = 'Usuário criado com sucesso!'
    }
    snackbar.color = 'success'
    snackbar.show = true
    buscarUsuarios()
    cancelarFormulario()
  } catch (e) {
    console.error(e)
    snackbar.message = 'Erro ao salvar usuário'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

const deletarUsuario = async (usuario) => {
  loading.value = true
  try {
    const id = usuario?.id || usuario
    await api.delete(`/usuario/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    snackbar.message = 'Usuário excluído com sucesso!'
    snackbar.color = 'success'
    snackbar.show = true
    buscarUsuarios()
  } catch (e) {
    console.error(e)
    snackbar.message = 'Erro ao excluir usuário'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  buscarUsuarios()
})
</script>
