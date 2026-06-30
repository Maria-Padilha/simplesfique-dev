import { config } from '@vue/test-utils'

if (typeof globalThis.localStorage === 'undefined') {
  const store = {}
  globalThis.localStorage = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { Object.keys(store).forEach(k => delete store[k]) },
  }
}

config.global.stubs = {
  transition: false,
  'v-btn': true,
  'v-icon': true,
  'v-card': true,
  'v-card-text': true,
  'v-card-title': true,
  'v-text-field': true,
  'v-data-table': true,
  'v-select': true,
  'v-dialog': true,
}
