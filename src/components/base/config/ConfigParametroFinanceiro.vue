<template>
  <div class="parametro-financeiro">


    <!-- Sistema de Abas no topo -->
    <div class="tabs-container">
      <ConfigTabs
        :tabs="abas"
        default-tab="contas-pagar"
        @tab-changed="onTabChanged"
      >
        <template #default="{ activeTab: currentTab }">
          <div class="tab-content">
            <component 
              :is="getActiveComponent(currentTab)" 
              :key="currentTab"
            />
          </div>
        </template>
      </ConfigTabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConfigTabs from './ConfigTabs.vue'
import ConfigContasPagar from './ConfigContasPagar.vue'
import ConfigContasReceber from './ConfigContasReceber.vue'
import ConfigCentroCusto from './ConfigCentroCusto.vue'
import ConfigCaixa from './ConfigCaixa.vue'

// Estado da aba ativa
const activeTab = ref('contas-pagar')

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
    id: 'caixa',
    label: 'Caixa',
    icon: 'mdi-cash-register'
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
  'centro-custo': ConfigCentroCusto,
  'caixa': ConfigCaixa
}

// Função para retornar o componente ativo
const getActiveComponent = (tabId) => {
  return componentMap[tabId] || ConfigContasPagar
}

// Controlar mudança de aba
const onTabChanged = (tabId) => {
  activeTab.value = tabId
  console.log('Aba alterada para:', tabId)
}
</script>

<style scoped>
.parametro-financeiro {
  width: 100%;
  height: 100%;
}

.section-header {
  margin-bottom: 24px;
}

.tabs-container {
  width: 100%;
}

.tab-content {
  margin-top: 0;
  padding-top: 0;
}
</style>
