/* global vi */

import { setActivePinia, createPinia } from 'pinia'
import { usePessoasStore } from '@/stores/APIs/pessoas'

const mockApiPhp = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('@/services/apiPhp', () => ({
  default: mockApiPhp,
}))

describe('usePessoasStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('buscarTodasPessoas', () => {
    it('inicia com pessoas vazio', () => {
      const store = usePessoasStore()
      expect(store.pessoas).toEqual([])
    })

    it('busca pessoas com sucesso e atualiza o estado', async () => {
      const pessoasMock = [
        { id: 1, nome: 'João Silva', cpf_cnpj: '12345678901' },
        { id: 2, nome: 'Maria Souza', cpf_cnpj: '98765432101' },
      ]
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: pessoasMock } })

      const store = usePessoasStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarTodasPessoas()
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/pessoas', { params: { find: '' } })
      expect(store.pessoas).toEqual(pessoasMock)
      expect(store.loading).toBe(false)
    })

    it('busca pessoas com parâmetro find', async () => {
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = usePessoasStore()
      await store.buscarTodasPessoas('João')

      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/pessoas', { params: { find: 'João' } })
    })

    it('trata erro e mantém pessoas vazio', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Network error'))

      const store = usePessoasStore()
      store.pessoas = [{ id: 1 }] // dados anteriores
      await store.buscarTodasPessoas()

      expect(store.pessoas).toEqual([])
      expect(store.loading).toBe(false)
    })

    it('extrai dados de diferentes formatos de resposta', async () => {
      // Formato: { data: [...] }
      mockApiPhp.get.mockResolvedValueOnce({ data: [{ id: 1 }] })
      const store1 = usePessoasStore()
      await store1.buscarTodasPessoas()
      expect(store1.pessoas).toEqual([{ id: 1 }])

      // Reseta
      setActivePinia(createPinia())

      // Formato: { data: null } (fallback para [])
      mockApiPhp.get.mockResolvedValueOnce({ data: null })
      const store2 = usePessoasStore()
      await store2.buscarTodasPessoas()
      expect(store2.pessoas).toEqual([])
    })
  })

  describe('buscarpessoaId', () => {
    it('busca pessoa por ID com sucesso', async () => {
      const pessoaMock = { id: 1, nome: 'João Silva' }
      const enderecoMock = [{ rua: 'Rua A', cidade: 'São Paulo' }]
      mockApiPhp.get.mockResolvedValueOnce({
        data: { data: { pessoa: pessoaMock, endereco: enderecoMock } },
      })

      const store = usePessoasStore()
      expect(store.loading).toBe(false)

      const promise = store.buscarpessoaId(1)
      expect(store.loading).toBe(true)

      const result = await promise

      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/pessoas/1')
      expect(store.pessoa).toEqual(pessoaMock)
      expect(store.errorMessage).toBe('')
      expect(result).toEqual({ pessoa: pessoaMock, endereco: enderecoMock })
      expect(store.loading).toBe(false)
    })

    it('retorna null em caso de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce({
        response: { data: { message: 'Pessoa não encontrada' } },
      })

      const store = usePessoasStore()
      const result = await store.buscarpessoaId(999)

      expect(result).toBeNull()
      expect(store.errorMessage).toBe('Pessoa não encontrada')
      expect(store.loading).toBe(false)
    })

    it('usa fallback de mensagem de erro', async () => {
      mockApiPhp.get.mockRejectedValueOnce(new Error('Erro de rede'))

      const store = usePessoasStore()
      await store.buscarpessoaId(1)

      expect(store.errorMessage).toBe('Erro de rede')
    })

    it('usa fallback genérico se não houver mensagem', async () => {
      mockApiPhp.get.mockRejectedValueOnce({})

      const store = usePessoasStore()
      await store.buscarpessoaId(1)

      expect(store.errorMessage).toBe('Erro desconhecido')
    })

    it('extrai dados no formato direto', async () => {
      const pessoaMock = { id: 1, nome: 'Direto' }
      // Formato sem .data aninhado
      mockApiPhp.get.mockResolvedValueOnce({
        data: { pessoa: pessoaMock, endereco: [] },
      })

      const store = usePessoasStore()
      const result = await store.buscarpessoaId(1)

      expect(store.pessoa).toEqual(pessoaMock)
      expect(result.pessoa).toEqual(pessoaMock)
    })
  })

  describe('cadastrarPessoa', () => {
    it('cadastra pessoa e recarrega lista', async () => {
      const novaPessoa = { nome: 'Novo Cliente', cpf_cnpj: '12345678901' }
      mockApiPhp.post.mockResolvedValueOnce({ data: { data: { id: 3 } } })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [{ id: 3, nome: 'Novo Cliente' }] } })

      const store = usePessoasStore()
      expect(store.loading).toBe(false)

      const promise = store.cadastrarPessoa(novaPessoa)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.post).toHaveBeenCalledWith('/manutencao/pessoas', novaPessoa)
      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/pessoas', { params: { find: '' } })
      expect(store.pessoas).toEqual([{ id: 3, nome: 'Novo Cliente' }])
      expect(store.loading).toBe(false)
    })

    it('cadastra pessoa com parâmetro find', async () => {
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = usePessoasStore()
      await store.cadastrarPessoa({ nome: 'Teste' }, 'Teste')

      expect(mockApiPhp.get).toHaveBeenCalledWith('/manutencao/pessoas', { params: { find: 'Teste' } })
    })

    it('não lança erro se API falhar', async () => {
      mockApiPhp.post.mockRejectedValueOnce(new Error('Erro ao cadastrar'))
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = usePessoasStore()
      await expect(store.cadastrarPessoa({ nome: 'X' })).resolves.toBeUndefined()
      expect(store.loading).toBe(false)
    })
  })

  describe('deletarPessoa', () => {
    it('deleta pessoa, mostra snackbar e recarrega lista', async () => {
      mockApiPhp.delete.mockResolvedValueOnce({})
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })
      const snackbar = { message: '', color: '', show: false }

      const store = usePessoasStore()
      expect(store.loading).toBe(false)

      const promise = store.deletarPessoa(1, snackbar)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.delete).toHaveBeenCalledWith('/manutencao/pessoas/1')
      expect(snackbar.message).toBe('Pessoa excluída')
      expect(snackbar.color).toBe('success')
      expect(snackbar.show).toBe(true)
      expect(store.loading).toBe(false)
    })

    it('trata erro na exclusão', async () => {
      mockApiPhp.delete.mockRejectedValueOnce(new Error('Erro ao excluir'))
      const snackbar = { message: '', color: '', show: false }

      const store = usePessoasStore()
      await store.deletarPessoa(1, snackbar)

      expect(snackbar.message).toBe('Erro ao excluir pessoa')
      expect(snackbar.color).toBe('error')
      expect(snackbar.show).toBe(true)
      expect(store.loading).toBe(false)
    })
  })

  describe('salvarPessoa', () => {
    const makeFormRef = (valid = true) => ({
      validate: vi.fn().mockResolvedValue({ valid }),
    })
    const makeSnackbar = () => ({ message: '', color: '', show: false })

    it('cria nova pessoa com sucesso', async () => {
      const formRef = makeFormRef()
      const snackbar = makeSnackbar()
      const form = {
        nome: 'João',
        cpf_cnpj: '123.456.789-01',
        telefone: '(11) 99999-8888',
        celular: '(11) 97777-6666',
        whats: '(11) 95555-4444',
        enderecos: [{ rua: 'Rua A' }],
        data: '2024-01-01',
      }
      mockApiPhp.post.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = usePessoasStore()
      await store.salvarPessoa(formRef, form, false, snackbar)

      // Verifica que o validate foi chamado
      expect(formRef.validate).toHaveBeenCalled()

      // Verifica que a máscara foi limpa
      expect(mockApiPhp.post).toHaveBeenCalledWith('/manutencao/pessoas', {
        nome: 'João',
        cpf_cnpj: '12345678901',
        telefone: '11999998888',
        celular: '11977776666',
        whats: '11955554444',
        endereco: [{ rua: 'Rua A' }],
      })
      expect(snackbar.message).toBe('Cliente criado com sucesso!')
      expect(snackbar.color).toBe('success')
      expect(snackbar.show).toBe(true)
      expect(store.loading).toBe(false)
    })

    it('edita pessoa existente com sucesso', async () => {
      const formRef = makeFormRef()
      const snackbar = makeSnackbar()
      const form = {
        id: 5,
        nome: 'João Editado',
        cpf_cnpj: '12345678901',
        telefone: '',
        celular: '',
        whats: '',
        enderecos: [],
      }
      mockApiPhp.put.mockResolvedValueOnce({ data: {} })
      mockApiPhp.get.mockResolvedValueOnce({ data: { data: [] } })

      const store = usePessoasStore()
      await store.salvarPessoa(formRef, form, true, snackbar)

      expect(mockApiPhp.put).toHaveBeenCalledWith('/manutencao/pessoas/5', {
        id: 5,
        nome: 'João Editado',
        cpf_cnpj: '12345678901',
        telefone: '',
        celular: '',
        whats: '',
        endereco: [],
      })
      expect(snackbar.message).toBe('Cliente atualizado com sucesso!')
      expect(snackbar.color).toBe('success')
    })

    it('não prossegue se validação falhar', async () => {
      const formRef = makeFormRef(false) // validation fails
      const snackbar = makeSnackbar()
      const form = { nome: '' }

      const store = usePessoasStore()
      await store.salvarPessoa(formRef, form, false, snackbar)

      expect(mockApiPhp.post).not.toHaveBeenCalled()
      expect(mockApiPhp.put).not.toHaveBeenCalled()
    })

    it('trata erro ao salvar', async () => {
      const formRef = makeFormRef()
      const snackbar = makeSnackbar()
      const form = { nome: 'Erro', cpf_cnpj: '', telefone: '', celular: '', whats: '', enderecos: [] }
      mockApiPhp.post.mockRejectedValueOnce(new Error('Erro de servidor'))

      const store = usePessoasStore()
      await store.salvarPessoa(formRef, form, false, snackbar)

      expect(snackbar.message).toBe('Erro ao salvar cliente')
      expect(snackbar.color).toBe('error')
      expect(snackbar.show).toBe(true)
      expect(store.errorMessage).toBe('Erro ao salvar cliente!')
      expect(store.loading).toBe(false)
    })
  })

  describe('importarPessoasCSV', () => {
    it('importa pessoas com sucesso', async () => {
      const pessoas = [
        {
          nome: 'João',
          cpf_cnpj: '123.456.789-01',
          telefone: '(11) 99999-8888',
          cliente: 'S',
          ativo: 'S',
        },
        {
          nome: 'Maria',
          cpf_cnpj: '987.654.321-01',
          telefone: '(21) 98888-7777',
          fornecedor: 'S',
        },
      ]
      mockApiPhp.post.mockResolvedValueOnce({ data: { data: [] } })

      const store = usePessoasStore()

      expect(store.loading).toBe(false)
      const promise = store.importarPessoasCSV(pessoas)
      expect(store.loading).toBe(true)

      await promise

      expect(mockApiPhp.post).toHaveBeenCalledWith('/manutencao/pessoas/importar', [
        {
          nome: 'João',
          cpf_cnpj: '12345678901',
          telefone: '11999998888',
          celular: '',
          whats: '',
          latitude: null,
          longitude: null,
          cliente: 'S',
          fornecedor: 'N',
          transportadora: 'N',
          colaborador: 'N',
          representante: 'N',
          ativo: 'S',
        },
        {
          nome: 'Maria',
          cpf_cnpj: '98765432101',
          telefone: '21988887777',
          celular: '',
          whats: '',
          latitude: null,
          longitude: null,
          cliente: 'N',
          fornecedor: 'S',
          transportadora: 'N',
          colaborador: 'N',
          representante: 'N',
          ativo: 'S',
        },
      ])
      expect(store.errorMessage).toBe('')
      expect(store.loading).toBe(false)
    })

    it('trata erro na importação', async () => {
      mockApiPhp.post.mockRejectedValueOnce(new Error('Erro ao importar'))

      const store = usePessoasStore()
      await expect(store.importarPessoasCSV([{ nome: 'Teste' }])).rejects.toThrow('Erro ao importar')
      expect(store.errorMessage).toBe('Erro ao importar pessoas')
      expect(store.loading).toBe(false)
    })
  })
})
