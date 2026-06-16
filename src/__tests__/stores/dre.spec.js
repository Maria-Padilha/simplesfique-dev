import { setActivePinia, createPinia } from 'pinia'
import { useDreStore } from '@/stores/APIs/dre'

const mockApiPhp = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('vue3-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('@/services/apiPhp', () => ({
  default: mockApiPhp,
}))

describe('useDreStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('estado inicial', () => {
    it('inicia com dreData vazio', () => {
      const store = useDreStore()
      expect(store.dreData).toEqual([])
    })

    it('inicia com loading false', () => {
      const store = useDreStore()
      expect(store.loading).toBe(false)
    })
  })

  describe('buscarMovimentacoesDRE', () => {
    const paramsValidos = {
      id: 1,
      idEmpresa: 10,
      idAno: 2026,
      idMes: 6,
      regime: 1,
    }

    it('busca movimentações com sucesso', async () => {
      const movimentacoesMock = [
        { id: 1, conta: 'Receita', valor: 1000 },
        { id: 2, conta: 'Despesa', valor: 500 },
      ]
      mockApiPhp.get.mockResolvedValueOnce({ data: movimentacoesMock })

      const store = useDreStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarMovimentacoesDRE(paramsValidos)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/dre-detalhes/1', {
        params: { id_ano: 2026, id_mes: 6, regime: 1 },
      })
      expect(store.dreData).toEqual(movimentacoesMock)
      expect(result).toEqual(movimentacoesMock)
      expect(store.loading).toBe(false)
    })

    it('usa regime padrão = 1 quando não informado', async () => {
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useDreStore()
      await store.buscarMovimentacoesDRE({
        id: 1,
        idEmpresa: 10,
        idAno: 2026,
        idMes: 6,
      })

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/dre-detalhes/1', {
        params: { id_ano: 2026, id_mes: 6, regime: 1 },
      })
    })

    it('extrai dados no formato direto (sem .data aninhado)', async () => {
      const data = [{ id: 1, conta: 'Direta' }]
      mockApiPhp.get.mockResolvedValueOnce({ data })

      const store = useDreStore()
      await store.buscarMovimentacoesDRE(paramsValidos)

      expect(store.dreData).toEqual(data)
    })

    it('throw error quando id está faltando', async () => {
      const store = useDreStore()

      await expect(
        store.buscarMovimentacoesDRE({ idEmpresa: 10, idAno: 2026, idMes: 6 })
      ).rejects.toThrow('Parâmetros obrigatórios não fornecidos')

      expect(store.loading).toBe(false)
    })

    it('throw error quando idEmpresa está faltando', async () => {
      const store = useDreStore()

      await expect(
        store.buscarMovimentacoesDRE({ id: 1, idAno: 2026, idMes: 6 })
      ).rejects.toThrow('Parâmetros obrigatórios não fornecidos')

      expect(store.loading).toBe(false)
    })

    it('throw error quando idAno está faltando', async () => {
      const store = useDreStore()

      await expect(
        store.buscarMovimentacoesDRE({ id: 1, idEmpresa: 10, idMes: 6 })
      ).rejects.toThrow('Parâmetros obrigatórios não fornecidos')

      expect(store.loading).toBe(false)
    })

    it('throw error quando idMes está faltando', async () => {
      const store = useDreStore()

      await expect(
        store.buscarMovimentacoesDRE({ id: 1, idEmpresa: 10, idAno: 2026 })
      ).rejects.toThrow('Parâmetros obrigatórios não fornecidos')

      expect(store.loading).toBe(false)
    })

    it('throw error para regime inválido (não 1 ou 2)', async () => {
      const store = useDreStore()

      await expect(
        store.buscarMovimentacoesDRE({ ...paramsValidos, regime: 3 })
      ).rejects.toThrow('Regime inválido')

      expect(store.loading).toBe(false)
    })

    it('throw error para regime 0', async () => {
      const store = useDreStore()

      await expect(
        store.buscarMovimentacoesDRE({ ...paramsValidos, regime: 0 })
      ).rejects.toThrow('Regime inválido')

      expect(store.loading).toBe(false)
    })

    it('aceita regime = 2 (Caixa)', async () => {
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useDreStore()
      await store.buscarMovimentacoesDRE({ ...paramsValidos, regime: 2 })

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/dre-detalhes/1', {
        params: { id_ano: 2026, id_mes: 6, regime: 2 },
      })
    })

    it('propaga erro da API', async () => {
      const apiError = new Error('Erro de servidor')
      mockApiPhp.get.mockRejectedValueOnce(apiError)

      const store = useDreStore()
      await expect(store.buscarMovimentacoesDRE(paramsValidos)).rejects.toThrow('Erro de servidor')
      expect(store.loading).toBe(false)
    })

    it('não altera dreData em caso de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useDreStore()
      store.dreData = [{ id: 1, existing: true }]

      await expect(store.buscarMovimentacoesDRE(paramsValidos)).rejects.toThrow()
      // O erro é jogado para o caller, então dreData mantém o valor anterior
      // (o catch no store não reassina dreData no erro)
      expect(store.dreData).toEqual([{ id: 1, existing: true }])
      expect(store.loading).toBe(false)
    })

    it('usa regime = 1 quando undefined (default destructuring)', async () => {
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useDreStore()
      await store.buscarMovimentacoesDRE({ id: 1, idEmpresa: 10, idAno: 2026, idMes: 6, regime: undefined })

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/dre-detalhes/1', {
        params: { id_ano: 2026, id_mes: 6, regime: 1 },
      })
      expect(store.loading).toBe(false)
    })
  })
})
