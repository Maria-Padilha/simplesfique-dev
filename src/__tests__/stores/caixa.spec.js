/* global vi */

import { setActivePinia, createPinia } from 'pinia'
import { useCaixaStore } from '@/stores/APIs/caixa'

const mockApiPhp = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
}))

vi.mock('@/services/apiPhp', () => ({
  default: mockApiPhp,
}))

vi.mock('@/services/api', () => ({
  default: mockApi,
}))

describe('useCaixaStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('estado inicial', () => {
    it('inicia com valores padrão', () => {
      const store = useCaixaStore()
      expect(store.loading).toBe(false)
      expect(store.caixas).toEqual([])
      expect(store.historicoMovimentacao).toEqual([])
      expect(store.errorMessage).toBe('')
      expect(store.successMessage).toBe('')
    })
  })

  describe('buscarCaixas', () => {
    it('busca caixas com sucesso', async () => {
      const caixasMock = [{ id: 1, nome: 'Caixa 1' }, { id: 2, nome: 'Caixa 2' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: caixasMock } })

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarCaixas()
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/caixas')
      expect(store.caixas).toEqual(caixasMock)
      expect(result).toEqual(caixasMock)
      expect(store.loading).toBe(false)
    })

    it('retorna array vazio em caso de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useCaixaStore()
      const result = await store.buscarCaixas()

      expect(result).toEqual([])
      expect(store.caixas).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  describe('buscarCaixasUsuarioAtivo', () => {
    it('busca caixas ativos do usuário', async () => {
      const caixaMock = { id: 1, nome: 'Caixa Ativo', status: 'ativo' }
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: caixaMock } })

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarCaixasUsuarioAtivo()
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/caixas/usuario/ativo')
      expect(result).toEqual([caixaMock])
      expect(store.loading).toBe(false)
    })

    it('retorna array quando API retorna array', async () => {
      const caixasMock = [{ id: 1 }, { id: 2 }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: caixasMock } })

      const store = useCaixaStore()
      const result = await store.buscarCaixasUsuarioAtivo()

      expect(result).toEqual(caixasMock)
    })

    it('retorna array vazio em caso de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useCaixaStore()
      const result = await store.buscarCaixasUsuarioAtivo()

      expect(result).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  describe('buscarCaixasUsuarioAberto', () => {
    it('busca caixas abertos do usuário', async () => {
      const caixasMock = [{ id: 1, nome: 'Caixa Aberto', status: 'aberto' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: caixasMock } })

      const store = useCaixaStore()
      const result = await store.buscarCaixasUsuarioAberto()

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/caixas/usuario/aberto')
      expect(result).toEqual(caixasMock)
      expect(store.loading).toBe(false)
    })

    it('encapsula objeto único em array', async () => {
      const caixaUnico = { id: 1, nome: 'Único' }
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: caixaUnico } })

      const store = useCaixaStore()
      const result = await store.buscarCaixasUsuarioAberto()

      expect(result).toEqual([caixaUnico])
    })

    it('retorna array vazio em caso de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useCaixaStore()
      const result = await store.buscarCaixasUsuarioAberto()

      expect(result).toEqual([])
    })
  })

  describe('abrirCaixa', () => {
    it('abre caixa com sucesso', async () => {
      const dadosAbertura = { valor_inicial: 100 }
      const responseMock = { data: { id: 1, status: 'aberto' } }
      mockApiPhp.post.mockResolvedValueOnce(responseMock)

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.abrirCaixa(1, 5, dadosAbertura)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.post).toHaveBeenCalledWith('/financeiro/caixas/5/abrir', dadosAbertura)
      expect(store.successMessage).toBe('Caixa aberto com sucesso!')
      expect(result).toEqual(responseMock.data)
      expect(store.loading).toBe(false)
    })

    it('retorna null em caso de erro', async () => {
      mockApiPhp.post.mockRejectedValueOnce({
        response: { data: { message: 'Caixa já está aberto' } },
      })

      const store = useCaixaStore()
      const result = await store.abrirCaixa(1, 5, {})

      expect(result).toBeNull()
      expect(store.errorMessage).toBe('Caixa já está aberto')
      expect(store.loading).toBe(false)
    })
  })

  describe('encerrarCaixa', () => {
    it('encerra caixa com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: { status: 'fechado' } })

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.encerrarCaixa(1, 1, 5)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.post).toHaveBeenCalledWith('/financeiro/caixas/5/fechar', {})
      expect(store.successMessage).toBe('Caixa encerrado com sucesso!')
      expect(result).toEqual({ status: 'fechado' })
      expect(store.loading).toBe(false)
    })

    it('retorna null em caso de erro', async () => {
      mockApiPhp.post.mockRejectedValueOnce(new Error('Erro'))

      const store = useCaixaStore()
      const result = await store.encerrarCaixa(1, 1, 5)

      expect(result).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe('buscarLancamentosCaixa', () => {
    it('busca lançamentos com sucesso', async () => {
      const responseMock = {
        data: {
          saldo_anterior: 500,
          data: [{ id: 1, valor: 100 }, { id: 2, valor: 200 }],
          total: 2,
        },
      }
      mockApiPhp.get.mockResolvedValueOnce(responseMock)

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarLancamentosCaixa(1, 5, '2026-06-01', '2026-06-30')
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/caixa-movimentos', {
        params: { id_caixa: 5, data_ini: '2026-06-01', data_fim: '2026-06-30' },
      })
      expect(result).toEqual({
        saldoanterior: 500,
        data: [{ id: 1, valor: 100 }, { id: 2, valor: 200 }],
        records: 2,
      })
      expect(store.loading).toBe(false)
    })

    it('usa fallback saldoanterior quando formato antigo', async () => {
      mockApiPhp.get.mockResolvedValueOnce({
        data: { saldoanterior: 300, data: [], total: 0 },
      })

      const store = useCaixaStore()
      const result = await store.buscarLancamentosCaixa(1, 5, '', '')

      expect(result.saldoanterior).toBe(300)
    })

    it('usa records como fallback de total', async () => {
      mockApiPhp.get.mockResolvedValueOnce({
        data: { saldo_anterior: 0, data: [], records: 5 },
      })

      const store = useCaixaStore()
      const result = await store.buscarLancamentosCaixa(1, 5, '', '')

      expect(result.records).toBe(5)
    })

    it('retona valores zerados em caso de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useCaixaStore()
      const result = await store.buscarLancamentosCaixa(1, 5, '', '')

      expect(result).toEqual({ saldoanterior: 0, data: [], records: 0 })
      expect(store.loading).toBe(false)
    })
  })

  describe('criarLancamentoCaixa', () => {
    it('cria lançamento com sucesso', async () => {
      const payload = { valor: 150, descricao: 'Venda', ccusto: 3 }
      mockApiPhp.post.mockResolvedValueOnce({ data: { id: 10 } })

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.criarLancamentoCaixa(1, 5, payload)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.post).toHaveBeenCalledWith('/financeiro/caixa-movimentos', {
        valor: 150,
        descricao: 'Venda',
        id_caixa: 5,
        ccusto: 3,
      })
      expect(store.successMessage).toBe('Lançamento criado com sucesso!')
      expect(result).toEqual({ id: 10 })
      expect(store.loading).toBe(false)
    })

    it('extrai payload.data[0] quando formato THorse', async () => {
      const payload = { data: [{ valor: 200, descricao: 'THorse format' }] }
      mockApiPhp.post.mockResolvedValueOnce({ data: { id: 11 } })

      const store = useCaixaStore()
      await store.criarLancamentoCaixa(1, 5, payload)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/financeiro/caixa-movimentos', {
        valor: 200,
        descricao: 'THorse format',
        id_caixa: 5,
      })
    })

    it('propaga erro', async () => {
      mockApiPhp.post.mockRejectedValueOnce(new Error('Erro ao criar'))

      const store = useCaixaStore()
      await expect(store.criarLancamentoCaixa(1, 5, {})).rejects.toThrow('Erro ao criar')
      expect(store.loading).toBe(false)
    })
  })

  describe('buscarLancamentoCaixa', () => {
    it('busca lançamento específico', async () => {
      const lancamentoMock = { id: 10, valor: 150, descricao: 'Venda' }
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: lancamentoMock } })

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarLancamentoCaixa(1, 5, 10)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/financeiro/caixa-movimentos/10')
      expect(result).toEqual(lancamentoMock)
      expect(store.loading).toBe(false)
    })

    it('propaga erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Não encontrado'))

      const store = useCaixaStore()
      await expect(store.buscarLancamentoCaixa(1, 5, 999)).rejects.toThrow('Não encontrado')
      expect(store.loading).toBe(false)
    })
  })

  describe('atualizarLancamentoCaixa', () => {
    it('atualiza lançamento com sucesso', async () => {
      const payload = { valor: 300, descricao: 'Atualizado' }
      mockApiPhp.put.mockResolvedValueOnce({ data: { id: 10, ...payload } })

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.atualizarLancamentoCaixa(1, 5, 10, payload)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.put).toHaveBeenCalledWith('/financeiro/caixa-movimentos/10', {
        valor: 300,
        descricao: 'Atualizado',
        id_caixa: 5,
      })
      expect(store.successMessage).toBe('Lançamento atualizado com sucesso!')
      expect(store.loading).toBe(false)
    })

    it('propaga erro', async () => {
      mockApiPhp.put.mockRejectedValueOnce(new Error('Erro ao atualizar'))

      const store = useCaixaStore()
      await expect(store.atualizarLancamentoCaixa(1, 5, 10, {})).rejects.toThrow('Erro ao atualizar')
      expect(store.loading).toBe(false)
    })
  })

  describe('deletarLancamentoCaixa', () => {
    it('deleta lançamento com sucesso', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})

      const store = useCaixaStore()
      expect(store.loading).toBe(false)

      const promise = store.deletarLancamentoCaixa(10)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/financeiro/caixa-movimentos/10')
      expect(store.successMessage).toBe('Lançamento deletado com sucesso!')
      expect(result).toBe(true)
      expect(store.loading).toBe(false)
    })

    it('propaga erro', async () => {
      mockApiPhp.delete.mockRejectedValueOnce(new Error('Erro ao deletar'))

      const store = useCaixaStore()
      await expect(store.deletarLancamentoCaixa(999)).rejects.toThrow('Erro ao deletar')
      expect(store.loading).toBe(false)
    })
  })

  describe('deletarLancamentoCaixaPorId', () => {
    it('delega para deletarLancamentoCaixa', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})

      const store = useCaixaStore()
      const result = await store.deletarLancamentoCaixaPorId(10)

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/financeiro/caixa-movimentos/10')
      expect(result).toBe(true)
    })
  })

  describe('buscarHistoricoMovimentacao (THorse API)', () => {
    beforeEach(() => {
      localStorage.setItem('token', 'fake-token')
    })

    it('busca histórico com sucesso', async () => {
      const historicoMock = [{ id: 1, tipo: 'entrada', valor: 500 }]
      mockApi.get.mockResolvedValueOnce({ data: { data: historicoMock } })

      const store = useCaixaStore()
      const result = await store.buscarHistoricoMovimentacao(1)

      expect(mockApi.get).toHaveBeenCalledWith('caixahistmov/1', {
        headers: { Authorization: 'Bearer fake-token' },
      })
      expect(store.historicoMovimentacao).toEqual(historicoMock)
      expect(store.errorMessage).toBe('')
      expect(result).toEqual({ data: historicoMock })
    })

    it('retorna null se não há token', async () => {
      localStorage.removeItem('token')

      const store = useCaixaStore()
      const result = await store.buscarHistoricoMovimentacao(1)

      expect(result).toBeNull()
      expect(store.errorMessage).toBe('Token não encontrado!')
      expect(store.loading).toBe(false)
    })

    it('retorna null se não há idEmpresa', async () => {
      localStorage.setItem('token', 'fake-token')

      const store = useCaixaStore()
      const result = await store.buscarHistoricoMovimentacao(null)

      expect(result).toBeNull()
      expect(store.errorMessage).toBe('ID da empresa não encontrado!')
    })

    it('trata erro na busca', async () => {
      localStorage.setItem('token', 'fake-token')
      mockApi.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useCaixaStore()
      const result = await store.buscarHistoricoMovimentacao(1)

      expect(result).toBeNull()
      expect(store.errorMessage).toBe('Erro')
    })
  })

  describe('buscarUsuariosPorCaixa (THorse API)', () => {
    it('busca usuários do caixa', async () => {
      localStorage.setItem('token', 'token123')
      mockApi.get.mockResolvedValueOnce({ data: { data: [{ id: 1, nome: 'Usuário' }] } })

      const store = useCaixaStore()
      const result = await store.buscarUsuariosPorCaixa(1, 5)

      expect(mockApi.get).toHaveBeenCalledWith('caixausu/1/id/5', {
        headers: { Authorization: 'Bearer token123' },
      })
      expect(result).toEqual({ data: [{ id: 1, nome: 'Usuário' }] })
    })

    it('retorna null em caso de erro', async () => {
      mockApi.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useCaixaStore()
      const result = await store.buscarUsuariosPorCaixa(1, 5)

      expect(result).toBeNull()
    })
  })
})
