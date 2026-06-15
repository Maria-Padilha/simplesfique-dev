# Rules — SimplesFique ERP

Regras obrigatórias para todo código novo ou alteração no projeto.

---

## 1. Composition API (`<script setup>`)

- Todo view/componente novo deve usar `<script setup>` — **proibido Options API** (`export default { data() { } }`)
- Exceção: componentes legados em refatoração, desde que seja para migrar para Composition API

## 2. Store obrigatória para chamadas HTTP

- Nenhuma view pode chamar `api.get()`, `api.post()`, `api.put()` ou `api.delete()` diretamente
- Toda requisição HTTP deve passar pela store Pinia correspondente em `src/stores/APIs/`

## 3. API — payload direto (sem wrapper)

- **API PHP (nova):** payload é enviado direto, sem wrapper — `apiPhp.post('/rota', payload)`
- **API THorse (legado):** usava `{ data: [objeto] }` — manter apenas em stores não migradas
- Correto (PHP): `apiPhp.post('/rota', payload)`
- Correto (THorse): `api.post('/rota', { data: [payload] })`
- Headers de auth são injetados automaticamente pelo interceptor de `apiPhp` ou `api`

## 4. TabelaPadrao obrigatório

- Nenhuma view deve usar `<v-data-table>` diretamente
- Sempre usar `<TabelaPadrao>` que já encapsula busca, paginação, ações (editar/excluir) e diálogo de exclusão

## 5. TopAllPages como wrapper de página

- Toda view de página deve usar `<TopAllPages>` com os 3 slots: `#titulo`, `#acoes`, `#section`
- Proibido criar layout de página avulso com `v-card` solto

## 6. Lazy loading nas rotas

- Views secundárias: `() => import('@/views/...')` — lazy loading obrigatório
- Exceção: apenas views principais (home, login, 404) podem ter import direto

## 7. CSS variables do tema

- Usar classes do tema: `background-secondary`, `background-card`, `background-third`, `texto-color-laranja`
- Proibido usar cores fixas como `color: #F57C00` ou `background: #fff` em estilos não-scoped
- Exceção: scoped styles específicos do componente

## 8. Modais padrão

- Usar os modais existentes em `src/components/base/modais/` em vez de criar `v-dialog` solto
- Se não existir o modal ideal, criar novo componente em `src/components/base/modais/` seguindo os padrões existentes

## 9. Snackbar para feedback

- Toda operação (salvar, excluir, erro) deve mostrar feedback visual com `<v-snackbar>` + helper `mostrarMensagem()`
- Proibido usar `alert()` ou `console.log()` como feedback para o usuário
- Seguir o padrão: `snackbar = reactive({ show: false, message: '', color: 'success' })`

---

## Checklist rápido

| # | Regra | Obrigatório |
|---|-------|-------------|
| 1 | `<script setup>` — sem Options API | ✅ |
| 2 | Chamadas HTTP só na store | ✅ |
| 3 | `{ data: [{}] }` no POST/PUT | ✅ |
| 4 | `<TabelaPadrao>` — sem `v-data-table` direto | ✅ |
| 5 | `<TopAllPages>` com 3 slots | ✅ |
| 6 | Lazy loading nas rotas | ✅ |
| 7 | CSS variables, sem cor fixa | ✅ |
| 8 | Modais padrão, sem `v-dialog` solto | ✅ |
| 9 | Snackbar para feedback | ✅ |
