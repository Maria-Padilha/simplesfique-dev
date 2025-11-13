<template>
  <div class="contas-pagar-config">
    <div class="section-header">
      <h3 class="text-xl font-semibold mb-2">Configurações - Contas a Pagar</h3>
      <p class="text-sm opacity-70 mb-6">Defina as configurações para o módulo de contas a pagar</p>
    </div>

    <v-form ref="formRef" v-model="formValid">
     
      <!-- Códigos de Histórico -->
      <div class="config-section mb-6">
        <h4 class="text-lg font-medium mb-4">Códigos de Histórico</h4>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="config.codigo_historico_baixa_cartao"
              label="Código do histórico para baixa no cartão"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="config.codigo_historico_baixa_banco"
              label="Código do histórico para baixa no banco"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="config.codigo_historico_estorno_pagos"
              label="Código do hist. para estorno de tít. pagos no caixa:"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <!-- Contas Contábeis -->
      <div class="config-section mb-6">
        <h4 class="text-lg font-medium mb-4">Contas Contábeis</h4>
        <v-row>
          <v-col cols="12" md="4">
            <div class="conta-config">
              <label class="conta-label">Conta juros:</label>
              <v-text-field
                v-model="config.conta_juros"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="config.conta_juros_desc"
                placeholder="JUROS PAGOS"
                variant="outlined"
                density="compact"
                hide-details
                readonly
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="conta-config">
              <label class="conta-label">Conta multa:</label>
              <v-text-field
                v-model="config.conta_multa"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="config.conta_multa_desc"
                placeholder="JUROS PAGOS"
                variant="outlined"
                density="compact"
                hide-details
                readonly
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="conta-config">
              <label class="conta-label">Conta descontos obtidos:</label>
              <v-text-field
                v-model="config.conta_descontos"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="config.conta_descontos_desc"
                placeholder="DESCONTOS OBTIDOS"
                variant="outlined"
                density="compact"
                hide-details
                readonly
              ></v-text-field>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="conta-config">
              <label class="conta-label">Conta fornecedores:</label>
              <v-text-field
                v-model="config.conta_fornecedores"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="config.conta_fornecedores_desc"
                placeholder="FORNECEDORES DIVERSOS"
                variant="outlined"
                density="compact"
                hide-details
                readonly
              ></v-text-field>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Empréstimos e Transferências -->
      <div class="config-section mb-6">
        <h4 class="text-lg font-medium mb-4">Empréstimos e Transferências</h4>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="config.conta_debito_emprestimos"
              label="Conta Débito para empréstimos e transferências"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="config.conta_credito_emprestimos"
              label="Conta Crédito para empréstimos e transferências"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <!-- Adiantamentos a Fornecedores -->
      <div class="config-section mb-6">
        <h4 class="text-lg font-medium mb-4">Adiantamentos a Fornecedores</h4>
        <v-row>
          <v-col cols="12" md="6">
            <div class="input-with-lookup">
              <v-text-field
                v-model="config.historico_calqa_padrao"
                label="Histórico do Caixa padrão"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
              <v-btn
                icon="mdi-magnify"
                variant="outlined"
                size="small"
                class="lookup-btn"
              ></v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="input-with-lookup">
              <v-text-field
                v-model="config.historico_bancario_padrao"
                label="Histórico Bancário padrão"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
              <v-btn
                icon="mdi-magnify"
                variant="outlined"
                size="small"
                class="lookup-btn"
              ></v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Configurações de Pagamento -->
      <div class="config-section mb-6">
        <h4 class="text-lg font-medium mb-4">Configurações de Pagamento</h4>
        <v-row>
          <v-col cols="12" md="4">
            <div class="input-with-lookup">
              <v-text-field
                v-model="config.tipo_pagamento_padrao"
                label="Tipo de Pagamento padrão"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
              <v-btn
                icon="mdi-magnify"
                variant="outlined"
                size="small"
                class="lookup-btn"
              ></v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4">
            <div class="input-with-lookup">
              <v-text-field
                v-model="config.tipo_documento_padrao"
                label="Tipo de Documento padrão"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
              <v-btn
                icon="mdi-magnify"
                variant="outlined"
                size="small"
                class="lookup-btn"
              ></v-btn>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- Níveis do Centro de Custo -->
      <div class="config-section">
        <h4 class="text-lg font-medium mb-4">Níveis do Centro de Custo</h4>
        <v-row>
          <v-col cols="12" md="2">
            <v-select
              v-model="config.nivel1"
              :items="[0, 1, 2, 3, 4, 5]"
              label="Nível 1"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="config.nivel2"
              :items="[0, 1, 2, 3, 4, 5]"
              label="Nível 2"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="config.nivel3"
              :items="[0, 1, 2, 3, 4, 5]"
              label="Nível 3"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-select>
          </v-col>
        </v-row>
      </div>
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
  // Opções Gerais
  permite_mesmo_numero_documento: false,
  conta_unica_fornecedores: false,
  liberacao_titulos_pagar: false,
  controle_centro_custo: false,
  permite_alterar_rateio: false,
  regra_negocio_juros_multa: false,
  
  // Códigos de Histórico
  codigo_historico_baixa_cartao: '',
  codigo_historico_baixa_banco: '',
  codigo_historico_estorno_pagos: '',
  
  // Contas Contábeis
  conta_juros: '255',
  conta_juros_desc: 'JUROS PAGOS',
  conta_multa: '253',
  conta_multa_desc: 'JUROS PAGOS',
  conta_descontos: '211112',
  conta_descontos_desc: 'DESCONTOS OBTIDOS',
  conta_fornecedores: '211111',
  conta_fornecedores_desc: 'FORNECEDORES DIVERSOS',
  
  // Empréstimos e Transferências
  conta_debito_emprestimos: '',
  conta_credito_emprestimos: '',
  
  // Adiantamentos
  historico_calqa_padrao: '3',
  historico_bancario_padrao: '3',
  
  // Configurações de Pagamento
  tipo_pagamento_padrao: '1',
  tipo_documento_padrao: '1',
  
  // Níveis do Centro de Custo
  nivel1: 0,
  nivel2: 0,
  nivel3: 0
})

