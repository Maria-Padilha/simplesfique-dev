import { setActivePinia, createPinia } from 'pinia'
import { useThemeStore } from '@/stores/config-temas/theme'

describe('useThemeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('inicia com darkMode = false', () => {
    const store = useThemeStore()
    expect(store.darkMode).toBe(false)
  })

  it('inicia com brightness = 1', () => {
    const store = useThemeStore()
    expect(store.brightness).toBe(1)
  })

  it('inicia com tipoBtn = true', () => {
    const store = useThemeStore()
    expect(store.tipoBtn).toBe(true)
  })

  it('permite alternar darkMode', () => {
    const store = useThemeStore()
    store.darkMode = true
    expect(store.darkMode).toBe(true)
  })

  it('permite alterar brightness', () => {
    const store = useThemeStore()
    store.brightness = 0.5
    expect(store.brightness).toBe(0.5)
  })
})
