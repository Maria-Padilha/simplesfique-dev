import {defineStore} from "pinia"
import apiPhp from "@/services/apiPhp"

export const useConfigParfinStore = defineStore('configParfin', {
    state: () => ({
        loading: false,
        errorMessage: '',
        successMessage: '',

        config: [],
        historicoCaixa: [],
        historicoBancario: [],

    }),

    actions: {

        /**
         * BUSCAR PARFIN — Parâmetros de centro de custo
         *
         * @return {Promise<{data: *}|null>}
         */

        async buscarparfin() {
            this.loading = true;

            try {
                const response = await apiPhp.get(`/financeiro/centro-custo-parametros/parametro`);

                this.config = response.data?.data ?? response.data;
                this.errorMessage = '';

                
                return response.data;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar config:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR PARFIN — Criar parâmetros de centro de custo
         */
        async cadastrarParfin(parfinData) {
            this.loading = true;
            try {
                // Normalizar payload do formato THorse { data: [{}] } para direto
                const dados = Array.isArray(parfinData.data) ? parfinData.data[0] : parfinData;
                await apiPhp.post('/financeiro/centro-custo-parametros', dados);
                this.successMessage = 'Configurações salvas com sucesso!';
                await this.buscarparfin();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro ao cadastrar configurações';
                console.error('Erro ao cadastrar parfin:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * ALTERAR PARFIN — Atualizar parâmetros de centro de custo
         */
        async alterarParfin(parfinData) {
            this.loading = true;
            try {
                const dados = Array.isArray(parfinData.data) ? parfinData.data[0] : parfinData;
                await apiPhp.put('/financeiro/centro-custo-parametros', dados);
                this.successMessage = 'Configurações atualizadas com sucesso!';
                await this.buscarparfin();
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro ao alterar configurações';
                console.error('Erro ao alterar parfin:', error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR PARÂMETROS FINANCEIROS - CONTAS A PAGAR
         */
        async buscarParametrosFinanceirosPagar(idEmpresa) {
            this.loading = true;
            
            try {
                const response = await apiPhp.get(`/financeiro/parametros-financeiros-pagars/${idEmpresa}`);
                
                this.errorMessage = '';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar parâmetros financeiros (pagar):', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR PARÂMETROS FINANCEIROS - CONTAS A PAGAR
         */
        async cadastrarParametrosFinanceirosPagar(idEmpresa, dados) {
            this.loading = true;
            
            try {
                // Normalizar payload do formato THorse { data: [{}] } para direto
                const dadosBase = Array.isArray(dados.data) ? dados.data[0] : dados;
                const response = await apiPhp.put(`/financeiro/parametros-financeiros-pagars/${idEmpresa}`, dadosBase);
                
                this.successMessage = 'Configurações salvas com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao salvar configurações';
                console.error('Erro ao cadastrar parâmetros financeiros (pagar):', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * ALTERAR PARÂMETROS FINANCEIROS - CONTAS A PAGAR
         */
        async alterarParametrosFinanceirosPagar(idEmpresa, dados) {
            this.loading = true;
            
            try {
                const dadosBase = Array.isArray(dados.data) ? dados.data[0] : dados;
                const response = await apiPhp.put(`/financeiro/parametros-financeiros-pagars/${idEmpresa}`, dadosBase);
                
                this.successMessage = 'Configurações atualizadas com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao atualizar configurações';
                console.error('Erro ao alterar parâmetros financeiros (pagar):', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR PARÂMETROS FINANCEIROS - CONTAS A RECEBER
         */
        async buscarParametrosFinanceirosReceber(idEmpresa) {
            this.loading = true;
            
            try {
                const response = await apiPhp.get(`/financeiro/parametros-financeiros-recebers/${idEmpresa}`);
                
                this.errorMessage = '';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar parâmetros financeiros (receber):', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * CADASTRAR PARÂMETROS FINANCEIROS - CONTAS A RECEBER
         */
        async cadastrarParametrosFinanceirosReceber(idEmpresa, dados) {
            this.loading = true;
            
            try {
                const dadosBase = Array.isArray(dados.data) ? dados.data[0] : dados;
                const response = await apiPhp.put(`/financeiro/parametros-financeiros-recebers/${idEmpresa}`, dadosBase);
                
                this.successMessage = 'Configurações salvas com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao salvar configurações';
                console.error('Erro ao cadastrar parâmetros financeiros (receber):', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * ALTERAR PARÂMETROS FINANCEIROS - CONTAS A RECEBER
         */
        async alterarParametrosFinanceirosReceber(idEmpresa, dados) {
            this.loading = true;
            
            try {
                const dadosBase = Array.isArray(dados.data) ? dados.data[0] : dados;
                const response = await apiPhp.put(`/financeiro/parametros-financeiros-recebers/${idEmpresa}`, dadosBase);
                
                this.successMessage = 'Configurações atualizadas com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao atualizar configurações';
                console.error('Erro ao alterar parâmetros financeiros (receber):', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR PARÂMETROS FINANCEIROS - CAIXA (baixa)
         */
        async buscarParametrosBaixa(idEmpresa) {
            this.loading = true;
            
            try {
                const response = await apiPhp.get(`/financeiro/parametros-financeiros-caixas/${idEmpresa}`);
                
                this.errorMessage = '';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar parâmetros financeiros (baixa):', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR HISTÓRICO CAIXA
         */
        async buscarHistoricoCaixa() {
            this.loading = true;

            try {
                const response = await apiPhp.get('/financeiro/historico-caixas');

                this.historicoCaixa = response.data?.data ?? response.data ?? [];
                return response.data;

            } catch (error) {
                console.error('Erro ao buscar histórico caixa:', error);
                return [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR HISTÓRICO BANCÁRIO
         */
        async buscarHistoricoBancario() {
            this.loading = true;

            try {
                const response = await apiPhp.get('/financeiro/historico-bancarios');

                this.historicoBancario = response.data?.data ?? response.data ?? [];
                return response.data;

            } catch (error) {
                console.error('Erro ao buscar histórico bancário:', error);
                return [];
            } finally {
                this.loading = false;
            }
        },

        /**
         * BUSCAR PARÂMETROS CAIXA
         */
        async buscarParametrosCaixa(idEmpresa) {
            this.loading = true;
            
            try {
                const response = await apiPhp.get(`/financeiro/parametros-financeiros-caixas/${idEmpresa}`);
                
                this.errorMessage = '';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar parâmetros do caixa:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        /**
         * ALTERAR PARÂMETROS CAIXA
         */
        async alterarParametrosCaixa(idEmpresa, dados) {
            this.loading = true;
            
            try {
                const dadosBase = Array.isArray(dados.data) ? dados.data[0] : dados;
                const response = await apiPhp.put(`/financeiro/parametros-financeiros-caixas/${idEmpresa}`, dadosBase);
                
                this.successMessage = 'Configurações do caixa atualizadas com sucesso!';
                return response.data;
                
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || 'Erro ao atualizar configurações do caixa';
                console.error('Erro ao alterar parâmetros do caixa:', error);
                return null;
            } finally {
                this.loading = false;
            }
        }

    }

})
