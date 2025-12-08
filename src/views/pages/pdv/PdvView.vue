<template>
  <div class="pdv-container">
    <!-- Modal de Abertura de Caixa -->
    <AberturaCaixaModal
      v-model="mostrarModalAbertura"
      @confirmar="handleAberturaCaixa"
    />

    <!-- Modal de Leitor de Código de Barras -->
    <LeitorCodigoBarrasModal
      v-model="mostrarLeitorBarras"
      @codigo-lido="handleCodigoLido"
    />

    <!-- Header do PDV -->
    <div class="pdv-header">
      <div class="header-left">
        <v-btn variant="text" size="small">Registrar</v-btn>
        <v-btn variant="text" size="small">Pedidos</v-btn>
        <v-btn icon="mdi-plus" variant="text" size="small"></v-btn>
        <span class="caixa-numero">2002</span>
      </div>

      <div class="header-right">
        <v-text-field
          v-model="buscaProduto"
          placeholder="Buscar produtos..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          class="search-field"
        ></v-text-field>
        <v-btn icon="mdi-barcode-scan" variant="text" size="small" @click="abrirLeitorBarras"></v-btn>
        <v-btn icon="mdi-account-circle" variant="text" size="small"></v-btn>
        <v-btn icon="mdi-menu" variant="text" size="small"></v-btn>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="pdv-content">
      <!-- Área de Produtos -->
      <div class="produtos-area">
        <!-- Categorias -->
        <div class="categorias-tabs">
          <v-chip
            v-for="cat in categorias"
            :key="cat.nome"
            :color="cat.cor"
            class="ma-1"
            @click="categoriaSelecionada = cat.nome"
          >
            {{ cat.nome }}
          </v-chip>
        </div>

        <!-- Grid de Produtos -->
        <div class="produtos-grid">
          <div
            v-for="produto in produtosFiltrados"
            :key="produto.id"
            class="produto-card"
            @click="adicionarProduto(produto)"
          >
            <div class="produto-imagem">
              <v-icon :icon="produto.icone" size="48"></v-icon>
            </div>
            <div class="produto-nome">{{ produto.nome }}</div>
            <div class="produto-estoque" v-if="produto.estoque">
              {{ produto.estoque }}
            </div>
          </div>
        </div>
      </div>

      <!-- Área do Carrinho -->
      <div class="carrinho-area">
        <!-- Lista de Itens -->
        <div class="carrinho-lista">
          <div class="carrinho-header">
            <v-btn icon="mdi-cart" variant="text" size="small"></v-btn>
            <span class="carrinho-titulo">Começar a adicionar produtos</span>
          </div>

          <!-- Itens do carrinho -->
          <div v-if="itensCarrinho.length === 0" class="carrinho-vazio">
            <v-icon icon="mdi-cart-outline" size="80" color="grey"></v-icon>
            <p>Começar a adicionar produtos</p>
          </div>

          <div v-else class="itens-lista">
            <div
              v-for="(item, index) in itensCarrinho"
              :key="index"
              class="item-carrinho"
            >
              <div class="item-info">
                <div class="item-nome">{{ item.nome }}</div>
                <div class="item-preco">{{ formatarMoeda(item.preco) }}</div>
              </div>
              <div class="item-quantidade">
                <v-btn icon="mdi-minus" size="x-small" variant="text" @click="diminuirQuantidade(index)"></v-btn>
                <span>{{ item.quantidade }}</span>
                <v-btn icon="mdi-plus" size="x-small" variant="text" @click="aumentarQuantidade(index)"></v-btn>
              </div>
              <v-btn icon="mdi-delete" size="small" variant="text" @click="removerItem(index)"></v-btn>
            </div>
          </div>
        </div>

        <!-- Rodapé do Carrinho -->
        <div class="carrinho-footer">
          <!-- Abas Cliente/Observação -->
          <div class="tabs-footer">
            <v-btn variant="text" size="small">Cliente</v-btn>
            <v-btn variant="text" size="small">Observação</v-btn>
            <v-btn icon="mdi-dots-vertical" variant="text" size="small"></v-btn>
          </div>

          <!-- Total -->
          <div class="total-area">
            <div class="total-label">Total</div>
            <div class="total-valor">{{ formatarMoeda(totalCarrinho) }}</div>
          </div>

          <!-- Botão Finalizar -->
          <v-btn
            color="success"
            size="large"
            block
            @click="finalizarVenda"
            class="btn-finalizar"
          >
            Finalizar Venda
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AberturaCaixaModal from '@/components/base/modais/AberturaCaixaModal.vue';
import LeitorCodigoBarrasModal from '@/components/base/modais/LeitorCodigoBarrasModal.vue';

const router = useRouter();
const route = useRoute();

// Estado dos modais
const mostrarModalAbertura = ref(false);
const mostrarLeitorBarras = ref(false);
const caixaAberto = ref(false);

// Estado da busca e produtos
const buscaProduto = ref('');
const categoriaSelecionada = ref('Todos');

