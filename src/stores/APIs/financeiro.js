import { defineStore } from 'pinia'
import api from '@/services/api'

export const useFinanceiroStore = defineStore('financeiro', {
  state: () => ({
    contas: [],
    bancos: [],
    agencias: [],
    ufs: [],
    loading: false,
    error: null,
    search: ''
  }),

  actions: {
    // Função auxiliar para obter headers com token
    getAuthHeaders() {
      const token = localStorage.getItem('token')
      console.log('Token obtido:', token) // Debug
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    },

    // ========== CONTAS CORRENTES ==========
    
    // Buscar todas as contas correntes
    async buscarContas() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/ccorrente', {
          headers: this.getAuthHeaders()
        });
        
        // Garantir que response.data seja um array válido
        const resposta = response.data;
        
        console.log('Resposta completa da API:', resposta); // Debug
        
        // Verificar se a resposta tem a estrutura {data: [...], records: X}
        let dados;
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data;
        } 
        // Se é array diretamente
        else if (Array.isArray(resposta)) {
          dados = resposta;
        }
        // Se é objeto válido (não null, não undefined, não string vazia), transformar em array
        else if (resposta && resposta !== '' && typeof resposta === 'object' && !resposta.data) {
          dados = [resposta];
        }
        // Qualquer outro caso (null, undefined, string vazia, etc), usar array vazio
        else {
          dados = [];
        }
        
        this.contas = dados;
        console.log('Contas processadas:', this.contas); // Debug
        
        return this.contas;
      } catch (error) {
        this.error = error.message;
        this.contas = []; // Garantir que contas seja um array vazio em caso de erro
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar conta corrente por ID
    async buscarContaPorId(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/ccorrente/${id}`, {
          headers: this.getAuthHeaders()
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Criar nova conta corrente
    async criarConta(contaData) {
      this.loading = true;
      this.error = null;
      try {
        // Garantir que não estamos enviando o id na criação
        const dadosSemId = { ...contaData };
        delete dadosSemId.id;
        
        const response = await api.post('/ccorrente', { data: [dadosSemId] }, {
          headers: this.getAuthHeaders()
        });
        
        // Atualizar a lista local
        this.contas.push(response.data);
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Atualizar conta corrente existente
    async atualizarConta(id, contaData) {
      this.loading = true;
      this.error = null;
      try {
        // Remover o id dos dados a serem enviados (vai na URL)
        const dadosParaUpdate = { ...contaData };
        delete dadosParaUpdate.id_ccorrente; // Nome correto do campo ID
        
        const response = await api.put(`/ccorrente/${id}`, { data: [dadosParaUpdate] }, {
          headers: this.getAuthHeaders()
        });
        
        // Atualizar na lista local
        const index = this.contas.findIndex(conta => conta.id_ccorrente === id);
        if (index !== -1) {
          this.contas[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar conta corrente
    async deletarConta(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/ccorrente/${id}`, {
          headers: this.getAuthHeaders()
        });
        
        // Remover da lista local
        this.contas = this.contas.filter(conta => conta.id_ccorrente !== id);
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== BANCOS ==========
    
    // Buscar todos os bancos
    async buscarBancos() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/banco', {
          headers: this.getAuthHeaders()
        });
        
        // Garantir que response.data seja um array válido
        const resposta = response.data;
        
        // Verificar se a resposta tem a estrutura {data: [...], records: X}
        let dados;
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data;
        } 
        // Se é array diretamente
        else if (Array.isArray(resposta)) {
          dados = resposta;
        }
        // Se é objeto válido (não null, não undefined, não string vazia), transformar em array
        else if (resposta && resposta !== '' && typeof resposta === 'object' && !resposta.data) {
          dados = [resposta];
        }
        // Qualquer outro caso (null, undefined, string vazia, etc), usar array vazio
        else {
          dados = [];
        }
        
        this.bancos = dados;
        return this.bancos;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar bancos';
        this.bancos = []; // Garantir que bancos seja um array vazio em caso de erro
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar banco por ID
    async buscarBancoPorId(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/banco/${id}`, {
          headers: this.getAuthHeaders()
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar banco';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== AGÊNCIAS ==========
    
    // Buscar todas as agências
    async buscarAgencias() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/agencia', {
          headers: this.getAuthHeaders()
        });
        
        // Garantir que response.data seja um array válido
        const resposta = response.data;
        
        // Verificar se a resposta tem a estrutura {data: [...], records: X}
        let dados;
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data;
        } 
        // Se é array diretamente
        else if (Array.isArray(resposta)) {
          dados = resposta;
        }
        // Se é objeto válido (não null, não undefined, não string vazia), transformar em array
        else if (resposta && resposta !== '' && typeof resposta === 'object' && !resposta.data) {
          dados = [resposta];
        }
        // Qualquer outro caso (null, undefined, string vazia, etc), usar array vazio
        else {
          dados = [];
        }
        
        this.agencias = dados;
        return this.agencias;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar agências';
        this.agencias = []; // Garantir que agencias seja um array vazio em caso de erro
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar agência por ID
    async buscarAgenciaPorId(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/agencia/${id}`, {
          headers: this.getAuthHeaders()
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Criar nova agência
    async criarAgencia(agenciaData) {
      this.loading = true;
      this.error = null;
      try {
        // Para agência, NÃO removemos o ID pois ele representa o número da agência
        const dadosParaEnvio = { ...agenciaData };
        
        console.log('Dados da agência para envio:', dadosParaEnvio); // Debug
        
        const response = await api.post('/agencia', { data: [dadosParaEnvio] }, {
          headers: this.getAuthHeaders()
        });
        
        // Atualizar a lista local
        this.agencias.push(response.data);
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Atualizar agência existente
    async atualizarAgencia(id, agenciaData) {
      this.loading = true;
      this.error = null;
      try {
        const dadosParaUpdate = { ...agenciaData };
        delete dadosParaUpdate.id;
        
        const response = await api.put(`/agencia/${id}`, { data: [dadosParaUpdate] }, {
          headers: this.getAuthHeaders()
        });
        
        // Atualizar na lista local
        const index = this.agencias.findIndex(agencia => agencia.id === id);
        if (index !== -1) {
          this.agencias[index] = response.data;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar agência
    async deletarAgencia(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/agencia/${id}`, {
          headers: this.getAuthHeaders()
        });
        
        // Remover da lista local
        this.agencias = this.agencias.filter(agencia => agencia.id !== id);
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== UFS ==========
    
    // Buscar todas as UFs
    async buscarUFs() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/uf', {
          headers: this.getAuthHeaders()
        });
        
        console.log('Resposta UFs da API:', response.data); // Debug
        
        // Normalizar a resposta para o formato esperado pelo THorse
        // A resposta vem com campos: ID, SIGLA, DESCUF, ID_PAIS, NOMEPAIS
        if (response.data && response.data.data) {
          this.ufs = response.data.data;
        } else if (Array.isArray(response.data)) {
          this.ufs = response.data;
        } else {
          console.warn('Formato inesperado na resposta das UFs:', response.data);
          this.ufs = [];
        }
        
        console.log('UFs carregadas:', this.ufs); // Debug
        return this.ufs;
      } catch (error) {
        console.error('Erro ao buscar UFs:', error);
        this.error = error.response?.data?.message || 'Erro ao buscar UFs';
        this.ufs = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== UTILITÁRIOS ==========
    
    // Limpar erros
    limparErros() {
      this.error = null;
    },

    // Limpar estado
    limparEstado() {
      this.contas = [];
      this.bancos = [];
      this.agencias = [];
      this.ufs = [];
      this.error = null;
      this.loading = false;
      this.search = '';
    }
  },

  getters: {
    // Getter para contas ativas
    contasAtivas: (state) => {
      return state.contas.filter(conta => conta.dtvencimento === null || new Date(conta.dtvencimento) > new Date());
    },

    // Getter para contas por banco
    contasPorBanco: (state) => {
      return state.contas.reduce((acc, conta) => {
        if (!acc[conta.id_banco]) {
          acc[conta.id_banco] = [];
        }
        acc[conta.id_banco].push(conta);
        return acc;
      }, {});
    },

    // Getter para agências por banco
    agenciasPorBanco: (state) => {
      return state.agencias.reduce((acc, agencia) => {
        if (!acc[agencia.id_banco]) {
          acc[agencia.id_banco] = [];
        }
        acc[agencia.id_banco].push(agencia);
        return acc;
      }, {});
    },

    // Getter para verificar se está carregando
    estaCarregando: (state) => state.loading,

    // Getter para verificar se tem erro
    temErro: (state) => !!state.error,

    // Getter para contas filtradas pela pesquisa
    contasFiltradas: (state) => {
      if (!state.search) return state.contas;
      
      const searchLower = state.search.toLowerCase();
      return state.contas.filter(conta => 
        conta.titulas?.toLowerCase().includes(searchLower) ||
        conta.numero_conta?.toString().includes(searchLower) ||
        conta.digito_cc?.toLowerCase().includes(searchLower)
      );
    }
  }
});
