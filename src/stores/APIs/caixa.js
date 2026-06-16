import { defineStore } from "pinia"
import api from "@/services/api"
import apiPhp from "@/services/apiPhp"

export const useCaixaStore = defineStore('caixa', {
    state: () => ({
        loading: false,
        errorMessage: '',
        successMessage: '',
        caixas: [],
        historicoMovimentacao: []
    }),

    actions: {
        // Buscar histórico de movimentação do caixa (endpoint não mapeado no PHP ainda)
        async buscarHistoricoMovimentacao(idEmpresa) {
            this.loading = true;
            const token = localStorage.getItem('token');

            if (!token) {
                this.errorMessage = 'Token não encontrado!';
                this.loading = false;
                return null;
            }

            if (!idEmpresa) {
                this.errorMessage = 'ID da empresa não encontrado!';
                this.loading = false;
                return null;
            }

            try {
                const response = await api.get(`caixahistmov/${idEmpresa}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.historicoMovimentacao = response.data?.data || response.data || [];
                this.errorMessage = '';
                return response.data;
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Buscar caixas da empresa (empresa vem do JWT)
        async buscarCaixas() {
            this.loading = true;
            try {
                const res = await apiPhp.get('/financeiro/caixas');
                this.caixas = res.data?.data ?? res.data ?? [];
                return this.caixas;
            } catch (error) {
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Buscar caixas ativos do usuário logado
        async buscarCaixasUsuarioAtivo() {
            this.loading = true;
            try {
                const res = await apiPhp.get('/financeiro/caixas/usuario/ativo');
                const caixaData = res.data?.data ?? res.data;
                if (caixaData && typeof caixaData === 'object' && !Array.isArray(caixaData)) {
                    return [caixaData];
                }
                return Array.isArray(caixaData) ? caixaData : [];
            } catch (error) {
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Buscar caixas abertos do usuário logado (para lançamentos)
        async buscarCaixasUsuarioAberto() {
            this.loading = true;
            try {
                const res = await apiPhp.get('/financeiro/caixas/usuario/aberto');
                const dados = res.data?.data ?? res.data;
                return Array.isArray(dados) ? dados : [dados];
            } catch (error) {
                return [];
            } finally {
                this.loading = false;
            }
        },

        // Buscar usuários vinculados a um caixa (endpoint não mapeado no PHP ainda)
        async buscarUsuariosPorCaixa(idEmpresa, idCaixa) {
            this.loading = true;
            const token = localStorage.getItem('token');
            try {
                const response = await api.get(`caixausu/${idEmpresa}/id/${idCaixa}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.data;
            } catch (error) {
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Abrir caixa
        async abrirCaixa(idEmpresa, idCaixa, dados) {
            this.loading = true;
            try {
                const res = await apiPhp.post(`/financeiro/caixas/${idCaixa}/abrir`, dados);
                this.successMessage = 'Caixa aberto com sucesso!';
                return res.data;
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao abrir caixa';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Fechar caixa
        async encerrarCaixa(id, idEmpresa, idCaixa) {
            this.loading = true;
            try {
                const res = await apiPhp.post(`/financeiro/caixas/${idCaixa}/fechar`, {});
                this.successMessage = 'Caixa encerrado com sucesso!';
                return res.data;
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao encerrar caixa';
                return null;
            } finally {
                this.loading = false;
            }
        },

        // Buscar lançamentos do caixa
        async buscarLancamentosCaixa(idEmpresa, idCaixa, dtini, dtfim) {
            this.loading = true;
            try {
                const res = await apiPhp.get('/financeiro/caixa-movimentos', {
                    params: { id_caixa: idCaixa, data_ini: dtini, data_fim: dtfim }
                });
                return {
                    saldoanterior: res.data?.saldo_anterior ?? res.data?.saldoanterior ?? 0,
                    data: res.data?.data ?? [],
                    records: res.data?.total ?? res.data?.records ?? 0
                };
            } catch (error) {
                return { saldoanterior: 0, data: [], records: 0 };
            } finally {
                this.loading = false;
            }
        },

        // Criar lançamento do caixa
        async criarLancamentoCaixa(idEmpresa, idCaixa, payload) {
            this.loading = true;
            try {
                // Normalizar payload: extrair data[0] do formato THorse e montar para PHP (sem wrapper)
                const dadosBase = Array.isArray(payload.data) ? payload.data[0] : payload;
                const phpPayload = {
                    ...dadosBase,
                    id_caixa: idCaixa,
                    ...(payload.ccusto && { ccusto: payload.ccusto })
                };
                const res = await apiPhp.post('/financeiro/caixa-movimentos', phpPayload);
                this.successMessage = 'Lançamento criado com sucesso!';
                return res.data;
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao criar lançamento';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Buscar lançamento específico do caixa
        async buscarLancamentoCaixa(idEmpresa, idCaixa, idLancamento) {
            this.loading = true;
            try {
                const res = await apiPhp.get(`/financeiro/caixa-movimentos/${idLancamento}`);
                return res.data?.data ?? res.data;
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao buscar lançamento';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Atualizar lançamento do caixa
        async atualizarLancamentoCaixa(idEmpresa, idCaixa, idLancamento, payload) {
            this.loading = true;
            try {
                const dadosBase = Array.isArray(payload.data) ? payload.data[0] : payload;
                const phpPayload = {
                    ...dadosBase,
                    id_caixa: idCaixa,
                    ...(payload.ccusto && { ccusto: payload.ccusto })
                };
                const res = await apiPhp.put(`/financeiro/caixa-movimentos/${idLancamento}`, phpPayload);
                this.successMessage = 'Lançamento atualizado com sucesso!';
                return res.data;
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao atualizar lançamento';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Deletar lançamento do caixa
        async deletarLancamentoCaixa(idLancamento) {
            this.loading = true;
            try {
                await apiPhp.delete(`/financeiro/caixa-movimentos/${idLancamento}`);
                this.successMessage = 'Lançamento deletado com sucesso!';
                return true;
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao deletar lançamento';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deletarLancamentoCaixaPorId(idLancamento) {
            return this.deletarLancamentoCaixa(idLancamento);
        }
    }
})
