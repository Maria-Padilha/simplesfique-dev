<template>
  <top-all-pages icon="mdi-account-group">
    <template #titulo>
      <v-sheet class="bg-transparent w-[100%] text-h5 pa-4 d-flex justify-space-between align-center">
        Pessoas
        <v-btn
            color="var(--text-color-laranja)"
            variant="flat"
            size="small"
            prepend-icon="mdi-file-upload"
            class="text-white"
            @click="abrirImportacao"
        >
          Importar CSV
        </v-btn>
      </v-sheet>
    </template>

    <template #section>
      <div>
        <v-card elevation="0" class="background-secondary">
          <v-card-text class="pa-4">
            <botao-expand-transition :formulario-aberto="formularioAberto" @toggle="toggleFormulario">
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
                              class="custom-text-field required-left-border"
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
                              class="custom-text-field required-left-border"
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
                             class="custom-text-field required-left-border"
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

            <!-- Modal de Importação CSV -->
            <v-dialog v-model="importacaoAberta" max-width="600px" persistent>
              <v-card class="background-card">
                <v-card-title class="text-h6 pa-4 d-flex align-center">
                  <v-icon icon="mdi-file-upload" class="mr-2"></v-icon>
                  Importar Pessoas via CSV
                </v-card-title>

                <v-card-text class="pa-4">
                  <v-alert
                      type="info"
                      variant="tonal"
                      density="compact"
                      class="mb-4"
                  >
                    <div class="text-caption">
                      <strong>Formato esperado:</strong> Arquivo CSV com as colunas do modelo.
                      Campos obrigatórios: tipo_pessoa, nome_razao, apelido_fantasia.
                    </div>
                  </v-alert>

                  <div class="d-flex gap-2 mb-4">
                    <v-btn
                        color="primary"
                        variant="outlined"
                        prepend-icon="mdi-download"
                        @click="baixarModeloCSV"
                        size="small"
                        block
                    >
                      Baixar Modelo CSV
                    </v-btn>
                  </div>

                  <v-file-input
                      v-model="arquivoCSV"
                      label="Selecione o arquivo CSV"
                      accept=".csv"
                      prepend-icon="mdi-file-delimited"
                      variant="outlined"
                      density="compact"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      show-size
                      @change="onArquivoSelecionado"
                  ></v-file-input>

                  <v-alert
                      v-if="resultadoImportacao.show"
                      :type="resultadoImportacao.type"
                      variant="tonal"
                      density="compact"
                      class="mt-4"
                  >
                    {{ resultadoImportacao.message }}
                  </v-alert>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn
                      color="grey"
                      variant="text"
                      @click="fecharImportacao"
                      size="small"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                      color="var(--text-color-laranja)"
                      variant="flat"
                      class="text-white"
                      :loading="importandoCSV"
                      :disabled="!arquivoCSV"
                      @click="importarCSV"
                      size="small"
                  >
                    Importar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

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
  </top-all-pages>
</template>

<script setup>
import {ref, reactive, computed, watchEffect} from 'vue'
import {useThemeStore} from '@/stores/config-temas/theme'
import {usePessoasStore} from "@/stores/APIs/pessoas";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

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

// Importação CSV
const importacaoAberta = ref(false)
const arquivoCSV = ref(null)
const importandoCSV = ref(false)
const resultadoImportacao = reactive({ show: false, message: '', type: 'success' })

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

// Importação CSV
const abrirImportacao = () => {
  importacaoAberta.value = true
  resultadoImportacao.show = false
}

const fecharImportacao = () => {
  importacaoAberta.value = false
  arquivoCSV.value = null
  resultadoImportacao.show = false
}

