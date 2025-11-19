<template>
  <div class="pagamento-container">
    <!-- Header -->
    <div class="pagamento-header">
      <v-btn icon="mdi-arrow-left" variant="text" @click="voltarParaPdv"></v-btn>
      <span class="caixa-numero">{{ numeroCaixa }}</span>
      <v-btn icon="mdi-account-circle" variant="text"></v-btn>
      <v-btn icon="mdi-menu" variant="text"></v-btn>
    </div>

    <!-- Conteúdo Principal -->
    <div class="pagamento-content">
      <!-- Lado Esquerdo - Formas de Pagamento -->
      <div class="formas-pagamento-area">
        <!-- Total Principal -->
        <div class="total-principal">
          R$ {{ formatarValor(totalVenda) }}
        </div>

        <!-- Lista de Formas de Pagamento -->
        <div class="formas-lista">
          <div
            v-for="forma in formasPagamento"
            :key="forma.id"
            class="forma-item"
            :class="{ 'forma-selecionada': forma.id === formaSelecionada }"
            @click="selecionarForma(forma.id)"
          >
            <div class="forma-info">
              <v-icon :icon="forma.icone" size="24"></v-icon>
              <span class="forma-nome">{{ forma.nome }}</span>
            </div>
            <div class="forma-valor">
              R$ {{ formatarValor(pagamentos[forma.id] || 0) }}
            </div>
            <v-btn
              v-if="pagamentos[forma.id] > 0"
              icon="mdi-close"
              variant="text"
              size="small"
              color="error"
              @click.stop="removerPagamento(forma.id)"
            ></v-btn>
          </div>
        </div>

        <!-- Troco -->
        <div class="troco-area">
          <span class="troco-label">Troco</span>
          <span class="troco-valor" :class="{ 'troco-negativo': troco < 0 }">
            R$ {{ formatarValor(Math.abs(troco)) }}
          </span>
        </div>
      </div>

      <!-- Lado Direito - Calculadora e Controles -->
      <div class="calculadora-area">
        <!-- Abas Cliente e Fatura -->
        <div class="abas-superior">

          <v-btn
            :variant="abaAtiva === 'fatura' ? 'flat' : 'text'"
            size="small"
            class="aba-btn"
            prepend-icon="mdi-file-document"
            @click="abaAtiva = 'fatura'"
          >
            Fatura
          </v-btn>
          <v-btn icon="mdi-printer" variant="text" size="small"></v-btn>
        </div>

        <!-- Display de Entrada -->
        <div class="display-valor">
          <v-text-field
            v-model="valorEntrada"
            variant="outlined"
            readonly
            density="comfortable"
            hide-details
            class="input-valor"
          ></v-text-field>
        </div>

        <!-- Calculadora -->
        <div class="calculadora-grid">
          <!-- Linha 1 -->
          <v-btn class="calc-btn" @click="adicionarDigito('1')">1</v-btn>
          <v-btn class="calc-btn" @click="adicionarDigito('2')">2</v-btn>
          <v-btn class="calc-btn" @click="adicionarDigito('3')">3</v-btn>
          <v-btn class="calc-btn atalho-btn" @click="adicionarAtalho(10)">+10</v-btn>

          <!-- Linha 2 -->
          <v-btn class="calc-btn" @click="adicionarDigito('4')">4</v-btn>
          <v-btn class="calc-btn" @click="adicionarDigito('5')">5</v-btn>
          <v-btn class="calc-btn" @click="adicionarDigito('6')">6</v-btn>
          <v-btn class="calc-btn atalho-btn" @click="adicionarAtalho(20)">+20</v-btn>

          <!-- Linha 3 -->
          <v-btn class="calc-btn" @click="adicionarDigito('7')">7</v-btn>
          <v-btn class="calc-btn" @click="adicionarDigito('8')">8</v-btn>
          <v-btn class="calc-btn" @click="adicionarDigito('9')">9</v-btn>
          <v-btn class="calc-btn atalho-btn" @click="adicionarAtalho(50)">+50</v-btn>

          <!-- Linha 4 -->
          <v-btn class="calc-btn operador-btn" @click="toggleSinal">+/-</v-btn>
          <v-btn class="calc-btn" @click="adicionarDigito('0')">0</v-btn>
          <v-btn class="calc-btn operador-btn" @click="adicionarDigito(',')">,</v-btn>
          <v-btn class="calc-btn limpar-btn" @click="limparEntrada">
            <v-icon>mdi-backspace</v-icon>
          </v-btn>

          <!-- Linha 5 - Botões de Ação -->
          <v-btn class="calc-btn-action" @click="voltarParaPdv">Voltar</v-btn>
          <v-btn
            class="calc-btn-action validar-btn"
            @click="validarPagamento"
            :disabled="!podeValidar"
          >
            Validar
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estado
const numeroCaixa = ref('2004');
const totalVenda = ref(0);
const valorEntrada = ref('0,00');
const formaSelecionada = ref('dinheiro');
const abaAtiva = ref('cliente');
const pagamentos = ref({
  dinheiro: 0,
  cartao: 0,
  conta: 0
});

