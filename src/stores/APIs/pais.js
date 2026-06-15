import {defineStore} from "pinia"
import apiPhp from "@/services/apiPhp";

const errorMessages = {
    "The name field is required.": "O campo nome é obrigatório!",
};
export const usePaísStore = defineStore('país', {
    state: () => ({
        loading: false,
        errorMessage: '',
        successMessage: '',

        países: [],
        país: null,

        records: 0,
    }),

    actions: {
        async buscarTodosPaises() {
            this.loading = true;

            try {
                const res = await apiPhp.get('/api/v1/manutencao/pais');

                this.paises = res.data?.data ?? res.data;
                this.errorMessage = '';

                this.records = res.data?.total ?? 0;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async buscarPaisId(id) {
            this.loading = true;

            try {
                const res = await apiPhp.get(`/api/v1/manutencao/pais/${id}`);

                this.pais = res.data?.data ?? res.data;
                this.errorMessage = '';

                this.records = res.data?.total ?? 0;

            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        },

        async cadastrarPais(id, nomePais, id_empresa) {
            this.loading = true;
            try {
                await apiPhp.post('/api/v1/manutencao/pais', { id, nomePais });

                await this.buscarTodosPaises(id_empresa);
                this.errorMessage = '';
                this.successMessage = 'País cadastrado com sucesso!';

            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    this.fieldErrors = {};

                    Object.keys(error.response.data.errors).forEach(field => {
                        this.fieldErrors[field] = error.response.data.errors[field].map(errorMsg => {
                            this.errorMessage = errorMessages[errorMsg] || errorMsg;
                            return errorMessages[errorMsg] || errorMsg;
                        });
                    });
                } else {
                    this.errorMessage = 'Desculpe, ocorreu um erro ao cadastrar o País. Entre em contato com nosso suporte.';
                }

            } finally {
                this.loading = false;
            }
        },

        async deletePais(id, id_empresa) {
            this.loading = true;
            try {
                await apiPhp.delete(`/api/v1/manutencao/pais/${id}`);

                await this.buscarTodosPaises(id_empresa);
                this.errorMessage = '';
                this.successMessage = 'País deletado com sucesso!';
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
            } finally {
                this.loading = false;
            }
        }
    }
})