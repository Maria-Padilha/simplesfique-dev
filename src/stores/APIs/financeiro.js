import { defineStore } from 'pinia'
import api from '@/services/api'

export const useFinanceiroStore = defineStore('financeiro', {
  state: () => ({
    contas: [],
    bancos: [],
    ufs: [],
    usuarios: [],
    loading: false,
    error: null,
    search: ''
  }),

  actions: {
    // Função auxiliar para obter headers com token
    getAuthHeaders() {
      const token = localStorage.getItem('token')
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

        // Normalizar id_banco: enviar somente o ID numérico se vier como objeto
        if (dadosSemId.id_banco && typeof dadosSemId.id_banco === 'object') {
          dadosSemId.id_banco = dadosSemId.id_banco.ID ?? dadosSemId.id_banco.id ?? dadosSemId.id_banco
        }

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

        // Normalizar id_banco se necessário
        if (dadosParaUpdate.id_banco && typeof dadosParaUpdate.id_banco === 'object') {
          dadosParaUpdate.id_banco = dadosParaUpdate.id_banco.ID ?? dadosParaUpdate.id_banco.id ?? dadosParaUpdate.id_banco
        }

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
    // ========== UFS ==========
    
    // Buscar todas as UFs
    async buscarUFs() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/uf', {
          headers: this.getAuthHeaders()
        });


        // Normalizar a resposta para garantir chaves consistentes (SIGLA, ID, DESCUF, NOMEPAIS)
        let raw = []
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          raw = response.data.data
        } else if (Array.isArray(response.data)) {
          raw = response.data
        } else if (response.data && typeof response.data === 'object') {
          raw = [response.data]
        } else {
          raw = []
        }

        // Mapear cada item para uma forma previsível usada pela UI
        this.ufs = raw.map(u => ({
          ID: u.ID ?? u.id ?? u.Id ?? '',
          SIGLA: u.SIGLA ?? u.sigla ?? u.Sigla ?? '',
          DESCUF: u.DESCUF ?? u.descuf ?? u.DescUf ?? u.DESCRICAO ?? u.descricao ?? '',
          ID_PAIS: u.ID_PAIS ?? u.id_pais ?? u.idPais ?? '',
          NOMEPAIS: u.NOMEPAIS ?? u.nomepais ?? u.nomePais ?? ''
        }))


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

    // Buscar usuários (GET /usuario) - normalize THorse style { data: [...] }
    async buscarUsuarios() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/usuario', {
          headers: this.getAuthHeaders()
        })
        const resp = response.data
        let dados = []
        if (resp && resp.data && Array.isArray(resp.data)) {
          dados = resp.data
        } else if (Array.isArray(resp)) {
          dados = resp
        } else if (resp && typeof resp === 'object') {
          dados = [resp]
        } else {
          dados = []
        }

        // Normalizar campos mais usados pela UI
        this.usuarios = dados.map(u => ({
          ID: u.ID ?? u.id ?? u.id_saas ?? '',
          nome: u.nome ?? u.NOME ?? u.name ?? '',
          email: u.email ?? u.EMAIL ?? '',
          ativo: u.ativo ?? 'S',
          raw: u
        }))

        return this.usuarios
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar usuários'
        this.usuarios = []
        throw error
      } finally {
        this.loading = false
      }
    },

      // Buscar usuários vinculados a uma conta corrente (GET /ccorrenteusu/:id)
      async buscarUsuariosPorConta(contaId) {
        this.loading = true
        this.error = null
        try {

          
          const response = await api.get(`/ccorrenteusu/${contaId}`, {
            headers: this.getAuthHeaders()
          })
          

          
          const resp = response.data
          let dados = []
          if (resp && resp.data && Array.isArray(resp.data)) {
            dados = resp.data
          } else if (Array.isArray(resp)) {
            dados = resp
          } else if (resp && typeof resp === 'object') {
            dados = [resp]
          } else {
            dados = []
          }



          // retorno: array de objetos que representam vínculo (esperado campos como id_usuario, ativo, nome, email)
          return dados
        } catch (error) {
          console.error('Erro ao buscar usuários vinculados à conta:', error)
          this.error = error.response?.data?.message || 'Erro ao buscar usuários vinculados à conta'
          throw error
        } finally {
          this.loading = false
        }
      },

      // Atualizar acessos de usuários para uma conta (POST /ccorrenteusu/:id)
      // payload: { contaId, users: [{ id: <usuarioId>, acesso: true|false }, ...] }
      async atualizarAcessoConta(payload) {
        this.loading = true
        this.error = null
        try {
          const contaId = payload.contaId
          const users = Array.isArray(payload.users) ? payload.users : []

          // Enviar as atualizações; o backend pode aceitar múltiplos registros em data array
          // Construir array de objetos com { id_usuario, ativo }
          const dataArray = users.map(u => ({ id_usuario: u.id, ativo: u.acesso ? 'S' : 'N' }))

          // Enviar em um único POST encapsulado em { data: [...] }
          const response = await api.post(`/ccorrenteusu/${contaId}`, { data: dataArray }, {
            headers: this.getAuthHeaders()
          })

          // Opcional: retornar o body normalizado
          const resp = response.data
          if (resp && resp.data && Array.isArray(resp.data)) return resp.data
          return resp
        } catch (error) {
          this.error = error.response?.data?.message || 'Erro ao atualizar acessos de usuários'
          throw error
        } finally {
          this.loading = false
        }
      },

    // ========== AGENCIA =============

    async buscarAgencias() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/agencia', {
          headers: this.getAuthHeaders()
        });
        // Normalizar resposta no padrão THorse: { data: [...] }
        const resp = response.data;
        let dados;
        if (resp && resp.data && Array.isArray(resp.data)) {
          dados = resp.data;
        } else if (Array.isArray(resp)) {
          dados = resp;
        } else if (resp && resp !== '' && typeof resp === 'object') {
          // Single object -> transformar em array
          dados = [resp];
        } else {
          dados = [];
        }

        this.agencias = dados;
        return this.agencias;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar agências';
        this.agencias = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async criarAgencia(agenciaData) {
      this.loading = true;
      this.error = null;
      try {
        // Garantir que id_banco e id_uf estejam no formato esperado pelo backend
        const ag = { ...agenciaData }
        // id_banco: pode vir como objeto -> extrair ID ou id
        if (ag.id_banco && typeof ag.id_banco === 'object') {
          ag.id_banco = ag.id_banco.ID ?? ag.id_banco.id ?? ag.id_banco
        }
        // id_uf: backend expects SIGLA (string). If an object was provided, extract SIGLA/sigla
        if (ag.id_uf && typeof ag.id_uf === 'object') {
          ag.id_uf = ag.id_uf.SIGLA ?? ag.id_uf.sigla ?? ag.id_uf.Sigla ?? ag.id_uf.ID ?? ag.id_uf.id ?? ''
        }

        // THorse expects payload wrapped in { data: [ ... ] }
        const payload = { data: [ag] };
        const response = await api.post('/agencia', payload, {
          headers: this.getAuthHeaders()
        });

        // Normalizar resposta: pode retornar { data: [...] } ou o objeto criado
        const resp = response.data;
        let created;
        if (resp && resp.data && Array.isArray(resp.data)) {
          created = resp.data[0];
        } else if (resp && typeof resp === 'object') {
          created = resp;
        } else {
          created = null;
        }

        if (created) this.agencias.push(created);
        return created || response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar uma agência por ID (agora requer id do banco na rota)
    // usar: buscarAgenciaPorId(idBanco, idAgencia)
    async buscarAgenciaPorId(idBanco, id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/agencia/${idBanco}/id/${id}`, {
          headers: this.getAuthHeaders()
        });

        // Normalizar retorno
        const resp = response.data;
        if (resp && resp.data && Array.isArray(resp.data)) return resp.data[0];
        return resp;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Atualizar agência (rota agora inclui id do banco)
    // usar: atualizarAgencia(idBanco, idAgencia, agenciaData)
    async atualizarAgencia(idBanco, id, agenciaData) {
      this.loading = true;
      this.error = null;
      try {
        const ag = { ...agenciaData }
        if (ag.id_banco && typeof ag.id_banco === 'object') {
          ag.id_banco = ag.id_banco.ID ?? ag.id_banco.id ?? ag.id_banco
        }
        if (ag.id_uf && typeof ag.id_uf === 'object') {
          ag.id_uf = ag.id_uf.SIGLA ?? ag.id_uf.sigla ?? ag.id_uf.Sigla ?? ag.id_uf.ID ?? ag.id_uf.id ?? ''
        }

        const payload = { data: [ag] };
        const response = await api.put(`/agencia/${idBanco}/id/${id}`, payload, {
          headers: this.getAuthHeaders()
        });

        const resp = response.data;
        let updated;
        if (resp && resp.data && Array.isArray(resp.data)) {
          updated = resp.data[0];
        } else if (resp && typeof resp === 'object') {
          updated = resp;
        }

        // Atualizar na lista local (tenta casar por várias chaves possíveis)
        if (updated) {
          const findIndex = this.agencias.findIndex(a => String(a.ID ?? a.id ?? a.id_agencia) === String(id));
          if (findIndex !== -1) this.agencias[findIndex] = updated;
        }

        return updated || response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar agência (rota agora inclui id do banco)
    // usar: deletarAgencia(idBanco, idAgencia)
    async deletarAgencia(idBanco, id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/agencia/${idBanco}/id/${id}`, {
          headers: this.getAuthHeaders()
        });

        // Remover da lista local com chaves variantes
        this.agencias = this.agencias.filter(a => String(a.ID ?? a.id ?? a.id_agencia) !== String(id));
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar agência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== CAIXAS ==========

    // Buscar caixas por empresa (GET /caixa/:idempresa)
    async buscarCaixas(idEmpresa) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/caixa/${idEmpresa}`, {
          headers: this.getAuthHeaders()
        });

        // Normalizar retorno THorse: { data: [...] }
        const resp = response.data;
        let dados;
        if (resp && resp.data && Array.isArray(resp.data)) {
          dados = resp.data;
        } else if (Array.isArray(resp)) {
          dados = resp;
        } else if (resp && typeof resp === 'object') {
          dados = [resp];
        } else {
          dados = [];
        }

        return dados;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar caixas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar caixa por ID (GET /caixa/:idempresa/id/:id)
    async buscarCaixaPorId(idEmpresa, idCaixa) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/caixa/${idEmpresa}/id/${idCaixa}`, {
          headers: this.getAuthHeaders()
        });

        // Normalizar retorno
        const resp = response.data;
        if (resp && resp.data && Array.isArray(resp.data)) return resp.data[0];
        if (Array.isArray(resp)) return resp[0];
        return resp;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar caixa';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Criar nova caixa (POST /caixa)
    async criarCaixa(caixaData) {
      this.loading = true;
      this.error = null;
      try {
        // Garantir que não estamos enviando o ID na criação
        const dadosSemId = { ...caixaData };
        delete dadosSemId.id;

        // THorse expects payload wrapped in { data: [ ... ] }
        const payload = { data: [dadosSemId] };
        const response = await api.post('/caixa', payload, {
          headers: this.getAuthHeaders()
        });

        // Normalizar retorno: pode retornar { data: [...] } ou o objeto criado
        const resp = response.data;
        let created;
        if (resp && resp.data && Array.isArray(resp.data)) {
          created = resp.data[0];
        } else if (resp && typeof resp === 'object') {
          created = resp;
        }

        return created || response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar caixa';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Atualizar caixa existente (PUT /caixa/:idempresa/id/:id)
    async atualizarCaixa(idEmpresa, id, caixaData) {
      this.loading = true;
      this.error = null;
      try {
        // Remover o id dos dados a serem enviados (vai na URL)
        const dadosParaUpdate = { ...caixaData };
        delete dadosParaUpdate.id;

        // THorse expects payload wrapped in { data: [ ... ] }
        const payload = { data: [dadosParaUpdate] };
        const response = await api.put(`/caixa/${idEmpresa}/id/${id}`, payload, {
          headers: this.getAuthHeaders()
        });

        // Normalizar retorno
        const resp = response.data;
        let updated;
        if (resp && resp.data && Array.isArray(resp.data)) {
          updated = resp.data[0];
        } else if (resp && typeof resp === 'object') {
          updated = resp;
        }

        return updated || response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar caixa';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar caixa (DELETE /caixa/:idempresa/id/:id)
    async deletarCaixa(idEmpresa, id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/caixa/${idEmpresa}/id/${id}`, {
          headers: this.getAuthHeaders()
        });

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar caixa';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== CAIXA USUÁRIOS ==========
    
    // Buscar usuários vinculados a um caixa (GET /caixausu/:idempresa/id/:id)
    async buscarUsuariosPorCaixa(idEmpresa, caixaId) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/caixausu/${idEmpresa}/id/${caixaId}`, {
          headers: this.getAuthHeaders()
        })
        const resp = response.data
        let dados = []
        if (resp && resp.data && Array.isArray(resp.data)) {
          dados = resp.data
        } else if (Array.isArray(resp)) {
          dados = resp
        } else if (resp && typeof resp === 'object') {
          dados = [resp]
        } else {
          dados = []
        }

        // retorno: array de objetos que representam vínculo (esperado campos como id_usuario, ativo, nome, email)
        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar usuários vinculados ao caixa'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar acessos de usuários para um caixa (POST /caixausu/:idempresa/id/:id)
    // payload: { idEmpresa, caixaId, users: [{ id: <usuarioId>, acesso: true|false }, ...] }
    async atualizarAcessoCaixa(payload) {
      this.loading = true
      this.error = null
      try {
        const idEmpresa = payload.idEmpresa
        const caixaId = payload.caixaId
        const users = Array.isArray(payload.users) ? payload.users : []

        // Enviar as atualizações; o backend pode aceitar múltiplos registros em data array
        // Construir array de objetos com { id_usuario, ativo }
        const dataArray = users.map(u => ({ id_usuario: u.id, ativo: u.acesso ? 'S' : 'N' }))

        // Enviar em um único POST encapsulado em { data: [...] }
        const response = await api.post(`/caixausu/${idEmpresa}/id/${caixaId}`, { data: dataArray }, {
          headers: this.getAuthHeaders()
        })

        // Opcional: retornar o body normalizado
        const resp = response.data
        if (resp && resp.data && Array.isArray(resp.data)) return resp.data
        return resp
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar acessos de usuários no caixa'
        throw error
      } finally {
        this.loading = false
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

    // Getter para verificar se está carregando
    estaCarregando: (state) => state.loading,

    // Getter para verificar se tem erro
    temErro: (state) => !!state.error,

    // Getter para contas filtradas pela pesquisa
    contasFiltradas: (state) => {
      if (!state.search) return state.contas;
      
      const searchLower = state.search.toLowerCase();
      return state.contas.filter(conta => 
        conta.titular?.toLowerCase().includes(searchLower) ||
        conta.numero_conta?.toString().includes(searchLower) ||
        conta.digito_cc?.toLowerCase().includes(searchLower)
      );
    }
  }
});
