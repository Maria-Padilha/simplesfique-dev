<template>
  <busca-padrao-menu
      v-model="menu"
      :modelInput="termoPesquisa"
      :resultados="cfops"
      :loading="estoqueStore.loading"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarCfop"
      :cadastrar-btn="false"
  >
    <template #resultados="{ selecionar }">
      <div class="cfop-menu-scroll-container" style="height: 200px; overflow-y: auto;">
        <template v-if="cfops.length">
          <div
              v-for="item in cfops"
              :key="item.id"
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer transition-colors w-[400px]"
              @click="selecionar(item)"
          >
            <p class="text-body-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {{ item.id_cfop || 'Sem código' }} - {{ item.descricao || 'Sem descrição' }}
            </p>
          </div>
        </template>
        <template v-else>
          <div class="px-3 py-4">
            <p class="text-sm opacity-50">Nenhum resultado encontrado</p>
          </div>
        </template>
      </div>
      <p class="text-sm opacity-50 px-3 py-2">Exibindo {{ cfops?.length }} de {{ estoqueStore.recordsCfop }}</p>
    </template>
  </busca-padrao-menu>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import {ref, computed, defineEmits, watch, watchEffect} from "vue";
import {useEstoqueStore} from "@/stores/APIs/estoque";

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");

const estoqueStore = useEstoqueStore();
const cfops = computed(() => estoqueStore.cfops);

watchEffect(() => {
  estoqueStore.buscarCfops("", 15);
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 2) {
    return;
  }
  await estoqueStore.buscarCfops(pesquisa, 15);
})

const selecionarCfop = (cfopSelecionado) => {
  emit("selecionar", cfopSelecionado);
  menu.value = false;
};
</script>

