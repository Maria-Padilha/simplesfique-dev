import {defineStore} from "pinia"
import api from "@/services/api";
import apiPhpModule from "@/services/apiPhp";
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
        // Auth headers injetados pelo interceptor de api.js — sem duplicação aqui
        async executarAcao(entidade, metodo, payload = null, id = null) {
            this.loading = true;
            this.successMessage = '';
            this.errorMessage = '';

            try {
                let response;
                const url = id ? `/${entidade}/${id}` : `/${entidade}`;

                switch (metodo) {
                    case 'post':
                        response = await api.post(url, payload);
                        this.successMessage = `${entidade} cadastrado(a) com sucesso!`;
                        toast.success(this.successMessage);
                        break;

                    case 'put':
                        response = await api.put(url, payload);
                        this.successMessage = `${entidade} atualizado(a) com sucesso!`;
                        toast.success(this.successMessage);
                        break;

                    case 'delete':
                        response = await api.delete(url);
                        this.successMessage = `${entidade} excluído(a) com sucesso!`;
                        toast.success(this.successMessage);
                        break;

                    default:
                        throw new Error('Método inválido. Use post, put ou delete.');
                }

                return response.data;

            } catch (error) {
                this.errorMessage = error.validationMessage
                    || error.response?.data?.message
                    || 'Erro na operação.';
                toast.error(this.errorMessage);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async buscarDados(entidade, {
            limit = 50,
            offset = 0,
            perPage,
            page,
            ignorarPaginacao = false,
            id = null,
            apiPhp = false
        } = {}) {
            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                const http = apiPhp ? apiPhpModule : api;
                let url;

                if (id) {
                    url = `/${entidade}/${id}`;
                } else if (ignorarPaginacao) {
                    url = `/${entidade}`;
                } else {
                    // page/per_page explicitos têm prioridade; senão converte de limit/offset
                    const finalPage = page ?? (Math.floor(offset / limit) + 1);
                    const finalPerPage = perPage ?? limit;

                    if (apiPhp) {
                        url = `/${entidade}?page=${finalPage}&per_page=${finalPerPage}`;
                    } else {
                        url = `/${entidade}?limit=${limit}&offset=${offset}`;
                    }
                }

                const response = await http.get(url);

                if (id) {
                    this.item = response.data.data;
                } else {
                    this[`${entidade}s`] = response.data.data;
                    this.records = response.data.total ?? response.data.records ?? 0;
                }

            } catch (error) {
                this.errorMessage = error.validationMessage
                    || error.response?.data?.message
                    || 'Erro ao buscar dados.';
            } finally {
                this.loading = false;
            }
        }
    }
})
