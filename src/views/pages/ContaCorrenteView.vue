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
                        v-model="formData.id_ccorrente"
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
              item-key="id_ccorrente"
              class="elevation-1 background-secondary"
            >
              <template v-slot:[`item.id_banco`]="{ item }">
                {{ getBancoNome(item.id_banco) }}
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

// Snackbar
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

// Headers da tabela
const headers = [
  { title: 'ID', key: 'id_ccorrente', sortable: true },
  { title: 'Número da Conta', key: 'id_ccorrente', sortable: true },
  { title: 'Dígito', key: 'digito_cc', sortable: true },
  { title: 'Titular', key: 'titular', sortable: true },
  { title: 'Banco', key: 'id_banco', sortable: true },

  { title: 'Limite', key: 'limite', sortable: true },
  { title: 'Venc. Limite', key: 'dtvenctolimite', sortable: true },
  { title: 'Abertura', key: 'dtabertura', sortable: true },
  { title: 'Cadastro', key: 'dhcadastro', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

// Dados do formulário
const formData = reactive({
  id_empresa: 1, // Será obtido do contexto/auth futuramente
  id_ccorrente: '',
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

const editarConta = (conta) => {
  editando.value = true
  Object.assign(formData, conta)
 
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
    id_ccorrente: '',
    digito_cc: '',
    titular: '', // Nome correto
    id_banco: '',
    limite: '0',
    dtabertura: '',
    dtvenctolimite: '', // Nome correto
    gerente: '',
    telefone: ''
  })
  
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

