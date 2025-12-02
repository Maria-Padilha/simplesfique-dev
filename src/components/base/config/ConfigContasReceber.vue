<template>
  <div class="contas-receber-config">
    <div class="section-header">
      <h3 class="text-xl font-semibold mb-2">Configurações - Contas a Receber</h3>
      <p class="text-sm opacity-70 mb-6">Defina as configurações para o módulo de contas a receber</p>
    </div>

    <v-form ref="formRef" v-model="formValid">
      <v-row>
        <!-- Numeração Automática -->
        <v-col cols="12" md="6">
          <v-switch
            v-model="config.numeracao_automatica"
            label="Numeração Automática de Títulos"
            color="var(--text-color-laranja)"
            hide-details
          ></v-switch>
        </v-col>

        <!-- Calcular Juros Automaticamente -->
        <v-col cols="12" md="6">
          <v-switch
            v-model="config.calcular_juros_auto"
            label="Calcular Juros Automaticamente"
            color="var(--text-color-laranja)"
            hide-details
          ></v-switch>
        </v-col>

        <!-- Taxa de Juros Padrão -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="config.taxa_juros_padrao"
            label="Taxa de Juros Padrão (%)"
            type="number"
            variant="outlined"
            density="compact"
            step="0.01"
            min="0"
            max="100"
            suffix="%"
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <!-- Taxa de Multa Padrão -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="config.taxa_multa_padrao"
            label="Taxa de Multa Padrão (%)"
            type="number"
            variant="outlined"
            density="compact"
            step="0.01"
            min="0"
            max="100"
            suffix="%"
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <!-- Dias Carência -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="config.dias_carencia"
            label="Dias de Carência"
            type="number"
            variant="outlined"
            density="compact"
            min="0"
            max="90"
            hide-details="auto"
          ></v-text-field>
        </v-col>

        <!-- Forma de Pagamento Padrão -->
        <v-col cols="12" md="6">
          <v-select
            v-model="config.forma_pagamento_padrao"
            :items="formasPagamento"
            item-title="descricao"
            item-value="id"
            label="Forma de Pagamento Padrão"
            variant="outlined"
            density="compact"
            hide-details="auto"
          ></v-select>
        </v-col>

        <!-- Conta Corrente Padrão -->
        <v-col cols="12" md="6">
          <v-select
            v-model="config.conta_corrente_padrao"
            :items="contasCorrentes"
            item-title="descricao"
            item-value="id"
            label="Conta Corrente Padrão"
            variant="outlined"
            density="compact"
            hide-details="auto"
          ></v-select>
        </v-col>

        <!-- Permitir Desconto -->
        <v-col cols="12" md="6">
          <v-switch
            v-model="config.permitir_desconto"
            label="Permitir Aplicação de Descontos"
            color="var(--text-color-laranja)"
            hide-details
          ></v-switch>
        </v-col>

        <!-- Gerar Boleto Automaticamente -->
        <v-col cols="12" md="6">
          <v-switch
            v-model="config.gerar_boleto_auto"
            label="Gerar Boleto Automaticamente"
            color="var(--text-color-laranja)"
            hide-details
          ></v-switch>
        </v-col>

        <!-- Observações -->
        <v-col cols="12">
          <v-textarea
            v-model="config.observacoes_padrao"
            label="Observações Padrão"
            variant="outlined"
            density="compact"
            rows="3"
            hide-details="auto"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>

    <!-- Botões de Ação -->
    <div class="action-buttons mt-6">
      <v-btn
        color="var(--text-color-laranja)"
        variant="flat"
        @click="salvarConfiguracoes"
        :loading="loading"
        class="text-white"
      >
        <v-icon class="mr-2">mdi-content-save</v-icon>
        Salvar Configurações
      </v-btn>
      
      <v-btn
        variant="outlined"
        @click="resetarConfiguracoes"
        class="ml-3"
      >
        <v-icon class="mr-2">mdi-refresh</v-icon>
        Resetar
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)

// Dados de configuração
const config = reactive({
  numeracao_automatica: true,
  calcular_juros_auto: false,
  taxa_juros_padrao: 2.0,
  taxa_multa_padrao: 2.0,
  dias_carencia: 5,
  forma_pagamento_padrao: null,
  conta_corrente_padrao: null,
  permitir_desconto: true,
  gerar_boleto_auto: false,
  observacoes_padrao: ''
})

// Dados mock para os selects
const formasPagamento = ref([
  { id: 1, descricao: 'Dinheiro' },
  { id: 2, descricao: 'Cartão de Crédito' },
  { id: 3, descricao: 'Cartão de Débito' },
  { id: 4, descricao: 'PIX' },
  { id: 5, descricao: 'Boleto' },
  { id: 6, descricao: 'Transferência' }
])

const contasCorrentes = ref([
  { id: 1, descricao: 'Conta Corrente Principal' },
  { id: 2, descricao: 'Conta Poupança' },
  { id: 3, descricao: 'Conta Recebimentos' }
])

// Métodos
const salvarConfiguracoes = async () => {
  try {
    loading.value = true
    // Aqui você implementaria a lógica para salvar as configurações
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
    console.log('Configurações de Contas a Receber salvas:', config)
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
  } finally {
    loading.value = false
  }
}

const resetarConfiguracoes = () => {
  config.numeracao_automatica = true
  config.calcular_juros_auto = false
  config.taxa_juros_padrao = 2.0
  config.taxa_multa_padrao = 2.0
  config.dias_carencia = 5
  config.forma_pagamento_padrao = null
  config.conta_corrente_padrao = null
  config.permitir_desconto = true
  config.gerar_boleto_auto = false
  config.observacoes_padrao = ''
}

// Carregar configurações ao montar o componente
onMounted(() => {
  // Aqui você implementaria a lógica para carregar as configurações existentes
})
</script>

<style scoped>
.contas-receber-config {
  padding: 20px 0;
}

.section-header {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>