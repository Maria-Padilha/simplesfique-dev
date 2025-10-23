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
                        v-model="formData.numero_conta"
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
                        v-model="formData.titulas"
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
                      <v-combobox
                        v-model="formData.id_banco"
                        :items="financeiroStore.bancos"
                        item-title="DESCBANCO"
                        item-value="ID"
                        label="Banco *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-bank"
                        :loading="financeiroStore.loading"
                        @update:model-value="onBancoChange"
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-title>Nenhum banco encontrado</v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </v-col>

                    <!-- Agência (Obrigatório) -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="agenciaSelecionada?.nome || ''"
                        label="Agência *"
                        :rules="[rules.agenciaRequired]"
                        variant="outlined"
                        density="compact"
                        class="custom-text-field"
                        prepend-inner-icon="mdi-office-building"
                        readonly
                        :disabled="!formData.id_banco"
                        :placeholder="!formData.id_banco ? 'Selecione um banco primeiro' : 'Clique na lupa para buscar'"
                      >
                        <template v-slot:append-inner>
                          <BuscaPadraoMenu
                            v-model="menuAgencia"
                            v-model:model-input="buscaAgencia"
                            :pesquisar="pesquisarAgencia"
                            :resultados="resultadosAgencia"
                            :cadastrar-btn="true"
                            :modal-cadastrar="abrirModalAgencia"
                            @selecionar="selecionarAgencia"
                          >
                            <template #resultados="{ selecionar }">
                              <div class="flex flex-col gap-2">
                                <div
                                  v-for="agencia in resultadosAgencia"
                                  :key="agencia.id_agencia"
                                  @click="selecionar(agencia)"
                                  class="cursor-pointer p-2 hover:bg-gray-100 rounded"
                                >
                                  <p class="font-medium">{{ agencia.nome }}</p>
                                  <p class="text-sm opacity-70">ID: {{ agencia.id_agencia }}</p>
                                </div>
                              </div>
                            </template>
                          </BuscaPadraoMenu>
                        </template>
                      </v-text-field>
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
              append-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              class="mb-2 ml-3 custom-text-field w-50">
            </v-text-field>
            <v-data-table
              :headers="headers"
              :items="financeiroStore.contas"
              :loading="financeiroStore.loading"
              item-key="id_ccorrente"
              class="elevation-1 background-secondary"
            >
              <template v-slot:[`item.id_banco`]="{ item }">
                {{ getBancoNome(item.id_banco) }}
              </template>
              
              <template v-slot:[`item.id_agencia`]="{ item }">
                {{ getAgenciaNome(item.id_agencia) }}
              </template>
              
              <template v-slot:[`item.limite`]="{ item }">
                {{ formatarMoeda(item.limite) }}
              </template>
              
              <template v-slot:[`item.dtvenctolimite`]="{ item }">
                {{ item.dtvenctolimite ? formatarData(item.dtvenctolimite) : '-' }}
              </template>
              
              <template v-slot:[`item.dtcadastro`]="{ item }">
                {{ formatarDataHora(item.dtcadastro) }}
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
          Tem certeza que deseja excluir a conta "{{ contaParaExcluir?.titulas }}"?
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

    <!-- Modal de Cadastro de Agência -->
    <v-dialog v-model="modalAgencia" max-width="600px" persistent>
      <v-card class="background-secondary">
        <v-card-title class="text-h6 pa-4">
          <v-icon icon="mdi-office-building-plus" class="mr-2"></v-icon>
          Nova Agência
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-form ref="formAgenciaRef" v-model="formAgenciaValido">
            <v-row>
              <!-- Número da Agência (ID) e Dígito na mesma linha -->
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="formAgencia.id"
                  label="Número da Agência *"
                  :rules="[rules.required, rules.number]"
                  type="number"
                  variant="outlined"
                  density="compact"
                  class="custom-text-field"
                  prepend-inner-icon="mdi-numeric"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formAgencia.digito_ag"
                  label="Dígito *"
                  :rules="[rules.required]"
                  maxlength="5"
                  variant="outlined"
                  density="compact"
                  class="custom-text-field"
                  prepend-inner-icon="mdi-numeric"
                ></v-text-field>
              </v-col>

              <!-- Nome da Agência (Descrição) -->
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="formAgencia.descagencia"
                  label="Nome da Agência *"
                  :rules="[rules.required]"
                  maxlength="100"
                  variant="outlined"
                  density="compact"
                  class="custom-text-field"
                  prepend-inner-icon="mdi-office-building"
                ></v-text-field>
              </v-col>

              <!-- UF (Obrigatório) -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formAgencia.id_uf"
                  :items="financeiroStore.ufs"
                  item-title="DESCUF"
                  item-value="ID"
                  label="UF *"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="compact"
                  class="custom-text-field"
                  prepend-inner-icon="mdi-map-marker"
                  :loading="financeiroStore.loading"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <v-list-item-title>{{ item.raw.SIGLA }} - {{ item.raw.DESCUF }}</v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    {{ item.raw.SIGLA }} - {{ item.raw.DESCUF }}
                  </template>
                  <template v-slot:no-data>
                    <v-list-item>
                      <v-list-item-title>Nenhuma UF encontrada</v-list-item-title>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <!-- Contato (Opcional) -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formAgencia.contato"
                  label="Contato"
                  maxlength="60"
                  variant="outlined"
                  density="compact"
                  class="custom-text-field"
                  prepend-inner-icon="mdi-account"
                ></v-text-field>
              </v-col>

              <!-- Telefone (Opcional) -->
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="formAgencia.telefone"
                  label="Telefone"
                  maxlength="15"
                  variant="outlined"
                  density="compact"
                  class="custom-text-field"
                  prepend-inner-icon="mdi-phone"
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
            @click="cancelarAgencia"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="var(--text-color-laranja)"
            :loading="financeiroStore.loading"
            :disabled="!formAgenciaValido"
            @click="salvarAgencia"
            variant="flat"
            class="text-white"
          >
            Salvar
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
import { ref, reactive, onMounted } from 'vue'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import { useThemeStore } from '@/stores/config-temas/theme'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'

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

