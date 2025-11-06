<template>
  <v-container :class="{ 'theme--dark': themeStore.darkMode }">
    <h2 class="text-2xl font-bold mb-8" :class="textColorClass">Configuração de Acesso de Usuários</h2>
    <p class="text-sm opacity-70 mb-6" :class="textColorClass">Configure as políticas de acesso e segurança dos usuários</p>

    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedUser"
          :items="users"
          item-title="name"
          item-value="id"
          label="Selecione o Usuário"
          :theme="themeStore.darkMode ? 'dark' : 'light'"
          class="mb-4"
          @update:model-value="loadUserPermissions"
        ></v-select>
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="selectedModule"
          :items="modulesList"
          item-title="title"
          item-value="id"
          label="Selecione o Módulo"
          :theme="themeStore.darkMode ? 'dark' : 'light'"

          class="mb-4"
        ></v-select>
      </v-col>
    </v-row>

    <v-card
      v-if="selectedUser && selectedModule"
      class="mt-4"
      :theme="themeStore.darkMode ? 'dark' : 'light'"
      :style="cardStyle"
    >
      <v-card-text>
        <h3 class="text-h6 mb-4" :class="textColorClass">Permissões do Módulo</h3>

        <v-row>
          <v-col cols="12" sm="6" md="3" v-for="permission in currentModulePermissions" :key="permission.id">
            <v-switch
              v-model="permission.enabled"
              :label="permission.label"
              color="orange"
              class="custom-switch"
              :theme="themeStore.darkMode ? 'dark' : 'light'"
              hide-details
              @change="savePermissions"
            ></v-switch>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card
      v-else-if="selectedUser"
      class="mt-4"
      :theme="themeStore.darkMode ? 'dark' : 'light'"
      :style="cardStyle"
    >
      <v-card-text>
        <div v-for="(module, moduleName) in modules" :key="moduleName" class="mb-6">
          <v-expansion-panels
            :theme="themeStore.darkMode ? 'dark' : 'light'"
          >
            <v-expansion-panel :style="panelStyle">
              <v-expansion-panel-title :class="textColorClass">
                {{ module.title }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row>
                  <v-col cols="12" sm="6" md="3" v-for="(permission, permName) in module.permissions" :key="permName">
                    <v-switch
                      v-model="permission.enabled"
                      :label="permission.label"
                      color="orange"
                      class="custom-switch"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      hide-details
                      @change="savePermissions"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :theme="themeStore.darkMode ? 'dark' : 'light'"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'

const themeStore = useThemeStore()
const selectedUser = ref(null)
const selectedModule = ref(null)
const snackbar = ref({
  show: false,
  text: '',

})



// Mock users data - replace with API call
const users = ref([
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Gerente' },
  { id: 3, name: 'Usuário Padrão' },
])

const modules = ref({
  usuarios: {
    id: 'usuarios',
    title: 'Usuários',
    permissions: {
      view: { label: 'Visualizar', enabled: false },
      create: { label: 'Criar', enabled: false },
      edit: { label: 'Editar', enabled: false },
      delete: { label: 'Excluir', enabled: false }
    }
  },
  financeiro: {
    id: 'financeiro',
    title: 'Financeiro',
    permissions: {
      view: { label: 'Visualizar', enabled: false },
      create: { label: 'Criar', enabled: false },
      edit: { label: 'Editar', enabled: false },
      delete: { label: 'Excluir', enabled: false }
    }
  },
  pessoas: {
    id: 'pessoas',
    title: 'Pessoas',
    permissions: {
      view: { label: 'Visualizar', enabled: false },
      create: { label: 'Criar', enabled: false },
      edit: { label: 'Editar', enabled: false },
      delete: { label: 'Excluir', enabled: false }
    }
  },
  config: {
    id: 'config',
    title: 'Configurações',
    permissions: {
      view: { label: 'Visualizar', enabled: false },
      edit: { label: 'Editar', enabled: false }
    }
  }
})

const modulesList = computed(() => {
  return Object.values(modules.value).map(module => ({
    id: module.id,
    title: module.title
  }))
})

const currentModulePermissions = computed(() => {
  if (!selectedModule.value) return []
  const module = modules.value[selectedModule.value]
  return Object.entries(module.permissions).map(([key, value]) => ({
    id: key,
    label: value.label,
    enabled: value.enabled
  }))
})

const loadUserPermissions = async () => {
  try {
    // TODO: Fazer chamada à API para carregar as permissões do usuário
    // Exemplo mockado:
    const mockPermissions = {
      usuarios: { view: true, create: false, edit: false, delete: false },
      financeiro: { view: true, create: true, edit: true, delete: false },
      pessoas: { view: true, create: true, edit: true, delete: true },
      config: { view: true, edit: false }
    }

    Object.entries(mockPermissions).forEach(([moduleName, permissions]) => {
      Object.entries(permissions).forEach(([permName, value]) => {
        if (modules.value[moduleName]?.permissions[permName]) {
          modules.value[moduleName].permissions[permName].enabled = value
        }
      })
    })
  } catch (error) {
    showSnackbar('Erro ao carregar permissões', 'error')
  }
}

const savePermissions = async () => {
  try {
    const permissions = {}
    Object.entries(modules.value).forEach(([moduleName, module]) => {
      permissions[moduleName] = {}
      Object.entries(module.permissions).forEach(([permName, perm]) => {
        permissions[moduleName][permName] = perm.enabled
      })
    })

    // TODO: Integrar com a API para salvar as permissões
    console.log('Permissões a serem salvas:', permissions)

    showSnackbar('Permissões salvas com sucesso')
  } catch (error) {
    showSnackbar('Erro ao salvar permissões', 'error')
  }
}

const showSnackbar = (text, ) => {
  snackbar.value = {
    show: true,
    text,

  }
}

const cardStyle = computed(() => ({
  backgroundColor: 'transparent',
  border: `1px solid ${themeStore.darkMode ? 'var(--bg-color-secondary)' : 'var(--bg-color-third)'}`,
}))

const panelStyle = computed(() => ({
  backgroundColor: 'transparent',
  border: `1px solid ${themeStore.darkMode ? 'var(--bg-color-secondary)' : 'var(--bg-color-third)'}`,
}))
</script>

