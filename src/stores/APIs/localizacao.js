import {defineStore} from "pinia"
import api from "@/services/api";

// const errorMessages = {
//     "The name field is required.": "O campo nome é obrigatório!",
// };
export const useLocalizacaoStore = defineStore('localizacao', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',

        cep: [],

        records: 0,
    }),

    actions: {
        async buscarCep(cep) {
            this.loading = true;

            try {
                const response = await api.get(`/cep/${cep}`,);

                this.cep = response.data;
                this.errorMessage = '';

                console.log('CEP encontrado:', this.cep);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar CEP:', error);
            } finally {
                this.loading = false;
            }
        },
    }
})