// Métodos
const salvarConfiguracoes = async () => {
  try {
    loading.value = true
    // Aqui você implementaria a lógica para salvar as configurações
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
    console.log('Configurações de Contas a Pagar salvas:', config)
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
  } finally {
    loading.value = false
  }
}

const resetarConfiguracoes = () => {
  // Opções Gerais
  config.permite_mesmo_numero_documento = false
  config.conta_unica_fornecedores = false
  config.liberacao_titulos_pagar = false
  config.controle_centro_custo = false
  config.permite_alterar_rateio = false
  config.regra_negocio_juros_multa = false
  
  // Códigos de Histórico
  config.codigo_historico_baixa_cartao = ''
  config.codigo_historico_baixa_banco = ''
  config.codigo_historico_estorno_pagos = ''
  
  // Contas Contábeis
  config.conta_juros = '255'
  config.conta_juros_desc = 'JUROS PAGOS'
  config.conta_multa = '253'
  config.conta_multa_desc = 'JUROS PAGOS'
  config.conta_descontos = '211112'
  config.conta_descontos_desc = 'DESCONTOS OBTIDOS'
  config.conta_fornecedores = '211111'
  config.conta_fornecedores_desc = 'FORNECEDORES DIVERSOS'
  
  // Empréstimos e Transferências
  config.conta_debito_emprestimos = ''
  config.conta_credito_emprestimos = ''
  
  // Adiantamentos
  config.historico_calqa_padrao = '3'
  config.historico_bancario_padrao = '3'
  
  // Configurações de Pagamento
  config.tipo_pagamento_padrao = '1'
  config.tipo_documento_padrao = '1'
  
  // Níveis do Centro de Custo
  config.nivel1 = 0
  config.nivel2 = 0
  config.nivel3 = 0
}

// Carregar configurações ao montar o componente
onMounted(() => {
  // Aqui você implementaria a lógica para carregar as configurações existentes
})
</script>

<style scoped>
.contas-pagar-config {
  padding: 0;
  position: relative;
}

.section-header {
  margin-bottom: 24px;
}

.config-section {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 24px;
}

.config-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.conta-config {
  margin-bottom: 16px;
}

.conta-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  display: block;
}

.input-with-lookup {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-with-lookup .v-text-field {
  flex: 1;
}

.lookup-btn {
  min-width: 40px !important;
  height: 40px;
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>