<template>
  <div class="pa-4">
    <!-- Cabeçalho -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-swap-horizontal" class="mr-3"></v-icon>
          Transferências Financeiras
        </div>
      </v-card-title>
    </v-card>

    <!-- Tabs de Transferências -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-tabs
        v-model="tabAtiva"
        color="var(--text-color-laranja)"
        align-tabs="start"
        class="mb-4"
      >
        <v-tab value="caixa-banco">
          <v-icon icon="mdi-cash-fast" class="mr-2"></v-icon>
          Caixa / Banco
        </v-tab>
        <v-tab value="intercaixa">
          <v-icon icon="mdi-cash-sync" class="mr-2"></v-icon>
          Intercaixa
        </v-tab>
        <v-tab value="banco-caixa">
          <v-icon icon="mdi-bank-transfer-out" class="mr-2"></v-icon>
          Banco / Caixa
        </v-tab>
        <v-tab value="interbancaria">
          <v-icon icon="mdi-bank-transfer" class="mr-2"></v-icon>
          Interbancária
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-4">
        <v-window v-model="tabAtiva">
          <!-- Tab: Caixa / Banco -->
          <v-window-item value="caixa-banco">
            <TransferenciaCaixaBanco />
          </v-window-item>

          <!-- Tab: Intercaixa -->
          <v-window-item value="intercaixa">
            <TransferenciaIntercaixa />
          </v-window-item>

          <!-- Tab: Banco / Caixa -->
          <v-window-item value="banco-caixa">
            <TransferenciaBancoCaixa />
          </v-window-item>

          <!-- Tab: Interbancária -->
          <v-window-item value="interbancaria">
            <TransferenciaInterbancaria />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import TransferenciaCaixaBanco from '@/components/base/transferencias/TransferenciaCaixaBanco.vue'
import TransferenciaIntercaixa from '@/components/base/transferencias/TransferenciaIntercaixa.vue'
import TransferenciaBancoCaixa from '@/components/base/transferencias/TransferenciaBancoCaixa.vue'
import TransferenciaInterbancaria from '@/components/base/transferencias/TransferenciaInterbancaria.vue'

const themeStore = useThemeStore()
const tabAtiva = ref('caixa-banco')
</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.background-card {
  background-color: var(--bg-card);
  color: var(--text-color);
}

/* Estilização das tabs */
:deep(.v-tab) {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
}

:deep(.v-tab--selected) {
  color: var(--text-color-laranja);
}

:deep(.v-tabs-slider) {
  background-color: var(--text-color-laranja);
}
</style>
