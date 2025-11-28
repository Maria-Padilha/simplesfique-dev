<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modelInput="termoPesquisa"
      :modal-cadastrar="abrirModalCadastrar"
      :resultados="grupos"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionargrupo"
      :cadastrar-btn="true"
      :loading="estoqueStore.loading"
  >
    <template #resultados="{ selecionar }">
      <div class="grupos-menu-scroll-container" style="height: 200px; overflow-y: auto;">
        <template v-if="grupos.length">
          <div
              v-for="item in grupos"
              :key="item.id"
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer transition-colors w-[400px]"
              @click="selecionar(item)"
          >
            <p class="text-body-1 overflow-hidden text-ellipsis whitespace-nowrap text-capitalize">
              {{ item.descgrupo || 'Sem nome' }}
            </p>
          </div>
        </template>
        <template v-else>
          <div class="px-3 py-4">
            <p class="text-sm opacity-50">Nenhum resultado encontrado</p>
          </div>
        </template>
      </div>
      <p class="text-sm opacity-50 px-3 py-2">Exibindo {{ grupos?.length }} de {{ estoqueStore.recordsGrupo }}</p>
    </template>
  </busca-padrao-menu>

  <redirect-modal
      v-model:modal-redirect="modalRedirect"
      :cancelar="cancelarRedirect"
      :redirect="redirect"
      :loading-redirect="loadingRedirect"
  >
    <template #default>
      Você será redirecionado para a página de cadastro de Grupos de Estoque.
      As informações preenchidas no formulário atual serão perdidas. Deseja continuar?
    </template>
  </redirect-modal>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import {ref, computed, defineEmits, watch, watchEffect} from "vue";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import RedirectModal from "@/components/base/modais/RedirectModal.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");

const estoqueStore = useEstoqueStore();
const grupos = computed(() => estoqueStore.grupos);

watchEffect(() => {
  if (grupos.value.length === 0) {
    estoqueStore.buscarTodos("", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 3) {
    grupos.value = [];
    return;
  }
  console.log("Pesquisando grupo: ", pesquisa);
  await estoqueStore.buscarTodos(pesquisa, 0);
})

const selecionargrupo = (gruposelecionado) => {
  emit("selecionar", gruposelecionado);
  menu.value = false;
};

// MODAL REDIRECT
const abrirModalCadastrar = () => {
  modalRedirect.value = true;
};

const modalRedirect = ref(false);
const loadingRedirect = ref(false);

const redirect = async () => {
  loadingRedirect.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));

  router.push('/paginas/estoque/grupo');

  loadingRedirect.value = false;
  modalRedirect.value = false;
};

const cancelarRedirect = () => {
  modalRedirect.value = false;
};
</script>