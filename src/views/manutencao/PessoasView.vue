<template>
  <div class="pa-4">
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-group" class="mr-3"></v-icon>
          Pessoas
        </div>
        <v-btn color="var(--text-color-laranja)" @click="abrirFormulario()" variant="flat" class="text-white">Nova Pessoa</v-btn>
      </v-card-title>
    </v-card>

    <v-card class="background-secondary">
      <v-card-text class="pa-4">
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field v-model="search" label="Pesquisar" append-inner-icon="mdi-magnify" variant="outlined" density="compact"></v-text-field>
          </v-col>
        </v-row>

        <v-data-table
          :headers="headers"
          :items="pessoas"
          :loading="loading"
          item-key="id"
          class="elevation-1 background-secondary"
        >
          <template v-slot:[`item.tipo_pessoa`]='{ item }'>
            {{ item.tipo_pessoa === 'F' ? 'Física' : 'Jurídica' }}
          </template>

          <template v-slot:[`item.acoes`]='{ item }'>
            <v-btn icon="mdi-pencil" size="small" color="primary" variant="text" @click="editarPessoa(item)"></v-btn>
            <v-btn icon="mdi-delete" size="small" color="error" variant="text" @click="confirmarExclusao(item)"></v-btn>
          </template>

          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon icon="mdi-account-off" size="64" class="mb-2 opacity-60"></v-icon>
              <p class="text-body-1">Nenhuma pessoa encontrada</p>
            </div>
          </template>
        </v-data-table>

      </v-card-text>
    </v-card>

    <!-- Modal cadastro/edição -->
    <v-dialog v-model="formAberto" max-width="800px">
      <v-card class="background-secondary">
        <v-card-title class="text-h6 pa-4">{{ editando ? 'Editar Pessoa' : 'Nova Pessoa' }}</v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="formRef" v-model="formValido">
            <v-row>
              <v-col cols="12" md="3">
                <v-select v-model="form.tipo_pessoa" :items="[{label:'Física', value:'F'},{label:'Jurídica', value:'J'}]" item-title="label" item-value="value" label="Tipo *" :rules="[rules.required]"></v-select>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="form.nome_razao" label="Nome / Razão *" :rules="[rules.required]" maxlength="100"></v-text-field>
              </v-col>

              <v-col cols="12" md="5">
                <v-text-field v-model="form.apelido_fantasia" label="Apelido / Fantasia *" :rules="[rules.required]" maxlength="100"></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="form.cpf_cnpj" label="CPF / CNPJ" maxlength="14"></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="form.telefone" label="Telefone" maxlength="15"></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model="form.celular" label="Celular" maxlength="15"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="form.email" label="E-mail" maxlength="120"></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-col cols="12" md="2"><v-checkbox v-model="form.cliente" label="Cliente" true-value="S" false-value="N"></v-checkbox></v-col>
                  <v-col cols="12" md="2"><v-checkbox v-model="form.fornecedor" label="Fornecedor" true-value="S" false-value="N"></v-checkbox></v-col>
                  <v-col cols="12" md="2"><v-checkbox v-model="form.transportadora" label="Transportadora" true-value="S" false-value="N"></v-checkbox></v-col>
                  <v-col cols="12" md="2"><v-checkbox v-model="form.colaborador" label="Colaborador" true-value="S" false-value="N"></v-checkbox></v-col>
                  <v-col cols="12" md="2"><v-checkbox v-model="form.representante" label="Representante" true-value="S" false-value="N"></v-checkbox></v-col>
                </v-row>
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
          <v-btn color="var(--text-color-laranja)" :disabled="!formValido" :loading="loading" @click="salvarPessoa" class="text-white">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">{{ snackbar.message }}</v-snackbar>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted} from 'vue'
import api from '@/services/api'

// State
const pessoas = ref([])
const loading = ref(false)
const search = ref('')

// Modal/form
const formAberto = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const editando = ref(false)

const form = reactive({
  id_empresa: 1,
  id: null,
  tipo_pessoa: 'F',
  nome_razao: '',
  apelido_fantasia: '',
  cpf_cnpj: '',
  rg_inscricao: '',
  telefone: '',
  celular: '',
  whats: '',
  website: '',
  email: '',
  cliente: 'N',
  fornecedor: 'N',
  transportadora: 'N',
  colaborador: 'N',
  representante: 'N',
  instagram: '',
  facebook: '',
  twitter_x: '',
  tik_tok: '',
  telegram: '',
  latitude: null,
  longitude: null,
  ativo: 'S'
})

// Snackbar
const snackbar = reactive({ show:false, message:'', color:'success' })

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Tipo', key: 'tipo_pessoa', sortable: true },
  { title: 'Nome / Razão', key: 'nome_razao', sortable: true },
  { title: 'Apelido', key: 'apelido_fantasia', sortable: true },
  { title: 'CPF/CNPJ', key: 'cpf_cnpj', sortable: true },
  { title: 'Telefone', key: 'telefone', sortable: false },
  { title: 'Celular', key: 'celular', sortable: false },
  { title: 'Flags', key: 'flags', sortable: false },
  { title: 'Ações', key: 'acoes', sortable: false }
]

const rules = {
  required: (v) => !!v || 'Campo obrigatório'
}

// CRUD
const buscarPessoas = async () => {
  loading.value = true
  try {
    const resp = await api.get('/pessoa', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    const data = resp.data && resp.data.data ? resp.data.data : Array.isArray(resp.data) ? resp.data : []
    pessoas.value = data
  } catch (e) {
    console.error(e)
    pessoas.value = []
  } finally {
    loading.value = false
  }
}

const abrirFormulario = () => {
  editando.value = false
  resetarForm()
  formAberto.value = true
}

const editarPessoa = (p) => {
  editando.value = true
  Object.assign(form, p)
  formAberto.value = true
}

const cancelarFormulario = () => {
  formAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(form, {
    id_empresa: 1,
    id: null,
    tipo_pessoa: 'F',
    nome_razao: '',
    apelido_fantasia: '',
    cpf_cnpj: '',
    rg_inscricao: '',
    telefone: '',
    celular: '',
    whats: '',
    website: '',
    email: '',
    cliente: 'N',
    fornecedor: 'N',
    transportadora: 'N',
    colaborador: 'N',
    representante: 'N',
    instagram: '',
    facebook: '',
    twitter_x: '',
    tik_tok: '',
    telegram: '',
    latitude: null,
    longitude: null,
    ativo: 'S'
  })
  if (formRef.value) formRef.value.resetValidation()
}

const salvarPessoa = async () => {
  if (!formRef.value?.validate()) return
  loading.value = true
  try {
    const payload = { data: [ { ...form } ] }
    if (editando.value) {
      await api.put(`/pessoa/${form.id}`, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      snackbar.message = 'Pessoa atualizada com sucesso!'
    } else {
      await api.post('/pessoa', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      snackbar.message = 'Pessoa criada com sucesso!'
    }
    snackbar.color = 'success'
    snackbar.show = true
    buscarPessoas()
    cancelarFormulario()
  } catch (e) {
    console.error(e)
    snackbar.message = 'Erro ao salvar pessoa'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

const confirmarExclusao = (p) => {
  if (!confirm('Confirmar exclusão?')) return
  deletarPessoa(p.id)
}

const deletarPessoa = async (id) => {
  loading.value = true
  try {
    await api.delete(`/pessoa/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    snackbar.message = 'Pessoa excluída'
    snackbar.color = 'success'
    snackbar.show = true
    buscarPessoas()
  } catch (e) {
    console.error(e)
    snackbar.message = 'Erro ao excluir pessoa'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  buscarPessoas()
})
</script>
