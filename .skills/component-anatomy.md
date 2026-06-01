# Skill: Component Anatomy

Estrutura padrão de componentes Vue 3 no SimplesFique ERP.

## Estrutura do arquivo

```vue
<template>
  <v-card>
    <!-- HTML aqui -->
    {{ store.propriedade }}
    <ComponenteBase @event="handler" />
  </v-card>
</template>

<script setup>
// 1. Imports
import { ref, computed, onMounted, watch } from 'vue'
import { useModuloStore } from '@/stores/APIs/modulo'
import { useThemeStore } from '@/stores/config-temas/theme'
import ComponenteBase from '@/components/base/ComponenteBase.vue'

// 2. Stores
const moduloStore = useModuloStore()
const themeStore = useThemeStore()

// 3. Estado local (ref)
const visible = ref(false)
const form = ref({ nome: '', valor: 0 })

// 4. Computados
const total = computed(() => moduloStore.dados.reduce((a, b) => a + b.valor, 0))

// 5. Lifecycle
onMounted(() => moduloStore.buscarDados('/rota'))

// 6. Métodos
function salvar() {
  moduloStore.salvar('/rota', form.value)
  visible.value = false
}
</script>

<style scoped>
/* styles específicos do componente */
</style>
```

## Regras

1. **`<script setup>`** — sem export default, sem Options API
2. **Ordem das seções**: template → script setup → style scoped
3. **Ordem dentro do script**: imports → stores → refs → computed → watch → lifecycle → methods
4. **`v-model`** para two-way binding em inputs e modais
5. **Eventos**: `@click`, `@submit.prevent`, `@update:model-value`
6. **Slots nomeados** em componentes base (`#titulo`, `#acoes`, `#section`)
7. **Style scoped** por padrão — estilos globais só em `src/assets/scss/`
8. **Classes**: usar classes Vuetify + Tailwind, evitar CSS customizado quando possível

## Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| View | `PascalCaseView.vue` | `PagarView.vue` |
| Componente | `PascalCase.vue` | `SidebarComponent.vue` |
| Store | `camelCase.js` | `useFinanceiroStore` em `financeiro.js` |
| Arquivo de rota | `camelCase.js` | `index.js` |
