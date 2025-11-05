import {defineStore} from "pinia"
import api from "@/services/api";
import {toast} from "vue3-toastify";

export const useApiStore = defineStore('api', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),

        errorMessage: '',
        successMessage: '',

        records: 0,

        dataEmpresa: null,
        tokenEmpresa: null,
    }),

    actions: {
        async executarAcao(entidade, metodo, payload = null, id = null, token = this.token) {
            this.loading = true;
            this.successMessage = '';
            this.errorMessage = '';

            try {
                let response;
                const url = id ? `/${entidade}/${id}` : `/${entidade}`;

                switch (metodo) {
                    case 'post':
                        response = await api.post(url, payload, {
                            headers: {Authorization: `Bearer ${token}`}
                        });
                        this.successMessage = `${entidade} cadastrado(a) com sucesso!`;
                        toast.success(this.successMessage);
                        console.log(response)
                        break;

                    case 'put':
                        response = await api.put(url, payload, {
                            headers: {Authorization: `Bearer ${this.token}`}
                        });
                        this.successMessage = `${entidade} atualizado(a) com sucesso!`;
                        toast.success(this.successMessage);
                        break;

                    case 'delete':
                        response = await api.delete(url, {
                            headers: {Authorization: `Bearer ${this.token}`}
                        });
                        this.successMessage = `${entidade} excluído(a) com sucesso!`;
                        toast.success(this.successMessage);
                        break;

                    default:
                        throw new Error('Método inválido. Use post, put ou delete.');
                }

                console.log(response.data);
                // Return the response data so callers can react to success
                return response.data;

            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro na operação.';
                console.error(`Erro ao executar ação em ${entidade}:`, error);
                toast.error(this.errorMessage);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async buscarDados(entidade, {limit = 50, offset = 0, ignorarPaginacao = false, id = null} = {}) {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                let url;

                if (id) {
                    // Buscar registro específico
                    url = `/${entidade}/${id}`;
                } else {
                    // Buscar todos (com ou sem paginação)
                    url = ignorarPaginacao ? `/${entidade}` : `/${entidade}?limit=${limit}&offset=${offset}`;
                }

                const response = await api.get(url);

                if (id) {
                    this.item = response.data.data;
                    console.log(`${entidade} encontrada:`, this.item);
                } else {
                    this[`${entidade}s`] = response.data.data;
                    this.records = response.data.records;
                    console.log(`${entidade}s encontradas:`, this[`${entidade}s`]);
                    console.log('Total de registros:', this.records);
                }

            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Erro ao buscar dados.';
                console.error(`Erro ao buscar ${entidade}:`, error);
            } finally {
                this.loading = false;
            }
        }
    }
})