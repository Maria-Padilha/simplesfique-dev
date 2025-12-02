<template>
  <div class="centro-custo-config">
    <div class="section-header">
      <h3 class="text-xl font-semibold mb-2">Configurações - Centro de Custo</h3>
      <p class="text-sm opacity-70 mb-6">Defina a estrutura e configurações do centro de custo</p>
    </div>

    <v-form ref="formRef" v-model="formValid">
      <!-- Configuração de Níveis -->
      <div class="config-section mb-8">
        <h4 class="text-lg font-medium mb-4">Estrutura de Níveis</h4>
        
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-text-field
              v-model="config.nivel1"
              label="Nível 1"
              type="number"
              variant="outlined"
              density="compact"
              min="1"
              max="9"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="config.nivel2"
              label="Nível 2"
              type="number"
              variant="outlined"
              density="compact"
              min="1"
              max="9"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="config.nivel3"
              label="Nível 3"
              type="number"
              variant="outlined"
              density="compact"
              min="1"
              max="9"
              hide-details="auto"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="config.nivel4"
              label="Nível 4"
              type="number"
              variant="outlined"
              density="compact"
              min="1"
              max="9"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- Exemplo de Estrutura -->
        <div class="structure-example p-4 rounded-lg bg-opacity-10 bg-white mb-6">
          <h5 class="text-sm font-medium mb-2">Exemplo de Estrutura:</h5>
          <p class="text-sm opacity-80">
            {{ gerarExemploEstrutura() }}
          </p>
        </div>
      </div>

      <!-- Configurações Gerais -->
      <div class="config-section mb-8">
        <h4 class="text-lg font-medium mb-4">Configurações Gerais</h4>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-switch
              v-model="config.obrigatorio_lancamento"
              label="Centro de Custo Obrigatório nos Lançamentos"
              color="var(--text-color-laranja)"
              hide-details
            ></v-switch>
          </v-col>

          <v-col cols="12" md="6">
            <v-switch
              v-model="config.permitir_orcamento"
              label="Permitir Controle Orçamentário"
              color="var(--text-color-laranja)"
              hide-details
            ></v-switch>
          </v-col>

          <v-col cols="12" md="6">
            <v-switch
              v-model="config.herdar_orcamento"
              label="Herdar Orçamento do Nível Superior"
              color="var(--text-color-laranja)"
              hide-details
            ></v-switch>
          </v-col>

          <v-col cols="12" md="6">
            <v-switch
              v-model="config.bloquear_orcamento_excedido"
              label="Bloquear Lançamentos com Orçamento Excedido"
              color="var(--text-color-laranja)"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>
      </div>

      <!-- Centro de Custo Padrão -->
      <div class="config-section">
        <h4 class="text-lg font-medium mb-4">Centro de Custo Padrão</h4>
        
        <v-row>
          <v-col cols="12" md="8">
            <v-select
              v-model="config.centro_custo_padrao"
              :items="centrosCusto"
              item-title="descricao"
              item-value="id"
              label="Centro de Custo Padrão"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="config.separador"
              label="Separador de Níveis"
              variant="outlined"
              density="compact"
              maxlength="1"
              hide-details="auto"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-form>

    <!-- Botões de Ação -->
    <div class="action-buttons mt-8">
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

      <v-btn
        variant="outlined"
        @click="visualizarEstrutura"
        class="ml-3"
      >
        <v-icon class="mr-2">mdi-eye</v-icon>
        Visualizar Estrutura
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
  nivel1: 1,
  nivel2: 2,
  nivel3: 2,
  nivel4: 2,
  obrigatorio_lancamento: true,
  permitir_orcamento: false,
  herdar_orcamento: true,
  bloquear_orcamento_excedido: false,
  centro_custo_padrao: null,
  separador: '.'
})

// Dados mock para o select
const centrosCusto = ref([
  { id: 1, descricao: '1 - Administração' },
  { id: 2, descricao: '2 - Vendas' },
  { id: 3, descricao: '3 - Produção' },
  { id: 4, descricao: '4 - Financeiro' }
])

// Computed para gerar exemplo da estrutura
const gerarExemploEstrutura = () => {
  const sep = config.separador || '.'
  const n1 = '0'.repeat(config.nivel1)
  const n2 = '0'.repeat(config.nivel2)
  const n3 = '0'.repeat(config.nivel3)
  const n4 = '0'.repeat(config.nivel4)
  
  return `${n1}${sep}${n2}${sep}${n3}${sep}${n4} (Ex: 1${sep}01${sep}01${sep}01)`
}

// Métodos
const salvarConfiguracoes = async () => {
  try {
    loading.value = true
    // Aqui você implementaria a lógica para salvar as configurações
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay
    console.log('Configurações de Centro de Custo salvas:', config)
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
  } finally {
    loading.value = false
  }
}

const resetarConfiguracoes = () => {
  config.nivel1 = 1
  config.nivel2 = 2
  config.nivel3 = 2
  config.nivel4 = 2
  config.obrigatorio_lancamento = true
  config.permitir_orcamento = false
  config.herdar_orcamento = true
  config.bloquear_orcamento_excedido = false
  config.centro_custo_padrao = null
  config.separador = '.'
}

const visualizarEstrutura = () => {
  // Aqui você poderia abrir um modal ou navegar para uma tela de visualização
  console.log('Visualizar estrutura do centro de custo')
}

// Carregar configurações ao montar o componente
onMounted(() => {
  // Aqui você implementaria a lógica para carregar as configurações existentes
})
</script>

<style scoped>
.centro-custo-config {
  padding: 20px 0;
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
}

.structure-example {
  border: 1px solid rgba(var(--text-color-laranja-rgb), 0.3);
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>