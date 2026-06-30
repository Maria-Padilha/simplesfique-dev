import { setActivePinia, createPinia } from 'pinia'
import { useFuncoesStore } from '@/stores/funcoes/funcoes'

describe('useFuncoesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('normalizarMoeda', () => {
    const store = () => useFuncoesStore()

    it('retorna "0.00" para null', () => {
      expect(store().normalizarMoeda(null)).toBe('0.00')
    })

    it('retorna "0.00" para undefined', () => {
      expect(store().normalizarMoeda(undefined)).toBe('0.00')
    })

    it('retorna "0.00" para string vazia', () => {
      expect(store().normalizarMoeda('')).toBe('0.00')
    })

    it('formata número inteiro com 2 casas', () => {
      expect(store().normalizarMoeda(10)).toBe('10.00')
    })

    it('formata string com vírgula como decimal', () => {
      expect(store().normalizarMoeda('15,50')).toBe('15.50')
    })

    it('retorna "0.00" para valor com separador de milhar', () => {
      expect(store().normalizarMoeda('1.234,56')).toBe('0.00')
    })

    it('retorna "0.00" para NaN', () => {
      expect(store().normalizarMoeda('abc')).toBe('0.00')
    })
  })

  describe('normalizarQuantidade', () => {
    const store = () => useFuncoesStore()

    it('retorna "0.0000" para null', () => {
      expect(store().normalizarQuantidade(null)).toBe('0.0000')
    })

    it('formata número com 4 casas', () => {
      expect(store().normalizarQuantidade(5)).toBe('5.0000')
    })
  })
})
