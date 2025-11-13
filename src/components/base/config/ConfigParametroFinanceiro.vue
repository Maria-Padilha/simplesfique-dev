<template>
  <div class="parametro-financeiro">
    <div class="section-header">
      <h2 class="text-2xl font-bold mb-2">Parâmetro Financeiro</h2>
      <p class="text-sm opacity-70 mb-8">Configure os parâmetros para os módulos financeiros</p>
    </div>

    <!-- Sistema de Abas -->
    <ConfigTabs
      :tabs="abas"
      default-tab="contas-pagar"
      @tab-changed="onTabChanged"
    >
      <template #default="{ activeTab }">
        <div class="tab-content-wrapper">
          <component 
            :is="getActiveComponent(activeTab)" 
            :key="activeTab"
          />
        </div>
      </template>
    </ConfigTabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConfigTabs from './ConfigTabs.vue'
import ConfigContasPagar from './ConfigContasPagar.vue'
import ConfigContasReceber from './ConfigContasReceber.vue'
import ConfigCentroCusto from './ConfigCentroCusto.vue'

// Definição das abas
const abas = ref([
  {
    id: 'contas-pagar',
    label: 'Contas a Pagar',
    icon: 'mdi-credit-card-outline'
  },
  {
    id: 'contas-receber',
    label: 'Contas a Receber',
    icon: 'mdi-cash-multiple'
  },
  {
    id: 'centro-custo',
    label: 'Centro de Custo',
    icon: 'mdi-chart-tree'
  }
])

// Mapeamento de componentes
const componentMap = {
  'contas-pagar': ConfigContasPagar,
  'contas-receber': ConfigContasReceber,
  'centro-custo': ConfigCentroCusto
}

// Função para retornar o componente ativo
const getActiveComponent = (activeTab) => {
  return componentMap[activeTab] || ConfigContasPagar
}

// Controlar mudança de aba
const onTabChanged = (tabId) => {
  console.log('Aba alterada para:', tabId)
}
</script>

<style scoped>
.parametro-financeiro {
  width: 100%;
  height: 100%;
}

.section-header {
  margin-bottom: 32px;
}

.tab-content-wrapper {
  overflow: hidden;
  position: relative;
}
</style>
