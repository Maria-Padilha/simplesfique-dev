# SPEC — SimplesFique

> Documento de requisitos do SimplesFique, ERP de gestão empresarial para pequenas e médias empresas.

---

## Problema

Pequenas e médias empresas brasileiras têm dificuldade em controlar suas finanças, estoque, vendas e operações do dia a dia. O uso de planilhas, sistemas desconectados e processos manuais gera retrabalho, falta de visão financeira e dificuldade de crescimento.

O SimplesFique resolve isso centralizando a gestão em uma única plataforma integrada, com foco em **facilitar o controle financeiro** e dar **visibilidade sobre o crescimento do negócio**.

---

## Usuários

| Perfil | Descrição |
|--------|-----------|
| **Administrador do negócio** | Gestor que precisa de visão consolidada do financeiro, vendas e resultados |
| **Funcionário do financeiro** | Opera contas a pagar/receber, conciliação, fluxo de caixa |
| **Operador de PDV** | Utiliza o sistema no ponto de venda (balcão) |
| **Garçom / Atendente** | Operam o totem e o PDV em ambiente de restaurante |
| **Contador** | Acessa dados fiscais e contábeis para fechamento |
| **Cliente (inventário)** | Acesso público via token para contagem de estoque |

---

## Funcionalidades

### Essenciais

| Funcionalidade | Descrição |
|----------------|-----------|
| **Gestão Financeira** | Contas a pagar e a receber, caixa, conciliação bancária, centro de custo, DRE |
| **PDV (Ponto de Venda)** | Venda rápida no balcão, pagamento, operação de caixa |
| **Totem de Autoatendimento** | Cliente faz o próprio pedido sem intervenção do atendente |
| **Integração TEF** | Pagamento na maquininha integrada ao sistema |
| **Gestão de Produtos** | Cadastro, grade, localização, certificados, importação em lote |
| **Gestão de Estoque** | Posição, grupos, classes, transferência entre almoxarifados, inventário |
| **Gestão de Vendas** | Terminal de vendas, ambientes, motivos de perda de orçamento |
| **Emissão Fiscal** | NF-e, NFS-e, CT-e, MDF-e, Nota de Serviço |
| **Relatórios** | Financeiro, fiscal, estoque, vendas, caixa, DRE |
| **Dashboard** | Indicadores financeiros, fluxo de caixa, saldos |
| **Integração Cloudflare R2** | Armazenamento de arquivos em nuvem (imagens, boletos) |
| **Múltiplas Empresas** | Um mesmo usuário gerencia vários CNPJs |

### Fora do Escopo

- Folha de pagamento / RH
- Produção industrial (ordem de produção, PCP)
- E-commerce próprio
- Backend / API server (mantido por equipe externa)
- Aplicativo mobile nativo

---

## Módulos

| Módulo | Responsabilidade |
|--------|-----------------|
| **Financeiro** | Contas a pagar/receber, caixa, banco, centro de custo, DRE, adiantamentos, estornos, conciliação |
| **Vendas** | Terminal de vendas, ambientes, motivo de perda de orçamento |
| **PDV** | Venda no balcão, pagamento, operação, caixa, totem de autoatendimento |
| **Produtos** | Cadastro, grades, localizações, certificados, entrada DFe, devolução |
| **Estoque** | Posição, grupos, classes, CEST, aliquotas, fórmulas, transferências, inventário |
| **Fiscal** | Nota de Serviço, plano de contas fiscal |
| **Relatórios** | Financeiro, fiscal, estoque, vendas, caixa, DRE |
| **Integrações** | API externa, Cloudflare R2, loja de integrações |
| **Manutenção** | Clientes, empresas, usuários, grupos de usuário, fórmulas, mensagens tributárias |
| **Configurações** | Geral, parâmetros financeiros, acesso de usuários, tema |

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | Vue 3 (Composition API + Options API) |
| **Build** | Vue CLI 5 (Webpack) |
| **UI** | Vuetify 3 + Tailwind CSS 4 + SCSS |
| **Estado** | Pinia 3 com `pinia-plugin-persistedstate` |
| **Roteamento** | Vue Router 4 |
| **HTTP** | Axios |
| **Gráficos** | ApexCharts |
| **Notificações** | vue3-toastify |
| **Ícones** | Material Design Icons + Lucide Vue Next |
| **Desktop** | Electron 39 |
| **Storage** | Cloudflare R2 (S3-compatible) |
| **Fontes** | Google Fonts (Quicksand) |

> Backend: API REST externa (não documentada neste SPEC).

---

## Constraints Técnicas

| Constraint | Descrição |
|------------|-----------|
| **Performance** | O sistema deve ser rápido, especialmente no PDV e totem — operações em segundos |
| **UX Intuitiva** | Interface simples e fácil de usar, curva de aprendizado mínima |
| **Disponibilidade** | Sistema em nuvem, acessível via browser (SPA) |
| **Offline** | *(decisão em aberto)* não foi definido se deve funcionar offline |
| **Multiempresa** | Deve suportar gestão de múltiplos CNPJs na mesma conta |
| **Segurança** | `nodeIntegration: false`, `contextIsolation: true` no Electron |
| **Tema** | Suporte a dark/light mode com controle de brilho |

---

## Critérios de Aceitação

1. **Gestão Financeira**: usuário consegue cadastrar, editar, baixar e estornar contas a pagar e a receber; visualizar fluxo de caixa e DRE
2. **PDV**: operador consegue registrar venda, processar pagamento (dinheiro, cartão, TEF), abrir/fechar caixa
3. **Totem**: cliente consegue fazer autoatendimento sem ajuda do operador
4. **Produtos**: usuário consegue cadastrar produtos com grade, localização e importar em lote via CSV
5. **Estoque**: usuário consegue ver posição de estoque, transferir entre almoxarifados e realizar contagem de inventário
6. **Fiscal**: usuário consegue emitir Nota de Serviço e acessar documentos fiscais
7. **Relatórios**: usuário consegue gerar relatórios financeiros, de vendas, estoque e DRE
8. **Integrações**: usuário consegue configurar Cloudflare R2 e APIs externas
9. **Multiempresa**: usuário logado consegue alternar entre empresas sem relogar
10. **Desktop (Electron)**: o sistema abre como aplicativo desktop com a mesma funcionalidade da versão web

---

## Decisões em Aberto

- Suporte offline (PDV funcionar sem internet?)
- Aplicativo mobile nativo (ou manter apenas SPA responsivo + Electron?)
- Limite de performance máximo aceitável (ex: tempo de resposta < 2s)
- Uso de TypeScript no futuro (projeto atualmente é JavaScript puro)
