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
         * BUSCAR CAIXAS ABERTOS DO USUÁRIO (para lançamentos)
         * 
         * @param {number} idEmpresa - ID da empresa
         * @return {Promise<Array>}
         */
        async buscarCaixasUsuarioAberto(idEmpresa) {
            this.loading = true;
            
            try {
                console.log('Store: Chamando API caixausuaberto/', idEmpresa);
                const response = await api.get(`caixausuaberto/${idEmpresa}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                console.log('Store: Resposta completa da API:', response.data);
                
                // A API retorna { data: {id_caixa, desccaixa} } - um único objeto, não array
                const dados = response.data?.data || response.data;
                console.log('Store: Dados processados:', dados);
                
                // Se for um objeto único, colocar em array; se já for array, manter
                const resultado = Array.isArray(dados) ? dados : [dados];
                console.log('Store: Retornando:', resultado);
                
                return resultado;
                
            } catch (error) {
                console.error('Store: Erro ao buscar caixas abertos do usuário:', error);
                console.error('Store: Detalhes do erro:', error.response?.data);
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
        },

        /**
         * ENCERRAR CAIXA
         * 
         * @param {number} id - ID do registro de abertura
         * @param {number} idEmpresa - ID da empresa
         * @param {number} idCaixa - ID do caixa
         * @return {Promise<Object|null>}
         */
        async encerrarCaixa(id, idEmpresa, idCaixa) {
            this.loading = true;
            
            if (!this.token) {
                console.error('Token não encontrado!');
                this.errorMessage = 'Token não encontrado!';
                this.loading = false;
                return null;
            }
            
            if (!id || !idEmpresa || !idCaixa) {
                console.error('ID do registro, empresa ou caixa não encontrado!');
                this.errorMessage = 'ID do registro, empresa ou caixa não encontrado!';
                this.loading = false;
                return null;
            }
            
            try {
                const response = await api.post(`caixaclose/${id}/idempresa/${idEmpresa}/idcaixa/${idCaixa}`, {}, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.successMessage = 'Caixa encerrado com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao encerrar caixa';
                console.error('Erro ao encerrar caixa:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR LANÇAMENTOS DO CAIXA
         * 
         * @param {number} idEmpresa - ID da empresa
         * @param {number} idCaixa - ID do caixa
         * @param {string} dtini - Data inicial (formato: YYYY-MM-DD)
         * @param {string} dtfim - Data final (formato: YYYY-MM-DD)
         * @return {Promise<Object>} - Retorna { saldoanterior, data, records }
         */
        async buscarLancamentosCaixa(idEmpresa, idCaixa, dtini, dtfim) {
            this.loading = true;
            
            try {
                const response = await api.get(`caixalct/${idEmpresa}/idcaixa/${idCaixa}/dtini/${dtini}/dtfim/${dtfim}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                // A API retorna { saldoanterior, data: [...], records }
                return {
                    saldoanterior: response.data?.saldoanterior || 0,
                    data: response.data?.data || [],
                    records: response.data?.records || 0
                };
                
            } catch (error) {
                console.error('Erro ao buscar lançamentos do caixa:', error);
                return {
                    saldoanterior: 0,
                    data: [],
                    records: 0
                };
            } finally {
                this.loading = false;
            }
        },

        /**
         * CRIAR LANÇAMENTO DO CAIXA
         * 
         * @param {number} idEmpresa - ID da empresa
         * @param {number} idCaixa - ID do caixa
         * @param {Object} payload - Dados do lançamento
         * @return {Promise<Object|null>}
         */
        async criarLancamentoCaixa(idEmpresa, idCaixa, payload) {
            this.loading = true;
            
            try {
                const response = await api.post(`caixalct/${idEmpresa}/idcaixa/${idCaixa}`, payload, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.successMessage = 'Lançamento criado com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao criar lançamento';
                console.error('Erro ao criar lançamento:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * ATUALIZAR LANÇAMENTO DO CAIXA
         * 
         * @param {number} idEmpresa - ID da empresa
         * @param {number} idCaixa - ID do caixa
         * @param {number} idLancamento - ID do lançamento
         * @param {Object} payload - Dados do lançamento
         * @return {Promise<Object|null>}
         */
        async atualizarLancamentoCaixa(idEmpresa, idCaixa, idLancamento, payload) {
            this.loading = true;
            
            try {
                const response = await api.put(`caixalct/${idEmpresa}/idcaixa/${idCaixa}/id/${idLancamento}`, payload, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.successMessage = 'Lançamento atualizado com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao atualizar lançamento';
                console.error('Erro ao atualizar lançamento:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * DELETAR LANÇAMENTO DO CAIXA
         * 
         * @param {number} idEmpresa - ID da empresa
         * @param {number} idLancamento - ID do lançamento
         * @return {Promise<boolean>}
         */
        async deletarLancamentoCaixa(idEmpresa, idLancamento) {
            this.loading = true;
            
            try {
                await api.delete(`caixalct/${idEmpresa}/id/${idLancamento}`, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                
                this.successMessage = 'Lançamento deletado com sucesso!';
                return true;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao deletar lançamento';
                console.error('Erro ao deletar lançamento:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
})
