import { defineStore } from 'pinia'
import api from '@/services/api'
import apiPhp from '@/services/apiPhp'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
    
    // Buscar todas as contas correntes (admin/geral)
    async buscarTodasContas() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.get('/financeiro/conta-correntes');
        this.contas = res.data?.data ?? res.data ?? [];
        return this.contas;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        this.contas = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // Buscar todas as contas correntes do usuário
    async buscarContas() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.get('/financeiro/conta-correntes');
        this.contas = res.data?.data ?? res.data ?? [];
        return this.contas;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        this.contas = [];
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
        const res = await apiPhp.get('/financeiro/historico-bancarios');
        return res.data?.data ?? res.data ?? [];
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar contas correntes ativas do usuário logado
    async buscarContasUsuarioAtivo() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.get('/financeiro/conta-correntes/ativas');
        return res.data?.data ?? res.data ?? [];
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.get(`/financeiro/conta-correntes/${id}`);
        return res.data?.data ?? res.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.post('/financeiro/conta-correntes', contaData);
        const created = res.data?.data ?? res.data;
        if (created) this.contas.push(created);
        return created;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.put(`/financeiro/conta-correntes/${id}`, contaData);
        const updated = res.data?.data ?? res.data;
        const index = this.contas.findIndex(conta => conta.id_ccorrente === id);
        if (index !== -1) {
          this.contas[index] = updated;
        }
        return updated;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        await apiPhp.delete(`/financeiro/conta-correntes/${id}`);
        this.contas = this.contas.filter(conta => conta.id_ccorrente !== id);
        return true;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.get('/financeiro/conta-corrente-movimentos', {
          params: { id_ccorrente: idCcorrente, dtini, dtfim }
        });
        return res.data?.data ?? res.data ?? [];
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.get(`/financeiro/conta-corrente-movimentos/${id}`);
        return res.data?.data ?? res.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.post('/financeiro/conta-corrente-movimentos', payload);
        return res.data?.data ?? res.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.put(`/financeiro/conta-corrente-movimentos/${id}`, payload);
        return res.data?.data ?? res.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        await apiPhp.delete(`/financeiro/conta-corrente-movimentos/${id}`);
        return true;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.get('/financeiro/bancos');
        this.bancos = res.data?.data ?? res.data ?? [];
        return this.bancos;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        this.bancos = [];
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
        const res = await apiPhp.get(`/financeiro/bancos/${id}`);
        return res.data?.data ?? res.data ?? [];
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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
        const res = await apiPhp.get('/manutencao/ufs');
        const raw = res.data?.data ?? res.data ?? [];

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
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        this.ufs = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar usuários (GET /manutencao/usuarios)
    async buscarUsuarios() {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/manutencao/usuarios')
        const dados = res.data?.data ?? res.data ?? []

        // Normalizar campos mais usados pela UI
        this.usuarios = dados.map(u => ({
          ID: u.id ?? u.ID ?? u.id_saas ?? '',
          nome: u.nome ?? u.NOME ?? u.name ?? '',
          email: u.email ?? u.EMAIL ?? '',
          ativo: u.ativo ?? 'S',
          raw: u
        }))

        return this.usuarios
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        this.usuarios = []
        throw error
      } finally {
        this.loading = false
      }
    },

      // Buscar usuários vinculados a uma conta corrente
      async buscarUsuariosPorConta(contaId) {
        this.loading = true
        this.error = null
        try {
          const res = await apiPhp.get(`/financeiro/conta-correntes/${contaId}/usuarios`)
          return res.data?.data ?? res.data ?? []
        } catch (error) {
          this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
          throw error
        } finally {
          this.loading = false
        }
      },

      // Atualizar acessos de usuários para uma conta
      // payload: { contaId, users: [{ id: <usuarioId>, acesso: true|false }, ...] }
      async atualizarAcessoConta(payload) {
        this.loading = true
        this.error = null
        try {
          const contaId = payload.contaId
          const users = Array.isArray(payload.users) ? payload.users : []
          const dataArray = users.map(u => ({ id_usuario: u.id, ativo: u.acesso ? 'S' : 'N' }))

          const res = await apiPhp.post(`/financeiro/conta-correntes/${contaId}/usuarios`, dataArray)
          return res.data?.data ?? res.data
        } catch (error) {
          this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
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
        const res = await apiPhp.get('/financeiro/agencias');
        this.agencias = res.data?.data ?? res.data ?? [];
        return this.agencias;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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

        const res = await apiPhp.post('/financeiro/agencias', ag);
        const created = res.data?.data ?? res.data ?? null;
        if (created) this.agencias.push(created);
        return created;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar uma agência por ID
    async buscarAgenciaPorId(idBanco, id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.get(`/financeiro/agencias/${idBanco}/${id}`);
        return res.data?.data ?? res.data ?? [];
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Atualizar agência
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

        const res = await apiPhp.put(`/financeiro/agencias/${idBanco}/${id}`, ag);
        const updated = res.data?.data ?? res.data ?? null;

        // Atualizar na lista local
        if (updated) {
          const findIndex = this.agencias.findIndex(a => String(a.ID ?? a.id ?? a.id_agencia) === String(id));
          if (findIndex !== -1) this.agencias[findIndex] = updated;
        }

        return updated;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar agência
    async deletarAgencia(idBanco, id) {
      this.loading = true;
      this.error = null;
      try {
        await apiPhp.delete(`/financeiro/agencias/${idBanco}/${id}`);

        // Remover da lista local
        this.agencias = this.agencias.filter(a => String(a.ID ?? a.id ?? a.id_agencia) !== String(id));
        return true;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== CHAVES DE API DE CONTA CORRENTE ==========

    /**
     * Busca chaves de API de uma conta corrente
     * @param {number} idConta - ID da conta corrente
     */
    async buscarChavesAPI(idConta) {
      this.loading = true
      try {
        const res = await apiPhp.get(`/financeiro/conta-correntes/${idConta}/chaves-api`)
        return res.data?.data ?? res.data
      } catch (error) {
        if (error.response?.status === 404) {
          return null
        }
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Salva/atualiza chaves de API de uma conta corrente
     * @param {number} idConta - ID da conta corrente
     * @param {object} dados - Dados das chaves de API
     */
    async salvarChavesAPI(idConta, dados) {
      this.loading = true
      this.error = null
      try {
        const payload = {
          id_ccorrente: idConta,
          clid_api_pix: dados.clid_api_pix || '',
          clsecret_api_pix: dados.clsecret_api_pix || '',
          clid_api_cob: dados.clid_api_cob || '',
          clsecret_api_cob: dados.clsecret_api_cob || '',
          tpambiente: dados.tpambiente || 'P'
        }

        const res = await apiPhp.put(`/financeiro/conta-correntes/${idConta}/chaves-api`, payload)
        toast.success('Chaves de API salvas com sucesso!')
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Deletar chaves de API de uma conta corrente
     * @param {number} idConta - ID da conta corrente
     */
    async deletarChavesAPI(idConta) {
      this.loading = true
      this.error = null
      try {
        await apiPhp.delete(`/financeiro/conta-correntes/${idConta}/chaves-api`)
        toast.success('Chaves de API removidas com sucesso!')
        return true
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== CAIXAS ==========

    // Buscar caixas da empresa (empresa vem do JWT)
    async buscarCaixas() {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.get('/financeiro/caixas');
        return res.data?.data ?? res.data ?? [];
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar caixa por ID
    async buscarCaixaPorId(idEmpresa, idCaixa) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.get(`/financeiro/caixas/${idCaixa}`);
        return res.data?.data ?? res.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Criar nova caixa
    async criarCaixa(caixaData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.post('/financeiro/caixas', caixaData);
        return res.data?.data ?? res.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Atualizar caixa existente
    async atualizarCaixa(idEmpresa, id, caixaData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await apiPhp.put(`/financeiro/caixas/${id}`, caixaData);
        return res.data?.data ?? res.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Deletar caixa
    async deletarCaixa(idEmpresa, id) {
      this.loading = true;
      this.error = null;
      try {
        await apiPhp.delete(`/financeiro/caixas/${id}`);
        return true;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== CAIXA USUÁRIOS ==========
    
    // Buscar usuários vinculados a um caixa (GET /financeiro/caixas/:id/usuarios)
    // @todo: idEmpresa removido da assinatura (vem do JWT) — atualizar chamadas na view
    async buscarUsuariosPorCaixa(_idEmpresa, caixaId) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/caixas/${caixaId}/usuarios`)
        const dados = res.data?.data ?? res.data ?? []

        // retorno: array de objetos que representam vínculo (esperado campos como id_usuario, ativo, nome, email)
        return dados
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar acessos de usuários para um caixa (POST /financeiro/caixas/:id/usuarios)
    // payload: { caixaId, users: [{ id: <usuarioId>, acesso: true|false }, ...] }
    async atualizarAcessoCaixa(payload) {
      this.loading = true
      this.error = null
      try {
        const caixaId = payload.caixaId
        const users = Array.isArray(payload.users) ? payload.users : []

        // Construir array de objetos com { id_usuario, ativo }
        const dataArray = users.map(u => ({ id_usuario: u.id, ativo: u.acesso ? 'S' : 'N' }))

        const res = await apiPhp.post(`/financeiro/caixas/${caixaId}/usuarios`, dataArray)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== CONTAS A PAGAR ==========

    // Buscar baixas de contas a pagar por período
    async buscarBaixasPagar({ data_inicio, data_fim }) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/baixa-pagars', {
          params: { data_inicio, data_fim }
        })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        return []
      } finally {
        this.loading = false
      }
    },

    // Buscar baixa de conta a pagar por ID
    async buscarBaixaPagarPorId(id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/baixa-pagars/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Estornar baixa de conta a pagar
    async estornarBaixaPagar(id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post(`/financeiro/baixa-pagars/${id}/estornar`, {})
        return res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar baixas de contas a receber por período
    async buscarBaixasReceber({ data_inicio, data_fim }) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/baixa-recebers', {
          params: { data_inicio, data_fim }
        })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
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
        const res = await apiPhp.post(`/financeiro/baixa-recebers/${id}/estornar`, {})
        return res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // @deprecated — Cálculo de parcelas é automático no CRUD PHP (conta-pagars cria parcels)

    // ========== HISTÓRICO CONTABIL ==========

    // Buscar históricos contábeis (GET /contabil/historicos)
    async buscarHistoricosContabil() {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/contabil/historicos')
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar histórico contábil (POST /contabil/historicos)
    async criarHistoricoContabil(historicoData) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post('/contabil/historicos', historicoData)
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },
    // Buscar contas a pagar
    async buscarContasPagar(idEmpresa, filtros = {}) {
      this.loading = true
      this.error = null
      try {
        const params = {}
        if (filtros.tpperiodo !== undefined) params.tpperiodo = filtros.tpperiodo
        if (filtros.dtini) params.dtini = filtros.dtini
        if (filtros.dtfim) params.dtfim = filtros.dtfim
        if (filtros.dt_inicio) params.dt_inicio = filtros.dt_inicio
        if (filtros.dt_fim) params.dt_fim = filtros.dt_fim
        if (filtros.idfornecedor) params.idfornecedor = filtros.idfornecedor
        if (filtros.cnpj_cpf) params.cnpj_cpf = filtros.cnpj_cpf
        if (filtros.nrdocumento) params.nrdocumento = filtros.nrdocumento
        if (filtros.idtpdocumento) params.idtpdocumento = filtros.idtpdocumento
        if (filtros.idlocalcobranca) params.idlocalcobranca = filtros.idlocalcobranca
        if (filtros.baixado) params.baixado = filtros.baixado
        if (filtros.liberadopagto) params.liberadopagto = filtros.liberadopagto

        const res = await apiPhp.get('/financeiro/conta-pagars', { params })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar contas a pagar para baixa
    async buscarContasPagarBaixa(idEmpresa, filtros = {}) {
      this.loading = true
      this.error = null
      try {
        const params = {}
        const dtini = filtros.dtini || filtros.dt_inicio
        const dtfim = filtros.dtfim || filtros.dt_fim

        if (!dtini || !dtfim) throw new Error('As datas de início (dtini) e fim (dtfim) são obrigatórias')

        params.dtini = dtini
        params.dtfim = dtfim
        if (filtros.tpperiodo !== undefined) params.tpperiodo = filtros.tpperiodo
        if (filtros.idfornecedor) params.idfornecedor = filtros.idfornecedor
        if (filtros.cnpj_cpf) params.cnpj_cpf = filtros.cnpj_cpf
        if (filtros.nrdocumento) params.nrdocumento = filtros.nrdocumento
        if (filtros.idtpdocumento) params.idtpdocumento = filtros.idtpdocumento
        if (filtros.idlocalcobranca) params.idlocalcobranca = filtros.idlocalcobranca
        if (filtros.baixado) params.baixado = filtros.baixado
        if (filtros.liberadopagto) params.liberadopagto = filtros.liberadopagto

        const res = await apiPhp.get('/financeiro/conta-pagars', { params })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar conta a pagar por ID
    async buscarContaPagarPorId(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/conta-pagars/${idEmpresa}/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar conta a pagar
    async criarContaPagar(idEmpresa, payload) {
      this.loading = true
      this.error = null
      try {
        // Compatibilidade: aceitar chamada com (payload) ou (idEmpresa, payload)
        if (payload === undefined && idEmpresa && typeof idEmpresa === 'object') {
          payload = idEmpresa
        }
        // Normalizar: extrair data[0] do formato THorse, manter parcela/media/ccusto no root
        const dadosBase = Array.isArray(payload?.data) ? payload.data[0] : payload
        const phpPayload = {
          ...dadosBase,
          ...(payload.parcela && { parcela: payload.parcela }),
          ...(payload.media && { media: payload.media }),
          ...(payload.ccusto && { ccusto: payload.ccusto })
        }
        const res = await apiPhp.post('/financeiro/conta-pagars', phpPayload)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar conta a pagar
    async atualizarContaPagar(idEmpresa, id, payload) {
      this.loading = true
      this.error = null
      try {
        const dadosBase = Array.isArray(payload?.data) ? payload.data[0] : payload
        const phpPayload = {
          ...dadosBase,
          ...(payload.parcela && { parcela: payload.parcela }),
          ...(payload.media && { media: payload.media }),
          ...(payload.ccusto && { ccusto: payload.ccusto })
        }
        const res = await apiPhp.put(`/financeiro/conta-pagars/${idEmpresa}/${id}`, phpPayload)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar conta a pagar
    async deletarContaPagar(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        await apiPhp.delete(`/financeiro/conta-pagars/${idEmpresa}/${id}`)
        return true
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // @deprecated — CRUD PHP já cria aprovado. Mantido apenas para compatibilidade com views antigas.
    async autorizarContasPagar(payload) {
      this.loading = true
      this.error = null
      try {
        const payloadFinal = Array.isArray(payload) ? { data: payload } : payload
        const response = await api.post('/contaspagarautorizar', payloadFinal, {
          headers: this.getAuthHeaders()
        })
        return response.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== PARCELAS A PAGAR ==========

    // Buscar parcelas de contas a pagar
    async buscarParcelasPagar(filtros = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/parcela-pagars', { params: filtros })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar parcela de conta a pagar por ID
    async buscarParcelaPagarPorId(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/parcela-pagars/${idEmpresa}/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar parcela de conta a pagar
    async atualizarParcelaPagar(idEmpresa, id, payload) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.put(`/financeiro/parcela-pagars/${idEmpresa}/${id}`, payload)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Cancelar parcela de conta a pagar
    async cancelarParcelaPagar(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post(`/financeiro/parcela-pagars/${idEmpresa}/${id}/cancelar`, {})
        return res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== PLANO CONTA ==========

    // Buscar planos de conta (GET /financeiro/plano-contas)
    async buscarPlanosConta(filtros = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/plano-contas', { params: filtros })
        const dados = res.data?.data ?? res.data ?? []

        // Só armazena em planosConta se não houver filtros específicos
        if (!filtros.tipoconta && !filtros.idclassificador) {
          this.planosConta = dados
        }

        return dados
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar plano de conta por ID (GET /financeiro/plano-contas/:id)
    async buscarPlanoContaPorId(id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/plano-contas/${id}`)
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar novo plano de conta (POST /financeiro/plano-contas)
    async criarPlanoConta(planoData) {
      this.loading = true
      this.error = null
      try {
        const dadosSemId = { ...planoData }
        delete dadosSemId.id

        const res = await apiPhp.post('/financeiro/plano-contas', dadosSemId)
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar plano de conta (PUT /financeiro/plano-contas/:id)
    async atualizarPlanoConta(id, planoData) {
      this.loading = true
      this.error = null
      try {
        const dadosParaUpdate = { ...planoData }
        delete dadosParaUpdate.id

        const res = await apiPhp.put(`/financeiro/plano-contas/${id}`, dadosParaUpdate)
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar plano de conta (DELETE /financeiro/plano-contas/:id)
    async deletarPlanoConta(id) {
      this.loading = true
      this.error = null
      try {
        await apiPhp.delete(`/financeiro/plano-contas/${id}`)
        return true
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== AUXILIARES PARA FORMULÁRIO ==========

    // Buscar tipos de documento (GET /financeiro/tipos-documento)
    async buscarTiposDocumento() {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/tipo-documentos')
        const dados = res.data?.data ?? res.data ?? []
        this.tiposDocumento = dados
        return dados
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar tipos de pagamento/recebimento (GET /financeiro/tipos-pagamento-recebimento)
    async buscarTiposPagRec() {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/tipo-pagamento-recebimentos')
        const dados = res.data?.data ?? res.data ?? []
        this.tiposPagRec = dados
        return dados
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar locais de cobrança (GET /financeiro/locais-cobranca)
    async buscarLocaisCobranca() {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/local-cobrancas')
        const dados = res.data?.data ?? res.data ?? []
        this.locaisCobranca = dados
        return dados
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar pessoas/fornecedores via PHP (GET /manutencao/pessoas?find=)
    async buscarPessoasFornecedores(findTerm = '', idEmpresa) {
      this.loading = true
      this.error = null
      try {
        const params = { find: findTerm }
        if (idEmpresa) params.id_empresa = idEmpresa
        const response = await apiPhp.get('/manutencao/pessoas', { params })
        return response.data?.data ?? response.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar pessoas via PHP (GET /manutencao/pessoas)
    async buscarPessoas() {
      this.loading = true
      this.error = null
      try {
        const response = await apiPhp.get('/manutencao/pessoas')
        return response.data?.data ?? response.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar tipo de documento (POST /financeiro/tipos-documento)
    async criarTipoDocumento(dados) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post('/financeiro/tipo-documentos', {
          desctipodocumento: dados.descricao,
          abreviatura: dados.abreviatura
        })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Cadastrar fornecedor via PHP (POST /manutencao/pessoas)
    async cadastrarFornecedor(fornecedorData = {}) {
      this.loading = true
      this.error = null
      try {
        // Construir payload apenas com dados disponíveis (não deixar campos vazios desnecessários)
        const dados = {
          tipo_pessoa: fornecedorData.tipo_pessoa || 'J',
          nome_razao: fornecedorData.nome_razao,
          apelido_fantasia: fornecedorData.apelido_fantasia,
          cpf_cnpj: fornecedorData.cpf_cnpj,
          cliente: fornecedorData.cliente || 'N',
          fornecedor: fornecedorData.fornecedor || 'S',
          transportadora: fornecedorData.transportadora || 'N',
          colaborador: fornecedorData.colaborador || 'N',
          representante: fornecedorData.representante || 'N',
          ativo: fornecedorData.ativo || 'S'
        }

        // Adicionar campos opcionais apenas se tiverem valor
        if (fornecedorData.rg_inscricao) dados.rg_inscricao = fornecedorData.rg_inscricao
        if (fornecedorData.telefone) dados.telefone = fornecedorData.telefone
        if (fornecedorData.celular) dados.celular = fornecedorData.celular
        if (fornecedorData.whats) dados.whats = fornecedorData.whats
        if (fornecedorData.website) dados.website = fornecedorData.website
        if (fornecedorData.instagram) dados.instagram = fornecedorData.instagram
        if (fornecedorData.facebook) dados.facebook = fornecedorData.facebook
        if (fornecedorData.twitter_x) dados.twitter_x = fornecedorData.twitter_x
        if (fornecedorData.tik_tok) dados.tik_tok = fornecedorData.tik_tok
        if (fornecedorData.telegram) dados.telegram = fornecedorData.telegram
        if (fornecedorData.latitude !== null && fornecedorData.latitude !== undefined) dados.latitude = fornecedorData.latitude
        if (fornecedorData.longitude !== null && fornecedorData.longitude !== undefined) dados.longitude = fornecedorData.longitude

        // Remover id caso venha para criação
        delete dados.id
        delete dados.ID

        // Payload direto no padrão PHP
        const response = await apiPhp.post('/manutencao/pessoas', dados)

        // Normalizar retorno
        const created = response.data?.data ?? response.data
        if (created && created.id_pessoa && !created.id) {
          created.id = created.id_pessoa
        }

        return created || response.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar local de cobrança (POST /financeiro/locais-cobranca)
    async criarLocalCobranca(dados) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post('/financeiro/local-cobrancas', {
          desclocalcobranca: dados.desclocalcobranca
        })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== CONTAS A RECEBER ==========

    // Buscar contas a receber
    async buscarContasReceber(idEmpresa, filtros = {}) {
      this.loading = true
      this.error = null
      try {
        const params = {}
        if (filtros.tpperiodo !== undefined) params.tpperiodo = filtros.tpperiodo
        if (filtros.dtini) params.dtini = filtros.dtini
        if (filtros.dtfim) params.dtfim = filtros.dtfim
        if (filtros.idCliente) params.idCliente = filtros.idCliente
        if (filtros.cnpj_cpf) params.cnpj_cpf = filtros.cnpj_cpf
        if (filtros.nrdocumento) params.nrdocumento = filtros.nrdocumento
        if (filtros.idtpdocumento) params.idtpdocumento = filtros.idtpdocumento
        if (filtros.idlocalcobranca) params.idlocalcobranca = filtros.idlocalcobranca
        if (filtros.baixado) params.baixado = filtros.baixado

        const res = await apiPhp.get('/financeiro/conta-recebers', { params })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar conta a receber por ID
    async buscarContaReceberPorId(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/conta-recebers/${idEmpresa}/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar conta a receber
    async criarContaReceber(payload) {
      this.loading = true
      this.error = null
      try {
        // Normalizar: extrair data[0] do formato THorse, manter parcela/media/ccusto no root
        const dadosBase = Array.isArray(payload?.data) ? payload.data[0] : payload
        const phpPayload = {
          ...dadosBase,
          ...(payload.parcela && { parcela: payload.parcela }),
          ...(payload.media && { media: payload.media }),
          ...(payload.ccusto && { ccusto: payload.ccusto })
        }
        const res = await apiPhp.post('/financeiro/conta-recebers', phpPayload)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar conta a receber
    async atualizarContaReceber(idEmpresa, id, payload) {
      this.loading = true
      this.error = null
      try {
        const dadosBase = Array.isArray(payload?.data) ? payload.data[0] : payload
        const phpPayload = {
          ...dadosBase,
          ...(payload.parcela && { parcela: payload.parcela }),
          ...(payload.media && { media: payload.media }),
          ...(payload.ccusto && { ccusto: payload.ccusto })
        }
        const res = await apiPhp.put(`/financeiro/conta-recebers/${idEmpresa}/${id}`, phpPayload)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar conta a receber
    async deletarContaReceber(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        await apiPhp.delete(`/financeiro/conta-recebers/${idEmpresa}/${id}`)
        return true
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar pessoas/clientes via PHP (GET /manutencao/pessoas?find=&tipo=cliente)
    async buscarPessoasClientes(findTerm = '', idEmpresa) {
      this.loading = true
      this.error = null
      try {
        const params = { find: findTerm, tipo: 'cliente' }
        if (idEmpresa) params.id_empresa = idEmpresa
        const response = await apiPhp.get('/manutencao/pessoas', { params })
        return response.data?.data ?? response.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
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
        // Normalizar: extrair data[0] do formato THorse
        const dadosBase = Array.isArray(dadosBaixa?.data) ? dadosBaixa.data[0] : dadosBaixa
        const phpPayload = { ...dadosBase }
        const res = await apiPhp.post('/financeiro/baixa-pagars', phpPayload)
        return res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar contas a receber para baixa
    async buscarContasReceberBaixa(idEmpresa, filtros = {}) {
      this.loading = true
      this.error = null
      try {
        const params = {}
        Object.entries(filtros).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value
          }
        })
        const res = await apiPhp.get('/financeiro/conta-recebers', { params })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Baixar recebimentos em lote
    async baixarContasReceber(idEmpresa, dadosBaixa) {
      this.loading = true
      this.error = null
      try {
        // Normalizar: extrair data[0] do formato THorse
        const dadosBase = Array.isArray(dadosBaixa?.data) ? dadosBaixa.data[0] : dadosBaixa
        const phpPayload = { ...dadosBase }
        const res = await apiPhp.post('/financeiro/baixa-recebers', phpPayload)
        return res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== PARCELAS A RECEBER ==========

    // Buscar parcelas de contas a receber
    async buscarParcelasReceber(filtros = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/parcela-recebers', { params: filtros })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar parcela de conta a receber por ID
    async buscarParcelaReceberPorId(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/parcela-recebers/${idEmpresa}/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar parcela de conta a receber
    async atualizarParcelaReceber(idEmpresa, id, payload) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.put(`/financeiro/parcela-recebers/${idEmpresa}/${id}`, payload)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Cancelar parcela de conta a receber
    async cancelarParcelaReceber(idEmpresa, id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post(`/financeiro/parcela-recebers/${idEmpresa}/${id}/cancelar`, {})
        return res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== TRANSFERÊNCIAS ==========

    // Realizar transferência entre contas/caixas (PHP)
    async realizarTransferencia(payload) {
      this.loading = true;
      this.error = null;

      try {
        const response = await apiPhp.post('/financeiro/conta-corrente-caixa-transfs', payload);
        return response.data;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar histórico de transferências financeiras (THorse)
    // @todo: #290 — aguardando endpoint PHP
    async buscarTransferenciasFinanceiras(idEmpresa, dtini, dtfim, tipoTransf = null) {
      this.loading = true;
      this.error = null;

      try {
        let url = `/transffinanceiras/${idEmpresa}/dtini/${dtini}/dtfim/${dtfim}`;
        
        if (tipoTransf !== null && tipoTransf !== undefined) {
          url += `?tipo_transf=${tipoTransf}`;
        }

        const response = await api.get(url, {
          headers: this.getAuthHeaders()
        });

        const resp = response.data;
        let dados = [];
        if (resp && resp.data && Array.isArray(resp.data)) {
          dados = resp.data;
        } else if (Array.isArray(resp)) {
          dados = resp;
        } else if (resp && typeof resp === 'object') {
          dados = [resp];
        }

        return dados;
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // ========== CARTEIRA DE COBRANÇA ==========

    // Buscar carteira de cobrança por banco e ID da carteira
    async buscarTiposCarteiraPorBanco(idBanco, idCarteira) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/carteira-cobrancas/${idBanco}/${idCarteira ?? ''}`)
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Gerar Nosso Número / boleto para parcelas selecionadas
    async gerarNossoNumero(idCarteira, idCcorrente, parcelasIds) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post('/financeiro/boletos/nosso-numero', { parcelas: parcelasIds })
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Registrar boleto para parcelas selecionadas
    async registrarBoleto(idEmpresa, idCarteira, idCcorrente, parcelasIds) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post('/financeiro/boletos/registrar', {
          id_carteira: idCarteira,
          id_ccorrente: idCcorrente,
          parcelas: parcelasIds
        })
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar todas as carteiras
    async buscarCarteiras() {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get('/financeiro/carteira-cobrancas')
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar carteira por ID
    async buscarCarteiraPorId(id) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.get(`/financeiro/carteira-cobrancas/${id}`)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar nova carteira
    async criarCarteira(carteiraData) {
      this.loading = true
      this.error = null
      try {
        const dadosSemId = { ...carteiraData }
        delete dadosSemId.id

        const res = await apiPhp.post('/financeiro/carteira-cobrancas', dadosSemId)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar carteira existente
    async atualizarCarteira(id, carteiraData) {
      this.loading = true
      this.error = null
      try {
        const dadosParaUpdate = { ...carteiraData }
        delete dadosParaUpdate.id

        const res = await apiPhp.put(`/financeiro/carteira-cobrancas/${id}`, dadosParaUpdate)
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar carteira
    async deletarCarteira(id) {
      this.loading = true
      this.error = null
      try {
        await apiPhp.delete(`/financeiro/carteira-cobrancas/${id}`)
        return true
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== DRE (DEMONSTRATIVO DE RESULTADO) ==========

    // Salvar modelo de DRE (POST /api/v1/financeiro/dres)
    async salvarModeloDRE(payload) {
      this.loading = true
      this.error = null
      try {
        const response = await apiPhp.post('/financeiro/dres', payload)
        return response.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar modelo de DRE (PUT /api/v1/financeiro/dres/:id)
    async atualizarModeloDRE(id, payload) {
      this.loading = true
      this.error = null
      try {
        const response = await apiPhp.put(`/financeiro/dres/${id}`, payload)
        return response.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar modelos de DRE (GET /api/v1/financeiro/dres)
    async buscarModelosDRE() {
      this.loading = true
      this.error = null
      try {
        const response = await apiPhp.get('/financeiro/dres')
        
        const dados = response.data?.data ?? response.data ?? []
        
        // Formatar para o v-select (precisa de title e value)
        return dados.map(modelo => ({
          title: modelo.descdre || modelo.nome,
          value: modelo.id,
          ...modelo
        }))
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        return []
      } finally {
        this.loading = false
      }
    },

    // Buscar modelo de DRE por ID (GET /api/v1/financeiro/dres/:id)
    async buscarModeloDRE(id) {
      this.loading = true
      this.error = null
      try {
        const response = await apiPhp.get(`/financeiro/dres/${id}`)
        
        const modelo = response.data?.data ?? response.data
        
        // Converter de volta para o formato da tela
        if (modelo) {
          // O ID pode vir de diferentes lugares na resposta
          const idModelo = modelo.id || modelo.id_dre || id
          
          // Criar mapa de ID para nome de grupo (para converter fórmulas)
          const gruposMap = new Map()
          ;(modelo.dredetalhe || []).forEach(detalhe => {
            gruposMap.set(detalhe.id, detalhe.descdredetalhe)
          })
          
          // O nome pode vir em diferentes locais dependendo da estrutura da resposta
          const nomeDre = modelo.descdre || modelo.nome || 'Modelo DRE'
          
          return {
            id: idModelo,
            nome: nomeDre,
            grupos: (modelo.dredetalhe || []).map(detalhe => {
              // Converter natureza para tipo: '+'=>RECEITA, '-'=>DESPESA, '='=>TOTALIZADOR
              let tipo = 'RECEITA'
              switch (detalhe.natureza) {
                case '+':
                  tipo = 'RECEITA'
                  break
                case '-':
                  tipo = 'DESPESA'
                  break
                case '=':
                  tipo = 'TOTALIZADOR'
                  break
              }
              
              // Converter fórmula de IDs para nomes (ex: "1 - 2" -> "RECEITA - DESPESA")
              let formulaConvertida = detalhe.natureza_formula || ''
              if (formulaConvertida) {
                gruposMap.forEach((nome, idGrupo) => {
                  const regex = new RegExp(`\\b${idGrupo}\\b`, 'g')
                  formulaConvertida = formulaConvertida.replace(regex, nome)
                })
              }
              
              return {
                id: Date.now() + Math.random(),
                id_detalhe: detalhe.id, // Guardar ID do backend
                nome: detalhe.descdredetalhe,
                tipo: tipo,
                formula: formulaConvertida,
                descricao: '',
                categorias: (modelo.dredetalheconta || [])
                  .filter(conta => conta.id_dre_detalhe === detalhe.id)
                  .map(conta => {
                    // Usar dados que já vêm na resposta da API
                    const classificador = conta.id_classificador || ''
                    const nomeConta = conta.descconta || ''
                    const contaDisplay = classificador && nomeConta ? `${classificador} - ${nomeConta}` : nomeConta
                    
                    return {
                      id: Date.now() + Math.random(),
                      id_conta: conta.id, // Guardar ID do backend
                      id_planoconta: conta.id_reduzido_ctb,
                      nome: nomeConta,
                      classificador: classificador,
                      conta: contaDisplay,
                      descricao: ''
                    }
                  })
              }
            })
          }
        }
        
        return null
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar modelo de DRE (DELETE /api/v1/financeiro/dres/:id)
    async deletarModeloDRE(id) {
      this.loading = true
      this.error = null
      try {
        await apiPhp.delete(`/financeiro/dres/${id}`)
        
        return true
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== LANÇAMENTO COLABORADOR ==========

    // Buscar lançamentos de colaborador (GET /financeiro/adiantamento-colaboradors)
    // idEmpresa opcional — se informado, enviado como query param
    async buscarLancamentosColab(idEmpresa, params = {}) {
      this.loading = true
      this.error = null
      try {
        const queryParams = { ...params }
        if (idEmpresa) queryParams.id_empresa = idEmpresa

        const res = await apiPhp.get('/financeiro/adiantamento-colaboradors', { params: queryParams })
        return res.data?.data ?? res.data ?? []
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar lançamento de colaborador (POST /financeiro/adiantamento-colaboradors)
    // payload direto (sem wrapper { data: [...] })
    async criarLancamentoColab(payload) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.post('/financeiro/adiantamento-colaboradors', payload)
        toast.success('Lançamento salvo com sucesso!')
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar lançamento de colaborador (PUT /financeiro/adiantamento-colaboradors/:id)
    async atualizarLancamentoColab(id, payload) {
      this.loading = true
      this.error = null
      try {
        const res = await apiPhp.put(`/financeiro/adiantamento-colaboradors/${id}`, payload)
        toast.success('Lançamento atualizado com sucesso!')
        return res.data?.data ?? res.data
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar lançamento de colaborador (DELETE /financeiro/adiantamento-colaboradors/:id)
    async deletarLancamentoColab(id) {
      this.loading = true
      this.error = null
      try {
        await apiPhp.delete(`/financeiro/adiantamento-colaboradors/${id}`)
        toast.success('Lançamento excluído com sucesso!')
        return true
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
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