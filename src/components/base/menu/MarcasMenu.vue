<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="marcas"
      :loading="marcaStore.loading"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarmarca"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <div class="marcas-menu-scroll-container" style="height: 200px; overflow-y: auto;">
        <template v-if="marcas.length">
          <div
              v-for="item in marcas"
              :key="item.id"
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer transition-colors"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.descmarca || 'Sem nome' }}</p>
          </div>
        </template>
        <template v-else>
          <div class="px-3 py-4">
            <p class="text-sm opacity-50">Nenhum resultado encontrado</p>
          </div>
        </template>
      </div>
      <p class="text-sm opacity-50 px-3 py-2">Exibindo {{ marcas?.length }} de {{ marcaStore.recordsMarcas }}</p>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrarmarca"
  >
    <template #titulo>Marca</template>
    <template #textfields>

      <v-card-text>
        <v-form class="d-flex flex-column gap-3 w-100">
          <v-text-field
              label="marca"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="marca"
          />
        </v-form>
      </v-card-text>
    </template>
   </CadastrarModal>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import CadastrarModal from "@/components/base/modais/CadastrarModal.vue";
import {ref, computed, defineEmits, watch, watchEffect} from "vue";
import {useProdutosStore} from "@/stores/APIs/produtos";
import { toast } from "vue3-toastify";

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");
const cadastrarModal = ref(false);

const marca = ref("");

const marcaStore = useProdutosStore();
const marcas = computed(() => marcaStore.marcas);

watchEffect(() => {
  if (marcas.value.length === 0) {
    marcaStore.buscarMarcas("", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.lenght < 2) {
    marcas.value = [];
    return;
  }
  console.log("Pesquisando marca: ", pesquisa);
  await marcaStore.buscarMarcas(pesquisa);
})

const selecionarmarca = (marcaSelecionado) => {
  emit("selecionar", marcaSelecionado);
  menu.value = false;
};

const clearInput = () => {
  marca.value = "";
  cadastrarModal.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarmarca = async () => {
  if (!marca.value) {
    toast.error("O marca é obrigatório!");
    return;
  }

  await marcaStore.cadastrarMarca({
    data: [
      {
        descmarca: marca.value
      }
    ]
  })

  if (!marcaStore.errorMessage) cadastrarModal.value = false;
};
</script>