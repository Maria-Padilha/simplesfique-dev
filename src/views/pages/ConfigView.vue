<template>
  <top-all-pages icon="mdi-cog-outline">
    <template #titulo>Configurações</template>
    <template #section>
      <!-- CONTAINER PRINCIPAL COM LAYOUT SIDEBAR + CONTENT -->
      <div class="flex gap-6 h-screen">

        <!-- SIDEBAR ESQUERDA - MENU DE SEÇÕES -->
        <div class="w-72 background-card rounded-lg p-6 h-fit">


          <!-- SCROLL DO MENU -->
          <div class="">
            <!-- LISTA DE SEÇÕES -->
            <div
                v-for="secao in configStore.getSecoesConfig()"
                :key="secao.id"
                @click="configStore.ativarSecao(secao.id)"
                :class="[
                  'flex items-center gap-3 px-4 py-3 mb-3 rounded-lg cursor-pointer transition-all duration-200',
                  configStore.getSecaoAtiva() === secao.id
                    ? 'background-sidebar text-white shadow-md'
                    : 'hover:opacity-100 opacity-70 hover:bg-opacity-50'
                ]"
            >
              <v-icon :icon="secao.icon" size="22"></v-icon>
              <span class="text-sm font-medium truncate">{{ secao.titulo }}</span>
            </div>
          </div>
        </div>

        <!-- PAINEL DIREITO - CONTEÚDO DINÂMICO -->
        <div class="flex-1">
          <v-card elevation="0" class="background-card rounded-lg overflow-y-auto" style="max-height: calc(100vh - 150px); padding: 32px;">
            <!-- RENDERIZAR COMPONENTE DINAMICAMENTE -->
            <component
                :is="obterComponente(configStore.getSecaoAtivaObj()?.componente)"
                :key="configStore.getSecaoAtiva()"
            />
          </v-card>
        </div>

      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import { useConfigStore } from "@/stores/config";

// Inicializar o store de configurações
const configStore = useConfigStore();

/**
 * Função para carregar componentes dinamicamente
 * Recebe o nome do componente e retorna o componente carregado
 *
 * @param {string} nomeComponente - Nome do componente (ex: 'ConfigGeral')
 * @returns {object} Componente Vue carregado
 */
const obterComponente = (nomeComponente) => {
  if (!nomeComponente) return null;

  // Importar dinamicamente o componente baseado no nome
  return defineAsyncComponent(() =>
    import(`@/components/base/config/${nomeComponente}.vue`)
  );
};
</script>

<style scoped>
/* Cores de fundo dinâmicas */
.background-card {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.background-sidebar {
  background: var(--bg-navbar);
  color: white;
}
</style>
