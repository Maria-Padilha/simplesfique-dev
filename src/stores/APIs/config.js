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
                const response = await api.get(`/parfin/`,

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
            await apiStore.executarAcao('parfin', 'post', parfinData);

        },


        async alterarParfin(parfinData) {
            this.loading = apiStore.loading;
            await apiStore.executarAcao('parfin', 'put', parfinData);
        },



    }

})