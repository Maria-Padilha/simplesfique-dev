<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-bank-outline" class="mr-3"></v-icon>
          Contas Corrente
        </div>
      </v-card-title>
    </v-card>

    <!-- Lista de Contas -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <v-btn
          color="var(--text-color-laranja)"
          @click="toggleFormulario()"
          :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
          variant="flat"
          class="mb-3 ml-3 text-white"
          >
          {{ formularioAberto ? 'Cancelar' : 'Nova Conta' }}
        </v-btn>
        
        <!-- Formulário Expansível -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Conta' : 'Nova Conta' }}
              </v-card-title>
              
              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Número da Conta (Obrigatório) -->
                    <v-col cols="12" md="8">
                      <v-text-field
                        v-model="formData.numero_ccorrente"
                        label="Número da Conta *"
                        :rules="[rules.required, rules.number]"
                        type="number"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-credit-card-outline"
                      ></v-text-field>
                    </v-col>

                    <!-- Dígito CC (Obrigatório) -->
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="formData.digito_cc"
                        label="Dígito *"
                        :rules="[rules.required]"
                        maxlength="1"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-numeric"
                      ></v-text-field>
                    </v-col>

                    <!-- Titular (Obrigatório) -->
                    <v-col cols="12" md="12">
                      <v-text-field
                        v-model="formData.titular"
                        label="Titular *"
                        :rules="[rules.required]"
                        maxlength="60"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-account"
                      ></v-text-field>
                    </v-col>

                    <!-- Banco (Obrigatório) -->
                    <v-col cols="12" md="6">
                      <v-autocomplete
                        v-model="bancoSelecionado"
                        :items="financeiroStore.bancos"
                        item-title="descbanco"
                        item-value="id"
                        label="Banco *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-bank"
                        :loading="financeiroStore.loading"
                        hide-no-data
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-title>Nenhum banco encontrado</v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-autocomplete>
                    </v-col>

                                    <v-col cols="12" md="6" class="d-flex align-center">
                                      <v-combobox
                                        ref="agenciaRef"
                                        v-model="formData.id_agencia"
                                        :items="agenciasFiltradas"
                                        item-title="DISPLAY_NAME"
                                        item-value="ID"
                                        label="Agência *"
                                        :rules="[rules.required]"
                                        variant="outlined"
                                        density="compact"
                                        class="custom-text-field flex-grow-1"
                                        prepend-inner-icon="mdi-bank-transfer"
                                        :loading="financeiroStore.loading"
                                        :disabled="!formData.id_banco"
                                        @update:model-value="onAgenciaChange"
                                      >
                                        <template #append>
                                          <v-btn icon variant="text" @click="abrirModalAgencia" title="Cadastrar agência">
                                            <v-icon icon="mdi-magnify" />
                                          </v-btn>
                                        </template>
                                        <template v-slot:no-data>
                                          <v-list-item>
                                            <v-list-item-title>Nenhuma agência encontrada</v-list-item-title>
                                          </v-list-item>
                                        </template>
                                      </v-combobox>
                                    </v-col>


                    <!-- Limite (Obrigatório) -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.limite"
                        label="Limite *"
                        :rules="[rules.required, rules.decimal]"
                        type="number"
                        step="0.01"
                        min="0"
                        variant="outlined"
                        density="compact"
                        prefix="R$"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-cash"
                      ></v-text-field>
                    </v-col>

                    <!-- Data Abertura (Obrigatório) -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.dtabertura"
                        label="Data Abertura *"
                        :rules="[rules.required]"
                        type="date"
                        variant="outlined"
                        density="compact"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-calendar-plus"
                      ></v-text-field>
                    </v-col>

                    <!-- Data Vencimento do Limite (Opcional) -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.dtvenctolimite"
                        label="Data Vencimento do Limite"
                        type="date"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        prepend-inner-icon="mdi-calendar-clock"
                      ></v-text-field>
                    </v-col>

                    <!-- Gerente (Opcional) -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.gerente"
                        label="Gerente"
                        maxlength="60"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-account-tie"
                      ></v-text-field>
                    </v-col>

                    <!-- Telefone (Opcional) -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.telefone"
                        label="Telefone"
                        maxlength="15"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-phone"
                        v-mask-phone.br
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
                  :loading="financeiroStore.loading"
                  :disabled="!formValido"
                  @click="salvarConta"
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
              v-model="financeiroStore.search"
              label="Pesquisar Conta"
              width="480"
              append-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="mb-2 ml-3 custom-text-field ">
            </v-text-field>
            <v-data-table
              :headers="headers"
              :items="financeiroStore.contas"
              :loading="financeiroStore.loading"
              item-key="id"
              class="elevation-1 background-secondary"
            >
              <template v-slot:[`item.descbanco`]="{ item }">
                {{ item.descbanco || getBancoNome(item.id_banco) }}
              </template>
              
              <template v-slot:[`item.limite`]="{ item }">
                {{ formatarMoeda(item.limite) }}
              </template>
              
              <template v-slot:[`item.dtvenctolimite`]="{ item }">
                {{ item.dtvenctolimite ? formatarData(item.dtvenctolimite) : '-' }}
              </template>
              
              <template v-slot:[`item.dhinc`]="{ item }">
                {{ item.dhinc ? formatarDataHora(item.dhinc) : '-' }}
              </template>
              
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="primary"
                  variant="text"
                  @click="editarConta(item)"
                ></v-btn>
                <v-btn
                  icon
                  size="small"
                  color="secondary"
                  variant="text"
                  title="Gerenciar Usuários"
                  :loading="loadingUsuarios"
                  :disabled="loadingUsuarios"
                  @click="abrirModalUsuarios(item)"
                >
                  <v-icon icon="mdi-account-multiple" />
                </v-btn>
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
                  <v-icon icon="mdi-bank-off" size="64" class="mb-2 opacity-60" :color="themeStore.darkMode ? '#ffff' : ''"></v-icon>
                  <p class="text-body-1">Nenhuma conta cadastrada</p>
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
          Tem certeza que deseja excluir a conta "{{ contaParaExcluir?.titular }}"?
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
            :loading="financeiroStore.loading"
            @click="excluirConta"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para cadastrar agência -->
    <v-dialog v-model="openAgenciaModal" persistent max-width="600px">
      <v-card class="background-secondary">
        <v-card-title class="text-h6 pa-4">
          Cadastrar Agência
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-form>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="agenciaForm.id"
                  label="Número da Agência *"
                  type="text"
                  variant="outlined"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="custom-text-field"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  v-model="agenciaForm.digito_ag"
                  label="Dígito"
                  maxlength="1"
                  variant="outlined"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="custom-text-field"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="agenciaForm.descagencia"
                  label="Descrição *"
                  variant="outlined"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="custom-text-field"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="agenciaForm.id_uf"
                  :items="financeiroStore.ufs || []"
                  item-title="SIGLA"
                  item-value="SIGLA"
                  label="UF"
                  variant="outlined"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="custom-text-field"
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="agenciaForm.contato"
                  label="Contato"
                  variant="outlined"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="custom-text-field"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="agenciaForm.telefone"
                  label="Telefone"
                  variant="outlined"
                  density="compact"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  class="custom-text-field"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="fecharModalAgencia">
            Cancelar
          </v-btn>
          <v-btn 
            color="var(--text-color-laranja)" 
            :loading="financeiroStore.loading" 
            @click="salvarAgencia" 
            variant="flat" 
            class="text-white"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Modal de Gerenciamento de Usuários -->
    <v-dialog v-model="openUsuariosModal" persistent max-width="900px">
      <v-card class="background-secondary">
        <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-multiple" class="mr-3"></v-icon>
            Gerenciar Usuários - Conta {{ contaParaUsuarios?.numero_ccorrente || contaParaUsuarios?.id || contaParaUsuarios?.ID }}
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="openUsuariosModal = false"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <!-- Loading interno enquanto carrega dados -->
          <div v-if="loadingUsuarios" class="text-center pa-8">
            <v-progress-circular
              indeterminate
              color="var(--text-color-laranja)"
              size="48"
              class="mb-4"
            ></v-progress-circular>
            <p class="text-body-1">Carregando usuários...</p>
          </div>

          <!-- Tabela de usuários -->
          <div v-else>
            <v-alert
              v-if="usuariosList.length === 0"
              type="info"
              variant="tonal"
              class="mb-4"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-information"></v-icon>
              </template>
              Nenhum usuário vinculado a esta conta encontrado.
            </v-alert>

            <v-data-table
              v-else
              :headers="headersUsuarios"
              :items="usuariosList"
              item-key="ID"
              class="elevation-1 background-secondary"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
            >
              <template v-slot:[`item.nome`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" class="mr-3" :color="themeStore.darkMode ? 'grey-darken-3' : 'grey-lighten-2'">
                    <v-icon icon="mdi-account" :color="themeStore.darkMode ? 'grey-lighten-1' : 'grey-darken-2'"></v-icon>
                  </v-avatar>
                  <span>{{ item.nome || `Usuário ${item.ID}` }}</span>
                </div>
              </template>
              
              <template v-slot:[`item.email`]="{ item }">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-email" size="16" class="mr-2 opacity-60"></v-icon>
                  {{ item.email || '-' }}
                </div>
              </template>
              
              <template v-slot:[`item.ativo`]="{ item }">
                <v-chip 
                  size="small" 
                  :color="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'success' : 'default'" 
                  :variant="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'flat' : 'outlined'"
                >
                  <v-icon 
                    :icon="(item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'mdi-check-circle' : 'mdi-close-circle'" 
                    size="16" 
                    class="mr-1"
                  ></v-icon>
                  {{ (item.ativo === 'S' || item.ativo === 's' || item.ativo === true) ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </template>
              
              <template v-slot:[`item.permissao`]="{ item }">
                <v-checkbox
                  v-model="userAccessMap[String(item.ID)]"
                  density="compact"
                  hide-details
                  color="var(--text-color-laranja)"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                ></v-checkbox>
              </template>
              
              <template v-slot:no-data>
                <div class="pa-8 text-center">
                  <v-icon icon="mdi-account-off" size="64" class="mb-4 opacity-60" :color="themeStore.darkMode ? '#fff' : '#666'"></v-icon>
                  <p class="text-body-1 mb-2">Nenhum usuário disponível</p>
                  <p class="text-body-2 opacity-60">Não há usuários vinculados a esta conta.</p>
                </div>
              </template>
            </v-data-table>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="text" 
            @click="openUsuariosModal = false"
            :disabled="loadingUsuarios"
          >
            Cancelar
          </v-btn>
          <v-btn 
            color="var(--text-color-laranja)" 
            :loading="financeiroStore.loading" 
            :disabled="loadingUsuarios || usuariosList.length === 0"
            @click="salvarUsuariosAcesso" 
            variant="flat" 
            class="text-white"
          >
            <v-icon icon="mdi-content-save" class="mr-2"></v-icon>
            Salvar Permissões
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useThemeStore } from '@/stores/config-temas/theme'
// BuscaPadraoMenu removed for agency inline autocomplete; keep modal for cadastrar

const themeStore = useThemeStore();

// Store
const financeiroStore = useFinanceiroStore()

// Refs
const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const dialogExclusao = ref(false)
const contaParaExcluir = ref(null)
// refs for agency modal/select
const agenciaRef = ref(null)
const openAgenciaModal = ref(false)
// banco selecionado (objeto) to improve typing UX
const bancoSelecionado = ref(null)

// form for creating agency in modal
const agenciaForm = reactive({
  id: '',
  digito_ag: '',
  descagencia: '',
  id_banco: '',
  id_uf: '',
  contato: '',
  telefone: ''
})

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Headers da tabela (usar chaves retornadas pela API THorse)
const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Número da Conta', key: 'numero_ccorrente', sortable: true },
  { title: 'Dígito', key: 'digito_cc', sortable: true },
  { title: 'Titular', key: 'titular', sortable: true },
  { title: 'Banco', key: 'descbanco', sortable: true },
  { title: 'Limite', key: 'limite', sortable: true },
  { title: 'Venc. Limite', key: 'dtvenctolimite', sortable: true },
  { title: 'Abertura', key: 'dtabertura', sortable: true },
  { title: 'Cadastro', key: 'dhinc', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Headers do modal de usuários
const headersUsuarios = [
  { title: 'ID', key: 'ID', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Status', key: 'ativo', sortable: true },
  { title: 'Permissão', key: 'permissao', sortable: false }
]

// Dados do formulário
const formData = reactive({
  id_empresa: 1, // Será obtido do contexto/auth futuramente
  numero_ccorrente: '',
  digito_cc: '',
  titular: '', // Nome correto do campo titular
  id_banco: '',

  limite: '0',
  dtabertura: '',
  dtvenctolimite: '', // Nome correto do campo vencimento do limite
  gerente: '',
  telefone: ''
})

// Regras de validação
const rules = {
  required: (value) => !!value || 'Campo obrigatório',
  number: (value) => /^\d+$/.test(value) || 'Deve ser um número válido',
  decimal: (value) => /^\d+(\.\d{1,2})?$/.test(value) || 'Deve ser um valor decimal válido',
}

// Computed: agencias filtradas pelo banco selecionado
const agenciasFiltradas = computed(() => {
  if (!formData.id_banco || !financeiroStore) return []
  
  const list = Array.isArray(financeiroStore.agencias) ? financeiroStore.agencias : []
  return list
    .filter(a => {
      if (!a) return false
      const bankId = a.ID_BANCO ?? a.id_banco ?? a.IDBANCO ?? a.idBanco ?? a.ID
      return String(bankId) === String(formData.id_banco)
    })
    .map(a => {
      const id = a.ID ?? a.id ?? a.id_agencia ?? a.ID_AGENCIA ?? ''
      const desc = a.DESCAGENCIA ?? a.descagencia ?? a.DESCRICAO ?? a.descricao ?? ''
      const dig = a.DIGITO_AG ?? a.digito_ag ?? a.digito ?? ''
      const display = desc ? `${desc} — ${id}${dig ? '-' + dig : ''}` : `${id}${dig ? '-' + dig : ''}`
      return { ...a, DISPLAY_NAME: display, ID: id }
    })
})



// Métodos
const toggleFormulario = () => {
  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    abrirFormulario()
  }
}

// Quando o banco for alterado, resetar agência e focar no select de agência
const onBancoChange = async (val) => {
  // val can be object (selected item) or primitive id
  let id = val
  if (val && typeof val === 'object') {
    id = val.ID ?? val.id ?? val.ID_BANCO ?? ''
  }
  formData.id_banco = id || ''
  formData.id_agencia = ''
  agenciaForm.id_banco = id || ''
  // abrir/ativar o select de agencias e focar
  await nextTick()
  if (id) {
    agenciaRef.value?.focus && agenciaRef.value.focus()
  }
}

// watch bancoSelecionado (autocomplete) to react to user selection/typing
watch(bancoSelecionado, (val) => {
  onBancoChange(val)
})

const onAgenciaChange = (val) => {
  formData.id_agencia = val
}

const abrirModalAgencia = () => {
  // preenche o banco selecionado caso exista
  agenciaForm.id_banco = formData.id_banco || ''
  agenciaForm.id = ''
  agenciaForm.digito_ag = ''
  agenciaForm.descagencia = ''
  agenciaForm.id_uf = ''
  agenciaForm.contato = ''
  agenciaForm.telefone = ''
  openAgenciaModal.value = true
}

const fecharModalAgencia = () => {
  openAgenciaModal.value = false
}

// === Modal de Controle de Usuários (Acesso a Contas) ===
const openUsuariosModal = ref(false)
const contaParaUsuarios = ref(null)
const usuariosList = ref([]) // será carregado se houver endpoint
const userAccessMap = reactive({}) // { [userId]: boolean }
const loadingUsuarios = ref(false) // Loading state para o modal

// Nota: não usamos mais o endpoint /usuario para listar usuários do gerenciador.
// A lista agora vem exclusivamente de /ccorrenteusu/:id via `buscarUsuariosPorConta`.

const abrirModalUsuarios = async (conta) => {
  try {
    // Iniciar loading
    loadingUsuarios.value = true
    contaParaUsuarios.value = conta
    const contaId = conta?.id ?? conta?.ID

    // Limpar dados anteriores
    usuariosList.value = []
    Object.keys(userAccessMap).forEach(key => delete userAccessMap[key])

    // Buscar usuários vinculados ANTES de abrir o modal
    const vinculados = await financeiroStore.buscarUsuariosPorConta(contaId)
    
    // Se os dados vêm em uma estrutura diferente, vamos normalizar
    let dadosNormalizados = vinculados
    if (vinculados && vinculados.data && Array.isArray(vinculados.data)) {
      dadosNormalizados = vinculados.data
    } else if (vinculados && !Array.isArray(vinculados) && typeof vinculados === 'object') {
      dadosNormalizados = [vinculados]
    }
    
    if (Array.isArray(dadosNormalizados) && dadosNormalizados.length > 0) {
      usuariosList.value = dadosNormalizados.map(v => ({
        ID: v.data.id ?? v.ID ?? v.id_usuario ?? '',
        nome: v.data.nome ?? v.NOME ?? '',
        email: v.data.email ?? v.EMAIL ?? '',
        ativo: v.data.ativo ?? v.ATIVO ?? 'S'
      }))

      // Inicializar permissões
      usuariosList.value.forEach(usuario => {
        if (usuario.ID) {
          const isActive = usuario.ativo === 'S' || usuario.ativo === 's' || usuario.ativo === true
          userAccessMap[String(usuario.ID)] = isActive
        }
      })
    } else {
      usuariosList.value = []
    }

    // Finalizar loading e abrir modal APENAS após carregar os dados
    loadingUsuarios.value = false
    openUsuariosModal.value = true
    
  } catch (error) {
    loadingUsuarios.value = false
    mostrarSnackbar('Erro ao carregar usuários: ' + error.message, 'error')
  }
}

const salvarUsuariosAcesso = async () => {
  try {
    const contaId = contaParaUsuarios.value?.id ?? contaParaUsuarios.value?.ID
    
    if (!contaId) {
      mostrarSnackbar('ID da conta não encontrado', 'error')
      return
    }

    const usersPayload = usuariosList.value
      .filter(u => u.ID)
      .map(u => ({
        id: u.ID,
        acesso: !!userAccessMap[String(u.ID)]
      }))

    const payload = {
      contaId,
      users: usersPayload
    }

    await financeiroStore.atualizarAcessoConta(payload)
    
    mostrarSnackbar('Permissões atualizadas com sucesso!', 'success')
    openUsuariosModal.value = false
    
    // Limpar dados do modal
    usuariosList.value = []
    Object.keys(userAccessMap).forEach(key => delete userAccessMap[key])
    contaParaUsuarios.value = null
    
  } catch (error) {
    mostrarSnackbar('Erro ao salvar permissões: ' + error.message, 'error')
  }
}

const salvarAgencia = async () => {
  if (!agenciaForm.id || !agenciaForm.descagencia || !agenciaForm.id_banco) {
    mostrarSnackbar('Preencha ID, descrição e o banco da agência', 'error')
    return
  }
  
  try {
    const payload = {
      id: agenciaForm.id,
      digito_ag: agenciaForm.digito_ag,
      descagencia: agenciaForm.descagencia,
      id_banco: agenciaForm.id_banco,
      id_uf: agenciaForm.id_uf,
      contato: agenciaForm.contato,
      telefone: agenciaForm.telefone
    }
    
    await financeiroStore.criarAgencia(payload)
    await financeiroStore.buscarAgencias()
    
    formData.id_agencia = agenciaForm.id
    mostrarSnackbar('Agência criada com sucesso', 'success')
    fecharModalAgencia()
  } catch (error) {
    mostrarSnackbar('Erro ao criar agência: ' + error.message, 'error')
  }
}

const abrirFormulario = () => {
  editando.value = false
  resetarForm()
  formularioAberto.value = true
}

const editarConta = async (conta) => {
  editando.value = true
  // Copiar os campos do registro para o formData
  Object.assign(formData, conta)

  // Formatar data para input datetime-local
  if (formData.dtabertura) {
    formData.dtabertura = new Date(formData.dtabertura).toISOString().slice(0, 16)
  }

  // Normalizar possíveis objetos de id que venham no objeto 'conta'
  formData.id_banco = normalizeId(formData.id_banco)
  formData.id_agencia = normalizeId(formData.id_agencia)

  // Buscar dados completos do banco e agência pelo ID para preencher lacunas
  try {
    // Buscar banco por ID e popular bancoSelecionado
    if (formData.id_banco) {
      const bancoResp = await financeiroStore.buscarBancoPorId(formData.id_banco)
      // Normalizar possíveis formatos retornados pelo store
      const bancoObj = bancoResp && bancoResp.data && Array.isArray(bancoResp.data) ? bancoResp.data[0] : (Array.isArray(bancoResp) ? bancoResp[0] : bancoResp)

      // Preferir o item já presente no cache (tem os campos usados pelo autocomplete)
      let bancoCached = null
      const bancoIdStr = String(bancoObj?.ID ?? bancoObj?.id ?? bancoObj?.ID_BANCO ?? bancoObj?.id_banco ?? formData.id_banco)
      if (Array.isArray(financeiroStore.bancos)) {
        bancoCached = financeiroStore.bancos.find(b => String(b.ID) === bancoIdStr || String(b.id) === bancoIdStr)
      }

      if (bancoCached) {
        bancoSelecionado.value = bancoCached
      } else if (bancoObj) {
        // Normalizar para a shape esperada pelo v-autocomplete (ID, DESCBANCO)
        const normalized = {
          ID: bancoObj.ID ?? bancoObj.id ?? bancoObj.ID_BANCO ?? bancoObj.id_banco,
          DESCBANCO: bancoObj.DESCBANCO ?? bancoObj.descbanco ?? bancoObj.DESCRICAO ?? bancoObj.DESCR
        }
        bancoSelecionado.value = normalized
      } else {
        bancoSelecionado.value = financeiroStore.bancos.find(b => String(b.ID) === String(formData.id_banco)) || null
      }
    }

    // Buscar agência por ID (rota agora exige id_banco) e garantir que esteja na lista de agencias para o combobox
    if (formData.id_agencia) {
      const agenciaResp = await financeiroStore.buscarAgenciaPorId(formData.id_banco, formData.id_agencia)
      const agenciaObj = agenciaResp && agenciaResp.data && Array.isArray(agenciaResp.data) ? agenciaResp.data[0] : (Array.isArray(agenciaResp) ? agenciaResp[0] : agenciaResp)
      if (agenciaObj) {
        // Se a agência não estiver no store.agencias, adicioná-la ao cache local
        const exists = Array.isArray(financeiroStore.agencias) && financeiroStore.agencias.some(a => String(a.ID ?? a.id ?? a.id_agencia) === String(agenciaObj.ID ?? agenciaObj.id ?? agenciaObj.id_agencia))
        if (!exists) {
          // Evita recarregar toda a lista via /agencia — inserimos o item específico no cache
          financeiroStore.agencias = Array.isArray(financeiroStore.agencias)
            ? [...financeiroStore.agencias, agenciaObj]
            : [agenciaObj]
        }
        // Garantir que o formData tenha apenas o id primitivo
        formData.id_agencia = agenciaObj.ID ?? agenciaObj.id ?? agenciaObj.id_agencia ?? formData.id_agencia
      }
    }
  } catch (e) {
    // Não bloquear edição se as buscas falharem — usar o que já temos
  }

  formularioAberto.value = true
}

// Normaliza possíveis objetos de id para primitives (ID, id, etc.)
const normalizeId = (val) => {
  if (val === null || val === undefined) return val
  if (typeof val === 'object') return val.ID ?? val.id ?? val.id_agencia ?? val.ID_AGENCIA ?? ''
  return val
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(formData, {
    id_empresa: 1,
    id: '',
    numero_ccorrente: '',
    digito_cc: '',
    titular: '', // Nome correto
    id_banco: '',
    limite: '0',
    dtabertura: '',
    dtvenctolimite: '', // Nome correto
    gerente: '',
    telefone: ''
  })
  bancoSelecionado.value = null
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const salvarConta = async () => {
  try {
    // Criar uma cópia para normalizar IDs antes de enviar
    const payload = { ...formData }
    // Normalizar id_banco e id_agencia caso estejam como objetos
    payload.id_banco = normalizeId(payload.id_banco)
    payload.id_agencia = normalizeId(payload.id_agencia)

    if (editando.value) {
      const recordId = payload.id ?? payload.id_ccorrente ?? payload.numero_ccorrente
      await financeiroStore.atualizarConta(recordId, payload)
      mostrarSnackbar('Conta atualizada com sucesso!', 'success')
    } else {
      await financeiroStore.criarConta(payload)
      mostrarSnackbar('Conta criada com sucesso!', 'success')
    }
    cancelarFormulario()
  } catch (error) {
    mostrarSnackbar('Erro ao salvar conta: ' + error.message, 'error')
  }
}

const confirmarExclusao = (conta) => {
  contaParaExcluir.value = conta
  dialogExclusao.value = true
}

const excluirConta = async () => {
  try {
  await financeiroStore.deletarConta(contaParaExcluir.value.id)
    mostrarSnackbar('Conta excluída com sucesso!', 'success')
    dialogExclusao.value = false
    contaParaExcluir.value = null
  } catch (error) {
    mostrarSnackbar('Erro ao excluir conta: ' + error.message, 'error')
  }
}

const mostrarSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// Formatadores
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0)
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const formatarDataHora = (data) => {
  return new Date(data).toLocaleString('pt-BR')
}

// Métodos para obter nomes do banco e agência
const getBancoNome = (idBanco) => {
  const banco = financeiroStore.bancos.find(b => String(b.ID) === String(idBanco) || String(b.id) === String(idBanco))
  if (!banco) return `ID: ${idBanco}`
  return banco.DESCBANCO ?? banco.descbanco ?? banco.DESCRICAO ?? banco.DESCR ?? `ID: ${idBanco}`
}

// Lifecycle
onMounted(async () => {
  try {
    // Carregar dados em paralelo para melhor performance
    await Promise.all([
      financeiroStore.buscarContas(),
      financeiroStore.buscarBancos(),
      financeiroStore.buscarUFs()
    ])
  } catch (error) {
    mostrarSnackbar('Erro ao carregar dados: ' + error.message, 'error')
  }
})
</script>

