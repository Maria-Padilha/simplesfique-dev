<template>
  <div class="pa-4">
    <!-- Header Card -->
    <v-card class="background-secondary mb-4">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-account-group" class="mr-3"></v-icon>
          Grupos de Usuários
        </div>
      </v-card-title>
    </v-card>

    <!-- Content Card -->
    <v-card :color="themeStore.darkMode ? 'text-white' : ''" class="background-secondary">
      <v-card-text class="pa-4">
        <BotaoExpandTransition
          :formulario-aberto="formularioAberto"
          texto-abrir="Novo Grupo de Usuário"
          texto-fechar="Cancelar"
          @toggle="toggleFormulario"
        />

        <!-- Expandable Form -->
        <v-expand-transition>
          <div v-if="formularioAberto">
            <v-card class="background-card mb-7" elevation="2">
              <v-card-title class="text-h6 pa-4">
                <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2"></v-icon>
                {{ editando ? 'Editar Grupo de Usuário' : 'Novo Grupo de Usuário' }}
              </v-card-title>
              <v-card-text class="pa-4">
                <v-form ref="formRef" v-model="formValido">
                  <v-row>
                    <!-- Nome do Grupo -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.descgrupousuario"
                        label="Descrição do Grupo *"
                        :rules="[rules.required]"
                        variant="outlined"
                        density="compact"
                        class="required-left-border"
                        prepend-inner-icon="mdi-account-group"
                        maxlength="100"
                      ></v-text-field>
                    </v-col>

                    <!-- Descrição -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.descricao"
                        label="Observações"
                        variant="outlined"
                        density="compact"
                        prepend-inner-icon="mdi-text-box"
                        maxlength="255"
                      ></v-text-field>
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
                  @click="salvarGrupoUsuario"
                  variant="flat"
                  class="text-white"
                >
                  {{ editando ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-expand-transition>

        <!-- Data Table -->
        <TabelaPadrao
          :formulario-aberto="formularioAberto"
          :headers="headers"
          :items="itemsFiltrados"
          :loading="loading"
          :search="search"
          @update:search="(value) => search = value"
          search-label="Pesquisar Grupo de Usuário"
          item-key="id"
          no-data-icon="mdi-account-group-outline"
          no-data-text="Nenhum grupo de usuário cadastrado"
          delete-item-display-field="nome"
          @edit-item="editarGrupoUsuario"
          @confirm-delete="excluirGrupoUsuario"
          show-custom-action
          custom-action-icon="mdi-lock"
          @custom-action="abrirModalPermissoes"
        >
          <template v-slot:[`item.data_criacao`]="{ item }">
            {{ formatarData(item.data_criacao) }}
          </template>
        </TabelaPadrao>
      </v-card-text>
    </v-card>

    <!-- Modal de Permissões -->
    <v-dialog v-model="modalPermissoes" max-width="900px">
      <v-card :color="themeStore.darkMode ? '#1E1E1E' : ''" class="background-secondary">
        <v-card-title class="text-h6 pa-4 d-flex justify-space-between align-center">
          <span>Permissões - {{ grupoSelecionado?.nome }}</span>
          <v-btn icon="mdi-close" variant="text" @click="modalPermissoes = false"></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-4">
          <!-- Acordeão de Módulos -->
          <v-expansion-panels class="mb-4">
            <v-expansion-panel
              v-for="modulo in modulos"
              :key="modulo.code"
            >
              <v-expansion-panel-title
                class="background-card"
                @click="carregarPermissoesDoModulo(modulo.code)"
              >
                <v-icon class="mr-2">{{ modulo.icon }}</v-icon>
                <span class="font-weight-bold">{{ modulo.label }}</span>
                <v-spacer></v-spacer>
                <div v-if="permissoesPorModulo(modulo.code).length > 0" class="d-flex gap-2 align-center">
                  <v-btn
                    icon="mdi-check-all"
                    size="small"
                    variant="tonal"
                    color="var(--text-color-laranja)"
                    @click.stop="marcarTodosDoModulo(modulo.code, true)"
                    title="Marcar todos"
                  ></v-btn>
                  <v-btn
                    icon="mdi-close-box-multiple"
                    size="small"
                    variant="tonal"
                    color="grey"
                    @click.stop="marcarTodosDoModulo(modulo.code, false)"
                    title="Desmarcar todos"
                  ></v-btn>
                  <v-chip
                    size="small"
                    color="var(--text-color-laranja)"
                    text-color="white"
                    :label="true"
                  >
                    {{ permissoesPorModulo(modulo.code).length }}
                  </v-chip>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text class="background-secondary">
                <div v-if="carregandoPermissoesPorModulo[modulo.code]" class="text-center pa-4">
                  <v-progress-circular indeterminate size="30"></v-progress-circular>
                  <p class="mt-2 text-caption">Carregando permissões...</p>
                </div>

                <div v-else-if="permissoesPorModulo(modulo.code).length > 0" class="pa-2">
                  <!-- Cabeçalho da tabela -->
                  <div class="d-flex mb-3 font-weight-bold text-caption align-center">
                    <div class="flex-grow-1">Programa</div>
                    <div style="width: 60px" class="text-center">
                      <div class="mb-1">Visualizar</div>
                      <v-btn
                        icon="mdi-check-all"
                        size="x-small"
                        variant="tonal"
                        color="var(--text-color-laranja)"
                        density="compact"
                        @click="marcarTodosCampoDoModulo(modulo.code, 'visualizar', true)"
                        title="Marcar todos"
                      ></v-btn>
                    </div>
                    <div style="width: 60px" class="text-center">
                      <div class="mb-1">Incluir</div>
                      <v-btn
                        icon="mdi-check-all"
                        size="x-small"
                        variant="tonal"
                        color="var(--text-color-laranja)"
                        density="compact"
                        @click="marcarTodosCampoDoModulo(modulo.code, 'incluir', true)"
                        title="Marcar todos"
                      ></v-btn>
                    </div>
                    <div style="width: 60px" class="text-center">
                      <div class="mb-1">Alterar</div>
                      <v-btn
                        icon="mdi-check-all"
                        size="x-small"
                        variant="tonal"
                        color="var(--text-color-laranja)"
                        density="compact"
                        @click="marcarTodosCampoDoModulo(modulo.code, 'alterar', true)"
                        title="Marcar todos"
                      ></v-btn>
                    </div>
                    <div style="width: 60px" class="text-center">
                      <div class="mb-1">Excluir</div>
                      <v-btn
                        icon="mdi-check-all"
                        size="x-small"
                        variant="tonal"
                        color="var(--text-color-laranja)"
                        density="compact"
                        @click="marcarTodosCampoDoModulo(modulo.code, 'excluir', true)"
                        title="Marcar todos"
                      ></v-btn>
                    </div>
                    <div style="width: 60px" class="text-center">
                      <div class="mb-1">Exportar</div>
                      <v-btn
                        icon="mdi-check-all"
                        size="x-small"
                        variant="tonal"
                        color="var(--text-color-laranja)"
                        density="compact"
                        @click="marcarTodosCampoDoModulo(modulo.code, 'exportar', true)"
                        title="Marcar todos"
                      ></v-btn>
                    </div>
                    <div style="width: 60px" class="text-center">
                      <div class="mb-1">PDF</div>
                      <v-btn
                        icon="mdi-check-all"
                        size="x-small"
                        variant="tonal"
                        color="var(--text-color-laranja)"
                        density="compact"
                        @click="marcarTodosCampoDoModulo(modulo.code, 'pdf', true)"
                        title="Marcar todos"
                      ></v-btn>
                    </div>
                  </div>

                  <v-divider class="mb-2"></v-divider>

                  <!-- Itens de permissão -->
                  <div
                    v-for="permissao in permissoesPorModulo(modulo.code)"
                    :key="permissao.id_programa"
                    class="d-flex align-center py-2 px-2 background-card mb-2 rounded"
                  >
                    <div class="flex-grow-1 text-body2">
                      <div class="font-weight-500 d-flex align-center gap-2">
                        {{ permissao.descprograma }}
                        <v-chip
                          v-if="!permissao.descgrupousuario"
                          size="x-small"
                          color="var(--text-color-laranja)"
                          text-color="white"
                          label
                        >
                          novo
                        </v-chip>
                      </div>
                      <div class="text-caption text-grey">{{ permissao.id_programa }}</div>
                    </div>

                    <!-- Switch Visualizar -->
                    <div style="width: 60px" class="d-flex justify-center">
                      <v-switch
                        :model-value="permissao.visualizar === 'S'"
                        color="var(--text-color-laranja)"
                        density="compact"
                        size="small"
                        @update:model-value="(val) => atualizarPermissao(permissao, 'visualizar', val)"
                      ></v-switch>
                    </div>

                    <!-- Switch Incluir -->
                    <div style="width: 60px" class="d-flex justify-center">
                      <v-switch
                        :model-value="permissao.incluir === 'S'"
                        color="var(--text-color-laranja)"
                        density="compact"
                        size="small"
                        @update:model-value="(val) => atualizarPermissao(permissao, 'incluir', val)"
                      ></v-switch>
                    </div>

                    <!-- Switch Alterar -->
                    <div style="width: 60px" class="d-flex justify-center">
                      <v-switch
                        :model-value="permissao.alterar === 'S'"
                        color="var(--text-color-laranja)"
                        density="compact"
                        size="small"
                        @update:model-value="(val) => atualizarPermissao(permissao, 'alterar', val)"
                      ></v-switch>
                    </div>

                    <!-- Switch Excluir -->
                    <div style="width: 60px" class="d-flex justify-center">
                      <v-switch
                        :model-value="permissao.excluir === 'S'"
                        color="var(--text-color-laranja)"
                        density="compact"
                        size="small"
                        @update:model-value="(val) => atualizarPermissao(permissao, 'excluir', val)"
                      ></v-switch>
                    </div>

                    <!-- Switch Exportar -->
                    <div style="width: 60px" class="d-flex justify-center">
                      <v-switch
                        :model-value="permissao.exportar === 'S'"
                        color="var(--text-color-laranja)"
                        density="compact"
                        size="small"
                        @update:model-value="(val) => atualizarPermissao(permissao, 'exportar', val)"
                      ></v-switch>
                    </div>

                    <!-- Switch PDF -->
                    <div style="width: 60px" class="d-flex justify-center">
                      <v-switch
                        :model-value="permissao.pdf === 'S'"
                        color="var(--text-color-laranja)"
                        density="compact"
                        size="small"
                        @update:model-value="(val) => atualizarPermissao(permissao, 'pdf', val)"
                      ></v-switch>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center pa-4 text-grey">
                  <v-icon size="40" class="mb-2">mdi-lock-outline</v-icon>
                  <p class="text-caption">Nenhuma permissão encontrada</p>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="modalPermissoes = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useGrupoUsuarioStore } from '@/stores/APIs/grupousuario'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'
import { toast } from 'vue3-toastify'
import api from '@/services/api'

const themeStore = useThemeStore()
const store = useGrupoUsuarioStore()

const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const loading = computed(() => store.loading)

// Modal de Permissões
const modalPermissoes = ref(false)
const grupoSelecionado = ref(null)
const permissoesPorModuloData = ref({}) // Armazena permissões de cada módulo
const carregandoPermissoesPorModulo = ref({}) // Controla carregamento individual

const modulos = [
  { code: 'MNT', label: 'Manutenção', icon: 'mdi-wrench' },
  { code: 'VEN', label: 'Vendas', icon: 'mdi-cart' },
  { code: 'FIN', label: 'Financeiro', icon: 'mdi-cash' },
  { code: 'EST', label: 'Estoque', icon: 'mdi-warehouse' },
  { code: 'CTB', label: 'Contábil', icon: 'mdi-file-document' },
  { code: 'AST', label: 'Ordem de Serviço', icon: 'mdi-toolbox' },
  { code: 'EFD', label: 'Escrita Fiscal', icon: 'mdi-file-outline' },
  { code: 'PCP', label: 'Ordem de Produção', icon: 'mdi-factory' }
]

const formData = reactive({
  id: null,
  nome: '',
  descgrupousuario: '',
  descricao: ''
})

const rules = {
  required: (value) => !!value || 'Campo obrigatório'
}

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Descrição', key: 'nome', sortable: true },
  { title: 'Usuário Criador', key: 'usuario', sortable: true },
  { title: 'Data de Criação', key: 'data_criacao', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false }
]

const itemsFiltrados = computed(() => {
  const dados = store.gruposUsuario || []
  if (!Array.isArray(dados)) return []

  if (!search.value) return dados

  const termo = search.value.toLowerCase()
  return dados.filter(item =>
    item.nome?.toLowerCase().includes(termo) ||
    item.usuario?.toLowerCase().includes(termo)
  )
})

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value
  if (!formularioAberto.value) {
    cancelarFormulario()
  }
}

