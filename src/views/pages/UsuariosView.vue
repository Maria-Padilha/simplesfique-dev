<template>
  <top-all-pages icon="mdi-account-cog">
    <template #titulo>Usuários</template>
    <template #section>
      <v-card class="background-secondary">
        <v-card-text class="pa-4">
          <BotaoExpandTransition
              :formulario-aberto="formularioAberto"
              texto-abrir="Novo Usuário"
              texto-fechar="Cancelar"
              @toggle="toggleFormulario"
          />

          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="2">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                  {{ editando ? 'Editar Usuário' : 'Novo Usuário' }}
                </v-card-title>
                <v-card-text class="pa-4">
                  <v-form ref="formRef" v-model="formValido">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="form.nome"
                            label="Nome *"
                            :rules="[rules.required]"
                            maxlength="120"
                            variant="outlined"
                            density="compact"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-account"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                            v-model="form.email"
                            label="E-mail *"
                            :rules="[rules.required, rules.email]"
                            maxlength="120"
                            variant="outlined"
                            density="compact"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-email"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-checkbox v-model="form.consolidar" label="Permite consolidar" true-value="S" false-value="N"></v-checkbox>
                      </v-col>

                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                  <v-spacer></v-spacer>
                  <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                  <v-btn
                      color="var(--text-color-laranja)"
                      :loading="loading"
                      :disabled="!formValido"
                      @click="salvarUsuario"
                      variant="flat"
                      class="text-white">
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela de Usuários -->
          <TabelaPadrao
              :formulario-aberto="formularioAberto"
              :headers="headers"
              :items="usuarios"
              :loading="loading"
              :search="search"
              @update:search="(value) => search = value"
              search-label="Pesquisar Usuário"
              item-key="id"
              no-data-icon="mdi-account-off"
              no-data-text="Nenhum usuário encontrado"
              :show-custom-action="true"
              custom-action-icon="mdi-office-building"
              delete-dialog-message="Esta ação não pode ser desfeita."
              delete-item-display-field="nome"
              @edit-item="editarUsuario"
              @confirm-delete="deletarUsuario"
              @custom-action="abrirModalEmpresaGrupo"
          >
            <!-- Slots para formatação customizada -->
            <template v-slot:[`item.consolidar`]="{ item }">
              {{ item.consolidar === 'S' ? 'Sim' : 'Não' }}
            </template>
          </TabelaPadrao>
        </v-card-text>
      </v-card>

      <!-- Modal de Empresa e Grupo de Usuário -->
      <v-dialog v-model="modalEmpresaGrupo" max-width="700px">
        <v-card :color="themeStore.darkMode ? '#1E1E1E' : ''" class="background-secondary">
          <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
            <span>Empresas e Grupos - {{ usuarioSelecionado?.nome }}</span>
            <v-btn icon="mdi-close" variant="text" @click="modalEmpresaGrupo = false"></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <div v-if="carregandoEmpresas" class="text-center pa-4">
              <v-progress-circular indeterminate></v-progress-circular>
              <p class="mt-2">Carregando empresas...</p>
            </div>

            <div v-else>
              <!-- Acordeões de Empresas -->
              <v-expansion-panels v-if="empresas && empresas.length > 0" class="mb-4">
                <v-expansion-panel
                  v-for="empresa in empresas"
                  :key="empresa.id"
                >
                  <v-expansion-panel-title class="background-card">
                    <v-icon class="mr-2">mdi-office-building</v-icon>
                    <span class="font-weight-bold">{{ empresa.nome }}</span>
                    <v-spacer></v-spacer>
                    <v-chip
                      v-if="getGrupoSelecionado(empresa.id)"
                      size="small"
                      color="var(--text-color-laranja)"
                      text-color="white"
                      :label="true"
                      class="mr-2"
                    >
                      {{ getGrupoSelecionado(empresa.id) }}
                    </v-chip>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text class="background-secondary">
                    <div class="d-flex gap-3 align-end">
                      <v-select
                        :model-value="empresasGrupos[empresa.id]"
                        :items="gruposUsuario"
                        item-title="nome"
                        item-value="id"
                        label="Grupo de Usuário"
                        variant="outlined"
                        density="compact"
                        class="flex-grow-1"
                        @update:model-value="(value) => empresasGrupos[empresa.id] = value"
                      ></v-select>
                      <v-btn
                        color="var(--text-color-laranja)"
                        variant="flat"
                        class="text-white"
                        @click="atualizarGrupoEmpresa(empresa, empresasGrupos[empresa.id])"
                      >
                        Salvar
                      </v-btn>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <div v-else class="text-center pa-4 text-grey">
                <v-icon size="48" class="mb-2">mdi-office-building-off</v-icon>
                <p>Nenhuma empresa encontrada</p>
              </div>
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="modalEmpresaGrupo = false">
              Fechar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">{{ snackbar.message }}</v-snackbar>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'
import { useThemeStore } from '@/stores/config-temas/theme'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";

const themeStore = useThemeStore();

// State
const usuarios = ref([])
const loading = ref(false)
const search = ref('')

// Formulário expansível
const formularioAberto = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const editando = ref(false)

const form = reactive({
  id_empresa: 1,
  id: null,
  nome: '',
  email: '',
  consolidar: 'N',
})

// Snackbar
const snackbar = reactive({ show:false, message:'', color:'success' })

// Modal de Empresa e Grupo
const modalEmpresaGrupo = ref(false)
const usuarioSelecionado = ref(null)
const empresas = ref([])
const gruposUsuario = ref([])
const empresasGrupos = ref({}) // Mapa de id_empresa -> id_grupo
const carregandoEmpresas = ref(false)

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nome', key: 'nome', sortable: true },
  { title: 'E-mail', key: 'email', sortable: true },
  { title: 'Consolidar', key: 'consolidar', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false }
]

