<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modelInput="termoPesquisa"
      :modal-cadastrar="abrirModalCadastrar"
      :resultados="classes"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarclasse"
      :cadastrar-btn="true"
      :loading="estoqueStore.loading"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="classes"
          :height="80"
          item-height="45"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer w-[400px]"
              @click="selecionar(item)"
          >
            <p class="text-body-1 overflow-hidden text-ellipsis whitespace-nowrap text-capitalize">
              {{ item.descclasse || 'Sem nome' }}
            </p>
          </div>
        </template>
      </v-virtual-scroll>
      <p class="text-sm opacity-50">Exibindo {{ classes?.length }} de {{ estoqueStore.recordsClasse }}</p>
    </template>
  </busca-padrao-menu>

  <redirect-modal
      v-model:modal-redirect="modalRedirect"
      :cancelar="cancelarRedirect"
      :redirect="redirect"
      :loading-redirect="loadingRedirect"
  >
    <template #default>
      Você será redirecionado para a página de cadastro de classes de Estoque.
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
const classes = computed(() => estoqueStore.classes);

watchEffect(() => {
  if (classes.value.length === 0) {
    estoqueStore.buscarTodasClasses("", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 3) {
    classes.value = [];
    return;
  }
  console.log("Pesquisando classe: ", pesquisa);
  await estoqueStore.buscarTodasClasses(pesquisa, 0);
})

const selecionarclasse = (classeselecionado) => {
  emit("selecionar", classeselecionado);
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

  router.push('/paginas/estoque/classe');

  loadingRedirect.value = false;
  modalRedirect.value = false;
};

const cancelarRedirect = () => {
  modalRedirect.value = false;
};
</script>