// Categorias
const categorias = ref([
  { nome: 'Misc', cor: 'red-lighten-3' },
  { nome: 'Desks', cor: 'green-lighten-3' },
  { nome: 'Chairs', cor: 'orange-lighten-3' }
]);

// Produtos mockados (baseado na imagem)
const produtos = ref([
  { id: 1, nome: 'Virtual Interior Design', icone: 'mdi-pencil-ruler', categoria: 'Misc', codigoBarras: '7891234560001' },
  { id: 2, nome: 'Virtual Home Staging', icone: 'mdi-home', categoria: 'Misc', codigoBarras: '7891234560002' },
  { id: 3, nome: 'Office Chair', icone: 'mdi-chair-rolling', categoria: 'Chairs', preco: 299.90, codigoBarras: '7908458322596' },
  { id: 4, nome: 'Office Lamp', icone: 'mdi-lamp', categoria: 'Misc', preco: 89.90, codigoBarras: '7891234560004' },
  { id: 5, nome: 'Office Design Software', icone: 'mdi-laptop', categoria: 'Misc', preco: 499.90, codigoBarras: '7891234560005' },
  { id: 6, nome: 'Desk', icone: 'mdi-desk', categoria: 'Desks', preco: 799.90, codigoBarras: '7891234560006' },
  { id: 7, nome: 'Customizable Desk', icone: 'mdi-desk', categoria: 'Desks', preco: 999.90, codigoBarras: '7891234560007' },
  { id: 8, nome: 'Corner Desk Right Sit', icone: 'mdi-desk', categoria: 'Desks', preco: 1099.90, codigoBarras: '7891234560008' },
  { id: 9, nome: 'Large Cabinet', icone: 'mdi-archive', categoria: 'Misc', preco: 599.90, codigoBarras: '7891234560009' },
  { id: 10, nome: 'Storage Box', icone: 'mdi-package-variant', categoria: 'Misc', preco: 149.90, codigoBarras: '7891234560010' },
  { id: 11, nome: 'Large Desk', icone: 'mdi-desk', categoria: 'Desks', preco: 1299.90 },
  { id: 12, nome: 'Pedal Bin', icone: 'mdi-delete', categoria: 'Misc', preco: 79.90 },
  { id: 13, nome: 'Cabinet with Doors', icone: 'mdi-file-cabinet', categoria: 'Misc', preco: 399.90 },
  { id: 14, nome: 'Conference Chair', icone: 'mdi-seat', categoria: 'Chairs', preco: 349.90 },
  { id: 15, nome: 'Office Chair Black', icone: 'mdi-chair-rolling', categoria: 'Chairs', preco: 399.90 },
  { id: 16, nome: 'Corner Desk Left Sit', icone: 'mdi-desk', categoria: 'Desks', preco: 1099.90 },
  { id: 17, nome: 'Drawer Black', icone: 'mdi-dresser', categoria: 'Misc', preco: 299.90 },
  { id: 18, nome: 'Flipover', icone: 'mdi-presentation', categoria: 'Misc', preco: 499.90 },
  { id: 19, nome: 'Desk Stand with Screen', icone: 'mdi-monitor-stand', categoria: 'Desks', preco: 899.90 },
  { id: 20, nome: 'Individual Workplace', icone: 'mdi-seat', categoria: 'Chairs', preco: 449.90 },
  { id: 21, nome: 'Acoustic Bloc Screens', icone: 'mdi-wall', categoria: 'Misc', preco: 699.90 },
  { id: 22, nome: 'Drawer', icone: 'mdi-dresser', categoria: 'Misc', preco: 279.90 },
  { id: 23, nome: 'Four Person Desk', icone: 'mdi-desk', categoria: 'Desks', preco: 1999.90 },
  { id: 24, nome: 'Large Meeting Table', icone: 'mdi-table-chair', categoria: 'Desks', preco: 2499.90 },
  { id: 25, nome: 'Two-Seat Sofa', icone: 'mdi-sofa', categoria: 'Chairs', preco: 1499.90 },
  { id: 26, nome: 'Desk Organizer', icone: 'mdi-tray', categoria: 'Misc', preco: 59.90 },
  { id: 27, nome: 'Desk Pad', icone: 'mdi-rectangle', categoria: 'Misc', preco: 79.90 },
  { id: 28, nome: 'Monitor Stand', icone: 'mdi-monitor', categoria: 'Misc', preco: 199.90 },
  { id: 29, nome: 'Office Combo', icone: 'mdi-desk', categoria: 'Desks', preco: 2999.90 },
  { id: 30, nome: 'Wall Shelf Unit', icone: 'mdi-bookshelf', categoria: 'Misc', preco: 349.90 },
  { id: 31, nome: 'Small Shelf', icone: 'mdi-bookshelf', categoria: 'Misc', preco: 199.90 },
  { id: 32, nome: 'Letter Tray', icone: 'mdi-tray', categoria: 'Misc', preco: 49.90 },
  { id: 33, nome: 'Magnetic Board', icone: 'mdi-clipboard', categoria: 'Misc', preco: 129.90 },
  { id: 34, nome: 'LED Lamp', icone: 'mdi-lamp', categoria: 'Misc', preco: 119.90 },
  { id: 35, nome: 'Newspaper Rack', icone: 'mdi-newspaper', categoria: 'Misc', preco: 89.90 },
  { id: 36, nome: 'Whiteboard Pen', icone: 'mdi-pen', categoria: 'Misc', preco: 29.90 }
]);