const cancelarFormulario = () => {
  formData.id = null
  formData.nome = ''
  formData.descgrupousuario = ''
  formData.descricao = ''
  editando.value = false
  formularioAberto.value = false

  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const salvarGrupoUsuario = async () => {
  if (!formRef.value?.validate()) {
    toast.error('Preencha os campos obrigatórios')
    return
  }

  try {
    if (editando.value) {
      await store.alterarGrupoUsuario(
        formData.id,
        formData.descgrupousuario,
        formData.descricao
      )
    } else {
      await store.cadastrarGrupoUsuario(
        null,
        formData.descgrupousuario,
        formData.descricao
      )
    }

    if (store.successMessage) {
      toast.success(store.successMessage)
    }

    cancelarFormulario()
    await store.buscarTodosGruposUsuario()
  } catch (error) {
    if (store.errorMessage) {
      toast.error(store.errorMessage)
    } else {
      toast.error('Erro ao salvar grupo de usuário')
    }
    console.error(error)
  }
}

const editarGrupoUsuario = (item) => {
  editando.value = true
  formularioAberto.value = true
  formData.id = item.id
  formData.nome = item.nome
  formData.descgrupousuario = item.nome
  formData.descricao = item.descricao || ''
}

const excluirGrupoUsuario = async (item) => {
  try {
    await store.deleteGrupoUsuario(item.id)

    if (store.successMessage) {
      toast.success(store.successMessage)
    }

    await store.buscarTodosGruposUsuario()
  } catch (error) {
    if (store.errorMessage) {
      toast.error(store.errorMessage)
    } else {
      toast.error('Erro ao excluir grupo de usuário')
    }
    console.error(error)
  }
}

const formatarData = (data) => {
  if (!data) return ''
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR')
}

const abrirModalPermissoes = async (item) => {
  grupoSelecionado.value = item
  modalPermissoes.value = true
  permissoesPorModuloData.value = {}
  carregandoPermissoesPorModulo.value = {}
}

const carregarPermissoesDoModulo = async (codigoModulo) => {
  const idGrupo = grupoSelecionado.value?.id

  if (!idGrupo) {
    console.log('ID do grupo não encontrado')
    return
  }

  console.log(`Carregando permissões do módulo: ${codigoModulo} para grupo: ${idGrupo}`)
  carregandoPermissoesPorModulo.value[codigoModulo] = true

  try {
    const token = localStorage.getItem('token')
    console.log('Token:', token ? 'Presente' : 'Não encontrado')

    const url = `/grupousuarioprog/${idGrupo}/modulovst/${codigoModulo}`
    console.log('URL da requisição:', url)

    const response = await api.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Resposta recebida:', response.data)

    if (response.data) {
      const dados = Array.isArray(response.data.data) ? response.data.data : (Array.isArray(response.data) ? response.data : [])
      permissoesPorModuloData.value[codigoModulo] = dados
      console.log(`Permissões carregadas para ${codigoModulo}:`, dados)

      if (!dados || dados.length === 0) {
        console.log(`Nenhuma permissão encontrada para o módulo ${codigoModulo}`)
      }
    } else {
      permissoesPorModuloData.value[codigoModulo] = []
      toast.error('Erro ao carregar permissões')
    }
  } catch (error) {
    console.error('Erro ao buscar permissões:', error)
    permissoesPorModuloData.value[codigoModulo] = []
    toast.error('Erro ao carregar permissões do módulo')
  } finally {
    carregandoPermissoesPorModulo.value[codigoModulo] = false
  }
}

const permissoesPorModulo = (codigoModulo) => {
  return permissoesPorModuloData.value[codigoModulo] || []
}

const atualizarPermissao = async (permissao, campo, valor) => {
  permissao[campo] = valor ? 'S' : 'N'
  console.log(`Permissão atualizada - Programa: ${permissao.id_programa}, Campo: ${campo}, Valor: ${valor ? 'S' : 'N'}`)

  // Salvar todas as permissões do módulo em uma requisição
  await salvarTodasPermissoesDoModulo(permissao.modulo_vst)
}

const salvarTodasPermissoesDoModulo = async (codigoModulo) => {
  try {
    const token = localStorage.getItem('token')
    const permissoes = permissoesPorModulo(codigoModulo)

    // Construir payload com todos os programas do módulo
    const payload = permissoes.map(permissao => ({
      id_programa: permissao.id_programa,
      visualizar: permissao.visualizar,
      incluir: permissao.incluir,
      alterar: permissao.alterar,
      excluir: permissao.excluir,
      exportar: permissao.exportar,
      pdf: permissao.pdf
    }))

    console.log('Enviando payload com', payload.length, 'programas:', payload)

    const response = await api.post(
      `/grupousuarioprog/${grupoSelecionado.value.id}`,
      { data: payload },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log('Permissões salvas com sucesso:', response.data)
    toast.success('Permissões atualizadas com sucesso')
  } catch (error) {
    console.error('Erro ao salvar permissões:', error)
    toast.error('Erro ao salvar permissões')
  }
}


const marcarTodosDoModulo = async (codigoModulo, marcar) => {
  const permissoes = permissoesPorModulo(codigoModulo)
  const campos = ['visualizar', 'incluir', 'alterar', 'excluir', 'exportar', 'pdf']

  permissoes.forEach(permissao => {
    campos.forEach(campo => {
      permissao[campo] = marcar ? 'S' : 'N'
    })
  })

  // Salvar todas as permissões do módulo em uma única requisição
  await salvarTodasPermissoesDoModulo(codigoModulo)
}

const marcarTodosCampoDoModulo = async (codigoModulo, campo, marcar) => {
  const permissoes = permissoesPorModulo(codigoModulo)

  permissoes.forEach(permissao => {
    permissao[campo] = marcar ? 'S' : 'N'
  })

  // Salvar todas as permissões do módulo em uma única requisição
  await salvarTodasPermissoesDoModulo(codigoModulo)
}

onMounted(async () => {
  await store.buscarTodosGruposUsuario()
})
</script>

