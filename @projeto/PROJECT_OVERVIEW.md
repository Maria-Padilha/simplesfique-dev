# SimplesFique — Project Overview

> ERP de gestão empresarial brasileiro (SaaS), full-stack Vue 3 + Vuetify + Pinia.
> Rodando como SPA web e desktop (Electron).

---

## 1. O Produto

**SimplesFique** é uma plataforma completa de gestão para pequenas e médias empresas brasileiras. Oferece módulos de **financeiro**, **fiscal**, **estoque**, **PDV**, **vendas**, **produtos**, **DRE**, **relatórios** e **integrações**.

A landing page institucional apresenta o produto em 4 páginas públicas: Home, Funcionalidades, Integrações e Planos.

### Diferenciais do produto
- Emissão fiscal completa (NF-e, NFS-e, CT-e, MDF-e)
- Controle financeiro integrado (contas a pagar/receber, caixa, banco, conciliação)
- PDV com totem de autoatendimento
- Inventário com contagem pública via token
- Integração com Cloudflare R2 para armazenamento de arquivos
- Integração contábil com sistemas como Phoenix
- Suporte humanizado via WhatsApp e vídeo chamada

---

## 2. Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | Vue 3 (Composition API) + Vite (Vue CLI 5) |
| **UI** | Vuetify 3 + Tailwind CSS 4 + SCSS |
| **Estado** | Pinia (com `pinia-plugin-persistedstate`) |
| **Roteamento** | Vue Router 4 (hash mode) |
| **Gráficos** | ApexCharts (`vue3-apexcharts`) |
| **Máscaras** | `@devindex/vue-mask` |
| **Toast/Notificações** | `vue3-toastify` |
| **Animações** | AOS (scroll reveal), Particles.js (background) |
| **Ícones** | Material Design Icons (`@mdi/font`) |
| **Desktop** | Electron 39 |
| **Backend** | API REST `http://192.168.10.100:9005` (THorse-style) |
| **Storage** | Cloudflare R2 (S3-compatible via AWS SDK) |
| **Fontes** | Google Fonts (Quicksand) via WebFontLoader |

### Dependências principais (destaque)
- `vue` ^3.2.13, `vue-router` ^4.0.3
- `vuetify` ^3.0.0
- `pinia` ^3.0.3
- `@aws-sdk/client-s3` ^3.1043.0 (Cloudflare R2)
- `electron` ^39.1.1
- `primevue` ^4.3.6
- `axios` ^1.12.2
- `html2pdf.js`, `html5-qrcode`, `lucide-vue-next`

---

## 3. Estrutura do Projeto

