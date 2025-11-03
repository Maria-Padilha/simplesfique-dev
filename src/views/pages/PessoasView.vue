<template>
  <div class="pa-4">
    <v-card class="background-secondary my-4" elevation="1">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-group" class="mr-3"></v-icon>
          Pessoas
        </div>

      </v-card-title>
    </v-card>

    <v-card elevation="0" class="background-secondary">
      <v-card-text class="pa-4">
        <botao-expand-transition :formulario-aberto="formularioAberto" :toggle-formulario="toggleFormulario">
          <template #default>{{ formularioAberto ? 'Cancelar' : 'Nova Pessoa' }}</template>
        </botao-expand-transition>

        <!-- Formulário expansível -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="0">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px"/>
                {{ editando ? 'Editar Pessoa' : 'Nova Pessoa' }}
              </v-card-title>

              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Tipo Pessoa -->
                    <v-col cols="12" md="3">
                      <v-select
                          v-model="form.tipo_pessoa"
                          :items="[{label:'Física', value:'F'},{label:'Jurídica', value:'J'}]"
                          item-title="label"
                          item-value="value"
                          label="Tipo *"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-account-circle"
                      />
                    </v-col>

                    <!-- Nome / Razão -->
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.nome_razao"
                          label="Nome / Razão *"
                          :rules="[rules.required]"
                          maxlength="100"
                          variant="outlined"
                          density="compact"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-account"
                          hide-details="auto"
                      />
                    </v-col>

                    <!-- Apelido / Fantasia -->
                    <v-col cols="12" md="5">
                      <v-text-field
                          v-model="form.apelido_fantasia"
                          label="Apelido / Fantasia *"
                          :rules="[rules.required]"
                          maxlength="100"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-rename-box"
                      />
                    </v-col>

                    <!-- CPF / CNPJ -->
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-if="form.tipo_pessoa === 'F'"
                          v-model="form.cpf_cnpj"
                          label="CPF"
                          maxlength="14"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-card-account-details"
                          v-mask-cpf
                      />
                      <v-text-field
                          v-else
                          v-model="form.cpf_cnpj"
                          label="CNPJ"
                          maxlength="14"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-card-account-details"
                          v-mask-cnpj
                      />
                    </v-col>

                    <!-- RG / Inscrição -->
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.rg_inscricao"
                          label="RG / Inscrição Estadual"
                          maxlength="20"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-identifier"
                      />
                    </v-col>

                    <!-- Telefone -->
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.telefone"
                          label="Telefone"
                          maxlength="15"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-phone"
                          v-mask-phone.br
                      />
                    </v-col>

                    <!-- Celular -->
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.celular"
                          label="Celular"
                          maxlength="15"
                          variant="outlined"
                          hide-details="auto"
                          density="compact"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-cellphone"
                          v-mask-phone.br
                      />
                    </v-col>

                    <!-- WhatsApp -->
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.whats"
                          label="WhatsApp"
                          maxlength="15"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-whatsapp"
                          v-mask-phone.br
                      />
                    </v-col>

                    <!-- Redes sociais -->
                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.instagram"
                          label="Instagram"
                          maxlength="80"
                          prepend-inner-icon="mdi-instagram"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                      />
                    </v-col>

                    <!-- Website -->
                    <v-col cols="12">
                      <v-text-field
                          v-model="form.website"
                          label="Website"
                          maxlength="150"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-web"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.facebook"
                          label="Facebook"
                          maxlength="80"
                          prepend-inner-icon="mdi-facebook"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.twitter_x"
                          label="Twitter / X"
                          maxlength="80"
                          prepend-inner-icon="mdi-twitter"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                      />
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-text-field
                          v-model="form.tik_tok"
                          label="TikTok"
                          maxlength="80"
                          prepend-inner-icon="mdi-music-note"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                          v-model="form.telegram"
                          label="Telegram"
                          maxlength="80"
                          prepend-inner-icon="mdi-send"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                      />
                    </v-col>

                    <!-- Coordenadas -->
                    <v-col cols="12" md="3">
                      <v-text-field
                          v-model="form.latitude"
                          label="Latitude"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-map-marker"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                          v-model="form.longitude"
                          label="Longitude"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-map-marker-outline"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="grey" variant="text" @click="cancelarFormulario" size="small">Cancelar</v-btn>
                <v-btn
                    color="var(--text-color-laranja)"
                    :loading="loading"
                    :disabled="!formValido"
                    @click="salvarPessoa"
                    variant="flat" size="small"
                    class="text-white">
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <v-expand-transition>
          <div v-if="!formularioAberto">
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                    class="ml-3"
                    width="480"
                    v-model="search"
                    label="Pesquisar"
                    append-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-data-table
                :headers="headers"
                :items="pessoas"
                :loading="loading"
                item-key="id"
                class="background-secondary"
            >
              <template v-slot:[`item.tipo_pessoa`]='{ item }'>
                {{ item.tipo_pessoa === 'F' ? 'Física' : 'Jurídica' }}
              </template>

              <template v-slot:[`item.acoes`]='{ item }'>
                <v-btn icon="mdi-pencil" size="small" color="primary" variant="text"
                       @click="editarPessoa(item)"></v-btn>
                <v-btn icon="mdi-delete" size="small" color="error" variant="text"
                       @click="confirmarExclusao(item)"></v-btn>
              </template>

              <template v-slot:no-data>
                <div class="text-center pa-4">
                  <v-icon icon="mdi-account-off" size="64" class="mb-2 opacity-60"></v-icon>
                  <p class="text-body-1">Nenhuma pessoa encontrada</p>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>


    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">{{ snackbar.message }}</v-snackbar>

  </div>
