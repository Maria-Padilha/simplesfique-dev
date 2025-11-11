<template>
  <busca-padrao-menu
      v-model="menu"
      :modelInput="termoPesquisa"
      :resultados="cidades"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarcidade"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="cidades"
          :height="80"
          item-height="42"
          class="mt-3"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.desccidade + ' - ' + item.id_uf }}</p>
          </div>
        </template>
      </v-virtual-scroll>
      <p class="text-sm opacity-70 mt-3 font-italic">{{ cidadeStore.cidades.length }} itens encontrados</p>
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
  if (!pesquisa || pesquisa.lenght < 2) {
    cidades.value = [];
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