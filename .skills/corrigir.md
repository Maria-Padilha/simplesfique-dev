# Skill: Corrigir

Fluxo para corrigir problemas comuns no SimplesFique ERP.

## Problemas comuns e soluções

### 1. Arquivo duplicado (com sufixo ` 2`, ` 3`)

**Causa**: Refatoração incompleta ou merge conflitado.

**Ação**:
1. Compare os dois arquivos com `diff`
2. Se um é claramente a versão mais recente → delete o antigo e renomeie o novo
3. Se são diferentes → mescle mantendo a melhor versão de cada parte
4. Atualize todos os imports que referenciam o arquivo deletado
5. Delete o arquivo obsoleto

### 2. Componente usando Options API

**Causa**: Código antigo ou copiado de fonte externa.

**Ação**:
1. Migre `export default { data(), methods: {}, computed: {} }` para `<script setup>`
2. `data()` → `ref()` / `reactive()`
3. `methods` → funções soltas no setup
4. `computed` → `computed()`
5. `watch` → `watch()`
6. `mounted` → `onMounted()`

### 3. Store chamando API sem auth headers

**Causa**: Store criada sem seguir o padrão.

**Ação**:
1. Import `useApiStore` de `@/stores/APIs/api`
2. Adicione `getAuthHeaders()` que lê token do store ou localStorage
3. Injete headers em toda chamada `api.get/post/put/delete`

### 4. Componente chamando axios direto

**Causa**: Lógica de API no componente em vez da store.

**Ação**:
1. Mova a chamada para a store correspondente (ou crie uma)
2. No componente, chame `store.acao()` em vez de `api.get()`
3. O componente lê `store.dados` e reage a `store.loading`

### 5. URL hardcoded no componente

**Causa**: IP ou porta fixa usada diretamente.

**Ação**:
1. Mova para `src/services/api.js` ou `src/services/apiLocal.js`
2. Use variável de ambiente: `process.env.VUE_APP_API_URL`
3. Se não existe env, defina em `.env` ou `vue.config.js`

### 6. View muito grande (> 1000 linhas)

**Causa**: Toda a lógica da página em um único arquivo.

**Ação**:
1. Extraia formulários para componentes separados em `src/components/base/<modulo>/`
2. Extraia tabelas e filtros para componentes reutilizáveis
3. A view principal só coordena os subcomponentes

### 7. Rota registrada sem lazy loading

**Causa**: Import direto no topo do router.

**Ação**:
```js
// ❌ Ruim
import PagarView from '@/views/pages/financeiro/pagar/PagarView.vue'

// ✅ Bom
{
  path: '/paginas/financeiro/pagar',
  component: () => import('@/views/pages/financeiro/pagar/PagarView.vue'),
}
```

## Workflow

1. Identifique o problema (use `.skills/review.md` como checklist)
2. Analise o arquivo e entenda o contexto
3. Aplique a correção seguindo a solução indicada
4. Verifique se não quebrou outras partes (imports, referências)
5. Confirme que o padrão do projeto foi seguido