```
simples-fique/
├── public/                      # Assets estáticos
│   ├── index.html               # Entry point HTML
│   ├── _redirects               # SPA redirect rule (/* /index.html 200)
│   ├── favicon.ico
│   ├── static/Quicksand-*.ttf   # Fontes locais
│   └── templates/               # Templates CSV de importação
├── src/
│   ├── main.js                  # Bootstrap da aplicação
│   ├── App.vue                  # Componente raiz
│   ├── assets/
│   │   ├── img/                 # Imagens (logo, perfil, segmentos, gifs)
│   │   └── scss/                # Estilos globais (index, theme, tailwind, components)
│   ├── components/
│   │   ├── base/                # Componentes reutilizáveis
│   │   │   ├── alerts/          # AlertWarning
│   │   │   ├── config/          # Abas de configuração do sistema
│   │   │   ├── image/           # Upload de imagens
│   │   │   ├── media/           # CRUD de mídias (api, show, save, delete)
│   │   │   ├── menu/            # Menus de busca (NCM, marcas, grupos, CFOP, etc.)
│   │   │   ├── modais/          # Modais (cadastro, exclusão, agenda, PDF, imagem, etc.)
│   │   │   ├── padrao-paginas/  # Padrões de UI (TopAllPages, TabelaPadrao, BuscaAvancada, etc.)
│   │   │   ├── produtos/        # Forms de entrada e devolução
│   │   │   ├── sidebar/         # Sidebar principal
│   │   │   └── transferencias/  # Transferências bancárias e de caixa
│   │   ├── impressos/           # Templates HTML/JS para relatórios impressos
│   │   ├── particle/            # Particles.js (biblioteca externa embutida)
│   │   └── site/                # Componentes do site institucional (NavBar, FooterBar, TitleSections)
│   ├── examples/                # Exemplos de uso (Cloudflare R2)
│   ├── plugins/                 # Config de plugins (vuetify, webfontloader, particles)
│   ├── router/index.js          # Rotas + navigation guard
│   ├── services/                # Serviços HTTP
│   │   ├── api.js               # API principal (http://192.168.10.100:9005)
│   │   ├── apiLocal.js          # API local (http://192.168.10.100:9010)
│   │   └── cloudflareR2.js     # S3 client para Cloudflare R2
│   ├── stores/                  # Stores Pinia
│   │   ├── APIs/                # Stores por domínio (api, financeiro, produtos, estoque, etc.)
│   │   ├── config-temas/        # Tema (dark mode, brightness)
│   │   └── funcoes/             # Funções utilitárias
│   ├── utils/                   # Utilitários (vazios?)
│   └── views/
│       ├── auth/                # Login, Seleção de Empresa
│       ├── pages/               # Páginas do sistema (autenticadas)
│       ├── site/                # Landing pages (Home, Funcionalidades, Integrações, Planos)
│       └── NotFoundView.vue     # 404
├── electron.js                  # Config do Electron (BrowserWindow 1200x800)
├── @projeto/                    # Harness de contexto do projeto
│   └── PROJECT_OVERVIEW.md      # Este arquivo
├── .claudeignore                # Arquivos ignorados pelo Claude/opencode
├── .gitignore
└── package.json
```

---

## 4. Rotas da Aplicação

### Site (público)
| Rota | View | Descrição |
|------|------|-----------|
| `/` | `HomeSiteView` | Landing page institucional |
| `/funcionalidades` | `FuncionalidadesSiteView` | Funcionalidades do sistema |
| `/integracoes` | `IntegracoesSiteView` | Integrações disponíveis |
| `/planos` | `PlanosSiteView` | Planos e preços |

### Auth
| Rota | View | Descrição |
|------|------|-----------|
| `/login` | `LoginView` | Login do usuário |
| `/empresa` | `EmpresaView` | Seleção de empresa (token-based) |

### Sistema (autenticado, prefixo `/paginas/`)
| Grupo | Rotas principais |
|-------|-----------------|
| **Home** | `/paginas/home` |
| **Perfil** | `/paginas/perfil` |
| **Config** | `/paginas/configuracoes` |
| **Financeiro** | `pagar`, `receber`, `caixa` (+ abertura, lançamento), `contacorrente`, `centrodecusto` (+ cadastro, previsão, debito real), `planoconta`, `autorizacao`, `baixa`, `baixareceb`, `transferencia`, `carteiracobranca`, `banco/movimentacao` |
| **DRE** | `financeiro/dre`, `financeiro/relatorio/dre` |
| **Estorno** | `estorno/pagar`, `estorno/receber` |
| **Adiantamento** | `adiantamento/cliente`, `adiantamento/fornecedor` |
| **PDV** | `pdv`, `pdv/pagamento`, `pdv/operacao`, `pdv/caixa`, `pdv/totem` |
| **Vendas** | `vendas/terminal`, `vendas/ambiente`, `vendas/motivo-perda-orcamento` |
| **Produtos** | `produtos`, `produtos/:id`, `produtos/importar`, `produtos/grade`, `produtos/local`, `entradadfe`, `entradadfe/nova`, `entradadfe/visualizar/:id`, `deventrada`, `deventrada/nova`, `certificados` |
| **Estoque** | `estoque/grupo`, `estoque/classe`, `estoque/aliquotauf`, `estoque/cest`, `estoque/formulas`, `estoque/posicao`, `estoque/grupo-tributacao`, `estoque/transfalmox` |
| **Inventário** | `inventario` |
| **Fiscal** | `fiscal/notadeservico` |
| **Manutenção** | `manutencao/clientes`, `manutencao/empresas`, `manutencao/usuarios`, `manutencao/grupousuario`, `manutencao/formulas`, `manutencao/mensagens-tributos` |
| **Integrações** | `integracoes/api-externa`, `integracao/cloudflare-r2`, `integracoes/loja` |
| **Relatórios** | `relatorios/financeiro`, `relatorios/fiscal` |