// Refs para busca de agência
const menuAgencia = ref(false)
const buscaAgencia = ref('')
const resultadosAgencia = ref([])
const agenciaSelecionada = ref(null)

// Modal de cadastro de agência
const modalAgencia = ref(false)
const formAgencia = reactive({
  id: '',           // Número da agência
  id_empresa: 1,    // Será obtido do contexto/auth futuramente
  digito_ag: '',
  descagencia: '',
  id_banco: '',
  id_uf: '',
  contato: '',
  telefone: ''
})
const formAgenciaValido = ref(false)
const formAgenciaRef = ref(null)

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id_ccorrente', sortable: true },
  { title: 'Número da Conta', key: 'numero_conta', sortable: true },
  { title: 'Dígito', key: 'digito_cc', sortable: true },
  { title: 'Titular', key: 'titulas', sortable: true },
  { title: 'Banco', key: 'id_banco', sortable: true },
  { title: 'Agência', key: 'id_agencia', sortable: true },
  { title: 'Limite', key: 'limite', sortable: true },
  { title: 'Venc. Limite', key: 'dtvenctolimite', sortable: true },
  { title: 'Abertura', key: 'dtabertura', sortable: true },
  { title: 'Cadastro', key: 'dhcadastro', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Dados do formulário
const formData = reactive({
  id_empresa: 1, // Será obtido do contexto/auth futuramente
  numero_conta: '',
  digito_cc: '',
  titulas: '', // Nome correto do campo titular
  id_banco: '',
  id_agencia: '',
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
  agenciaRequired: (value) => {
    if (!formData.id_banco) return 'Selecione um banco primeiro'
    return !!value || 'Campo obrigatório'
  }
}



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

// Método chamado quando o banco é alterado
const onBancoChange = () => {
  // Limpar a agência selecionada quando o banco mudar
  formData.id_agencia = ''
  agenciaSelecionada.value = null
  resultadosAgencia.value = []
  buscaAgencia.value = ''
}

// Métodos para busca de agência
const pesquisarAgencia = () => {
  if (!formData.id_banco) {
    resultadosAgencia.value = []
    return
  }

  if (!buscaAgencia.value || buscaAgencia.value.length < 2) {
    resultadosAgencia.value = []
    return
  }

  // Filtrar agências pelo banco selecionado e pelo termo de busca
  const termo = buscaAgencia.value.toLowerCase()
  resultadosAgencia.value = financeiroStore.agencias.filter(agencia => 
    agencia.id_banco === formData.id_banco &&
    (agencia.nome?.toLowerCase().includes(termo) ||
     agencia.id_agencia?.toString().includes(termo))
  )
}

const selecionarAgencia = (agencia) => {
  agenciaSelecionada.value = agencia
  formData.id_agencia = agencia.id_agencia
  buscaAgencia.value = ''
  resultadosAgencia.value = []
}

// Modal de cadastro de agência
const abrirModalAgencia = () => {
  if (!formData.id_banco) {
    mostrarSnackbar('Selecione um banco primeiro', 'warning')
    return
  }
  resetarFormAgencia()
  modalAgencia.value = true
}





const editarConta = (conta) => {
  editando.value = true
  Object.assign(formData, conta)
  
  // Buscar e definir a agência selecionada
  if (conta.id_agencia) {
    agenciaSelecionada.value = financeiroStore.agencias.find(a => a.id_agencia === conta.id_agencia) || null
  }
  
  // Formatar data para input datetime-local
  if (formData.dtabertura) {
    formData.dtabertura = new Date(formData.dtabertura).toISOString().slice(0, 16)
  }
  formularioAberto.value = true
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(formData, {
    id_empresa: 1,
    numero_conta: '',
    digito_cc: '',
    titulas: '', // Nome correto
    id_banco: '',
    id_agencia: '',
    limite: '0',
    dtabertura: '',
    dtvenctolimite: '', // Nome correto
    gerente: '',
    telefone: ''
  })
  
  // Limpar dados da agência
  agenciaSelecionada.value = null
  resultadosAgencia.value = []
  buscaAgencia.value = ''
  
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const salvarConta = async () => {
  try {
    if (editando.value) {
      await financeiroStore.atualizarConta(formData.id_ccorrente, formData)
      mostrarSnackbar('Conta atualizada com sucesso!', 'success')
    } else {
      await financeiroStore.criarConta(formData)
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
    await financeiroStore.deletarConta(contaParaExcluir.value.id_ccorrente)
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
  const banco = financeiroStore.bancos.find(b => b.ID === idBanco)
  return banco ? banco.DESCBANCO : `ID: ${idBanco}`
}

const getAgenciaNome = (idAgencia) => {
  const agencia = financeiroStore.agencias.find(a => a.id_agencia === idAgencia)
  return agencia ? agencia.nome : `ID: ${idAgencia}`
}

// Métodos do modal de agência
const salvarAgencia = async () => {
  if (!formAgenciaRef.value?.validate()) return
  
  try {
    // Preparar dados para envio - o número da agência vai como 'id'
    const novaAgencia = {
      id: formAgencia.id,           // Número da agência
      digito_ag: formAgencia.digito_ag,
      descagencia: formAgencia.descagencia,
      id_banco: typeof formData.id_banco === 'object' ? formData.id_banco.ID : formData.id_banco,  // Garantir que seja apenas o ID
      id_uf: formAgencia.id_uf,
      contato: formAgencia.contato,
      telefone: formAgencia.telefone,
      id_empresa: 1 // Ajustar conforme necessário
    }
    
    console.log('Dados da agência antes do envio:', novaAgencia); // Debug
    
    await financeiroStore.criarAgencia(novaAgencia)
    await financeiroStore.buscarAgencias() // Recarregar lista de agências
    
    // Selecionar a nova agência automaticamente no formulário principal
    agenciaSelecionada.value = novaAgencia
    formData.id_agencia = novaAgencia.id
    
    mostrarSnackbar('Agência cadastrada com sucesso!', 'success')
    cancelarAgencia()
  } catch (error) {
    mostrarSnackbar('Erro ao cadastrar agência: ' + error.message, 'error')
  }
}

const cancelarAgencia = () => {
  modalAgencia.value = false
  resetarFormAgencia()
}

const resetarFormAgencia = () => {
  Object.assign(formAgencia, {
    id: '',
    id_empresa: 1,
    digito_ag: '',
    descagencia: '',
    id_banco: '',
    id_uf: '',
    contato: '',
    telefone: ''
  })
  
  if (formAgenciaRef.value) {
    formAgenciaRef.value.resetValidation()
  }
}

// Lifecycle
onMounted(async () => {
  try {
    // Carregar dados em paralelo para melhor performance
    await Promise.all([
      financeiroStore.buscarContas(),
      financeiroStore.buscarBancos(),
      financeiroStore.buscarAgencias(),
      financeiroStore.buscarUFs()
    ])
  } catch (error) {
    mostrarSnackbar('Erro ao carregar dados: ' + error.message, 'error')
  }
})
</script>

