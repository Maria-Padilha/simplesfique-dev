<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modelInput="termoPesquisa"
      :resultados="ncms"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarNcm"
      :cadastrar-btn="false"
      :loading="estoqueStore.loading"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="ncms"
          :height="80"
          item-height="45"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer w-[400px]"
              @click="selecionar(item)"
          >
            <p class="text-body-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {{ item.id + ' - ' + item.desc_ncm || 'Sem nome' }}
            </p>
          </div>
        </template>
      </v-virtual-scroll>
      <p class="text-sm opacity-50">Exibindo {{ ncms?.length }} de {{ estoqueStore.recordsNcm }}</p>
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
const ncms = computed(() => estoqueStore.ncms);

watchEffect(() => {
  if (ncms.value.length === 0) {
    estoqueStore.buscarNcms("", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 3) {
    ncms.value = [];
    return;
  }
  console.log("Pesquisando Ncm: ", pesquisa);
  await estoqueStore.buscarNcms(pesquisa, 0);
})

const selecionarNcm = (NcmSelecionado) => {
  emit("selecionar", NcmSelecionado);
  estoqueStore.ncms = [];
  menu.value = false;
};
</script>