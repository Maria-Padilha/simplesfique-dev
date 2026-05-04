<template>
  <div>
    <!-- Campo de Pesquisa e Tabela -->
    <v-expand-transition>
      <div v-if="!formularioAberto">
        <div :class="tituloPesquisa ? 'flex items-center justify-between my-4' : ''">
          <p class="text-xl opacity-70">{{tituloPesquisa}}</p>
          <v-text-field
            v-if="showSearch"
            v-model="searchModel"
            :label="searchLabel"
            hide-details
            max-width="400px"
            append-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            class="custom-text-field mb-4"
          ></v-text-field>
        </div>

        <v-data-table
          :items-per-page="itemPorPag"
          :headers="headers"
          :items="items"
          :loading="loading"
          :item-key="itemKey"
          :item-value="itemKey"
          :search="searchModel"
          class="background-secondary minha-tabela"
          :hide-default-footer="esconderFooter"
          :show-expand="expandable"
          v-model:expanded="expandedModel"
          :expand-on-click="expandOnClick"
          :show-select="showSelect"
          v-model:selected="localSelected"
          :item-selectable="itemSelectable || undefined"
        >
          <!-- Slots dinâmicos para formatação customizada -->
          <template
            v-for="(_, name) in $slots"
            :key="name"
            v-slot:[name]="slotData"
          >
            <slot :name="name" v-bind="slotData" />
          </template>

          <!-- Actions padrão se não personalizado -->
          <template v-if="!$slots['item.actions']" v-slot:[`item.actions`]="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                v-if="showEditAction"
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                :title="editTitle"
                @click="$emit('edit-item', item)"
              ></v-btn>

              <v-btn
                v-if="showCustomAction"
                :icon="customActionIcon"
                size="small"
                :color="customActionColor"
                variant="text"
                :title="customActionTitle"
                :loading="customActionLoading"
                :disabled="customActionLoading"
                @click="$emit('custom-action', item)"
              ></v-btn>

              <v-btn
                v-if="showDeleteAction"
                :icon="deleteIcon"
                size="small"
                color="error"
                variant="text"
                :title="deleteTooltip"
                @click="handleDeleteItem(item)"
              ></v-btn>
            </div>
          </template>

          <!-- No data personalizado -->
          <template v-slot:no-data>
            <div class="text-center pa-4">
              <v-icon
                :icon="noDataIcon"
                size="64"
                class="mb-2 opacity-60"
                :color="themeStore.darkMode ? '#ffff' : ''"
              ></v-icon>
              <p class="text-body-1">{{ noDataText }}</p>
            </div>
          </template>
        </v-data-table>
      </div>
    </v-expand-transition>

    <!-- Dialog de Confirmação de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="background-secondary">
        <v-card-title class="text-h6">
          {{ deleteDialogTitle }}
        </v-card-title>
        <v-card-text>
          <span v-if="itemToDelete && deleteItemDisplayField">
            {{ deleteDialogText || `Tem certeza que deseja excluir "${getItemDisplayValue(itemToDelete)}"?` }}
            <br><br>
            {{ deleteDialogMessage }}
          </span>
          <span v-else>
            {{ deleteDialogText || deleteDialogMessage }}
          </span>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey"
            variant="text"
            @click="closeDeleteDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="loading"
            @click="confirmDelete"
          >
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits, defineExpose } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'

const themeStore = useThemeStore()

// Props
const props = defineProps({
  // Dados da tabela
  headers: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    default: () => []
  },
  itemKey: {
    type: String,
    default: 'id'
  },
  loading: {
    type: Boolean,
    default: false
  },

  itemPorPag: {
    type: Number,
    default: 10
  },

  // Controle de formulário
  formularioAberto: {
    type: Boolean,
    default: false
  },

  // Configuração da pesquisa
  showSearch: {
    type: Boolean,
    default: true
  },
  searchLabel: {
    type: String,
    default: 'Pesquisar'
  },
  search: {
    type: String,
    default: ''
  },
  tituloPesquisa: {
    type: String,
    default: null
  },

  // Configuração de ações
  showEditAction: {
    type: Boolean,
    default: true
  },
  editTitle: {
    type: String,
    default: 'Editar'
  },

  showCustomAction: {
    type: Boolean,
    default: false
  },
  customActionIcon: {
    type: String,
    default: 'mdi-cog'
  },
  customActionColor: {
    type: String,
    default: 'secondary'
  },
  customActionTitle: {
    type: String,
    default: 'Ação personalizada'
  },
  customActionLoading: {
    type: Boolean,
    default: false
  },

  showDeleteAction: {
    type: Boolean,
    default: true
  },
  deleteIcon: {
    type: String,
    default: 'mdi-delete'
  },
  deleteTooltip: {
    type: String,
    default: 'Excluir'
  },
  deleteTitle: {
    type: String,
    default: 'Excluir'
  },

  // Configuração do no-data
  noDataIcon: {
    type: String,
    default: 'mdi-database-off'
  },
  noDataText: {
    type: String,
    default: 'Nenhum registro encontrado'
  },

  // Configuração do dialog de exclusão
  deleteDialogTitle: {
    type: String,
    default: 'Confirmar Exclusão'
  },
  deleteDialogText: {
    type: String,
    default: null
  },
  deleteDialogMessage: {
    type: String,
    default: 'Esta ação não pode ser desfeita.'
  },
  deleteItemDisplayField: {
    type: String,
    default: null
  },

  esconderFooter: {
    type: Boolean,
    default: false
  },

  expanded: {
    type: Array,
    default: () => [],
  },
  expandOnClick: {
    type: Boolean,
    default: false,
  },
  expandable: {
    type: Boolean,
    default: false,
  },

  showSelect: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Array,
    default: () => []
  },
  itemSelectable: {
    type: String,
    default: null
  }
})

const esconderFooter = computed(() => props.esconderFooter)
const expanded = ref([]);

// Emits
const emit = defineEmits([
  'edit-item',
  'delete-item',
  'custom-action',
  'confirm-delete',
  'update:search',
  'update:expanded',
  'update:selected'
])

// Reactive data
const deleteDialog = ref(false)
const itemToDelete = ref(null)

// Computed
const searchModel = computed({
  get: () => props.search,
  set: (value) => emit('update:search', value)
})

// Local ref para seleção — fluxo unidirecional: filho → pai via emit
const localSelected = ref([...props.selected])

watch(localSelected, (val) => {
  emit('update:selected', val)
}, { deep: true })

const clearSelection = () => {
  localSelected.value = []
}

// Methods
const handleDeleteItem = (item) => {
  itemToDelete.value = item
  deleteDialog.value = true
  emit('delete-item', item)
}

const closeDeleteDialog = () => {
  deleteDialog.value = false
  itemToDelete.value = null
}

const confirmDelete = () => {
  emit('confirm-delete', itemToDelete.value)
  closeDeleteDialog()
}

const getItemDisplayValue = (item) => {
  if (!item || !props.deleteItemDisplayField) return ''
  return item[props.deleteItemDisplayField] || ''
}

const expandedModel = computed({
  get: () => props.expanded,
  set: (val) => emit('update:expanded', val),
})

// Expor métodos para o componente pai
defineExpose({
  openDeleteDialog: () => { deleteDialog.value = true },
  closeDeleteDialog,
  expanded,
  clearSelection
})
</script>

<style scoped>
/* Estilos personalizados podem ser adicionados aqui */
</style>