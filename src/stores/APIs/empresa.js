import {defineStore} from "pinia"
// import api from "@/services/api";
// import {toast} from "vue3-toastify";
import {useApiStore} from "@/stores/APIs/api";

const apiStore = useApiStore();

export const useEmpresaStore = defineStore('empresa', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),

        errorMessage: '',
        successMessage: '',

        empresas: [],
        empresa: null
    }),

    actions: {
        async cadastrarEmpresa(empresaData, token) {
            this.loading = true;
            try {
                await apiStore.executarAcao('empresa', 'post', empresaData, null, token);
            } catch (error) {
                console.error('Erro ao cadastrar empresa:', error);
            }
            finally {
                this.loading = false;
            }
        }
    }
})