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
        const res = await apiPhp.get('/financeiro/contas-correntes');
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
        const res = await apiPhp.get('/financeiro/contas-correntes');
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
        const res = await apiPhp.get('/financeiro/contas-correntes/ativas');
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
        const res = await apiPhp.get(`/financeiro/contas-correntes/${id}`);
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
        const res = await apiPhp.post('/financeiro/contas-correntes', contaData);
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
        const res = await apiPhp.put(`/financeiro/contas-correntes/${id}`, contaData);
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
        await apiPhp.delete(`/financeiro/contas-correntes/${id}`);
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
          const res = await apiPhp.get(`/financeiro/contas-correntes/${contaId}/usuarios`)
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

          const res = await apiPhp.post(`/financeiro/contas-correntes/${contaId}/usuarios`, dataArray)
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
        const res = await apiPhp.get(`/financeiro/contas-correntes/${idConta}/chaves-api`)
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
          clid_api_pix: dados.data[0].clid_api_pix || '',
          clsecret_api_pix: dados.data[0].clsecret_api_pix || '',
          clid_api_cob: dados.data[0].clid_api_cob || '',
          clsecret_api_cob: dados.data[0].clsecret_api_cob || '',
          tpambiente: dados.data[0].tpambiente || 'P'
        }

        const res = await apiPhp.put(`/financeiro/contas-correntes/${idConta}/chaves-api`, payload)
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
        await apiPhp.delete(`/financeiro/contas-correntes/${idConta}/chaves-api`)
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
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
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
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    async calcularParcelasColab(dadosCalculo) {
      this.loading = true
      this.error = null
      try {
        const dadosParcela = {
          vlrtotal: dadosCalculo.vlrtotal,
          qtdparcelas: dadosCalculo.qtdparcelas,
          intervalo: dadosCalculo.intervalo || 30,
          primeirovencimento: dadosCalculo.primeirovencimento,
        }

        const payload = { data: [dadosParcela] }

        const response = await api.post('/adtcolabocalcparc', payload, {
          headers: this.getAuthHeaders()
        })

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
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

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

    // Autorizar contas a pagar (não documentado no PHP — mantém no THorse)
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

    // Buscar planos de conta (GET /financeiro/planos-conta)
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

    // Buscar plano de conta por ID (GET /financeiro/planos-conta/:id)
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

    // Criar novo plano de conta (POST /financeiro/planos-conta)
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

    // Atualizar plano de conta (PUT /financeiro/planos-conta/:id)
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

    // Deletar plano de conta (DELETE /financeiro/planos-conta/:id)
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
          this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
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

    // Cadastrar fornecedor (POST /pessoa)
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

        // Payload no padrão THorse
        const payload = { data: [dados] }

        const response = await api.post('/pessoa', payload, {
          headers: this.getAuthHeaders()
        })

        // Normalizar retorno: pode vir { data: [...] } ou objeto direto ou apenas { id_pessoa: X }
        const resp = response.data
        let created = null

        if (resp && resp.data && Array.isArray(resp.data)) {
          // Formato: { data: [{...}] }
          created = resp.data[0]
        } else if (resp && resp.id_pessoa) {
          // Formato: { id_pessoa: 20 } - apenas ID retornado
          // Aceitar apenas o ID por enquanto
          created = {
            id_pessoa: resp.id_pessoa,
            id: resp.id_pessoa
          }
        } else if (resp && typeof resp === 'object') {
          // Formato: objeto direto
          created = resp
        }

        // Garantir que temos um ID (normalizar id_pessoa para id se necessário)
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
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido';
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

    // Salvar modelo de DRE (POST /dre)
    async salvarModeloDRE(payload) {
      this.loading = true
      this.error = null
      try {
        console.log('[Store] Salvando modelo DRE:', payload)
        
        const response = await api.post('/dre', payload, {
          headers: this.getAuthHeaders()
        })
        
        console.log('[Store] Resposta do servidor:', response.data)
        return response.data
      } catch (error) {
        console.error('[Store] Erro ao salvar modelo DRE:', error)
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar modelo de DRE (PUT /dre/:id)
    async atualizarModeloDRE(id, payload) {
      this.loading = true
      this.error = null
      try {
        console.log('[Store] Atualizando modelo DRE:', id, payload)
        
        const response = await api.put(`/dre/${id}`, payload, {
          headers: this.getAuthHeaders()
        })
        
        console.log('[Store] Resposta do servidor:', response.data)
        return response.data
      } catch (error) {
        console.error('[Store] Erro ao atualizar modelo DRE:', error)
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Buscar modelos de DRE (GET /dre)
    async buscarModelosDRE() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/dre', {
          headers: this.getAuthHeaders()
        })
        
        const resposta = response.data
        let dados = []
        
        if (resposta && resposta.data && Array.isArray(resposta.data)) {
          dados = resposta.data
        } else if (Array.isArray(resposta)) {
          dados = resposta
        }
        
        // Formatar para o v-select (precisa de title e value)
        return dados.map(modelo => ({
          title: modelo.descdre || modelo.nome,
          value: modelo.id,
          ...modelo
        }))
      } catch (error) {
        console.error('[Store] Erro ao buscar modelos DRE:', error)
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        return []
      } finally {
        this.loading = false
      }
    },

    // Buscar modelo de DRE por ID (GET /dre/:id)
    async buscarModeloDRE(id) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/dre/${id}`, {
          headers: this.getAuthHeaders()
        })
        
        const modelo = response.data.data || response.data
        console.log('[Store] Modelo DRE retornado da API:', JSON.stringify(modelo, null, 2))
        
        // Converter de volta para o formato da tela
        if (modelo) {
          // O ID pode vir de diferentes lugares na resposta
          const idModelo = modelo.id || modelo.id_dre || id
          console.log('[Store] ID do modelo identificado:', idModelo)
          
          // Criar mapa de ID para nome de grupo (para converter fórmulas)
          const gruposMap = new Map()
          ;(modelo.dredetalhe || []).forEach(detalhe => {
            gruposMap.set(detalhe.id, detalhe.descdredetalhe)
          })
          
          // O nome pode vir em diferentes locais dependendo da estrutura da resposta
          const nomeDre = modelo.descdre || modelo.nome || 'Modelo DRE'
          console.log('[Store] Nome do DRE identificado:', nomeDre)
          
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
        console.error('[Store] Erro ao buscar modelo DRE:', error)
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar modelo de DRE (DELETE /dre/:id)
    async deletarModeloDRE(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/dre/${id}`, {
          headers: this.getAuthHeaders()
        })
        
        return true
      } catch (error) {
        console.error('[Store] Erro ao deletar modelo DRE:', error)
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // ========== LANÇAMENTO COLABORADOR ==========

    // Buscar lançamentos de colaborador (GET /adtcolabo)
    async buscarLancamentosColab(idEmpresa, params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get(`/adtcolabo/${idEmpresa}`, {
          headers: this.getAuthHeaders(),
          params,
        })
        const resp = response.data
        let dados
        if (resp && resp.data && Array.isArray(resp.data)) dados = resp.data
        else if (Array.isArray(resp)) dados = resp
        else if (resp && typeof resp === 'object') dados = [resp]
        else dados = []
        return dados
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Criar lançamento de colaborador (POST /adtcolabo)
    // payload: { data: [{ ...campos }], parcela: [{ valor, dtvencimento }] }
    async criarLancamentoColab(payload) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/adtcolabo', payload, { headers: this.getAuthHeaders() })
        toast.success('Lançamento salvo com sucesso!')
        const resp = response.data
        if (resp && resp.data && Array.isArray(resp.data)) return resp.data[0]
        return resp
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Atualizar lançamento de colaborador (PUT /adtcolabo/:id)
    async atualizarLancamentoColab(id, payload) {
      this.loading = true
      this.error = null
      try {
        const response = await api.put(`/adtcolabo/${id}`, payload, { headers: this.getAuthHeaders() })
        toast.success('Lançamento atualizado com sucesso!')
        const resp = response.data
        if (resp && resp.data && Array.isArray(resp.data)) return resp.data[0]
        return resp
      } catch (error) {
        this.error = error?.response?.data?.message || error?.message || 'Erro desconhecido'
        toast.error(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Deletar lançamento de colaborador (DELETE /adtcolabo/:id)
    async deletarLancamentoColab(id) {
      this.loading = true
      this.error = null
      try {
        await api.delete(`/adtcolabo/${id}`, { headers: this.getAuthHeaders() })
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