const baixarModeloCSV = () => {
  const csvContent = `tipo_pessoa,nome_razao,apelido_fantasia,cpf_cnpj,rg_inscricao,telefone,celular,whats,website,cliente,fornecedor,transportadora,colaborador,representante,instagram,facebook,twitter_x,tik_tok,telegram,latitude,longitude,ativo
F,João Silva,João,12345678900,123456789,1133334444,11999998888,11999998888,https://exemplo.com,S,N,N,N,N,@joao,joao.silva,@joaosilva,@joao,@joaosilva,-23.5505,-46.6333,S
J,Empresa XYZ Ltda,XYZ Comércio,12345678000199,987654321,1144445555,11988887777,11988887777,https://empresaxyz.com.br,N,S,N,N,N,@empresaxyz,empresa.xyz,@empresaxyz,@xyzempresa,@empresaxyz,-23.5489,-46.6388,S`
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', 'modelo_importacao_pessoas.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const onArquivoSelecionado = () => {
  resultadoImportacao.show = false
}

const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const obj = {}
    
    headers.forEach((header, index) => {
      let value = values[index]?.trim() || ''
      
      // Converter valores numéricos
      if (header === 'latitude' || header === 'longitude') {
        value = value ? Number(value) : null
      }
      
      // Normalizar tipo_pessoa: "Física" -> "F", "Jurídica" -> "J"
      if (header === 'tipo_pessoa') {
        if (value.toLowerCase().includes('física') || value.toLowerCase() === 'fisica' || value === 'F') {
          value = 'F'
        } else if (value.toLowerCase().includes('jurídica') || value.toLowerCase() === 'juridica' || value === 'J') {
          value = 'J'
        }
      }
      
      // Normalizar Sim/Não -> S/N
      if (['cliente', 'fornecedor', 'transportadora', 'colaborador', 'representante', 'ativo'].includes(header)) {
        if (value.toLowerCase() === 'sim' || value === 'S') {
          value = 'S'
        } else if (value.toLowerCase() === 'não' || value.toLowerCase() === 'nao' || value === 'N') {
          value = 'N'
        } else {
          value = value || 'N' // Padrão
        }
      }
      
      obj[header] = value
    })
    
    data.push(obj)
  }
  
  return data
}

const importarCSV = async () => {
  if (!arquivoCSV.value) {
    resultadoImportacao.show = true
    resultadoImportacao.type = 'error'
    resultadoImportacao.message = 'Selecione um arquivo CSV'
    return
  }
  
  importandoCSV.value = true
  resultadoImportacao.show = false
  
  try {
    // v-file-input retorna array ou objeto dependendo da versão
    const file = Array.isArray(arquivoCSV.value) ? arquivoCSV.value[0] : arquivoCSV.value
    
    if (!file) {
      resultadoImportacao.show = true
      resultadoImportacao.type = 'error'
      resultadoImportacao.message = 'Arquivo inválido'
      return
    }
    
    const text = await file.text()
    const pessoas = parseCSV(text)
    
    if (pessoas.length === 0) {
      resultadoImportacao.show = true
      resultadoImportacao.type = 'warning'
      resultadoImportacao.message = 'Nenhuma pessoa encontrada no arquivo'
      return
    }
    
    // Validar campos obrigatórios
    const pessoasValidas = pessoas.filter(p => 
      p.tipo_pessoa && p.nome_razao && p.apelido_fantasia
    )
    
    if (pessoasValidas.length === 0) {
      resultadoImportacao.show = true
      resultadoImportacao.type = 'error'
      resultadoImportacao.message = 'Nenhuma pessoa válida encontrada. Verifique os campos obrigatórios.'
      return
    }
    
    // Importar pessoas
    await pessoasStore.importarPessoasCSV(pessoasValidas)
    
    resultadoImportacao.show = true
    resultadoImportacao.type = 'success'
    resultadoImportacao.message = `${pessoasValidas.length} pessoa(s) importada(s) com sucesso!`
    
    // Recarregar lista
    await pessoasStore.buscarTodasPessoas()
    
    // Fechar após 2 segundos
    setTimeout(() => {
      fecharImportacao()
    }, 2000)
    
  } catch (error) {
    console.error('Erro ao importar CSV:', error)
    resultadoImportacao.show = true
    resultadoImportacao.type = 'error'
    resultadoImportacao.message = 'Erro ao processar arquivo CSV'
  } finally {
    importandoCSV.value = false
  }
}

watchEffect(() => {
  buscarPessoas()
})
</script>
