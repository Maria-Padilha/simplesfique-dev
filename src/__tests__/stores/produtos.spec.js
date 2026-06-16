import { setActivePinia, createPinia } from 'pinia'
import { useProdutosStore } from '@/stores/APIs/produtos'

const mockApiPhp = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

const mockApi = vi.hoisted(() => ({
  get: vi.fn(),
  delete: vi.fn(),
}))

const mockExecutarAcao = vi.hoisted(() => vi.fn())

vi.mock('@/services/apiPhp', () => ({
  default: mockApiPhp,
}))

vi.mock('@/services/api', () => ({
  default: mockApi,
}))

vi.mock('@/stores/APIs/api', () => ({
  useApiStore: () => ({
    executarAcao: mockExecutarAcao,
  }),
}))

describe('useProdutosStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('estado inicial', () => {
    it('inicia com valores padrão', () => {
      const store = useProdutosStore()
      expect(store.loading).toBe(false)
      expect(store.produtos).toEqual([])
      expect(store.produto).toBeNull()
      expect(store.errorMessage).toBe('')
      expect(store.marcas).toEqual([])
      expect(store.medidas).toEqual([])
      expect(store.garantias).toEqual([])
    })
  })

  describe('buscarProdutos', () => {
    it('busca produtos com sucesso', async () => {
      const produtosMock = [
        { id: 1, nome: 'Produto A', preco: 10.5 },
        { id: 2, nome: 'Produto B', preco: 25.0 },
      ]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: produtosMock } })

      const store = useProdutosStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarProdutos()
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produtos')
      expect(store.produtos).toEqual(produtosMock)
      expect(store.errorMessage).toBe('')
      expect(store.loading).toBe(false)
    })

    it('trata erro na busca', async () => {
      mockApiPhp.get.mockRejectedValueOnce({
        response: { data: { message: 'Erro de conexão' } },
      })

      const store = useProdutosStore()
      await store.buscarProdutos()

      expect(store.errorMessage).toBe('Erro de conexão')
      expect(store.loading).toBe(false)
    })

    it('usa mensagem genérica em erro sem response', async () => {
      mockApiPhp.get.mockRejectedValueOnce('Erro genérico')

      const store = useProdutosStore()
      await store.buscarProdutos()

      expect(store.errorMessage).toBe('Erro desconhecido')
    })
  })

  describe('buscarProdutoPorId', () => {
    it('busca produto por ID com sucesso', async () => {
      const produtoMock = { id: 1, nome: 'Produto Teste', preco: 99.9 }
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: produtoMock } })

      const store = useProdutosStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarProdutoPorId(1)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produtos/1')
      expect(store.produto).toEqual(produtoMock)
      expect(store.errorMessage).toBe('')
      expect(store.loading).toBe(false)
    })

    it('trata erro ao buscar produto', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Não encontrado'))

      const store = useProdutosStore()
      await store.buscarProdutoPorId(999)

      expect(store.errorMessage).toBe('Não encontrado')
      expect(store.loading).toBe(false)
    })
  })

  describe('cadastrarProduto', () => {
    it('cadastra produto e recarrega lista', async () => {
      const novoProduto = { nome: 'Novo Produto', preco: 50 }
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [{ id: 1, ...novoProduto }] } })

      const store = useProdutosStore()
      expect(store.loading).toBe(false)

      const promise = store.cadastrarProduto(novoProduto)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/produtos', novoProduto)
      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produtos')
      expect(store.loading).toBe(false)
    })

    it('trata erro ao cadastrar', async () => {
      mockApiPhp.post.mockRejectedValueOnce({
        response: { data: { message: 'Produto já existe' } },
      })

      const store = useProdutosStore()
      await store.cadastrarProduto({ nome: 'Duplicado' })

      expect(store.errorMessage).toBe('Produto já existe')
      expect(store.loading).toBe(false)
    })
  })

  describe('atualizarProduto', () => {
    it('atualiza produto e recarrega dados', async () => {
      const dadosAtualizacao = { nome: 'Produto Alterado', preco: 75 }
      mockApiPhp.put.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: { id: 1, ...dadosAtualizacao } } })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [{ id: 1, ...dadosAtualizacao }] } })

      const store = useProdutosStore()
      expect(store.loading).toBe(false)

      const promise = store.atualizarProduto(1, dadosAtualizacao)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.put).toHaveBeenCalledWith('/estoque/produtos/1', dadosAtualizacao)
      // Deve buscar o produto por ID e depois a lista
      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produtos/1')
      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produtos')
      expect(store.loading).toBe(false)
    })

    it('trata erro ao atualizar', async () => {
      mockApiPhp.put.mockRejectedValueOnce(new Error('Erro ao atualizar'))

      const store = useProdutosStore()
      await store.atualizarProduto(1, {})

      expect(store.errorMessage).toBe('Erro ao atualizar')
      expect(store.loading).toBe(false)
    })
  })

  describe('deletarProduto', () => {
    it('deleta produto e recarrega lista', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      expect(store.loading).toBe(false)

      const promise = store.deletarProduto(1)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/estoque/produtos/1')
      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produtos')
      expect(store.loading).toBe(false)
    })

    it('trata erro ao deletar', async () => {
      mockApiPhp.delete.mockRejectedValueOnce({
        response: { data: { message: 'Produto possui vínculos' } },
      })

      const store = useProdutosStore()
      await store.deletarProduto(1)

      expect(store.errorMessage).toBe('Produto possui vínculos')
      expect(store.loading).toBe(false)
    })
  })

  describe('Marcas', () => {
    it('busca marcas com sucesso', async () => {
      const marcasMock = [{ id: 1, nome: 'Marca A' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: marcasMock, total: 1 } })

      const store = useProdutosStore()
      await store.buscarMarcas('A', 10)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/marcas', {
        params: { find: 'A', limit: 10 },
      })
      expect(store.marcas).toEqual(marcasMock)
      expect(store.recordsMarcas).toBe(1)
      expect(store.loading).toBe(false)
    })

    it('cadastra marca com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarMarca({ nome: 'Nova Marca' })

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/marcas', { nome: 'Nova Marca' })
      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/marcas', {
        params: { find: '', limit: 100 },
      })
      expect(store.loading).toBe(false)
    })
  })

  describe('Garantias', () => {
    it('busca garantias com sucesso', async () => {
      const garantiasMock = [{ id: 1, descricao: 'Garantia 1 ano' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: garantiasMock, total: 1 } })

      const store = useProdutosStore()
      await store.buscarGarantias('ano', 50)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/garantias', {
        params: { find: 'ano', limit: 50 },
      })
      expect(store.garantias).toEqual(garantiasMock)
      expect(store.recordsGarantias).toBe(1)
      expect(store.loading).toBe(false)
    })

    it('cadastra garantia com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarGarantia({ descricao: 'Garantia 2 anos' })

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/garantias', { descricao: 'Garantia 2 anos' })
      expect(store.loading).toBe(false)
    })
  })

  describe('Embalagens', () => {
    it('busca embalagens com sucesso', async () => {
      const embalagensMock = [{ id: 1, nome: 'Caixa' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: embalagensMock } })

      const store = useProdutosStore()
      await store.buscarEmbalagens(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produto-embalagens', {
        params: { id_produto: 1 },
      })
      expect(store.embalagens).toEqual(embalagensMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra embalagem com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarEmbalagem({ nome: 'Pack' }, 1)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/produto-embalagens', {
        nome: 'Pack',
        id_produto: 1,
      })
      expect(store.loading).toBe(false)
    })

    it('atualiza embalagem com sucesso', async () => {
      mockApiPhp.put.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.atualizarEmbalagem(1, 5, { nome: 'Pack Editado' })

      expect(mockApiPhp.put).toHaveBeenCalledWith('/estoque/produto-embalagens/5', {
        nome: 'Pack Editado',
        id_produto: 1,
      })
      expect(store.loading).toBe(false)
    })

    it('deleta embalagem com sucesso', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.deletarEmbalagem(1, 5)

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/estoque/produto-embalagens/5')
      expect(store.loading).toBe(false)
    })
  })

  describe('Fornecedores', () => {
    it('busca fornecedores com sucesso', async () => {
      const fornecedoresMock = [{ id: 1, nome: 'Fornecedor A' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: fornecedoresMock } })

      const store = useProdutosStore()
      await store.buscarFornecedores(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produto-fornecedors', {
        params: { id_produto: 1 },
      })
      expect(store.fornecedores).toEqual(fornecedoresMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra fornecedor com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarFornecedor({ nome: 'Novo Forn' }, 1)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/produto-fornecedors', {
        nome: 'Novo Forn',
        id_produto: 1,
      })
      expect(store.loading).toBe(false)
    })

    it('atualiza fornecedor com sucesso', async () => {
      mockApiPhp.put.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.atualizarFornecedor(1, 5, { nome: 'Forn Editado' })

      expect(mockApiPhp.put).toHaveBeenCalledWith('/estoque/produto-fornecedors/5', {
        nome: 'Forn Editado',
        id_produto: 1,
      })
      expect(store.loading).toBe(false)
    })

    it('deleta fornecedor com sucesso', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.deletarFornecedor(1, 5)

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/estoque/produto-fornecedors/5', {
        params: { id_produto: 1 },
      })
      expect(store.loading).toBe(false)
    })
  })

  describe('Cores', () => {
    it('busca cores com sucesso', async () => {
      const coresMock = [{ id: 1, nome: 'Vermelho' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: coresMock } })

      const store = useProdutosStore()
      await store.buscarCores()

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/cors')
      expect(store.cores).toEqual(coresMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra cor com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarCor({ nome: 'Azul' })

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/cors', { nome: 'Azul' })
      expect(store.loading).toBe(false)
    })

    it('atualiza cor com sucesso', async () => {
      mockApiPhp.put.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.atualizarCor(1, { nome: 'Azul Claro' })

      expect(mockApiPhp.put).toHaveBeenCalledWith('/estoque/cors/1', { nome: 'Azul Claro' })
      expect(store.loading).toBe(false)
    })
  })

  describe('Entradas DFe', () => {
    it('busca entradas DFe com sucesso', async () => {
      const entradasMock = [{ id: 1, numero: '1234' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: entradasMock } })

      const store = useProdutosStore()
      await store.buscarEntradasDfe(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/entradas')
      expect(store.entradadfe).toEqual(entradasMock)
      expect(store.loading).toBe(false)
    })

    it('busca entrada DFe por ID com sucesso', async () => {
      const entradaMock = { id: 1, numero: '1234' }
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: entradaMock } })

      const store = useProdutosStore()
      await store.buscarEntradaDfePorId(1, 1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/entradas/1')
      expect(store.entradadfeItem).toEqual(entradaMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra entrada DFe com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarEntradaDfe({ chave_acesso: '123' }, 1)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/entradas', { chave_acesso: '123' })
      expect(store.loading).toBe(false)
    })

    it('deleta entrada DFe com sucesso', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.deletarEntradaDfe(1, 1)

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/estoque/entradas/1')
      expect(store.loading).toBe(false)
    })

    it('atualiza entrada DFe com sucesso', async () => {
      mockApiPhp.put.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: {} } })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.atualizarEntradaDfe(1, 1, { numero: '9999' })

      expect(mockApiPhp.put).toHaveBeenCalledWith('/estoque/entradas/1', { numero: '9999' })
      expect(store.loading).toBe(false)
    })
  })

  describe('Localizações', () => {
    it('busca localizações com sucesso', async () => {
      const locMock = [{ id: 1, nome: 'Prateleira A' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: locMock } })

      const store = useProdutosStore()
      await store.buscarLocalizacoes(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/localizacoes')
      expect(store.localizacoes).toEqual(locMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra localização com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarLocalizacao({ nome: 'Galpão B' }, 1)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/localizacoes', { nome: 'Galpão B' })
      expect(store.loading).toBe(false)
    })

    it('deleta localização com sucesso', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.deletarLocalizacao(1, 5)

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/estoque/localizacoes/5')
      expect(store.loading).toBe(false)
    })

    it('atualiza localização com sucesso', async () => {
      mockApiPhp.put.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.atualizarLocalizacao(1, 5, { nome: 'Galpão A' })

      expect(mockApiPhp.put).toHaveBeenCalledWith('/estoque/localizacoes/5', { nome: 'Galpão A' })
      expect(store.loading).toBe(false)
    })
  })

  describe('Produtos Similares', () => {
    it('busca produtos similares com sucesso', async () => {
      const similarMock = [{ id: 2, nome: 'Produto Similar' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: similarMock } })

      const store = useProdutosStore()
      await store.buscarProdutosSimilares(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produto-similars', {
        params: { id_produto: 1 },
      })
      expect(store.similar).toEqual(similarMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra produto similar com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarProdutoSimilar({ id_produto_similar: 2 }, 1)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/produto-similars', {
        id_produto_similar: 2,
        id_produto: 1,
      })
      expect(store.loading).toBe(false)
    })
  })

  describe('Grades', () => {
    it('busca grades com sucesso', async () => {
      const gradesMock = [{ id: 1, produto: 'Produto A', cor: 'Azul', tamanho: 'M' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: gradesMock } })

      const store = useProdutosStore()
      await store.buscarGradeProduto(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/grades')
      expect(store.grades).toEqual(gradesMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra grade com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarGradeProduto({ id_produto: 1, id_cor: 1, id_tam: 'M' }, 1)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/grades', {
        id_produto: 1,
        id_cor: 1,
        id_tam: 'M',
      })
      expect(store.loading).toBe(false)
    })

    it('retorna array vazio na busca em caso de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro'))

      const store = useProdutosStore()
      const result = await store.buscarGradeProduto(1)

      expect(result).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  describe('Tributos', () => {
    it('busca tributos com sucesso', async () => {
      const tributosMock = [{ id: 1, nome: 'ICMS' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: tributosMock } })

      const store = useProdutosStore()
      await store.buscarTributos(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/produto-tributos')
      expect(store.tributos).toEqual(tributosMock)
      expect(store.loading).toBe(false)
    })
  })

  describe('Devoluções de Entrada', () => {
    it('busca devoluções com sucesso', async () => {
      const devMock = [{ id: 1, descricao: 'Devolução' }]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: devMock } })

      const store = useProdutosStore()
      await store.buscarDevolucoesEntrada(1)

      expect(mockApiPhp.get).toHaveBeenCalledWith('/estoque/devolucao-compras')
      expect(store.deventrada).toEqual(devMock)
      expect(store.loading).toBe(false)
    })

    it('cadastra devolução com sucesso', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = useProdutosStore()
      await store.cadastrarDevEntrada({ motivo: 'Avaria' }, 1)

      expect(mockApiPhp.post).toHaveBeenCalledWith('/estoque/devolucao-compras', { motivo: 'Avaria' })
      expect(store.loading).toBe(false)
    })
  })
})
