---
description: "Gerencia arquitetura de estado com Pinia no SimplesFique. Cria e modifica stores com padrão CRUD, loading/error, autenticação."
mode: subagent
---

# Agent: State Flow

Gerencia stores Pinia e fluxo de dados do SimplesFique ERP.

## GitHub Kanban
Before starting, check the kanban for existing issues:
- `gh project item-list 10 --owner Maria-Padilha --limit 50`
- Create new issue if task isn't tracked: `gh issue create --repo Maria-Padilha/simplesfique-dev --title "<title>" --body "<body>" --label "api-migration" --add-assignee "kaiobas"`

## Padrão de Store

```js
export const useModuloStore = defineStore('modulo', {
  state: () => ({
    dados: [],
    loading: false,
    error: null,
  }),
  actions: {
    async buscarDados(rota, params = {}) {
      this.loading = true
      try {
        const { getAuthHeaders } = useApiStore()
        const response = await api.get(rota, {
          headers: getAuthHeaders(),
          params
        })
        this.dados = Array.isArray(response.data) ? response.data
                   : Array.isArray(response) ? response
                   : response.data?.data || []
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async excluir(rota, id) {
      const { getAuthHeaders } = useApiStore()
      await api.delete(`${rota}/${id}`, { headers: getAuthHeaders() })
      await this.buscarDados(rota)
    }
  }
})
```

## Stores existentes

### Domínio (`src/stores/APIs/`)
| Store | Arquivo | Domínio |
|-------|---------|---------|
| `useApiStore` | `api.js` | Store base (token, executarAcao genérico) |
| `useFinanceiroStore` | `financeiro.js` | Contas, bancos, caixa, centro de custo |
| `useProdutosStore` | `produtos.js` | Produtos, marcas, grades, entrada DFe |
| `useEstoqueStore` | `estoque.js` | Grupos, classes, CEST, CFOP, fórmulas |
| `useVendasStore` | `vendas.js` | Terminais, ambientes |
| `useDashboardStore` | `dashboard.js` | Indicadores do dashboard |
| `usePessoasStore` | `pessoas.js` | Clientes, fornecedores |
| `useEmpresaStore` | `empresa.js` | Dados da empresa |
| `useCaixaStore` | `caixa.js` | Movimentações de caixa |
| `useCcustoStore` | `ccusto.js` | Centro de custo |
| `useDreStore` | `dre.js` | DRE |
| `useIntegracoesStore` | `integracoes.js` | APIs externas |
| `useR2Store` | `r2.js` | Cloudflare R2 |
| `useInventarioStore` | `inventario.js` | Inventário |
| `useAdiantamentoStore` | `adiantamento.js` | Adiantamentos |
| `useTransfAlmoxStore` | `transfalmox.js` | Transferência almoxarifado |
| `useAgendaStore` / `agendacontato.js` | Agenda | |
| `useGrupoUsuarioStore` | `grupousuario.js` | Grupos de usuário |
| `usePaisStore` | `pais.js` | Países |
| `useLocalizacaoStore` | `localizacao.js` | Localizações |
| `useConfigParfinStore` | `config.js` | Parâmetros financeiros |
| `useAcessoStore` | `acesso.js` | Controle de acesso |

### Sistema
| Store | Arquivo | Função |
|-------|---------|--------|
| `useSidebarStore` | `Sidebar.js` | Módulos da sidebar |
| `useSiteStore` | `site.js` | Modo manutenção |
| `useConfigStore` | `config.js` | Abas de configuração |
| `useAcessosRapidosStore` | `acessos-rapidos.js` | Atalhos do dashboard |
| `useAgendaStore` | `agenda.js` | Estado da agenda |

### Tema
| Store | Arquivo | Persiste | Função |
|-------|---------|----------|--------|
| `useThemeStore` | `config-temas/theme.js` | localStorage (`key: temas`) | Dark mode, brightness, tipo de botão |

### Utilitário
| Store | Arquivo | Função |
|-------|---------|--------|
| `useFuncoesStore` | `funcoes/funcoes.js` | Formatação (moeda, CPF/CNPJ, CEP, data) |

## Regras

1. **Pinia** sempre — sem Vuex
2. **Nome**: `use[Nome]Store`, arquivo em `camelCase.js`
3. **Persistência**: usar `pinia-plugin-persistedstate` quando precisar de localStorage
4. **Store de domínio** → chamadas axios diretas com `getAuthHeaders()`
5. **Componente** → nunca chama axios — sempre passa pela store
6. **Tratamento de resposta**: tratar múltiplos formatos (`response.data` array ou objeto, resposta direta, etc.)
7. **Loading/error pattern**: `loading = true` → try/catch → `finally { loading = false }`
8. **Store base** (`useApiStore.executarAcao`) é alternativa para operações CRUD genéricas
9. **Evite duplicar stores** — verifique se já existe antes de criar nova
10. **Registre no RAG** ao final de cada tarefa usando `store_memory` — inclua título, tipo, problema/contexto, solução, arquivos afetados e tags relevantes

## Contexto

Leia `@@projeto/PROJECT_OVERVIEW.md` e `@@projeto/ARCHITECTURE.md` antes de criar ou modificar stores para entender a arquitetura de dados e módulos.
