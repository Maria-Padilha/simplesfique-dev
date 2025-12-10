import {defineStore} from "pinia"
import api from "@/services/api";
import {useApiStore} from "@/stores/APIs/api";
// import {toast} from "vue3-toastify";

export const useConfigParfinStore = defineStore('config-parfin', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',

        config: [],
        historicoCaixa: [],
        historicoBancario: [],

    }),

    actions: {

        /**
         * BUSCAR PARFIN
         *
         * @return {Promise<void>}
         */

        async buscarparfin() {
            this.loading = true;

            try {
                const response = await api.get(`ccustoparametro`, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });

                this.config = response.data;
                this.errorMessage = '';

                console.log('config encontrado:', this.config);
                
                return response.data;

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar config:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },
        async cadastrarParfin(parfinData) {
            const apiStore = useApiStore();
            this.loading = apiStore.loading;
            const result = await apiStore.executarAcao('ccustoparametro', 'post', parfinData);

            // If the POST succeeded, refresh the stored config so the UI switches to PUT mode
            if (result) {
                await this.buscarparfin();
            }

        },


        async alterarParfin(parfinData) {
            const apiStore = useApiStore();
            this.loading = apiStore.loading;
            const result = await apiStore.executarAcao('ccustoparametro', 'put', parfinData);

            // If the PUT succeeded, refresh the stored config
            if (result) {
                await this.buscarparfin();
            }
        },

        /**
         * BUSCAR PARÂMETROS FINANCEIROS - CONTAS A PAGAR
         */
        async buscarParametrosFinanceirosPagar(idEmpresa) {
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
                const response = await api.get(`parfinpag/${idEmpresa}`, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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
            
            if (!this.token || !idEmpresa) {
                console.error('Token ou ID da empresa não encontrado!');
                this.loading = false;
                return false;
            }
            
            try {
                const response = await api.post(`parfinpag/${idEmpresa}`, dados, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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
            
            if (!this.token || !idEmpresa) {
                console.error('Token ou ID da empresa não encontrado!');
                this.loading = false;
                return false;
            }
            
            try {
                const response = await api.put(`parfinpag/${idEmpresa}`, dados, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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
                const response = await api.get(`parfinrec/${idEmpresa}`, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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
            
            if (!this.token || !idEmpresa) {
                console.error('Token ou ID da empresa não encontrado!');
                this.loading = false;
                return false;
            }
            
            try {
                const response = await api.post(`parfinrec/${idEmpresa}`, dados, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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
            
            if (!this.token || !idEmpresa) {
                console.error('Token ou ID da empresa não encontrado!');
                this.loading = false;
                return false;
            }
            
            try {
                const response = await api.put(`parfinrec/${idEmpresa}`, dados, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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
         * BUSCAR HISTÓRICO CAIXA
         */
        async buscarHistoricoCaixa() {
            this.loading = true;

            try {
                const response = await api.get(`histcaixa`, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });

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
                const response = await api.get(`histbancario`, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });

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
                const response = await api.get(`parfincxa/${idEmpresa}`, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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
            
            if (!this.token || !idEmpresa) {
                console.error('Token ou ID da empresa não encontrado!');
                this.loading = false;
                return false;
            }
            
            try {
                const response = await api.put(`parfincxa/${idEmpresa}`, dados, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });
                
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