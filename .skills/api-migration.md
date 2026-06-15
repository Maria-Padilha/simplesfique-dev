# Skill: API Migration (THorse → PHP)

Padrões e regras para migrar stores/views da API THorse (porta 9005) para a nova API PHP/Laravel (porta 8000).

---

## 1. Arquivos Envolvidos

| Arquivo | Função |
|---------|--------|
| `src/services/apiPhp.js` | Service Axios para API PHP (base `/api/v1`) |
| `src/services/api.js` | Service Axios para API THorse (base `:9005`) |
| `src/stores/APIs/api.js` | Store base (suporta ambas) |

## 2. API Clients

### apiPhp.js (PHP — novo)
- Base: `VUE_APP_PHP_API_URL` ou `http://localhost:8000/api/v1`
- Interceptor request: injeta `Authorization: Bearer {token}`
- Interceptor response 401: limpa token, redireciona `/login`
- Interceptor response 422: normaliza 2 formatos em `error.validationMessage`

### api.js (THorse — legado)
- Base: `VUE_APP_API_URL` ou `http://192.168.10.100:9005`
- Interceptor request: injeta `Authorization: Bearer {token}`

## 3. Convenções da Nova API PHP

### URL
```
/api/v1/{modulo}/{recurso}[/{id}][?page=1&per_page=15]
```

### Autenticação
- JWT via `Authorization: Bearer {token}` (enviado pelo interceptor)
- `id_saas` e `id_empresa` são extraídos **automaticamente do JWT** — não enviar no body/URL

### Paginação
- Request: `?page=1&per_page=15`
- Response: `{ data: [...], current_page: 1, per_page: 15, total: 237 }`
- `total` no lugar de `records`

### Payload
- **Payload direto** — sem wrapper `{ data: [{}] }`
- Correto: `apiPhp.post('/url', { campo: 'valor' })`

### Respostas
| Situação | Formato |
|----------|---------|
| Listagem | `{ data: [...], current_page, per_page, total }` |
| Single | Objeto direto (ou `response.data.data`) |
| Erro 422 (form request) | `{ message: "...", errors: { campo: ["msg"] } }` |
| Erro 422 (NOT NULL) | `{ erro: "Campo obrigatório: coluna" }` |
| Erro 401 | `{ erro: "Não autenticado" }` |
| Erro 404 | `{ erro: "Não encontrado" }` |

### Status
- `ativo` → `'S'` / `'N'`
- `situacao` → `'A'` (ativo) / `'C'` (cancelado)
- **Soft delete** — `DELETE` não remove, marca como inativo

### Datas
- Formato ISO: `2024-01-10T08:00:00.000000Z`
- Campos: `dhinc`, `dhalt`, `dhexpiracao`

## 4. Mapeamento de Rotas (THorse → PHP)

### Padrão Geral

| THorse | PHP |
|--------|-----|
| `/{recurso}` | `/api/v1/{modulo}/{recurso}` |
| `/{recurso}/{id}` | `/api/v1/{modulo}/{recurso}/{id}` |
| `/{recurso}/{idEmpresa}/...` | `/api/v1/{modulo}/{recurso}` (id_empresa no JWT) |
| `POST ...calcparc` | Parcelas geradas automaticamente no CRUD |

### Módulos e Prefixos

| Módulo | Prefixo PHP |
|--------|-------------|
| Autenticação | `/api/v1/auth/` |
| SAAS | `/api/v1/saas` |
| Manutenção | `/api/v1/manutencao/` |
| Empresa | `/api/v1/empresas` |
| Financeiro | `/api/v1/financeiro/` |
| Contábil | `/api/v1/contabil/` |
| Estoque | `/api/v1/estoque/` |
| Vendas | `/api/v1/vendas/` |
| Integrações | `/api/v1/integracoes/` |
| Agendas | `/api/v1/agendas/` |
| CEP | `/api/v1/cep/` |
| CNPJ | `/api/v1/cnpj/` |
| Fórmulas | `/api/v1/formulas/` |

## 5. Padrão de Store Migrada

```js
import { defineStore } from 'pinia'
import apiPhp from '@/services/apiPhp'

export const useModuloStore = defineStore('modulo', {
  state: () => ({
    dados: [],
    loading: false,
    error: null,
  }),
  actions: {
    async buscarDados(params = {}) {
      this.loading = true
      try {
        const res = await apiPhp.get('/api/v1/modulo/recurso', { params })
        this.dados = res.data?.data ?? res.data ?? []
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async salvar(payload) {
      this.loading = true
      try {
        const res = await apiPhp.post('/api/v1/modulo/recurso', payload)
        await this.buscarDados()
        return res
      } finally {
        this.loading = false
      }
    },
    async atualizar(id, payload) {
      this.loading = true
      try {
        const res = await apiPhp.put(`/api/v1/modulo/recurso/${id}`, payload)
        await this.buscarDados()
        return res
      } finally {
        this.loading = false
      }
    },
    async excluir(id) {
      this.loading = true
      try {
        await apiPhp.delete(`/api/v1/modulo/recurso/${id}`)
        await this.buscarDados()
      } finally {
        this.loading = false
      }
    },
  },
})
```

## 6. Uso da Store Base Durante Migração

A store base `useApiStore` aceita o parâmetro `apiPhp`:

```js
const apiStore = useApiStore()

// Store legada (THorse)
await apiStore.buscarDados('produto', { limit: 50, offset: 0 })

// Store migrada (PHP)
await apiStore.buscarDados('produto', { apiPhp: true, page: 1, perPage: 20 })
```

## 7. Checklist de Migração por Store

- [ ] Trocar `import api from '@/services/api'` → `import apiPhp from '@/services/apiPhp'`
- [ ] Remover `getAuthHeaders()` das chamadas
- [ ] Ajustar URL: adicionar prefixo `/api/v1/{modulo}/`
- [ ] Remover `id_empresa` da URL/payload (vem do JWT)
- [ ] Ajustar paginação: `limit/offset` → `page/per_page`
- [ ] Ajustar payload: remover wrapper `{ data: [{}] }`
- [ ] Ajustar tratamento de resposta: `response.data.data` → `response.data?.data ?? response.data`
- [ ] Ajustar `records` → `total`
- [ ] Atualizar imports na view se necessário
