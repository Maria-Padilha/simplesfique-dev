<template>
  <main class="pa-6">

    <div class="d-flex justify-center items-center min-h-[80vh]">
      <v-card elevation="2" class="background-secondary w-full max-w-md rounded-2xl">
        <v-card-text class="pa-8">
          <div class="text-center mb-8">
            <v-icon icon="mdi-cash-register" size="48" class="text-orange-600 mb-4"></v-icon>
            <v-card-title class="text-h4 justify-center mb-2">
              Abrir Caixa
            </v-card-title>
            <p class="text-body-2 opacity-75">
              Gerencie suas operações de caixa
            </p>
          </div>

          <v-divider class="my-6"></v-divider>

          <div class="mb-6">
            <div class="mb-4">
              <p class="text-caption text-uppercase font-weight-bold opacity-75 mb-2">
                Data
              </p>
              <p class="text-h6 font-weight-medium">
                {{ dataHoje }}
              </p>
            </div>

            <div>
              <p class="text-caption text-uppercase font-weight-bold opacity-75 mb-2">
                Saldo em Caixa
              </p>
              <p class="text-h5 font-weight-bold text-orange-600">
                {{ formatarMoeda(saldoCaixa) }}
              </p>
            </div>
          </div>

          <v-divider class="my-6"></v-divider>

          <v-btn
            size="large"
            color="var(--text-color-laranja)"
            block
            class="orange-600 font-weight-bold"
            prepend-icon="mdi-lock-open"
            @click="abrirCaixa"
          >
            Abrir Caixa
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Dados fictícios
const saldoCaixa = ref(1250.50);

const dataHoje = computed(() => {
  const data = new Date();
  const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return data.toLocaleDateString('pt-BR', opcoes);
});

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

const abrirCaixa = () => {
  // Navega para a tela de CaixaView
  router.push({ name: 'pdv_caixa' });
};
</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.text-orange-600 {
  color: var(--text-color-laranja);
}

.min-h-\[80vh\] {
  min-height: 80vh;
}
</style>
