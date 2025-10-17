import {defineStore} from "pinia"
import api from "@/services/api";

const errorMessages = {
    "The name field is required.": "O campo nome é obrigatório!",
};
export const usePaísStore = defineStore('país', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),
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
                const response = await api.get(`/pais`,);

                this.paises = response.data;
                this.errorMessage = '';

                this.records = response.data.records;

                console.log('Países buscados com sucesso:', this.paises);

            } catch (error) {
                this.errorMessage = error;
                console.log(this.errorMessage)
            } finally {
                this.loading = false;
            }
        },

        async buscarPaisId(id) {
            this.loading = true;

            try {
                const response = await api.get(`/pais/${id}`,
                    {
                        headers: {Authorization: `Bearer ${this.token}`}
                    });

                this.pais = response.data;
                this.errorMessage = '';

                this.records = response.data.records;

            } catch (error) {
                this.errorMessage = error.response;
            } finally {
                this.loading = false;
            }
        },

        async cadastrarPais(id, nomePais, id_empresa) {
            this.loading = true;
            try {
                await api.post('/pais',
                    {id, nomePais},
                    {
                        headers: {Authorization: `Bearer ${this.token}`}
                    })

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
                    console.log(error)
                    this.errorMessage = 'Desculpe, ocorreu um erro ao cadastrar o País. Entre em contato com nosso suporte.';
                }

            } finally {
                this.loading = false;
            }
        },

        async deletePais(id, id_empresa) {
            this.loading = true;
            try {
                await api.delete(`/pais/${id}`, {
                    headers: {Authorization: `Bearer ${this.token}`}
                });

                await this.buscarTodosPaises(id_empresa);
                this.errorMessage = '';
                this.successMessage = 'País deletado com sucesso!';
            } catch (error) {
                this.errorMessage = error;
                console.log(this.errorMessage)
            } finally {
                this.loading = false;
            }
        }
    }
})