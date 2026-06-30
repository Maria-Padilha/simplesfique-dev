# Skill: Pinia Store

Padrão para criar stores Pinia no SimplesFique ERP.

## Store de domínio (mais comum)

### Padrão para API PHP (nova)
```js
import { defineStore } from 'pinia'
import apiPhp from '@/services/apiPhp'

export const useModuloStore = defineStore('modulo', {
  state: () => ({
    dados: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalizador: (state) => state.dados.reduce((acc, item) => acc + Number(item.valor), 0),
  },

  actions: {
    async buscarDados(params = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/entidade', { params })
        this.dados = res.data?.data ?? res.data ?? []
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async salvar(dados) {
      this.loading = true
      try {
        // Payload direto (sem wrapper) — padrão PHP
        const res = await apiPhp.post('/entidade', dados)
        await this.buscarDados()
        return res
      } finally {
        this.loading = false
      }
    },

    async atualizar(id, dados) {
      this.loading = true
      try {
        const res = await apiPhp.put(`/entidade/${id}`, dados)
        await this.buscarDados()
        return res
      } finally {
        this.loading = false
      }
    },

    async excluir(id) {
      this.loading = true
      try {
        await apiPhp.delete(`/entidade/${id}`)
        await this.buscarDados()
      } finally {
        this.loading = false
      }
    },
  },
})
```

### Padrão para API THorse (legado, até migrar)

```js
import api from '@/services/api'

async salvar(rota, dados) {
  const res = await api.post(rota, { data: [dados] })
}
```

## Store com persistência (tema, config)

```js
export const useConfigStore = defineStore('config', {
  state: () => ({
    nome: 'valor',
  }),
  persist: {
    key: 'nome-da-chave',         // chave no localStorage
    storage: localStorage,
  },
})
```

## Regras

1. **Nome do arquivo**: `camelCase.js` (ex: `financeiro.js`, `produtos.js`)
2. **Nome da store**: `use[Nome]Store` (ex: `useFinanceiroStore`)
3. **`defineStore('id', ...)`** — o primeiro argumento é o ID único, deve ser o nome do módulo
4. **Sempre usar `getAuthHeaders()`** para chamadas autenticadas
5. **Tratar resposta flexível**: backend pode retornar `res.data`, `res.data.data`, `res.data.rows`, ou `res` direto
6. **Loading/error pattern**: `loading = true` → try/catch → `finally { loading = false }`
7. **API wrapper**: POST e PUT sempre em `{ data: [objeto] }` — padrão THorse para criação/atualização
8. **Recarregar após mutação**: `salvar`, `atualizar`, `excluir` devem chamar `buscarDados` ao final
9. **Store base `useApiStore`** para operações genéricas (alternativa ao padrão direto)
10. **Componente nunca chama axios** — sempre usa a store
