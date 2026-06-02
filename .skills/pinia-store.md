# Skill: Pinia Store

Padrão para criar stores Pinia no SimplesFique ERP.

## Store de domínio (mais comum)

```js
import { defineStore } from 'pinia'
import api from '@/services/api'
import { useApiStore } from './api'

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
    getAuthHeaders() {
      const apiStore = useApiStore()
      const token = apiStore.token || localStorage.getItem('token')
      return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    },

    async buscarDados(rota, params = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(rota, { headers: this.getAuthHeaders(), params })
        this.dados = Array.isArray(res.data) ? res.data
                   : Array.isArray(res) ? res
                   : res.data?.data || res.data?.rows || []
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    /**
     * API padrão THorse: enviar dados dentro de { data: [objeto] }
     */
    async salvar(rota, dados) {
      this.loading = true
      try {
        const res = await api.post(rota, { data: [dados] }, { headers: this.getAuthHeaders() })
        await this.buscarDados(rota)
        return res
      } finally {
        this.loading = false
      }
    },

    async atualizar(rota, id, dados) {
      this.loading = true
      try {
        const res = await api.put(`${rota}/${id}`, { data: [dados] }, { headers: this.getAuthHeaders() })
        await this.buscarDados(rota)
        return res
      } finally {
        this.loading = false
      }
    },

    async excluir(rota, id) {
      this.loading = true
      try {
        await api.delete(`${rota}/${id}`, { headers: this.getAuthHeaders() })
        await this.buscarDados(rota)
      } finally {
        this.loading = false
      }
    },
  },
})
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