// Formas de pagamento
const formasPagamento = ref([
  { id: 'dinheiro', nome: 'Dinheiro', icone: 'mdi-cash' },
  { id: 'cartao', nome: 'Cartão', icone: 'mdi-credit-card' },
  { id: 'conta', nome: 'Conta do cliente', icone: 'mdi-account-credit-card' }
]);

// Computeds
const totalPago = computed(() => {
  return Object.values(pagamentos.value).reduce((sum, val) => sum + val, 0);
});

const troco = computed(() => {
  return totalPago.value - totalVenda.value;
});

const podeValidar = computed(() => {
  return totalPago.value >= totalVenda.value;
});

// Carregar dados da venda
onMounted(() => {
  const dadosVenda = JSON.parse(sessionStorage.getItem('dadosVenda') || '{}');
  if (dadosVenda.total) {
    totalVenda.value = dadosVenda.total;
    // Pré-preencher com o valor total em dinheiro
    pagamentos.value.dinheiro = dadosVenda.total;
    valorEntrada.value = formatarValorInput(dadosVenda.total);
  }
});

// Funções
const selecionarForma = (formaId) => {
  formaSelecionada.value = formaId;
  const valorAtual = pagamentos.value[formaId] || 0;
  valorEntrada.value = formatarValorInput(valorAtual);
};

const adicionarDigito = (digito) => {
  if (valorEntrada.value === '0,00') {
    valorEntrada.value = digito === ',' ? '0,' : digito;
  } else {
    if (digito === ',' && valorEntrada.value.includes(',')) {
      return; // Já tem vírgula
    }
    valorEntrada.value += digito;
  }
  atualizarPagamento();
};

const adicionarAtalho = (valor) => {
  const valorAtual = parseValor(valorEntrada.value);
  const novoValor = valorAtual + valor;
  valorEntrada.value = formatarValorInput(novoValor);
  atualizarPagamento();
};

const toggleSinal = () => {
  const valorAtual = parseValor(valorEntrada.value);
  valorEntrada.value = formatarValorInput(-valorAtual);
  atualizarPagamento();
};

const limparEntrada = () => {
  if (valorEntrada.value.length > 1) {
    valorEntrada.value = valorEntrada.value.slice(0, -1);
    if (valorEntrada.value === '' || valorEntrada.value === '-') {
      valorEntrada.value = '0,00';
    }
  } else {
    valorEntrada.value = '0,00';
  }
  atualizarPagamento();
};

const atualizarPagamento = () => {
  pagamentos.value[formaSelecionada.value] = parseValor(valorEntrada.value);
};

const removerPagamento = (formaId) => {
  pagamentos.value[formaId] = 0;
  if (formaId === formaSelecionada.value) {
    valorEntrada.value = '0,00';
  }
};

const validarPagamento = () => {
  if (!podeValidar.value) {
    return;
  }

  // Aqui você salvaria o pagamento
  const dadosPagamento = {
    total: totalVenda.value,
    pagamentos: pagamentos.value,
    troco: troco.value,
    data: new Date().toISOString()
  };

  console.log('Pagamento validado:', dadosPagamento);

  // Limpar dados da sessão
  sessionStorage.removeItem('dadosVenda');

  // Você pode adicionar uma notificação de sucesso aqui
  alert(`Pagamento realizado com sucesso!\nTroco: R$ ${formatarValor(troco.value)}`);

  // Voltar para a tela de operações ou PDV limpo
  router.push({ name: 'pdv' });
};

const voltarParaPdv = () => {
  if (confirm('Tem certeza que deseja cancelar o pagamento?')) {
    router.push({ name: 'pdv' });
  }
};

// Utilitários
const parseValor = (valorStr) => {
  const cleaned = valorStr.replace(/[^\d,.-]/g, '');
  const numero = parseFloat(cleaned.replace(',', '.'));
  return isNaN(numero) ? 0 : numero;
};

const formatarValorInput = (valor) => {
  return valor.toFixed(2).replace('.', ',');
};

const formatarValor = (valor) => {
  return valor.toFixed(2).replace('.', ',');
};
</script>