const rules = {
  required: (v) => !!v || 'Campo obrigatório',
  email: (v) => /\S+@\S+\.\S+/.test(v) || 'E-mail inválido'
}

// CRUD
const buscarUsuarios = async () => {
  loading.value = true
  try {
    const resp = await api.get('/usuario', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    usuarios.value = resp.data && resp.data.data ? resp.data.data : Array.isArray(resp.data) ? resp.data : []
  } catch (e) {
    console.error(e)
    usuarios.value = []
  } finally {
    loading.value = false
  }
}

const toggleFormulario = () => {
  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    editando.value = false
    resetarForm()
    formularioAberto.value = true
  }
}

const editarUsuario = (u) => {
  editando.value = true
  Object.assign(form, u)
  formularioAberto.value = true
}

const cancelarFormulario = () => {
  formularioAberto.value = false
  resetarForm()
}

const resetarForm = () => {
  Object.assign(form, {
    id_empresa: 1,
    id: null,
    nome: '',
    email: '',
    consolidar: 'N',
  })
  if (formRef.value) formRef.value.resetValidation()
}

const salvarUsuario = async () => {
  if (!formRef.value?.validate()) return
  loading.value = true
  try {
    const payload = { data: [ { ...form } ] }
    if (editando.value) {
      await api.put(`/usuario/${form.id}`, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      snackbar.message = 'Usuário atualizado com sucesso!'
    } else {
      await api.post('/usuario', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      snackbar.message = 'Usuário criado com sucesso!'
    }
    snackbar.color = 'success'
    snackbar.show = true
    buscarUsuarios()
    cancelarFormulario()
  } catch (e) {
    console.error(e)
    snackbar.message = 'Erro ao salvar usuário'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

const deletarUsuario = async (usuario) => {
  loading.value = true
  try {
    const id = usuario?.id || usuario
    await api.delete(`/usuario/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    snackbar.message = 'Usuário excluído com sucesso!'
    snackbar.color = 'success'
    snackbar.show = true
    buscarUsuarios()
  } catch (e) {
    console.error(e)
    snackbar.message = 'Erro ao excluir usuário'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    loading.value = false
  }
}

const abrirModalEmpresaGrupo = async (usuario) => {
  usuarioSelecionado.value = usuario
  modalEmpresaGrupo.value = true
  carregandoEmpresas.value = true
  empresasGrupos.value = {}

  try {
    const token = localStorage.getItem('token')

    // Buscar empresas disponíveis e grupos do usuário
    const [empresasResp, gruposResp, usuarioEmpresaResp] = await Promise.all([
      api.get('/empresa', { headers: { Authorization: `Bearer ${token}` } }),
      api.get('/grupousuario', { headers: { Authorization: `Bearer ${token}` } }),
      api.get(`/empresa/`, { headers: { Authorization: `Bearer ${token}` } })
    ])

    // Mapear empresas com razao_social
    const dataEmpresas = empresasResp.data?.data || empresasResp.data || []
    empresas.value = Array.isArray(dataEmpresas) ? dataEmpresas.map(e => ({
      id: e.id,
      nome: e.razao_social || e.fantasia || `Empresa ${e.id}`
    })) : []

    // Mapear grupos
    const dataGrupos = gruposResp.data?.data || gruposResp.data || []
    gruposUsuario.value = Array.isArray(dataGrupos) ? dataGrupos.map(g => ({
      id: g.id,
      nome: g.nome || g.descgrupousuario
    })) : []

    // Mapear grupos por empresa do usuário
    const dataUsuarioEmpresa = usuarioEmpresaResp.data?.data || usuarioEmpresaResp.data || []
    const usuarioEmpresas = Array.isArray(dataUsuarioEmpresa) ? dataUsuarioEmpresa : []

    usuarioEmpresas.forEach(ue => {
      empresasGrupos.value[ue.id_empresa] = ue.id_grupo
    })

    console.log('Empresas carregadas:', empresas.value)
    console.log('Grupos carregados:', gruposUsuario.value)
    console.log('Grupos do usuário por empresa:', empresasGrupos.value)
  } catch (e) {
    console.error('Erro ao carregar empresas e grupos:', e)
    snackbar.message = 'Erro ao carregar empresas e grupos'
    snackbar.color = 'error'
    snackbar.show = true
  } finally {
    carregandoEmpresas.value = false
  }
}

const atualizarGrupoEmpresa = async (empresa, idGrupo) => {
  if (!idGrupo) {
    snackbar.message = 'Selecione um grupo de usuário'
    snackbar.color = 'warning'
    snackbar.show = true
    return
  }

  try {
    const token = localStorage.getItem('token')

    const payload = {
      data: [{
        id_empresa: empresa.id,
        id_usuario: usuarioSelecionado.value.id,
        id_grupousuario: idGrupo
      }]
    }

    console.log('Enviando payload:', payload)

    await api.post('/usuarioemp', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // Atualizar o mapa local após sucesso
    empresasGrupos.value[empresa.id] = idGrupo

    snackbar.message = 'Grupo atualizado com sucesso!'
    snackbar.color = 'success'
    snackbar.show = true
  } catch (e) {
    console.error('Erro ao atualizar grupo:', e)
    snackbar.message = 'Erro ao atualizar grupo de usuário'
    snackbar.color = 'error'
    snackbar.show = true
  }
}

const getGrupoSelecionado = (idEmpresa) => {
  const idGrupo = empresasGrupos.value[idEmpresa]
  if (!idGrupo) return null

  const grupo = gruposUsuario.value.find(g => g.id === idGrupo)
  return grupo ? grupo.nome : null
}

onMounted(() => {
  buscarUsuarios()
})
</script>
