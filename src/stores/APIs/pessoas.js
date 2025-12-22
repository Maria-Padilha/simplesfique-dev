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
            if (!formRef?.validate()) return

            // limpar mascaras
            form.cpf_cnpj = form.cpf_cnpj.replace(/\D/g, '');
            form.telefone = form.telefone.replace(/\D/g, '');
            form.celular = form.celular.replace(/\D/g, '');
            form.whats = form.whats.replace(/\D/g, '');
            form.latitude = Number(form.latitude);
            form.longitude = Number(form.longitude);

            this.loading = true
            try {
                const payload = {data: [{...form}]}
                if (editando) {
                    await api.put(`/pessoa/${form.id}`, payload, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
                    snackbar.message = 'Pessoa atualizada com sucesso!'
                } else {
                    await api.post('/pessoa', payload, {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}})
                    snackbar.message = 'Pessoa criada com sucesso!'
                }
                snackbar.color = 'success'
                snackbar.show = true
                await this.buscarTodasPessoas();
            } catch (e) {
                console.error(e)
                this.errorMessage = 'Erro ao salvar pessoa!'
                snackbar.message = 'Erro ao salvar pessoa'
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
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });

                this.pessoa = response.data;
                this.errorMessage = '';
                console.log('pessoa encontrada: ', this.pessoa);

            } catch (error) {
                this.errorMessage = error.response;
                console.error('Erro ao buscar pessoa pelo ID:', error);
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