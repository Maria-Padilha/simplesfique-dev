import {defineStore} from "pinia"
// import {toast} from "vue3-toastify";
import api from "@/services/api";
import {useApiStore} from "@/stores/APIs/api";

export const usePessoasStore = defineStore('pessoas', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),

        errorMessage: '',
        successMessage: '',

        pessoas: [],
        pessoa: null
    }),

    actions: {
        async cadastrarPessoa (data, find = "") {
            this.loading = true;
            const apiStore = useApiStore();
            try {
                await apiStore.executarAcao('pessoa', 'post', data);
                await this.buscarTodasPessoas(find);
            } catch (error) {
                console.error('Erro ao cadastrar pessoa:', error);
            }
            finally {
                this.loading = false;
            }
        },

        async salvarPessoa (formRef, form, editando = false, snackbar = null) {
            const validation = await formRef?.validate()
            if (validation && !validation.valid) return

            // Clonar para sair do Proxy reativo e evitar mutação na tela
            const rawForm = JSON.parse(JSON.stringify(form))

            // Limpar máscaras
            rawForm.cpf_cnpj = (rawForm.cpf_cnpj || '').replace(/\D/g, '')
            rawForm.telefone  = (rawForm.telefone  || '').replace(/\D/g, '')
            rawForm.celular   = (rawForm.celular   || '').replace(/\D/g, '')
            rawForm.whats     = (rawForm.whats     || '').replace(/\D/g, '')

            // Separar enderecos e descartar campos obsoletos (latitude, longitude, data wrapper)
            const { enderecos = [], ...pessoaData } = rawForm
            delete pessoaData.data
            delete pessoaData.latitude
            delete pessoaData.longitude

            const payload = {
                data: [pessoaData],
                endereco: enderecos
            }

            this.loading = true
            try {
                if (editando) {
                    await api.put(`/pessoa/${rawForm.id}`, payload, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
                    snackbar.message = 'Cliente atualizado com sucesso!'
                } else {
                    await api.post('/pessoa', payload, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
                    snackbar.message = 'Cliente criado com sucesso!'
                }
                snackbar.color = 'success'
                snackbar.show = true
                await this.buscarTodasPessoas();
            } catch (e) {
                console.error(e)
                this.errorMessage = 'Erro ao salvar cliente!'
                snackbar.message = 'Erro ao salvar cliente'
                snackbar.color = 'error'
                snackbar.show = true
            } finally {
                this.loading = false
            }
        },

        async buscarTodasPessoas(find = "") {
            this.loading = true
            try {
                const resp = await api.get(`/pessoa?find=${find}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
                const data = resp.data && resp.data.data ? resp.data.data : Array.isArray(resp.data) ? resp.data : []
                this.pessoas = data
                console.log('Pessoas buscadas: ', this.pessoas)
            } catch (e) {
                console.error(e)
                this.pessoas = []
            } finally {
                this.loading = false
            }
        },

        async buscarpessoaId(id) {
            this.loading = true;
            try {
                const response = await api.get(`/pessoa/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const pessoa = response.data?.data?.[0] ?? null
                const endereco = response.data?.endereco ?? []
                this.pessoa = pessoa
                this.errorMessage = '';
                return { pessoa, endereco }
            } catch (error) {
                this.errorMessage = error?.response?.data?.message || error?.message || 'Erro desconhecido';
                console.error('Erro ao buscar pessoa pelo ID:', error);
                return null
            } finally {
                this.loading = false;
            }
        },

        async deletarPessoa(id, snackbar) {
            this.loading = true
            try {
                await api.delete(`/pessoa/${id}`, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
                snackbar.message = 'Pessoa excluída'
                snackbar.color = 'success'
                snackbar.show = true
                await this.buscarTodasPessoas();
            } catch (e) {
                console.error(e)
                snackbar.message = 'Erro ao excluir pessoa'
                snackbar.color = 'error'
                snackbar.show = true
            } finally {
                this.loading = false
            }
        },

        async importarPessoasCSV(pessoas) {
            this.loading = true
            try {
                // Processar cada pessoa e limpar máscaras
                const pessoasProcessadas = pessoas.map(pessoa => ({
                    ...pessoa,
                    cpf_cnpj: pessoa.cpf_cnpj?.replace(/\D/g, '') || '',
                    telefone: pessoa.telefone?.replace(/\D/g, '') || '',
                    celular: pessoa.celular?.replace(/\D/g, '') || '',
                    whats: pessoa.whats?.replace(/\D/g, '') || '',
                    latitude: pessoa.latitude ? Number(pessoa.latitude) : null,
                    longitude: pessoa.longitude ? Number(pessoa.longitude) : null,
                    cliente: pessoa.cliente || 'N',
                    fornecedor: pessoa.fornecedor || 'N',
                    transportadora: pessoa.transportadora || 'N',
                    colaborador: pessoa.colaborador || 'N',
                    representante: pessoa.representante || 'N',
                    ativo: pessoa.ativo || 'S'
                }))

                const payload = { data: pessoasProcessadas }
                await api.post('/pessoa', payload, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })
                
                this.errorMessage = ''
            } catch (e) {
                console.error('Erro ao importar pessoas:', e)
                this.errorMessage = 'Erro ao importar pessoas'
                throw e
            } finally {
                this.loading = false
            }
        }
    }
})