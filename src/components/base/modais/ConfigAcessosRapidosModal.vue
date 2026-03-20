<template>
  <v-dialog v-model="show" max-width="900px" persistent>
    <v-card class="background-secondary">
      <v-card-title class="text-h5 pa-4 d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-lightning-bolt" class="mr-3 texto-color-laranja"></v-icon>
          <span>Configurar Acessos Rápidos</span>
        </div>
        <v-btn icon="mdi-close" variant="text" @click="fechar"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <div class="mb-4">
          <p class="text-body-2 opacity-70 mb-2">
            Selecione as telas que você deseja ter acesso rápido na barra superior.
            Você pode adicionar até 10 itens.
          </p>
        </div>

        <!-- Acessos Rápidos Selecionados -->
        <div class="mb-6">
          <div class="d-flex justify-space-between align-center mb-3">
            <h3 class="text-h6">Seus Acessos Rápidos ({{ acessosRapidosStore.acessosRapidos.length }}/10)</h3>
            <v-btn
              color="grey"
              variant="text"
              size="small"
              @click="resetarParaPadrao"
            >
              <v-icon icon="mdi-restore" class="mr-1"></v-icon>
              Restaurar Padrão
            </v-btn>
          </div>

          <v-card class="background-card pa-3" elevation="1">
            <div v-if="acessosRapidosStore.acessosRapidos.length === 0" class="text-center py-8 opacity-50">
              <v-icon icon="mdi-information-outline" size="48"></v-icon>
              <p class="mt-2">Nenhum acesso rápido selecionado</p>
            </div>
            <div v-else class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="acesso in acessosRapidosStore.acessosRapidos"
                :key="acesso.id"
                closable
                @click:close="removerAcesso(acesso.id)"
                color="var(--text-color-laranja)"
                variant="flat"
                class="text-white"
              >
                <v-icon :icon="acesso.icon" size="18" class="mr-1"></v-icon>
                {{ acesso.titulo }}
              </v-chip>
            </div>
          </v-card>
        </div>

        <!-- Busca -->
        <v-text-field
          v-model="busca"
          variant="outlined"
          density="compact"
          placeholder="Buscar tela..."
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mb-4"
        ></v-text-field>

        <!-- Telas Disponíveis por Categoria -->
        <div>
          <h3 class="text-h6 mb-3">Telas Disponíveis</h3>
          
          <v-expansion-panels v-model="painelAberto" multiple>
            <v-expansion-panel
              v-for="(telas, categoria) in telasAgrupadasPorCategoria"
              :key="categoria"
              class="background-card mb-2"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center">
                  <v-icon :icon="getIconeCategoria(categoria)" class="mr-2"></v-icon>
                  <span class="font-weight-medium">{{ categoria }}</span>
                  <v-chip size="x-small" class="ml-2" color="grey" variant="flat">
                    {{ telas.length }}
                  </v-chip>
                </div>
              </v-expansion-panel-title>
              
              <v-expansion-panel-text>
                <div class="d-flex flex-wrap gap-2 pt-2">
                  <v-btn
                    v-for="tela in telas"
                    :key="tela.id"
                    :variant="isAcessoRapido(tela.id) ? 'flat' : 'outlined'"
                    :color="isAcessoRapido(tela.id) ? 'var(--text-color-laranja)' : 'grey'"
                    size="small"
                    @click="toggleAcesso(tela)"
                    :disabled="!isAcessoRapido(tela.id) && acessosRapidosStore.acessosRapidos.length >= 10"
                  >
                    <v-icon :icon="tela.icon" size="18" class="mr-1"></v-icon>
                    {{ tela.titulo }}
                    <v-icon
                      v-if="isAcessoRapido(tela.id)"
                      icon="mdi-check-circle"
                      size="16"
                      class="ml-1"
                    ></v-icon>
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="fechar">
          Cancelar
        </v-btn>
        <v-btn
          color="var(--text-color-laranja)"
          variant="flat"
          class="text-white"
          @click="salvar"
        >
          <v-icon icon="mdi-check" class="mr-1"></v-icon>
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAcessosRapidosStore } from '@/stores/acessos-rapidos'
import { toast } from 'vue3-toastify'

// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue'])

const acessosRapidosStore = useAcessosRapidosStore()

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const busca = ref('')
const painelAberto = ref([0, 1, 2, 3, 4]) // Todos os painéis abertos por padrão

// Filtrar e agrupar telas por categoria
const telasAgrupadasPorCategoria = computed(() => {
  let telas = acessosRapidosStore.telasDisponiveis

  // Aplicar filtro de busca
  if (busca.value) {
    const buscaLower = busca.value.toLowerCase()
    telas = telas.filter(tela => 
      tela.titulo.toLowerCase().includes(buscaLower) ||
      tela.categoria.toLowerCase().includes(buscaLower)
    )
  }

  // Agrupar por categoria
  return telas.reduce((acc, tela) => {
    if (!acc[tela.categoria]) {
      acc[tela.categoria] = []
    }
    acc[tela.categoria].push(tela)
    return acc
  }, {})
})

// Verificar se tela está nos acessos rápidos
const isAcessoRapido = (telaId) => {
  return acessosRapidosStore.isAcessoRapido(telaId)
}

// Adicionar ou remover acesso rápido
const toggleAcesso = (tela) => {
  if (isAcessoRapido(tela.id)) {
    removerAcesso(tela.id)
  } else {
    if (acessosRapidosStore.acessosRapidos.length >= 10) {
      toast.warning('Você pode adicionar no máximo 10 acessos rápidos')
      return
    }
    acessosRapidosStore.adicionarAcesso(tela)
  }
}

// Remover acesso rápido
const removerAcesso = (telaId) => {
  acessosRapidosStore.removerAcesso(telaId)
}

// Resetar para padrão
const resetarParaPadrao = () => {
  acessosRapidosStore.resetarParaPadrao()
  toast.success('Acessos rápidos restaurados para o padrão')
}

// Obter ícone da categoria
const getIconeCategoria = (categoria) => {
  const icones = {
    'Geral': 'mdi-home-circle',
    'Financeiro': 'mdi-cash-multiple',
    'Pessoas': 'mdi-account-group',
    'Produtos': 'mdi-package-variant',
    'Estoque': 'mdi-warehouse',
    'Relatórios': 'mdi-chart-bar'
  }
  return icones[categoria] || 'mdi-folder'
}

// Fechar modal
const fechar = () => {
  show.value = false
}

// Salvar configurações
const salvar = () => {
  toast.success('Acessos rápidos salvos com sucesso!')
  fechar()
}

// Resetar busca ao abrir modal
watch(show, (newValue) => {
  if (newValue) {
    busca.value = ''
  }
})
</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.background-card {
  background-color: var(--bg-color-primary);
}

.texto-color-laranja {
  color: var(--text-color-laranja);
}

.gap-2 {
  gap: 8px;
}
</style>
