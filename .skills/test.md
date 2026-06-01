# Skill: Test

Padrões para escrever testes no SimplesFique ERP usando Vitest + @vue/test-utils.

## Setup

- **Framework**: Vitest
- **Environment**: jsdom (via vitest.config.js)
- **Globals**: true (`describe`, `it`, `expect` disponíveis sem import)
- **Stubs**: Componentes Vuetify stubbados globalmente em `src/__tests__/setup.js`

## Onde criar

```
src/__tests__/
├── setup.js                    # Setup global (stubs)
├── stores/                     # Testes de stores Pinia
│   ├── theme.spec.js
│   └── funcoes.spec.js
└── components/                 # Testes de componentes Vue
    └── MeuComponente.spec.js
```

## Padrões por tipo

### Store Pinia (Options API)

```js
import { setActivePinia, createPinia } from 'pinia'
import { useModuloStore } from '@/stores/APIs/modulo'

describe('useModuloStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia com dados vazio', () => {
    const store = useModuloStore()
    expect(store.dados).toEqual([])
  })

  it('inicia com loading = false', () => {
    const store = useModuloStore()
    expect(store.loading).toBe(false)
  })
})
```

### Store Pinia (Setup store / Composition API)

```js
import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/config-temas/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('altera darkMode', () => {
    const store = useThemeStore()
    store.darkMode = true
    expect(store.darkMode).toBe(true)
  })
})
```

### Store com chamada API (mock)

```js
import { setActivePinia, createPinia } from 'pinia'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import api from '@/services/api'

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

describe('useFinanceiroStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('buscarDados popula dados', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, nome: 'Teste' }] })
    const store = useFinanceiroStore()
    await store.buscarDados('/rota')
    expect(store.dados).toHaveLength(1)
    expect(store.loading).toBe(false)
  })
})
```

### Componente Vue

```js
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import MeuComponente from '@/components/base/MeuComponente.vue'

describe('MeuComponente', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renderiza titulo', () => {
    const wrapper = mount(MeuComponente, { props: { titulo: 'Teste' } })
    expect(wrapper.text()).toContain('Teste')
  })
})
```

## Comandos

```bash
npm run test          # roda uma vez
npm run test:watch    # modo watch (desenvolvimento)
npm run test:ui       # interface Vitest UI
```

## Regras

1. Todo **composable** e toda **store** deve ter teste
2. Mock de APIs com `vi.mock()` — nunca chame API real
3. Use `beforeEach` com `setActivePinia(createPinia())` para isolar estado entre testes
4. Nome do arquivo: `nome.spec.js` ao lado do source ou em `src/__tests__/`
5. Prefira testar comportamento, não implementação interna
6. Stores com persistência (`localStorage`) devem chamar `localStorage.clear()` no `beforeEach`
