<template>
  <main class="caixa-container">
    <ParticleBackground />

    <!-- Hora e Data no canto superior esquerdo -->
    <div class="header-info">
      <div class="hora">{{ horaFormatada }}</div>
      <div class="dia-semana">{{
          diaSemana }}</div>
      <div class="data">{{ dataFormatada }}</div>
    </div>

    <!-- Logo no canto superior direito -->
    <div class="logo-area">
      <v-icon icon="mdi-camera" size="small"></v-icon>
      <span>Your logo</span>
    </div>

    <!-- Card centralizado com botão -->
    <div class="content-center">
      <v-card class="card-abrir-caixa" elevation="2" @click="abrirCaixa">
        <v-card-text class="text-center pa-8">
          <v-icon icon="mdi-basket" size="80" class="mb-4 text-dark texto-customizado"></v-icon>
          <div class="texto-customizado">Abrir caixa registradora</div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Botão sair no rodapé -->
    <div class="footer-btn">
      <v-btn
        variant="flat"
        color="grey-darken-4"
        @click="fecharCaixa"
        size="small"
      >
        Sair (caixa continua aberto)
      </v-btn>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import ParticleBackground from '@/components/particle/ParticleBackground.vue';

const router = useRouter();
const tempoAtual = ref(new Date());
let intervaloTempo;

onMounted(() => {
  intervaloTempo = setInterval(() => {
    tempoAtual.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervaloTempo);
});

const formatarDigito = (num) => String(num).padStart(2, '0');

const horaFormatada = computed(() => {
  const h = formatarDigito(tempoAtual.value.getHours());
  const m = formatarDigito(tempoAtual.value.getMinutes());
  const s = formatarDigito(tempoAtual.value.getSeconds());
  return `${h}:${m}:${s}`;
});

const diaSemana = computed(() => {
  const dias = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  return dias[tempoAtual.value.getDay()];
});

const dataFormatada = computed(() => {
  const dia = tempoAtual.value.getDate();
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const mes = meses[tempoAtual.value.getMonth()];
  const ano = tempoAtual.value.getFullYear();
  return `${dia} de ${mes}, ${ano}`;
});

const abrirCaixa = () => {
  router.push({ name: 'pdv', query: { abrirModal: 'true' } });
};

const fecharCaixa = () => {
  router.push({ name: 'pdv_operacao' });
};
</script>

<style scoped>
.texto-customizado {
  color: var(--text-color);
}
.caixa-container {
  position: relative;
  height: 100vh;
  background-color: var(--bg-color-secondary);
  overflow: hidden;
}

/* Header Info - Canto Superior Esquerdo */
.header-info {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 10;
}

.hora {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.dia-semana {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
  text-transform: lowercase;
}

.data {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.7;
}

/* Logo - Canto Superior Direito */
.logo-area {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.875rem;
}

/* Conteúdo Central */
.content-center {
  position: relative;
  z-index: 5;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-abrir-caixa {
  background-color: var(--text-color-laranja) !important;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 280px;
}

.card-abrir-caixa:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}


/* Botão Sair - Rodapé */
.footer-btn {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

/* Responsivo */
@media (max-width: 768px) {
  .header-info {
    top: 1rem;
    left: 1rem;
  }

  .hora {
    font-size: 1.25rem;
  }

  .logo-area {
    top: 1rem;
    right: 1rem;
  }

  .card-abrir-caixa {
    max-width: 240px;
  }
}
</style>

