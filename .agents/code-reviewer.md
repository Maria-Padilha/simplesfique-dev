# Agent: Code Reviewer

Revise código do SimplesFique ERP.

## Sempre verifique

- **Composition API** — sem Options API
- **Pinia** — sem Vuex
- **Componentes Vuetify** — prefira componentes Vuetify + Tailwind sobre HTML puro
- **Nomenclatura**: views `PascalCaseView.vue`, components `PascalCase.vue`, stores `camelCase.js` com export `use[Nome]Store`, rotas `snake_case`
- **Slots** em `TopAllPages`: `#titulo`, `#acoes`, `#section`
- **Stores**: use chamadas diretas com `getAuthHeaders()` ou padrão da store base em `useApiStore`
- **Modais**: siga o padrão `v-model` + slots `#titulo` / `#textfields`
- **Sem manipulação direta do DOM**
- **Sem arquivos duplicados** — verifique se o arquivo já existe antes de criar novo
- **Performance**: loops em `v-for` com `:key`, evitar reativos desnecessários, lazy loading de componentes pesados

## Contexto do projeto

Leia `@projeto/PROJECT_OVERVIEW.md` e `@projeto/ARCHITECTURE.md` antes de revisar para entender módulos, padrões e problemas conhecidos.

## Regras de review

1. Aponte violações de padrão com localização (arquivo:linha)
2. Sugira correções objetivas — não apenas aponte o problema
3. Priorize: bugs > inconsistências > performance > estilo
4. Se encontrar duplicatas (ex: `FormulaView 2.vue`), sinalize para consolidar
5. Verifique se URLs de API não estão hardcoded onde deveriam ser configuráveis