### Pública (com token)
| Rota | Descrição |
|------|-----------|
| `/inventario/contagem/:emp/:id` | Contagem de inventário para terceiros (sem autenticação) |

### Navigation Guard
- Verifica modo de manutenção (se ativo, redireciona para `/manutencao`)
- Valida token na rota `/empresa` chamando `GET /empsaas` com Bearer token
- Rotas sem autenticação explícita ficam acessíveis sem verificação

---

## 5. Stores (Gerenciamento de Estado)

### Stores de Domínio (APIs/)
Cada store encapsula as chamadas CRUD para um domínio específico.

| Store | Responsabilidade |
|-------|-----------------|
| `api.js` | Store base: token, dataEmpresa, tokenEmpresa, busca e ação genérica |
| `financeiro.js` | Contas corrente, bancos, contas a pagar/receber, baixas, estornos, PIX, centro de custo, histórico contábil |
| `produtos.js` | CRUD de produtos, marcas, medidas, garantias, NCM, entrada DFe, devolução |
| `estoque.js` | Grupos, classes, CEST, aliquotas UF, NBS, fórmulas, almoxarifados, CFOPs |
| `vendas.js` | Motivos de perda de orçamento, terminais, ambientes |
| `dashboard.js` | Indicadores: pagar/receber, saldos, fluxo de caixa mensal/diário |
| `pessoas.js` | Pessoas (clientes, fornecedores, colaboradores) |
| `empresa.js` | Dados da empresa logada |
| `caixa.js` | Movimentações de caixa |
| `ccusto.js` | Centro de custo |
| `dre.js` | DRE (Demonstrativo de Resultados) |
| `config.js` | Configurações do sistema |
| `acesso.js` | Controle de acesso |
| `adiantamento.js` | Adiantamentos |
| `transfalmox.js` | Transferência entre almoxarifados |
| `inventario.js` | Inventário/contagem |
| `localizacao.js` | Localizações de produto |
| `pais.js` | Países para cadastro |
| `agenda.js` / `agendacontato.js` | Agenda e contatos |
| `grupousuario.js` | Grupos de usuário |
| `integracoes.js` | APIs externas e loja de integrações |
| `r2.js` | Cloudflare R2 |

### Stores de Sistema
| Store | Responsabilidade |
|-------|-----------------|
| `Sidebar.js` | Estrutura dinâmica da sidebar (módulos, submenus, permissões) |
| `site.js` | Modo de manutenção |
| `config.js` | Abas de configuração ativa |
| `acessos-rapidos.js` | Atalhos do dashboard |
| `agenda.js` | Estado da agenda |

### Stores de Config/Tema
| Store | Responsabilidade |
|-------|-----------------|
| `theme.js` | Dark mode, brightness, tipo de botão (persistido localStorage) |

### Store de Funções
| Store | Utilitários |
|-------|------------|
| `funcoes.js` | Normalização de moeda, parsing de XML NFe (entrada DFe, devolução) |

---

## 6. Serviços Externos

| Serviço | URL | Uso |
|---------|-----|-----|
| **API Principal** | `http://192.168.10.100:9005` | Todas as operações CRUD do sistema (THorse-style) |
| **API Local** | `http://192.168.10.100:9010` | Operações auxiliares |
| **Media API** | `http://192.168.10.79:3005` | Upload/download de mídias |
| **Cloudflare R2** | via AWS SDK (S3) | Armazenamento de arquivos (imagens, boletos) |

### Cloudflare R2 (detalhes)
- Serviço S3-compatible da Cloudflare
- Endpoint: `https://<account-id>.r2.cloudflarestorage.com`
- Operações: presigned URL upload/download, delete, list objects
- Configurado via variáveis de ambiente `VUE_APP_CLOUDFLARE_*`

