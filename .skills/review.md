# Skill: Review

Checklist de revisão de código para o SimplesFique ERP.

## Antes de revisar

1. Leia `@@projeto/PROJECT_OVERVIEW.md` — contexto do projeto
2. Leia `@@projeto/ARCHITECTURE.md` — padrões e decisões técnicas
3. Identifique qual módulo a alteração afeta

## Checklist

### Estrutura e padrões
- [ ] **Composition API** (`<script setup>`) — sem Options API
- [ ] **Pinia** para estado — sem Vuex, sem reactive/ref globais
- [ ] **Componentes Vuetify** — sem HTML puro para layout
- [ ] **Slots corretos**: `#titulo`, `#acoes`, `#section` em `TopAllPages`
- [ ] **Modais**: usam o componente existente (`CadastrarModal`, `ExcluirModal`, etc.), não `v-dialog` solto
- [ ] **Nome do arquivo**: PascalCase para .vue, camelCase para .js
- [ ] **Store**: `use[Nome]Store` em arquivo `camelCase.js`

### Correção
- [ ] **Imports**: caminhos relativos corretos, sem imports de arquivos que não existem
- [ ] **Rotas**: lazy loading (`() => import(...)`) para views
- [ ] **Variáveis de ambiente**: sem valores hardcoded onde deveria ser `process.env.VUE_APP_*`
- [ ] **URLs de API**: sem IP/porta fixos em componentes (devem estar em `services/`)
- [ ] **Auth headers**: toda chamada API usa `getAuthHeaders()`

### Performance
- [ ] **`v-for` com `:key` único**
- [ ] **Componentes pesados** com lazy loading ou `defineAsyncComponent`
- [ ] **Watchers** desnecessários? Prefira `computed`
- [ ] **Reatividade**: não criar refs para dados que já estão na store

### Duplicatas
- [ ] Arquivo já existe sem o sufixo ` 2`, ` 3`, ` 4`?
- [ ] Funcionalidade já existe em outro lugar?

### Boas práticas
- [ ] Tratamento de erro (try/catch nas chamadas API)
- [ ] Loading state visível na UI
- [ ] Sem manipulação direta do DOM (exceto em composables específicos)
- [ ] Eventos nomeados consistentemente (`@click`, `@submit.prevent`)

## Como reportar

```
[ARQUIVO:linha] - Problema
[SUGESTÃO]: como corrigir
[IMPACTO]: baixo/médio/alto
```
