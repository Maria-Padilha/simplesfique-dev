import {defineStore} from 'pinia';
import api from '@/services/api';

export const useFinanceiroStore = defineStore('financeiro', {
  state: () => ({
    contas: [],
    loading: false,
    error: null,
  }),
  actions: {
    // Buscar todas as contas
    async buscarContas() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/financeiro/contas');
        this.contas = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar contas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar conta por ID
    async buscarContaPorId(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/financeiro/contas/${id}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Criar nova conta (sem id, apenas com id_empresa e outros dados)
    async criarConta(contaData) {
      this.loading = true;
      this.error = null;
      try {
        // Garantir que não estamos enviando o id na criação
        const dadosSemId = { ...contaData };
        delete dadosSemId.id;
        
        const response = await api.post('/financeiro/contas', dadosSemId);
        
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

    // Atualizar conta existente
    async atualizaConta(id, contaData) {
      this.loading = true;
      this.error = null;
      try {
        // Remover o id dos dados a serem enviados (vai na URL)
        const dadosParaUpdate = { ...contaData };
        delete dadosParaUpdate.id;
        
        const response = await api.put(`/financeiro/contas/${id}`, dadosParaUpdate);
        
        // Atualizar na lista local
        const index = this.contas.findIndex(conta => conta.id === id);
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

    // Deletar conta
    async deletaConta(id) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/financeiro/contas/${id}`);
        
        // Remover da lista local
        this.contas = this.contas.filter(conta => conta.id !== id);
        
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao deletar conta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Buscar contas por empresa
    async buscaContasPorEmpresa(idEmpresa) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/financeiro/contas/empresa/${idEmpresa}`);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar contas da empresa';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Limpar erros
    clearError() {
      this.error = null;
    },

    // Limpar estado
    clearState() {
      this.contas = [];
      this.error = null;
      this.loading = false;
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
    isLoading: (state) => state.loading,

    // Getter para verificar se tem erro
    hasError: (state) => !!state.error
  }
});