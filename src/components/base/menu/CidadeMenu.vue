<template>
  <busca-padrao-menu
      v-model="menu"
      :modelInput="termoPesquisa"
      :resultados="cidades"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarcidade"
  >
    <template #resultados="{ selecionar }">
      <div class="cidade-menu-scroll-container" style="height: 200px; overflow-y: auto;">
        <template v-if="cidades.length">
          <div
              v-for="item in cidades"
              :key="item.id"
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer transition-colors"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.desccidade + ' - ' + item.id_uf }}</p>
          </div>
        </template>
        <template v-else>
          <div class="px-3 py-4">
            <p class="text-sm opacity-50">Nenhum resultado encontrado</p>
          </div>
        </template>
      </div>
      <p class="text-sm opacity-70 px-3 py-2 font-italic">{{ cidadeStore.cidades.length }} itens encontrados</p>
    </template>
  </busca-padrao-menu>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import {ref, computed, defineEmits, watch} from "vue";
import { useLocalizacaoStore } from "@/stores/APIs/localizacao";

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");

const cidadeStore = useLocalizacaoStore();
const cidades = computed(() => cidadeStore.cidades);

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 2) {
    return;
  }
  await cidadeStore.buscarTodasCidades(pesquisa);
})

const selecionarcidade = (cidadeSelecionado) => {
  emit("selecionar", cidadeSelecionado);
  cidadeStore.cidade = cidadeSelecionado;
  console.log('SELECIONANDO UMA CIDADE: ', cidadeStore.cidade);
  menu.value = false;
};
</script>