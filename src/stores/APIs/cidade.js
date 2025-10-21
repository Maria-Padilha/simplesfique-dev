import {defineStore} from "pinia"
import api from "@/services/api";

// const errorMessages = {
//     "The name field is required.": "O campo nome é obrigatório!",
// };
export const useCidadeStore = defineStore('cidade', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
        errorMessage: '',
        successMessage: '',

        cidades: [],
        cidade: null,

        records: 0,
    }),

    actions: {
        async buscarTodasCidades(limit = 50, offset = 0, ignorarPaginacao = false) {
            this.loading = true;

            try {
                const url = ignorarPaginacao
                    ? '/cidade'
                    : `/cidade?limit=${limit}&offset=${offset}`;

                const response = await api.get(url);

                this.cidades = response.data.data;
                this.records = response.data.records;
                this.errorMessage = '';

                console.log('Cidades encontrada:', this.cidades);
                console.log('Total de registros:', this.records);

                console.log(response.data);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar cidades:', error);
            } finally {
                this.loading = false;
            }
        },
    }
})