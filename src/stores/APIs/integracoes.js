import { defineStore } from 'pinia'
import api from '@/services/api'
import { toast } from 'vue3-toastify'

export const useIntegracoesStore = defineStore('integracoes', {
    state: () => ({
        loading: false,
        token: localStorage.getItem('token'),

        apisExternas: [],
        integracoesLoja: [],
    }),

    actions: {
        getAuthHeaders() {
            return {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
        },

        /**
         * Listar todas as APIs externas cadastradas pela empresa
         */
        async listarApisExternas() {
            this.loading = true
            try {
                const response = await api.get('/integracoes/api-externa', {
                    headers: this.getAuthHeaders(),
                })
                this.apisExternas = response.data?.data ?? response.data ?? []
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao buscar APIs externas.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Cadastrar nova API externa
         * @param {Object} payload
         */
        async cadastrarApiExterna(payload) {
            this.loading = true
            try {
                const response = await api.post('/integracoes/api-externa', payload, {
                    headers: this.getAuthHeaders(),
                })
                toast.success('API externa cadastrada com sucesso!')
                await this.listarApisExternas()
                return response.data
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao cadastrar API externa.')
                return null
            } finally {
                this.loading = false
            }
        },

        /**
         * Atualizar API externa existente
         * @param {number} id
         * @param {Object} payload
         */
        async alterarApiExterna(id, payload) {
            this.loading = true
            try {
                const response = await api.put(`/integracoes/api-externa/${id}`, payload, {
                    headers: this.getAuthHeaders(),
                })
                toast.success('API externa atualizada com sucesso!')
                await this.listarApisExternas()
                return response.data
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao atualizar API externa.')
                return null
            } finally {
                this.loading = false
            }
        },

        /**
         * Excluir API externa
         * @param {number} id
         */
        async deletarApiExterna(id) {
            this.loading = true
            try {
                await api.delete(`/integracoes/api-externa/${id}`, {
                    headers: this.getAuthHeaders(),
                })
                toast.success('API externa excluída com sucesso!')
                await this.listarApisExternas()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao excluir API externa.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Ativar ou desativar uma API externa
         * @param {number} id
         * @param {boolean} ativo
         */
        async alterarStatusApiExterna(id, ativo) {
            this.loading = true
            try {
                await api.patch(`/integracoes/api-externa/${id}/status`, { ativo }, {
                    headers: this.getAuthHeaders(),
                })
                toast.success(`API externa ${ativo ? 'ativada' : 'desativada'} com sucesso!`)
                await this.listarApisExternas()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao alterar status da API externa.')
            } finally {
                this.loading = false
            }
        },

        // ─── Loja de Integrações ─────────────────────────────────────────────

        /**
         * Listar todas as integrações de plataforma configuradas pela empresa
         */
        async listarIntegracoesLoja() {
            this.loading = true
            try {
                const response = await api.get('/integracoes/loja', {
                    headers: this.getAuthHeaders(),
                })
                this.integracoesLoja = response.data?.data ?? response.data ?? []
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao buscar integrações.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Salvar (criar ou atualizar) configuração de uma plataforma
         * @param {Object} payload - { plataforma, nome, credenciais, ativo }
         */
        async salvarIntegracaoLoja(payload) {
            this.loading = true
            try {
                const existente = this.integracoesLoja.find(i => i.plataforma === payload.plataforma)
                if (existente) {
                    await api.put(`/integracoes/loja/${existente.id}`, payload, {
                        headers: this.getAuthHeaders(),
                    })
                } else {
                    await api.post('/integracoes/loja', payload, {
                        headers: this.getAuthHeaders(),
                    })
                }
                toast.success(`${payload.nome} configurada com sucesso!`)
                await this.listarIntegracoesLoja()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao salvar integração.')
            } finally {
                this.loading = false
            }
        },

        /**
         * Remover integração de plataforma pelo ID da plataforma
         * @param {string} plataformaId - ex: 'asaas', 'stripe'
         */
        async deletarIntegracaoLoja(plataformaId) {
            this.loading = true
            try {
                const item = this.integracoesLoja.find(i => i.plataforma === plataformaId)
                if (!item) return
                await api.delete(`/integracoes/loja/${item.id}`, {
                    headers: this.getAuthHeaders(),
                })
                toast.success('Integração desconectada com sucesso!')
                await this.listarIntegracoesLoja()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Erro ao desconectar integração.')
            } finally {
                this.loading = false
            }
        },
    },
})