// Carrinho
const itensCarrinho = ref([]);

// Produtos filtrados
const produtosFiltrados = computed(() => {
  let resultado = produtos.value;

  if (categoriaSelecionada.value !== 'Todos') {
    resultado = resultado.filter(p => p.categoria === categoriaSelecionada.value);
  }

  if (buscaProduto.value) {
    resultado = resultado.filter(p =>
      p.nome.toLowerCase().includes(buscaProduto.value.toLowerCase())
    );
  }

  return resultado;
});

// Total do carrinho
const totalCarrinho = computed(() => {
  return itensCarrinho.value.reduce((total, item) => {
    return total + (item.preco * item.quantidade);
  }, 0);
});

// Verificar se deve abrir o modal ao montar o componente
onMounted(() => {
  if (route.query.abrirModal === 'true') {
    mostrarModalAbertura.value = true;
    router.replace({ name: 'pdv' });
  }
});

// Funções
const handleAberturaCaixa = (dados) => {
  console.log('Caixa aberto com:', dados);
  caixaAberto.value = true;
  // Aqui você pode salvar os dados de abertura do caixa
};

const adicionarProduto = (produto) => {
  const itemExistente = itensCarrinho.value.find(item => item.id === produto.id);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    itensCarrinho.value.push({
      ...produto,
      quantidade: 1,
      preco: produto.preco || 99.90 // Preço padrão se não tiver
    });
  }
};

const aumentarQuantidade = (index) => {
  itensCarrinho.value[index].quantidade++;
};

const diminuirQuantidade = (index) => {
  if (itensCarrinho.value[index].quantidade > 1) {
    itensCarrinho.value[index].quantidade--;
  } else {
    removerItem(index);
  }
};

const removerItem = (index) => {
  itensCarrinho.value.splice(index, 1);
};

const finalizarVenda = () => {
  if (itensCarrinho.value.length === 0) {
    return;
  }

  // Salvar dados da venda na sessão
  const dadosVenda = {
    itens: itensCarrinho.value,
    total: totalCarrinho.value,
    data: new Date().toISOString()
  };

  sessionStorage.setItem('dadosVenda', JSON.stringify(dadosVenda));

  // Navegar para tela de pagamento
  router.push({ name: 'pdv_pagamento' });
};

const abrirLeitorBarras = () => {
  mostrarLeitorBarras.value = true;
};

const handleCodigoLido = (codigo) => {
  console.log('Código de barras lido:', codigo);

  // Buscar produto pelo código de barras
  const produtoEncontrado = produtos.value.find(p =>
    p.codigoBarras === codigo || p.id.toString() === codigo
  );

  if (produtoEncontrado) {
    adicionarProduto(produtoEncontrado);
    // Você pode adicionar uma notificação de sucesso aqui
  } else {
    // Produto não encontrado - você pode adicionar uma notificação de erro aqui
    console.log('Produto não encontrado com o código:', codigo);
  }

  // Alternativamente, você pode usar o código para buscar no campo de busca
  buscaProduto.value = codigo;
};

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
</script>

<style scoped>
.pdv-container {
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
.pdv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: var(--bg-color-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.caixa-numero {
  font-weight: bold;
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-field {
  width: 300px;
}

/* Conteúdo */
.pdv-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Área de Produtos */
.produtos-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

.categorias-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  overflow-y: auto;
  padding-right: 8px;
}

.produto-card {
  background-color: var(--bg-color-secondary);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;
}

.produto-card:hover {
  transform: translateY(-4px);
  border-color: var(--text-color-laranja);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.produto-imagem {
  margin-bottom: 8px;
  color: var(--text-color);
  opacity: 0.7;
}

.produto-nome {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
  min-height: 32px;
}

.produto-estoque {
  font-size: 10px;
  opacity: 0.6;
  position: absolute;
  bottom: 8px;
  right: 8px;
}

/* Área do Carrinho */
.carrinho-area {
  width: 400px;
  background-color: var(--bg-color-secondary);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.carrinho-lista {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.carrinho-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.carrinho-titulo {
  font-size: 14px;
  opacity: 0.7;
}

.carrinho-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.5;
}

.itens-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-carrinho {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: var(--bg-color);
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-nome {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.item-preco {
  font-size: 12px;
  opacity: 0.7;
}

.item-quantidade {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

/* Footer do Carrinho */
.carrinho-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tabs-footer {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.total-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background-color: var(--bg-color);
  border-radius: 8px;
}

.total-label {
  font-size: 16px;
  font-weight: 500;
}

.total-valor {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-color-laranja);
}

.btn-finalizar {
  font-weight: bold;
}

/* Scrollbar customizada */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>

