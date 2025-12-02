import {defineStore} from "pinia"
import api from "@/services/api";
import {useApiStore} from "@/stores/APIs/api";
// import {toast} from "vue3-toastify";
 const apiStore = useApiStore();

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
                const response = await api.get(`ccustoparametro`,

                    {
                        headers: {Authorization: `Bearer ${this.token}`}
                    });


                this.config = response.data;
                this.errorMessage = '';

                console.log('config encontrado:', this.config);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar config:', error);
            } finally {
                this.loading = false;
            }
        },
        async cadastrarParfin(parfinData) {

            this.loading = apiStore.loading;
            const result = await apiStore.executarAcao('ccustoparametro', 'post', parfinData);

            // If the POST succeeded, refresh the stored config so the UI switches to PUT mode
            if (result) {
                await this.buscarparfin();
            }

        },


        async alterarParfin(parfinData) {
            this.loading = apiStore.loading;
            const result = await apiStore.executarAcao('ccustoparametro', 'put', parfinData);

            // If the PUT succeeded, refresh the stored config
            if (result) {
                await this.buscarparfin();
            }
        },

        /**
         * BUSCAR PARÂMETROS FINANCEIROS
         */
        async buscarParametrosFinanceiros() {
            return async (idEmpresa) => {
                this.loading = true;
                console.log('Token usado:', this.token);
                console.log('ID da empresa usado:', idEmpresa);
                if (!this.token) {
                    console.error('Token não encontrado!');
                    this.errorMessage = 'Token não encontrado!';
                    this.loading = false;
                    return;
                }
                if (!idEmpresa) {
                    console.error('ID da empresa não encontrado!');
                    this.errorMessage = 'ID da empresa não encontrado!';
                    this.loading = false;
                    return;
                }
                try {
                    const response = await api.get(`parfin/${idEmpresa}`, {
                        headers: {Authorization: `Bearer ${this.token}`}
                    });
                    this.config = response.data;
                    this.errorMessage = '';
                    console.log('Parâmetros financeiros encontrados:', this.config);
                } catch (error) {
                    this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                    console.error('Erro ao buscar parâmetros financeiros:', error);
                } finally {
                    this.loading = false;
                }
            }
        },

        /**
         * CADASTRAR PARÂMETROS FINANCEIROS
         */
        async cadastrarParametrosFinanceiros() {
            return async (idEmpresa, dados) => {
                this.loading = apiStore.loading;
                console.log('Token usado:', this.token);
                console.log('ID da empresa usado:', idEmpresa);
                if (!this.token) {
                    console.error('Token não encontrado!');
                    this.errorMessage = 'Token não encontrado!';
                    this.loading = false;
                    return;
                }
                if (!idEmpresa) {
                    console.error('ID da empresa não encontrado!');
                    this.errorMessage = 'ID da empresa não encontrado!';
                    this.loading = false;
                    return;
                }
                const result = await apiStore.executarAcao(`parfin/${idEmpresa}`, 'post', dados);
                if (result) {
                    await this.buscarParametrosFinanceiros(idEmpresa);
                }
                return result;
            }
        },

        /**
         * ALTERAR PARÂMETROS FINANCEIROS
         */
        async alterarParametrosFinanceiros() {
            return async (idEmpresa, dados) => {
                this.loading = apiStore.loading;
                console.log('Token usado:', this.token);
                console.log('ID da empresa usado:', idEmpresa);
                if (!this.token) {
                    console.error('Token não encontrado!');
                    this.errorMessage = 'Token não encontrado!';
                    this.loading = false;
                    return;
                }
                if (!idEmpresa) {
                    console.error('ID da empresa não encontrado!');
                    this.errorMessage = 'ID da empresa não encontrado!';
                    this.loading = false;
                    return;
                }
                const result = await apiStore.executarAcao(`parfin/${idEmpresa}`, 'put', dados);
                if (result) {
                    await this.buscarParametrosFinanceiros(idEmpresa);
                }
                return result;
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
        }

    }

})