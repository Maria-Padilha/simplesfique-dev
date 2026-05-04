import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAcessosRapidosStore = defineStore('acessos-rapidos', () => {
  // Lista de todas as telas disponíveis no sistema
  const telasDisponiveis = ref([
    { id: 1, titulo: 'Home', route: '/paginas/home', icon: 'mdi-home', categoria: 'Geral' },
    { id: 2, titulo: 'Perfil', route: '/paginas/perfil', icon: 'mdi-account', categoria: 'Geral' },
    { id: 3, titulo: 'Configurações', route: '/paginas/configuracoes', icon: 'mdi-cog', categoria: 'Geral' },
    
    // Financeiro
    { id: 10, titulo: 'Contas a Pagar', route: '/paginas/financeiro/pagar', icon: 'mdi-cash-minus', categoria: 'Financeiro' },
    { id: 11, titulo: 'Contas a Receber', route: '/paginas/financeiro/receber', icon: 'mdi-cash-plus', categoria: 'Financeiro' },
    { id: 12, titulo: 'Caixa', route: '/paginas/financeiro/caixa', icon: 'mdi-cash-register', categoria: 'Financeiro' },
    { id: 13, titulo: 'Conta Corrente', route: '/paginas/financeiro/contacorrente', icon: 'mdi-bank', categoria: 'Financeiro' },
    { id: 14, titulo: 'Centro de Custo', route: '/paginas/financeiro/centrodecusto/cadastro', icon: 'mdi-chart-box', categoria: 'Financeiro' },
    { id: 15, titulo: 'Plano de Contas', route: '/paginas/financeiro/planoconta', icon: 'mdi-file-tree', categoria: 'Financeiro' },
    
    // Pessoas
    { id: 20, titulo: 'Clientes', route: '/paginas/pessoas/clientes', icon: 'mdi-account-group', categoria: 'Pessoas' },
    { id: 21, titulo: 'Fornecedores', route: '/paginas/pessoas/fornecedores', icon: 'mdi-truck', categoria: 'Pessoas' },
    { id: 22, titulo: 'Transportadores', route: '/paginas/pessoas/transportadores', icon: 'mdi-truck-delivery', categoria: 'Pessoas' },
    { id: 23, titulo: 'Vendedores', route: '/paginas/pessoas/vendedores', icon: 'mdi-account-tie', categoria: 'Pessoas' },
    
    // Produtos
    { id: 30, titulo: 'Produtos', route: '/paginas/produtos/produtos', icon: 'mdi-package-variant', categoria: 'Produtos' },
    { id: 31, titulo: 'Grupos', route: '/paginas/produtos/grupos', icon: 'mdi-folder-multiple', categoria: 'Produtos' },
    { id: 32, titulo: 'Marcas', route: '/paginas/produtos/marcas', icon: 'mdi-tag', categoria: 'Produtos' },
    
    // Estoque
    { id: 40, titulo: 'Estoque', route: '/paginas/estoque/estoque', icon: 'mdi-warehouse', categoria: 'Estoque' },
    { id: 41, titulo: 'Inventário', route: '/paginas/estoque/inventario', icon: 'mdi-clipboard-list', categoria: 'Estoque' },
    
    // Relatórios
    { id: 50, titulo: 'DRE', route: '/paginas/dre', icon: 'mdi-chart-line', categoria: 'Relatórios' },
    { id: 51, titulo: 'Relatórios', route: '/paginas/relatorios', icon: 'mdi-file-chart', categoria: 'Relatórios' },
  ])

  // Acessos rápidos selecionados pelo usuário (padrões iniciais)
  const acessosRapidos = ref([
    { id: 1, titulo: 'Home', route: '/paginas/home', icon: 'mdi-home' },
    { id: 10, titulo: 'Contas a Pagar', route: '/paginas/financeiro/pagar', icon: 'mdi-cash-minus' },
    { id: 11, titulo: 'Contas a Receber', route: '/paginas/financeiro/receber', icon: 'mdi-cash-plus' },
    { id: 12, titulo: 'Caixa', route: '/paginas/financeiro/caixa', icon: 'mdi-cash-register' },
    { id: 20, titulo: 'Clientes', route: '/paginas/pessoas/clientes', icon: 'mdi-account-group' },
  ])

  // Adicionar tela aos acessos rápidos
  const adicionarAcesso = (tela) => {
    if (!acessosRapidos.value.find(a => a.id === tela.id)) {
      acessosRapidos.value.push({ ...tela })
    }
  }

  // Remover tela dos acessos rápidos
  const removerAcesso = (telaId) => {
    const index = acessosRapidos.value.findIndex(a => a.id === telaId)
    if (index > -1) {
      acessosRapidos.value.splice(index, 1)
    }
  }

  // Verificar se tela está nos acessos rápidos
  const isAcessoRapido = (telaId) => {
    return acessosRapidos.value.some(a => a.id === telaId)
  }

  // Reordenar acessos rápidos
  const reordenarAcessos = (novosAcessos) => {
    acessosRapidos.value = novosAcessos
  }

  // Resetar para padrão
  const resetarParaPadrao = () => {
    acessosRapidos.value = [
      { id: 1, titulo: 'Home', route: '/paginas/home', icon: 'mdi-home' },
      { id: 10, titulo: 'Contas a Pagar', route: '/paginas/financeiro/pagar', icon: 'mdi-cash-minus' },
      { id: 11, titulo: 'Contas a Receber', route: '/paginas/financeiro/receber', icon: 'mdi-cash-plus' },
      { id: 12, titulo: 'Caixa', route: '/paginas/financeiro/caixa', icon: 'mdi-cash-register' },
      { id: 20, titulo: 'Clientes', route: '/paginas/pessoas/clientes', icon: 'mdi-account-group' },
    ]
  }

  return {
    telasDisponiveis,
    acessosRapidos,
    adicionarAcesso,
    removerAcesso,
    isAcessoRapido,
    reordenarAcessos,
    resetarParaPadrao,
  }
}, {
  persist: {
    key: 'acessos-rapidos',
    storage: localStorage,
  }
})
