import { defineStore } from 'pinia'
import api from '@/services/api'

export const useFinanceiroStore = defineStore('financeiro', {
  state: () => ({
    contas: [],
    bancos: [],
    ufs: [],
    usuarios: [],
    tiposDocumento: [],
    tiposPagRec: [],
    locaisCobranca: [],
    planosConta: [],
    loading: false,
    error: null,
    search: '',
    // Key da media anexada para contas a pagar
    mediaKeyTemporaria: null
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

    // ========== MEDIA TEMPORÁRIA ==========
    
    // Definir key da media temporária
    setMediaKeyTemporaria(key) {
      this.mediaKeyTemporaria = key
    },

    // Limpar key da media temporária
    clearMediaKeyTemporaria() {
      this.mediaKeyTemporaria = null
    },

    // Obter key da media temporária
    getMediaKeyTemporaria() {
      return this.mediaKeyTemporaria
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

    // Alias semântico para buscarContas
    async buscarContasCorrentes() {
      return await this.buscarContas();
    },

    // Buscar históricos bancários
    async buscarHistoricosBancarios() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/histbancario', {
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
        
        return dados;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar contas correntes ativas do usuário logado (GET /ccorrenteusuativo)
    async buscarContasUsuarioAtivo() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/ccorrenteusuativo', {
          headers: this.getAuthHeaders()
        });
        
        const resposta = response.data;
        
        // A API retorna {data: {id, numero_ccorrente, titular}}
        // Precisamos transformar em array
        let dados;
        if (resposta && resposta.data) {
          // Se data é um objeto único, transformar em array
          if (typeof resposta.data === 'object' && !Array.isArray(resposta.data)) {
            dados = [resposta.data];
          }
          // Se data já é array
          else if (Array.isArray(resposta.data)) {
            dados = resposta.data;
          }
          else {
            dados = [];
          }
        } 
        // Se é array diretamente
        else if (Array.isArray(resposta)) {
          dados = resposta;
        }
        // Se é objeto válido, transformar em array
        else if (resposta && resposta !== '' && typeof resposta === 'object') {
          dados = [resposta];
        }
        else {
          dados = [];
        }
        
        return dados;
      } catch (error) {
        this.error = error.message;
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

    // ========== MOVIMENTAÇÕES DE CONTA CORRENTE ==========
    
    // Buscar movimentações de conta corrente
    async buscarMovimentacoesContaCorrente(idEmpresa, idCcorrente, dtini, dtfim) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/ccorrentemov/${idEmpresa}/idccorrente/${idCcorrente}/dtini/${dtini}/dtfim/${dtfim}`, {
          headers: this.getAuthHeaders()
        });
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar movimentações';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar movimentação específica de conta corrente
    async buscarMovimentacaoContaCorrente(idEmpresa, idCcorrente, id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/ccorrentemov/${idEmpresa}/idccorrente/${idCcorrente}/id/${id}`, {
          headers: this.getAuthHeaders()
        });
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar movimentação';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Criar movimentação de conta corrente
    async criarMovimentacaoContaCorrente(idEmpresa, idCcorrente, payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post(`/ccorrentemov/${idEmpresa}/idccorrente/${idCcorrente}`, payload, {
          headers: this.getAuthHeaders()
        });
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar movimentação';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Atualizar movimentação de conta corrente
    async atualizarMovimentacaoContaCorrente(idEmpresa, idCcorrente, id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/ccorrentemov/${idEmpresa}/idccorrente/${idCcorrente}/id/${id}`, payload, {
          headers: this.getAuthHeaders()
        });
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao atualizar movimentação';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar movimentação de conta corrente
    async deletarMovimentacaoContaCorrente(idEmpresa, idCcorrente, id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.delete(`/ccorrentemov/${idEmpresa}/idccorrente/${idCcorrente}/id/${id}`, {
          headers: this.getAuthHeaders()
        });
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar movimentação';
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

    // ========== CONTAS A PAGAR ==========

    // Buscar baixas de contas a pagar por período (GET /pagarbaixados/:idempresa/dtini/:dtini/dtfim/:dtfim)
    async buscarBaixasPagar({ data_inicio, data_fim }) {
      this.loading = true
      this.error = null
      try {
        const idEmpresa = localStorage.getItem('empresa') || localStorage.getItem('id_empresa') || '1'
        
        const response = await api.get(`/pagarbaixados/${idEmpresa}/dtini/${data_inicio}/dtfim/${data_fim}`, {
          headers: this.getAuthHeaders()
        })

        // Normalizar resposta
        const resposta = response.data
        let dados = []
        
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data
        } else if (Array.isArray(resposta)) {
          dados = resposta
        } else if (resposta && resposta !== '' && typeof resposta === 'object') {
          dados = [resposta]
        }

        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar baixas'
        console.error('Erro ao buscar baixas a pagar:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    // Estornar baixa de conta a pagar
    async estornarBaixaPagar(id) {
      this.loading = true
      this.error = null
      try {
        const idEmpresa = localStorage.getItem('empresa') || localStorage.getItem('id_empresa') || '1'
        
        const response = await api.delete(`/estornopagar/${idEmpresa}/id/${id}`, {
          headers: this.getAuthHeaders()
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao estornar baixa'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar baixas de contas a receber por período (GET /receberbaixados/:idempresa/dtini/:dtini/dtfim/:dtfim)
    async buscarBaixasReceber({ data_inicio, data_fim }) {
      this.loading = true
      this.error = null
      try {
        const idEmpresa = localStorage.getItem('empresa') || localStorage.getItem('id_empresa') || '1'
        
        const response = await api.get(`/receberbaixados/${idEmpresa}/dtini/${data_inicio}/dtfim/${data_fim}`, {
          headers: this.getAuthHeaders()
        })

        // Normalizar resposta
        const resposta = response.data
        let dados = []
        
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data
        } else if (Array.isArray(resposta)) {
          dados = resposta
        } else if (resposta && resposta !== '' && typeof resposta === 'object') {
          dados = [resposta]
        }

        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar baixas'
        console.error('Erro ao buscar baixas a receber:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    // Estornar baixa de conta a receber
    async estornarBaixaReceber(id) {
      this.loading = true
      this.error = null
      try {
        const idEmpresa = localStorage.getItem('empresa') || localStorage.getItem('id_empresa') || '1'
        const response = await api.delete(`/estornoreceber/${idEmpresa}/id/${id}`, {
          headers: this.getAuthHeaders()
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao estornar baixa'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Calcular parcelas para conta a pagar (POST /contaspagarcalcparc)
    async calcularParcelasContaPagar(dadosCalculo) {
      this.loading = true
      this.error = null
      try {
        // Payload esperado pelo backend no formato THorse
        const dadosParcela = {
          vlrdocumento: dadosCalculo.vlrdocumento,
          vlrprimeiraparcela: dadosCalculo.vlrprimeiraparcela || 0,
          qtdparcelas: dadosCalculo.qtdparcelas,
          primeirovencimento: dadosCalculo.primeirovencimento,
          intervalo: dadosCalculo.intervalo || 30 // Default 30 dias se não informado
        }

        // THorse expects payload wrapped in { data: [ ... ] }
        const payload = { data: [dadosParcela] }

        const response = await api.post('/contaspagarcalcparc', payload, {
          headers: this.getAuthHeaders()
        })

        // Normalizar retorno: pode retornar { data: [...] } ou array direto
        const resp = response.data
        let parcelas = []
        if (resp && resp.data && Array.isArray(resp.data)) {
          parcelas = resp.data
        } else if (Array.isArray(resp)) {
          parcelas = resp
        } else if (resp && typeof resp === 'object') {
          parcelas = [resp]
        }

        return parcelas
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao calcular parcelas'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== HISTÓRICO CONTABIL ==========

    // Buscar históricos contábeis (GET /historicocontabil)
    async buscarHistoricosContabil() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/historicocontabil', {
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
        }
        return dados
      }
      catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar históricos contábeis'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar histórico contábil (POST /historicocontabil)
    async criarHistoricoContabil(historicoData) {
      this.loading = true
      this.error = null
      try {
        // THorse expects payload wrapped in { data: [ ... ] }
        const payload = { data: [historicoData] }
        const response = await api.post('/historicocontabil', payload, {
          headers: this.getAuthHeaders()
        })

        // Normalizar retorno
        const resp = response.data
        let created
        if (resp && resp.data && Array.isArray(resp.data)) {
          created = resp.data[0]
        } else if (resp && typeof resp === 'object') {
          created = resp
        }

        return created || response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar histórico contábil'
        throw error
      } finally {
        this.loading = false
      }
    },
    // Buscar contas a pagar (GET /contaspagar/:idempresa)
    async buscarContasPagar(idEmpresa, filtros = {}) {
      this.loading = true
      this.error = null
      try {
        // Construir query params
        const params = new URLSearchParams()
        
        if (filtros.tpperiodo !== undefined) params.append('tpperiodo', filtros.tpperiodo)
        if (filtros.dtini) params.append('dtini', filtros.dtini)
        if (filtros.dtfim) params.append('dtfim', filtros.dtfim)
        if (filtros.dt_inicio) params.append('dt_inicio', filtros.dt_inicio)
        if (filtros.dt_fim) params.append('dt_fim', filtros.dt_fim)
        if (filtros.idfornecedor) params.append('idfornecedor', filtros.idfornecedor)
        if (filtros.cnpj_cpf) params.append('cnpj_cpf', filtros.cnpj_cpf)
        if (filtros.nrdocumento) params.append('nrdocumento', filtros.nrdocumento)
        if (filtros.idtpdocumento) params.append('idtpdocumento', filtros.idtpdocumento)
        if (filtros.idlocalcobranca) params.append('idlocalcobranca', filtros.idlocalcobranca)
        if (filtros.baixado) params.append('baixado', filtros.baixado)
        if (filtros.liberadopagto) params.append('liberadopagto', filtros.liberadopagto)
        
        const queryString = params.toString()
        const url = queryString ? `/contaspagar/${idEmpresa}?${queryString}` : `/contaspagar/${idEmpresa}`
        
        console.log('🔍 Buscando contas a pagar:', url)
        
        const response = await api.get(url, {
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
        }

        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar contas a pagar'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar contas a pagar para baixa (GET /contaspagarbxa/:idempresa)
    async buscarContasPagarBaixa(idEmpresa, filtros = {}) {
      this.loading = true
      this.error = null
      try {
        // Construir query params
        const params = new URLSearchParams()
        
        if (filtros.tpperiodo !== undefined) params.append('tpperiodo', filtros.tpperiodo)
        if (filtros.dtini) params.append('dtini', filtros.dtini)
        if (filtros.dtfim) params.append('dtfim', filtros.dtfim)
        if (filtros.dt_inicio) params.append('dt_inicio', filtros.dt_inicio)
        if (filtros.dt_fim) params.append('dt_fim', filtros.dt_fim)
        if (filtros.idfornecedor) params.append('idfornecedor', filtros.idfornecedor)
        if (filtros.cnpj_cpf) params.append('cnpj_cpf', filtros.cnpj_cpf)
        if (filtros.nrdocumento) params.append('nrdocumento', filtros.nrdocumento)
        if (filtros.idtpdocumento) params.append('idtpdocumento', filtros.idtpdocumento)
        if (filtros.idlocalcobranca) params.append('idlocalcobranca', filtros.idlocalcobranca)
        if (filtros.baixado) params.append('baixado', filtros.baixado)
        if (filtros.liberadopagto) params.append('liberadopagto', filtros.liberadopagto)
        
        const queryString = params.toString()
        const url = queryString ? `/contaspagarbxa/${idEmpresa}?${queryString}` : `/contaspagarbxa/${idEmpresa}`
        
        console.log('🔍 Buscando contas a pagar para baixa:', url)
        
        const response = await api.get(url, {
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
        }

        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar contas a pagar para baixa'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar conta a pagar por ID (GET /contaspagar/:idempresa/id/:id)
    async buscarContaPagarPorId(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/contaspagar/${idEmpresa}/id/${id}`, {
          headers: this.getAuthHeaders()
        })

        // Retornar o objeto completo com data, pagparcela, ccusto, media
        // A API retorna: { data: [...], pagparcela: [...], media: [...], ccusto: [...] }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar conta a pagar'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar conta a pagar (POST /contaspagar)
    // Mantém assinatura (idEmpresa, payload) por compatibilidade, mas sempre envia para /contaspagar
    async criarContaPagar(idEmpresa, payload) {
      this.loading = true
      this.error = null
      try {
        // Compatibilidade: aceitar chamada com (payload) ou (idEmpresa, payload)
        if (payload === undefined && idEmpresa && typeof idEmpresa === 'object') {
          payload = idEmpresa
        }

        console.log('criarContaPagar - payload recebido:', payload)

        // Enviar sempre para a rota sem id_empresa no path; id_empresa deve estar dentro de data[0]
        const response = await api.post('/contaspagar', payload, {
          headers: this.getAuthHeaders()
        })

        console.log('criarContaPagar - resposta da API:', response.data)

        // Normalizar retorno
        const resp = response.data
        let created
        if (resp && resp.data && Array.isArray(resp.data)) {
          created = resp.data[0]
        } else if (resp && typeof resp === 'object') {
          created = resp
        }

        return created || response.data
      } catch (error) {
        console.error('criarContaPagar - erro:', error.response?.data)
        this.error = error.response?.data?.message || 'Erro ao criar conta a pagar'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar conta a pagar (PUT /contaspagar/:idempresa/id/:id)
    async atualizarContaPagar(idEmpresa, id, payload) {
      this.loading = true
      this.error = null
      try {
        console.log('atualizarContaPagar - payload recebido:', payload)
        console.log('atualizarContaPagar - id:', id)
        
        // O payload já vem no formato correto: { data: [{}], parcela: [...] }
        // Não precisamos fazer nenhuma transformação adicional
        const response = await api.put(`/contaspagar/${idEmpresa}/id/${id}`, payload, {
          headers: this.getAuthHeaders()
        })

        console.log('atualizarContaPagar - resposta da API:', response.data)

        // Normalizar retorno
        const resp = response.data
        let updated
        if (resp && resp.data && Array.isArray(resp.data)) {
          updated = resp.data[0]
        } else if (resp && typeof resp === 'object') {
          updated = resp
        }

        return updated || response.data
      } catch (error) {
        console.error('atualizarContaPagar - erro:', error.response?.data)
        this.error = error.response?.data?.message || 'Erro ao atualizar conta a pagar'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar conta a pagar (DELETE /contaspagar/:idempresa/id/:id)
    async deletarContaPagar(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/contaspagar/${idEmpresa}/id/${id}`, {
          headers: this.getAuthHeaders()
        })

        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar conta a pagar'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Autorizar contas a pagar (POST /contaspagarautorizar)
    async autorizarContasPagar(payload) {
      this.loading = true
      this.error = null
      try {
        console.log('🔒 Autorizando contas a pagar:', payload)
        
        // Garantir que o payload seja um objeto e não um array
        const payloadFinal = Array.isArray(payload) ? { data: payload } : payload
        
        const response = await api.post('/contaspagarautorizar', payloadFinal, {
          headers: this.getAuthHeaders()
        })
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao autorizar contas a pagar'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== PLANO CONTA ==========

    // Buscar planos de conta (GET /planoconta)
    async buscarPlanosConta() {
      this.loading = true
      this.error = null
      try {
      const response = await api.get('/planoconta', {
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

      this.planosConta = dados
      return dados
      } catch (error) {
      this.error = error.response?.data?.message || 'Erro ao buscar planos de conta'
      throw error
      } finally {
      this.loading = false
      }
    },

    // Buscar plano de conta por ID (GET /planoconta/:id)
    async buscarPlanoContaPorId(id) {
      this.loading = true
      this.error = null
      try {
      const response = await api.get(`/planoconta/${id}`, {
        headers: this.getAuthHeaders()
      })
      
      const resp = response.data
      if (resp && resp.data && Array.isArray(resp.data)) return resp.data[0]
      if (Array.isArray(resp)) return resp[0]
      return resp
      } catch (error) {
      this.error = error.response?.data?.message || 'Erro ao buscar plano de conta'
      throw error
      } finally {
      this.loading = false
      }
    },

    // Criar novo plano de conta (POST /planoconta)
    async criarPlanoConta(planoData) {
      this.loading = true
      this.error = null
      try {
      // Garantir que não estamos enviando o ID na criação
      const dadosSemId = { ...planoData }
      delete dadosSemId.id

      // THorse expects payload wrapped in { data: [ ... ] }
      const payload = { data: [dadosSemId] }
      const response = await api.post('/planoconta', payload, {
        headers: this.getAuthHeaders()
      })

      // Normalizar retorno: pode retornar { data: [...] } ou o objeto criado
      const resp = response.data
      let created
      if (resp && resp.data && Array.isArray(resp.data)) {
        created = resp.data[0]
      } else if (resp && typeof resp === 'object') {
        created = resp
      }

      return created || response.data
      } catch (error) {
      this.error = error.response?.data?.message || 'Erro ao criar plano de conta'
      throw error
      } finally {
      this.loading = false
      }
    },

    // Atualizar plano de conta (PUT /planoconta/:id)
    async atualizarPlanoConta(id, planoData) {
      this.loading = true
      this.error = null
      try {
      // Remover o id dos dados a serem enviados (vai na URL)
      const dadosParaUpdate = { ...planoData }
      delete dadosParaUpdate.id

      // THorse expects payload wrapped in { data: [ ... ] }
      const payload = { data: [dadosParaUpdate] }
      const response = await api.put(`/planoconta/${id}`, payload, {
        headers: this.getAuthHeaders()
      })

      // Normalizar retorno
      const resp = response.data
      let updated
      if (resp && resp.data && Array.isArray(resp.data)) {
        updated = resp.data[0]
      } else if (resp && typeof resp === 'object') {
        updated = resp
      }

      return updated || response.data
      } catch (error) {
      this.error = error.response?.data?.message || 'Erro ao atualizar plano de conta'
      throw error
      } finally {
      this.loading = false
      }
    },

    // Deletar plano de conta (DELETE /planoconta/:id)
    async deletarPlanoConta(id) {
      this.loading = true
      this.error = null
      try {
      await api.delete(`/planoconta/${id}`, {
        headers: this.getAuthHeaders()
      })

      return true
      } catch (error) {
      this.error = error.response?.data?.message || 'Erro ao deletar plano de conta'
      throw error
      } finally {
      this.loading = false
      }
    },

    // ========== AUXILIARES PARA FORMULÁRIO ==========

    // Buscar tipos de documento (GET /tipodocumento)
    async buscarTiposDocumento() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/tipodocumento', {
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
        }

        this.tiposDocumento = dados
        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar tipos de documento'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar tipos de pagamento/recebimento (GET /tipopagrec)
    async buscarTiposPagRec() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/tipopagrec', {
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
        }

        this.tiposPagRec = dados
        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar tipos de pagamento/recebimento'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar locais de cobrança (GET /localcobranca)
    async buscarLocaisCobranca() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/localcobranca', {
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
        }

        this.locaisCobranca = dados
        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar locais de cobrança'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar pessoas/fornecedores (GET /pessoafor/:idempresa)
      // Buscar pessoas/fornecedores (GET /pessoafor/:idempresa?find=term)
      async buscarPessoasFornecedores(findTerm = '', idEmpresa) {
        this.loading = true
        this.error = null
        try {
          const empresaId = idEmpresa || ''
          const url = empresaId ? `/pessoafor/${empresaId}?find=${encodeURIComponent(findTerm)}` : `/pessoafor?find=${encodeURIComponent(findTerm)}`
          const response = await api.get(url, {
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
          }

          return dados
        } catch (error) {
          this.error = error.response?.data?.message || 'Erro ao buscar pessoas/fornecedores'
          throw error
        } finally {
          this.loading = false
        }
      },

    // Buscar pessoas/fornecedores (GET /pessoa)
    async buscarPessoas() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/pessoa', {
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
        }

        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar pessoas'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar tipo de documento (POST /tipodocumento)
    async criarTipoDocumento(dados) {
      this.loading = true
      this.error = null
      try {
        const payload = {
          data: [{
            desctipodocumento: dados.descricao,
            abreviatura: dados.abreviatura
          }]
        }
        
        const response = await api.post('/tipodocumento', payload, {
          headers: this.getAuthHeaders()
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar tipo de documento'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar local de cobrança (POST /localcobranca)
    async criarLocalCobranca(dados) {
      this.loading = true
      this.error = null
      try {
        const payload = {
          data: [{
            desclocalcobranca: dados.desclocalcobranca
          }]
        }
        
        const response = await api.post('/localcobranca', payload, {
          headers: this.getAuthHeaders()
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar local de cobrança'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== CONTAS A RECEBER ==========

    // Calcular parcelas para conta a receber (POST /contasrecebercalcparc)
    async calcularParcelasContaReceber(dadosCalculo) {
      this.loading = true
      this.error = null
      try {
        // Payload esperado pelo backend no formato THorse
        const dadosParcela = {
          vlrdocumento: dadosCalculo.vlrdocumento,
          vlrprimeiraparcela: dadosCalculo.vlrprimeiraparcela || 0,
          qtdparcelas: dadosCalculo.qtdparcelas,
          primeirovencimento: dadosCalculo.primeirovencimento,
          intervalo: dadosCalculo.intervalo || 30 // Default 30 dias se não informado
        }

        // THorse expects payload wrapped in { data: [ ... ] }
        const payload = { data: [dadosParcela] }

        const response = await api.post('/contasrecebercalcparc', payload, {
          headers: this.getAuthHeaders()
        })

        // Normalizar retorno: pode retornar { data: [...] } ou array direto
        const resp = response.data
        let parcelas = []
        if (resp && resp.data && Array.isArray(resp.data)) {
          parcelas = resp.data
        } else if (Array.isArray(resp)) {
          parcelas = resp
        } else if (resp && typeof resp === 'object') {
          parcelas = [resp]
        }

        return parcelas
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao calcular parcelas'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar contas a receber (GET /contasreceber/:idempresa)
    async buscarContasReceber(idEmpresa, filtros = {}) {
      this.loading = true
      this.error = null
      try {
        // Construir query params
        const params = new URLSearchParams()
        
        if (filtros.tpperiodo !== undefined) params.append('tpperiodo', filtros.tpperiodo)
        if (filtros.dtini) params.append('dtini', filtros.dtini)
        if (filtros.dtfim) params.append('dtfim', filtros.dtfim)
        if (filtros.idCliente) params.append('idCliente', filtros.idCliente)
        if (filtros.cnpj_cpf) params.append('cnpj_cpf', filtros.cnpj_cpf)
        if (filtros.nrdocumento) params.append('nrdocumento', filtros.nrdocumento)
        if (filtros.idtpdocumento) params.append('idtpdocumento', filtros.idtpdocumento)
        if (filtros.idlocalcobranca) params.append('idlocalcobranca', filtros.idlocalcobranca)
        if (filtros.baixado) params.append('baixado', filtros.baixado)
        
        const queryString = params.toString()
        const url = queryString ? `/contasreceber/${idEmpresa}?${queryString}` : `/contasreceber/${idEmpresa}`
        
        console.log('🔍 Buscando contas a receber:', url)
        
        const response = await api.get(url, {
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
        }

        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar contas a receber'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar conta a receber por ID (GET /contasreceber/:idempresa/id/:id)
    async buscarContaReceberPorId(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/contasreceber/${idEmpresa}/id/${id}`, {
          headers: this.getAuthHeaders()
        })

        // Retornar o objeto completo com data, parcela, media
        // A API retorna: { data: [...], parcela: [...], media: [...] }
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar conta a receber'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar conta a receber (POST /contasreceber)
    async criarContaReceber(payload) {
      this.loading = true
      this.error = null
      try {
        console.log('criarContaReceber - payload recebido:', payload)

        // Enviar para a rota sem id_empresa no path; id_empresa deve estar dentro de data[0]
        const response = await api.post('/contasreceber', payload, {
          headers: this.getAuthHeaders()
        })

        console.log('criarContaReceber - resposta da API:', response.data)

        // Normalizar retorno
        const resp = response.data
        let created
        if (resp && resp.data && Array.isArray(resp.data)) {
          created = resp.data[0]
        } else if (resp && typeof resp === 'object') {
          created = resp
        }

        return created || response.data
      } catch (error) {
        console.error('criarContaReceber - erro:', error.response?.data)
        this.error = error.response?.data?.message || 'Erro ao criar conta a receber'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar conta a receber (PUT /contasreceber/:idempresa/id/:id)
    async atualizarContaReceber(idEmpresa, id, payload) {
      this.loading = true
      this.error = null
      try {
        console.log('atualizarContaReceber - payload recebido:', payload)
        console.log('atualizarContaReceber - id:', id)
        
        // O payload já vem no formato correto: { data: [{}], parcela: [...], media: [...] }
        const response = await api.put(`/contasreceber/${idEmpresa}/id/${id}`, payload, {
          headers: this.getAuthHeaders()
        })

        console.log('atualizarContaReceber - resposta da API:', response.data)

        // Normalizar retorno
        const resp = response.data
        let updated
        if (resp && resp.data && Array.isArray(resp.data)) {
          updated = resp.data[0]
        } else if (resp && typeof resp === 'object') {
          updated = resp
        }

        return updated || response.data
      } catch (error) {
        console.error('atualizarContaReceber - erro:', error.response?.data)
        this.error = error.response?.data?.message || 'Erro ao atualizar conta a receber'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar conta a receber (DELETE /contasreceber/:idempresa/id/:id)
    async deletarContaReceber(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/contasreceber/${idEmpresa}/id/${id}`, {
          headers: this.getAuthHeaders()
        })

        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar conta a receber'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar pessoas/clientes (GET /pessoafor/:idempresa?find=term)
    // Reutiliza o mesmo endpoint que fornecedores, pois a API usa /pessoafor para ambos
    async buscarPessoasClientes(findTerm = '', idEmpresa) {
      this.loading = true
      this.error = null
      try {
        const empresaId = idEmpresa || ''
        const url = empresaId ? `/pessoacli/${empresaId}?find=${encodeURIComponent(findTerm)}` : `/pessoacli?find=${encodeURIComponent(findTerm)}`
        const response = await api.get(url, {
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
        }

        return dados
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar pessoas/clientes'
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
    },

    // ========== BAIXA DE PAGAMENTOS ==========
    
    // Baixar pagamentos em lote
    async baixarPagamentos(idEmpresa, dadosBaixa) {
      this.loading = true;
      this.error = null;
      
      try {
        // Endpoint alvo: /contaspagarbxa
        // Mantém idEmpresa na assinatura por compatibilidade com chamadas existentes,
        // mas garante que o payload carregue o id_empresa quando necessário.
        const payload = { ...(dadosBaixa || {}) }

        if (Array.isArray(payload.data)) {
          payload.data = payload.data.map((item) => ({
            ...(item || {}),
            id_empresa: (item && item.id_empresa != null) ? item.id_empresa : idEmpresa
          }))
        }

        // Não adicionar `id_empresa` no objeto raiz do payload.
        // Garantir apenas que cada item em payload.data tenha `id_empresa`.

        const response = await api.post(`/contaspagarbxa`, payload, {
          headers: this.getAuthHeaders()
        });
        
        return response.data;
      } catch (error) {
        console.error('Erro ao baixar pagamentos:', error);
        this.error = error.response?.data?.message || 'Erro ao baixar pagamentos';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar contas a receber para baixa
    async buscarContasReceberBaixa(idEmpresa, filtros ={}) {
      this.loading = true;
      this.error = null;

      try{
        const params = new URLSearchParams();

        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value);
          }
        });
        const queryString = params.toString();
        const url = `/contasreceberbxa/${idEmpresa}${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url, {
          headers: this.getAuthHeaders()
        });

        const resposta = response.data;
        let dados;

        if(resposta && resposta.data && Array.isArray(resposta.data)){
          dados = resposta.data;
        } else if (Array.isArray(resposta)) {
          dados = resposta;
        } else {
          dados = [];
        }

        return dados;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar contas a receber para baixa';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Baixar recebimentos em lote (POST /contasreceberbxa)
    async baixarContasReceber(idEmpresa, dadosBaixa) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Baixando contas a receber - payload recebido:', dadosBaixa);
        const payload = { ...(dadosBaixa || {}) }

        if (Array.isArray(payload.data)) {
          payload.data = payload.data.map((item) => ({
            ...(item || {}),
            id_empresa: (item && item.id_empresa != null) ? item.id_empresa : idEmpresa
          }))
        }
        const response = await api.post(`/contasreceberbxa`, payload, {
          headers: this.getAuthHeaders()
        });
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao baixar contas a receber';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== TRANSFERÊNCIAS ==========

    // Realizar transferência entre contas/caixas (POST /ccorrentetransf)
    async realizarTransferencia(payload) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Realizando transferência - payload:', payload);
        
        const response = await api.post('/ccorrentetransf', payload, {
          headers: this.getAuthHeaders()
        });
        
        console.log('✅ Transferência realizada com sucesso:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Erro ao realizar transferência:', error.response?.data);
        this.error = error.response?.data?.message || 'Erro ao realizar transferência';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar histórico de transferências financeiras (GET /transffinanceiras/:idempresa/dtini/:dtini/dtfim/:dtfim)
    async buscarTransferenciasFinanceiras(idEmpresa, dtini, dtfim, tipoTransf = null) {
      this.loading = true;
      this.error = null;

      try {
        let url = `/transffinanceiras/${idEmpresa}/dtini/${dtini}/dtfim/${dtfim}`;
        
        // Adicionar filtro de tipo se especificado
        if (tipoTransf !== null && tipoTransf !== undefined) {
          url += `?tipo_transf=${tipoTransf}`;
        }

        console.log('🔍 Buscando transferências financeiras:', url);
        
        const response = await api.get(url, {
          headers: this.getAuthHeaders()
        });

        // Normalizar resposta
        const resp = response.data;
        let dados = [];
        if (resp && resp.data && Array.isArray(resp.data)) {
          dados = resp.data;
        } else if (Array.isArray(resp)) {
          dados = resp;
        } else if (resp && typeof resp === 'object') {
          dados = [resp];
        }

        console.log('✅ Transferências encontradas:', dados.length);
        return dados;
      } catch (error) {
        console.error('❌ Erro ao buscar transferências:', error.response?.data);
        this.error = error.response?.data?.message || 'Erro ao buscar transferências';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
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
