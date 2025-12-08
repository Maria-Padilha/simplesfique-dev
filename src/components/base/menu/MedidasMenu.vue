<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modelInput="termoPesquisa"
      :resultados="medidas"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarmedida"
      :cadastrar-btn="false"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="medidas"
          :height="80"
          item-height="45"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer w-[400px]"
              @click="selecionar(item)"
          >
            <p class="text-body-1 overflow-hidden text-ellipsis whitespace-nowrap text-capitalize">
              {{ item.abreviatura + ' - ' + item.descmedida }}
            </p>
          </div>
        </template>
      </v-virtual-scroll>
      <p class="text-sm opacity-50">Exibindo {{ medidas?.length }} de {{ estoqueStore.recordsMedidas }}</p>
    </template>
  </busca-padrao-menu>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import {ref, computed, defineEmits, watch, watchEffect} from "vue";
import {useProdutosStore} from "@/stores/APIs/produtos";

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");

const estoqueStore = useProdutosStore();
const medidas = computed(() => estoqueStore.medidas);

watchEffect(() => {
  if (medidas.value.length === 0) {
    estoqueStore.buscarMedidas("", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 3) {
    medidas.value = [];
    return;
  }
  console.log("Pesquisando medida: ", pesquisa);
  await estoqueStore.buscarMedidas(pesquisa, 0);
})

const selecionarmedida = (medidaselecionado) => {
  emit("selecionar", medidaselecionado);
  menu.value = false;
};
</script>