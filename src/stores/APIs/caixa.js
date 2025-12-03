import { defineStore } from "pinia"
import api from "@/services/api"

export const useCaixaStore = defineStore('caixa', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',
        
        caixas: [],
        historicoMovimentacao: []
    }),

    actions: {
        /**
         * BUSCAR HISTÓRICO DE MOVIMENTAÇÃO DO CAIXA
         * 
         * @param {number} idEmpresa - ID da empresa
         * @return {Promise<Object|null>}
         */
        async buscarHistoricoMovimentacao(idEmpresa) {
            this.loading = true;
            
            if (!this.token) {
                console.error('Token não encontrado!');
                this.errorMessage = 'Token não encontrado!';
                this.loading = false;
                return null;
            }
            
            if (!idEmpresa) {
                console.error('ID da empresa não encontrado!');
                this.errorMessage = 'ID da empresa não encontrado!';
                this.loading = false;
                return null;
            }
            
            try {
                const response = await api.get(`caixahistmov/${idEmpresa}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.historicoMovimentacao = response.data?.data || response.data || [];
                this.errorMessage = '';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar histórico de movimentação:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR CAIXAS
         * 
         * @param {number} idEmpresa - ID da empresa
         * @return {Promise<Array>}
         */
        async buscarCaixas(idEmpresa) {
            this.loading = true;
            
            try {
                const response = await api.get(`caixa/${idEmpresa}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.caixas = response.data?.data || response.data || [];
                return this.caixas;
                
            } catch (error) {
                console.error('Erro ao buscar caixas:', error);
                return [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR CAIXAS ATIVOS DO USUÁRIO
         * 
         * @param {number} idEmpresa - ID da empresa
         * @return {Promise<Array>}
         */
        async buscarCaixasUsuarioAtivo(idEmpresa) {
            this.loading = true;
            
            try {
                const response = await api.get(`caixausuativo/${idEmpresa}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                // API retorna {data: {id_caixa: 1, desccaixa: "Teste"}}
                const caixaData = response.data?.data;
                
                // Converter para array se vier objeto único
                if (caixaData && typeof caixaData === 'object' && !Array.isArray(caixaData)) {
                    return [{
                        id: caixaData.id_caixa,
                        desccaixa: caixaData.desccaixa
                    }];
                }
                
                return Array.isArray(caixaData) ? caixaData : [];
                
            } catch (error) {
                console.error('Erro ao buscar caixas do usuário ativo:', error);
                return [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR USUÁRIOS POR CAIXA
         * 
         * @param {number} idEmpresa - ID da empresa
         * @param {number} idCaixa - ID do caixa
         * @return {Promise<Object|null>}
         */
        async buscarUsuariosPorCaixa(idEmpresa, idCaixa) {
            this.loading = true;
            
            try {
                const response = await api.get(`caixausu/${idEmpresa}/id/${idCaixa}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                return response.data;
                
            } catch (error) {
                console.error('Erro ao buscar usuários do caixa:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * ABRIR CAIXA
         * 
         * @param {number} idEmpresa - ID da empresa
         * @param {number} idCaixa - ID do caixa
         * @param {Object} dados - Dados da abertura
         * @return {Promise<Object|null>}
         */
        async abrirCaixa(idEmpresa, idCaixa, dados) {
            this.loading = true;
            
            if (!this.token) {
                console.error('Token não encontrado!');
                this.errorMessage = 'Token não encontrado!';
                this.loading = false;
                return null;
            }
            
            if (!idEmpresa || !idCaixa) {
                console.error('ID da empresa ou do caixa não encontrado!');
                this.errorMessage = 'ID da empresa ou do caixa não encontrado!';
                this.loading = false;
                return null;
            }
            
            try {
                const response = await api.post(`caixaopen/${idEmpresa}/idcaixa/${idCaixa}`, dados, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.successMessage = 'Caixa aberto com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao abrir caixa';
                console.error('Erro ao abrir caixa:', error);
                return null;
            } finally {
                this.loading = false;
            }
        }
    }
})