---

## 7. UI e Padrões de Componentes

### Biblioteca de Componentes Base
- **`TopAllPages`**: Cabeçalho padronizado de página (título, breadcrumb, ações)
- **`TabelaPadrao`**: Tabela com filtros, paginação, ordenação e ações
- **`BuscaAvancada`** / **`BuscaAvancadaBaixa`** / **`BuscaAvancadaAutorizacao`**: Filtros avançados
- **`FormsExpandTransition`** / **`BotaoExpandTransition`**: Animações de expansão
- **Sidebar**: Dinâmica, baseada em módulos com submenus e permissões
- **Modais**: `CadastrarModal`, `ExcluirModal`, `AgendaModal`, `AcessoNegadoModal`, `ErrorAlertModal`, `RedirectModal`, `PdfPreviewModal`, `ExibirImagemModal`, `VincularProdutos`, `LeitorCodigoBarrasModal`, `ConfigAcessosRapidosModal`, `ExportacaoModal`, `AberturaCaixaModal`, `BaixaCaixaModal`, `BaixaBancoModal`

### Temas
- Dark mode toggle com persisted state (localStorage)
- Controle de brilho (brightness CSS filter)
- Classes `dark`/`light` no `<html>`
- Botões configuráveis (tipo)

### Site Institucional
- NavBar com navegação entre páginas
- FooterBar com links e informações
- Animações AOS (scroll reveal)
- ParticleBackground (particles.js)

---

## 8. Electron

- Janela: 1200x800
- Segurança: `nodeIntegration: false`, `contextIsolation: true`
- Dev: carrega `http://localhost:8080`
- Prod: carrega `dist/index.html`
- Comandos: `npm run dev` (web + electron simultâneo), `npm run electron-build`

---

## 9. Convenções e Padrões de Código

### Nomenclatura
- **Views**: `PascalCaseView.vue` (e.g., `ProdutosDetalhesView.vue`)
- **Components**: `PascalCase.vue` (e.g., `SidebarComponent.vue`)
- **Stores**: `camelCase.js` com export `use[Nome]Store` (e.g., `useFinanceiroStore`)
- **Services**: `camelCase.js` (e.g., `cloudflareR2.js`)
- **Rotas**: `snake_case` nos names (e.g., `financeiro_centrodecusto_cadastro`)
- **Caminhos de URL**: `kebab-case` (e.g., `/paginas/financeiro/centrodecusto/cadastro`)

### Padrões de Código
- **Composition API** com `<script setup>` na maioria dos componentes
- **Pinia** para estado global, com `pinia-plugin-persistedstate` para persistência
- **Vuetify** components com classes utilitárias Tailwind
- **SCSS** estruturado em `src/assets/scss/` (index, theme, tailwind, components, utilities)
- **Modais** abertos via variável reativa `dialog` no próprio componente
- **CRUD stores** seguem padrão: `buscarDados(rota, params)` + `executarAcao(rota, action, dados)`
- **API calls** centralizadas nas stores, não nos componentes

### Estrutura de Módulo
Cada módulo (financeiro, produtos, estoque, etc.) segue o padrão:
1. Store de API em `src/stores/APIs/`
2. View(s) em `src/views/pages/<modulo>/`
3. Componentes específicos em `src/components/base/<modulo>/` (quando necessário)
4. Rotas registradas em `src/router/index.js`

---

## 10. Observações / Problemas Conhecidos

- **Arquivos duplicados**: Vários views com sufixo ` 2`, ` 3`, ` 4` (e.g., `FormulaView 2`, `DreView 2`, `RelatorioDreView 2-4`, `acessos-rapidos 2`) — indicam refatoração incompleta ou merge pendente
- **Utils vazio**: `src/utils/` existe mas não contém arquivos
- **ESLint**: Configurado mas sem regras específicas
- **Backend URL hardcoded**: `http://192.168.10.100:9005` fixo em `src/services/api.js`
- **Loja de Integrações**: View existe mas pode estar em desenvolvimento
- **Relatório Fiscal**: Aponta para a mesma view de NotaDeServico (rota 447-448 do router)
