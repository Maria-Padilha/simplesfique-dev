import { setActivePinia, createPinia } from 'pinia'
import { useEmpresaStore } from '@/stores/APIs/empresa'

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

describe('useEmpresaStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('estado inicial', () => {
    it('inicia com valores padrão', () => {
      const store = useEmpresaStore()
      expect(store.loading).toBe(false)
      expect(store.empresas).toEqual([])
      expect(store.empresa).toBeNull()
      expect(store.empresaSelecionada).toBeNull()
      expect(store.errorMessage).toBe('')
      expect(store.successMessage).toBe('')
    })
  })

  describe('buscarTodasEmpresas', () => {
    it('busca empresas com sucesso', async () => {
      const empresasMock = [
        { id: 1, nome: 'Empresa A', cnpj: '12345678000199' },
        { id: 2, nome: 'Empresa B', cnpj: '98765432000188' },
      ]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: empresasMock } })

      const store = useEmpresaStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarTodasEmpresas()
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/empresas')
      expect(store.empresas).toEqual(empresasMock)
      expect(store.errorMessage).toBe('')
      expect(store.loading).toBe(false)
    })

    it('extrai dados no formato direto', async () => {
      const empresasMock = [{ id: 1, nome: 'Direto' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: empresasMock })

      const store = useEmpresaStore()
      await store.buscarTodasEmpresas()

      expect(store.empresas).toEqual(empresasMock)
    })

    it('trata erro na busca', async () => {
      mockApiPhp.get.mockRejectedValueOnce({
        response: { data: { message: 'Erro de conexão' } },
      })

      const store = useEmpresaStore()
      await store.buscarTodasEmpresas()

      expect(store.errorMessage).toBe('Erro de conexão')
      expect(store.loading).toBe(false)
    })

    it('usa mensagem genérica quando response não tem data', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Network Error'))

      const store = useEmpresaStore()
      await store.buscarTodasEmpresas()

      expect(store.errorMessage).toBe('Erro ao buscar empresas')
    })
  })

  describe('cadastrarEmpresa', () => {
    const dadosEmpresa = { nome: 'Nova Empresa', cnpj: '12345678000199' }

    it('cadastra empresa com sucesso', async () => {
      const responseMock = { data: { id: 3, ...dadosEmpresa } }
      mockApiPhp.post.mockResolvedValueOnce(responseMock)

      const store = useEmpresaStore()
      expect(store.loading).toBe(false)

      const promise = store.cadastrarEmpresa(dadosEmpresa)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.post).toHaveBeenCalledWith('/manutencao/empresas', dadosEmpresa)
      expect(store.successMessage).toBe('Empresa cadastrada com sucesso!')
      expect(store.errorMessage).toBe('')
      expect(result).toEqual(responseMock.data)
      expect(store.loading).toBe(false)
    })

    it('retorna null em caso de erro', async () => {
      mockApiPhp.post.mockRejectedValueOnce({
        response: { data: { message: 'CNPJ já existe' } },
      })

      const store = useEmpresaStore()
      const result = await store.cadastrarEmpresa(dadosEmpresa)

      expect(result).toBeNull()
      expect(store.errorMessage).toBe('CNPJ já existe')
      expect(store.loading).toBe(false)
    })

    it('usa mensagem genérica quando não há response.data', async () => {
      mockApiPhp.post.mockRejectedValueOnce(new Error('Erro'))

      const store = useEmpresaStore()
      await store.cadastrarEmpresa(dadosEmpresa)

      expect(store.errorMessage).toBe('Erro ao cadastrar empresa')
    })
  })

  describe('alterarEmpresa', () => {
    const dadosAlteracao = { nome: 'Empresa Alterada' }

    it('altera empresa com sucesso', async () => {
      const responseMock = { data: { id: 1, ...dadosAlteracao } }
      mockApiPhp.put.mockResolvedValueOnce(responseMock)

      const store = useEmpresaStore()
      expect(store.loading).toBe(false)

      const promise = store.alterarEmpresa(1, dadosAlteracao)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.put).toHaveBeenCalledWith('/manutencao/empresas/1', dadosAlteracao)
      expect(store.successMessage).toBe('Empresa atualizada com sucesso!')
      expect(store.errorMessage).toBe('')
      expect(result).toEqual(responseMock.data)
      expect(store.loading).toBe(false)
    })

    it('retorna null em caso de erro', async () => {
      mockApiPhp.put.mockRejectedValueOnce(new Error('Erro'))

      const store = useEmpresaStore()
      const result = await store.alterarEmpresa(1, dadosAlteracao)

      expect(result).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe('deletarEmpresa', () => {
    it('deleta empresa com sucesso', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})

      const store = useEmpresaStore()
      expect(store.loading).toBe(false)

      const promise = store.deletarEmpresa(1)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/manutencao/empresas/1')
      expect(store.successMessage).toBe('Empresa excluída com sucesso!')
      expect(store.errorMessage).toBe('')
      expect(store.loading).toBe(false)
    })

    it('trata erro na exclusão', async () => {
      mockApiPhp.delete.mockRejectedValueOnce({
        response: { data: { message: 'Empresa possui vínculos' } },
      })

      const store = useEmpresaStore()
      await store.deletarEmpresa(1)

      expect(store.errorMessage).toBe('Empresa possui vínculos')
      expect(store.loading).toBe(false)
    })
  })

  describe('buscarEmpresaPorId', () => {
    it('busca empresa por ID com sucesso', async () => {
      const empresaMock = { id: 1, nome: 'Empresa Teste', cnpj: '12345678000199' }
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: empresaMock } })

      const store = useEmpresaStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarEmpresaPorId(1)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/empresas/1')
      expect(store.empresa).toEqual(empresaMock)
      expect(store.errorMessage).toBe('')
      expect(result).toEqual(empresaMock)
      expect(store.loading).toBe(false)
    })

    it('extrai dados no formato direto', async () => {
      const empresaMock = { id: 1, nome: 'Direto' }
      mockApiPhp.get.mockResolvedValueOnce({ data: empresaMock })

      const store = useEmpresaStore()
      const result = await store.buscarEmpresaPorId(1)

      expect(store.empresa).toEqual(empresaMock)
      expect(result).toEqual(empresaMock)
    })

    it('trata erro na busca', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useEmpresaStore()
      const result = await store.buscarEmpresaPorId(1)

      expect(result).toBeUndefined()
      expect(store.errorMessage).toBe('Erro ao buscar empresa')
      expect(store.loading).toBe(false)
    })
  })

  describe('selecionarEmpresa', () => {
    it('seleciona empresa e persiste no localStorage', () => {
      const store = useEmpresaStore()
      const empresa = { id: 1, nome: 'Empresa Selecionada' }

      store.selecionarEmpresa(empresa)

      expect(store.empresaSelecionada).toEqual(empresa)
      expect(JSON.parse(localStorage.getItem('empresaSelecionada'))).toEqual(empresa)
    })

    it('não seleciona empresa sem id', () => {
      const store = useEmpresaStore()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      store.selecionarEmpresa({ nome: 'Sem ID' })

      expect(store.empresaSelecionada).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('não seleciona null', () => {
      const store = useEmpresaStore()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      store.selecionarEmpresa(null)

      expect(store.empresaSelecionada).toBeNull()
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('carregarEmpresaSelecionada', () => {
    it('carrega empresa do localStorage', () => {
      const empresa = { id: 2, nome: 'Empresa Persistida' }
      localStorage.setItem('empresaSelecionada', JSON.stringify(empresa))

      const store = useEmpresaStore()
      store.carregarEmpresaSelecionada()

      expect(store.empresaSelecionada).toEqual(empresa)
    })

    it('mantém null se não houver dados no localStorage', () => {
      const store = useEmpresaStore()
      store.carregarEmpresaSelecionada()

      expect(store.empresaSelecionada).toBeNull()
    })
  })

  describe('buscarAcessoUsuario', () => {
    it('busca acesso do usuário com sucesso', async () => {
      const acessoMock = [{ programa: 'Dashboard', permitido: true }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: acessoMock } })

      const store = useEmpresaStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarAcessoUsuario(1)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/grupo-usuario-programas', {
        params: { id_empresa: 1 },
      })
      expect(result).toEqual(acessoMock)
      expect(store.errorMessage).toBe('')
      expect(store.loading).toBe(false)
    })

    it('retorna dados no formato direto', async () => {
      const acessoMock = [{ programa: 'Dashboard' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: acessoMock })

      const store = useEmpresaStore()
      const result = await store.buscarAcessoUsuario(1)

      expect(result).toEqual(acessoMock)
    })

    it('trata erro na busca de acesso', async () => {
      mockApiPhp.get.mockRejectedValueOnce({
        response: { data: { message: 'Sem permissão' } },
      })

      const store = useEmpresaStore()
      const result = await store.buscarAcessoUsuario(1)

      expect(result).toBeUndefined()
      expect(store.errorMessage).toBe('Sem permissão')
      expect(store.loading).toBe(false)
    })

    it('usa fallback genérico para erro sem mensagem', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro desconhecido'))

      const store = useEmpresaStore()
      await store.buscarAcessoUsuario(1)

      expect(store.errorMessage).toBe('Erro desconhecido')
    })

    it('usa fallback quando error não tem response', async () => {
      mockApiPhp.get.mockRejectedValueOnce({})

      const store = useEmpresaStore()
      await store.buscarAcessoUsuario(1)

      expect(store.errorMessage).toBe('Erro desconhecido')
    })
  })
})