<style scoped>
.pagamento-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow: hidden;
  z-index: 9999;
}

/* Header */
.pagamento-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background-color: var(--bg-color-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.caixa-numero {
  font-weight: 600;
  font-size: 14px;
  padding: 6px 16px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-right: auto;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Conteúdo */
.pagamento-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Lado Esquerdo - Formas de Pagamento */
.formas-pagamento-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 48px 64px;
  background-color: var(--bg-color);
}

.total-principal {
  font-size: 72px;
  font-weight: 300;
  letter-spacing: -1px;
  text-align: center;
  margin-bottom: 64px;
  color: var(--text-color);
}

.formas-lista {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.forma-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  background-color: var(--bg-color-secondary);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.forma-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.forma-selecionada {
  background-color: rgba(129, 212, 250, 0.08);
  border-color: rgba(129, 212, 250, 0.4);
}

.forma-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.forma-nome {
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.forma-valor {
  font-size: 18px;
  font-weight: 600;
  min-width: 140px;
  text-align: right;
  letter-spacing: 0.5px;
}

.troco-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 32px;
  background-color: var(--bg-color-secondary);
  border-radius: 8px;
  border: 1px solid var(--text-color-laranja);
}

.troco-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-laranja);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.9;
}

.troco-valor {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-color-laranja);
  letter-spacing: 0.5px;
}

.troco-negativo {
  color: #ef5350 !important;
}

/* Lado Direito - Calculadora */
.calculadora-area {
  width: 420px;
  background-color: var(--bg-color-secondary);
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.abas-superior {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 4px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.aba-btn {
  flex: 1;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

.display-valor {
  margin-bottom: 20px;
}

.input-valor {
  font-size: 28px;
  font-weight: 600;
}

:deep(.input-valor input) {
  text-align: right;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 1px;
}

:deep(.input-valor .v-field) {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

:deep(.input-valor .v-field__outline) {
  border-color: rgba(255, 255, 255, 0.1);
}

/* Calculadora Grid */
.calculadora-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  flex: 1;
}

:deep(.calc-btn) {
  min-height: 64px !important;
  font-size: 18px !important;
  font-weight: 500 !important;
  border-radius: 8px !important;
  text-transform: none !important;
  background-color: var(--bg-color) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.2s ease !important;
  color: var(--text-color) !important;
}

:deep(.calc-btn:hover) {
  border-color: rgba(255, 255, 255, 0.2) !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.calc-btn-action) {
  min-height: 64px !important;
  font-size: 15px !important;
  font-weight: 500 !important;
  grid-column: span 2;
  border-radius: 8px !important;
  text-transform: none !important;
  background-color: var(--bg-color) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  transition: all 0.2s ease !important;
  color: var(--text-color) !important;
}

:deep(.calc-btn-action:hover) {
  border-color: rgba(255, 255, 255, 0.2) !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

:deep(.atalho-btn) {
  background-color: rgba(56, 142, 60, 0.2) !important;
  border-color: rgba(56, 142, 60, 0.4) !important;
  color: #81c784 !important;
}

:deep(.atalho-btn:hover) {
  background-color: rgba(56, 142, 60, 0.3) !important;
  border-color: rgba(56, 142, 60, 0.5) !important;
}

:deep(.operador-btn) {
  background-color: rgba(230, 126, 34, 0.2) !important;
  border-color: rgba(230, 126, 34, 0.4) !important;
  color: #ffb74d !important;
}

:deep(.operador-btn:hover) {
  background-color: rgba(230, 126, 34, 0.3) !important;
  border-color: rgba(230, 126, 34, 0.5) !important;
}

:deep(.limpar-btn) {
  background-color: rgba(211, 47, 47, 0.2) !important;
  border-color: rgba(211, 47, 47, 0.4) !important;
  color: #ef5350 !important;
}

:deep(.limpar-btn:hover) {
  background-color: rgba(211, 47, 47, 0.3) !important;
  border-color: rgba(211, 47, 47, 0.5) !important;
}

:deep(.validar-btn) {
  background-color: rgba(123, 31, 162, 0.25) !important;
  border-color: rgba(123, 31, 162, 0.5) !important;
  color: #ba68c8 !important;
}

:deep(.validar-btn:hover) {
  background-color: rgba(123, 31, 162, 0.35) !important;
  border-color: rgba(123, 31, 162, 0.6) !important;
}

:deep(.validar-btn:disabled) {
  opacity: 0.4 !important;
  cursor: not-allowed !important;
  background-color: rgba(123, 31, 162, 0.1) !important;
}
</style>