</template>

<script setup>
import {ref, reactive, computed, watchEffect} from 'vue'
import {useThemeStore} from '@/stores/config-temas/theme'
import {usePessoasStore} from "@/stores/APIs/pessoas";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";

const themeStore = useThemeStore();
const pessoasStore = usePessoasStore();

// State
const pessoas = computed(() => pessoasStore.pessoas);
const loading = computed(() => pessoasStore.loading);
const search = ref('')

// Formulário expansível
const formularioAberto = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const editando = ref(false)

const form = reactive({
  "tipo_pessoa": "",
  "nome_razao": "",
  "apelido_fantasia": "",
  "cpf_cnpj": "",
  "rg_inscricao": "",
  "telefone": "",
  "celular": "",
  "whats": "",
  "website": "",
  "cliente": "",
  "fornecedor": "",
  "transportadora": "",
  "colaborador": "",
  "representante": "",
  "instagram": "",
  "facebook": "",
  "twitter_x": "",
  "tik_tok": "",
  "telegram": "",
  "latitude": "",
  "longitude": "",
  "ativo": ""
});

// Snackbar
const snackbar = reactive({show: false, message: '', color: 'success'})

const headers = [
  {title: 'ID', key: 'id', sortable: true},
  {title: 'Tipo', key: 'tipo_pessoa', sortable: true},
  {title: 'Nome / Razão', key: 'nome_razao', sortable: true},
  {title: 'Apelido', key: 'apelido_fantasia', sortable: true},
  {title: 'CPF/CNPJ', key: 'cpf_cnpj', sortable: true},
  {title: 'Telefone', key: 'telefone', sortable: false},
  {title: 'Celular', key: 'celular', sortable: false},
  {title: 'Ativo', key: 'ativo', sortable: false},
  {title: 'Ações', key: 'acoes', sortable: false}
]

const rules = {
  required: (v) => !!v || 'Campo obrigatório'
}

// CRUD
const buscarPessoas = async () => {
  if (pessoas.value.length === 0)
    await pessoasStore.buscarTodasPessoas();
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

const editarPessoa = (p) => {
  editando.value = true
  Object.assign(form, p)
  formularioAberto.value = true
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(form, {
    tipo_pessoa: 'F',
    nome_razao: '',
    apelido_fantasia: '',
    cpf_cnpj: '',
    rg_inscricao: '',
    telefone: '',
    celular: '',
    whats: '',
    website: '',
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
  await pessoasStore.salvarPessoa(formRef.value, form, editando.value, snackbar);
  if (!pessoasStore.errorMessage) cancelarFormulario();
}

const confirmarExclusao = (p) => {
  if (!confirm('Confirmar exclusão?')) return
  deletarPessoa(p.id)
}

const deletarPessoa = async (id) => {
  await pessoasStore.deletarPessoa(id, snackbar)
}

watchEffect(() => {
  buscarPessoas()
})
</script>
