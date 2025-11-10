<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="locaisCobranca"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarLocalCobranca"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="locaisCobranca"
          :height="80"
          item-height="42"
          class="mt-3"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.desclocalcobranca || item.descricao || 'Sem nome' }}</p>
          </div>
        </template>
      </v-virtual-scroll>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrarLocalCobranca"
  >
    <template #titulo>Local de Cobrança</template>
    <template #textfields>
      <v-card-text>
        <v-form class="d-flex flex-column gap-3 w-100">
          <v-text-field
              label="Descrição"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="desclocalcobranca"
          />
        </v-form>
      </v-card-text>
    </template>
   </CadastrarModal>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import CadastrarModal from "@/components/base/modais/CadastrarModal.vue";
import {ref, computed, defineEmits, watch, onMounted} from "vue";
import { useFinanceiroStore } from "@/stores/APIs/financeiro";
import { toast } from "vue3-toastify";

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");
const cadastrarModal = ref(false);

const desclocalcobranca = ref("");

const financeiroStore = useFinanceiroStore();
const locaisCobranca = computed(() => financeiroStore.locaisCobranca || []);

// Carregar dados quando o componente for montado
onMounted(async () => {
  await financeiroStore.buscarLocaisCobranca();
});

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 2) {
    return;
  }
  console.log("Pesquisando local cobrança: ", pesquisa);
  await financeiroStore.buscarLocaisCobranca();
})

const pesquisar = async () => {
  await financeiroStore.buscarLocaisCobranca();
};

const selecionarLocalCobranca = (localSelecionado) => {
  emit("selecionar", localSelecionado);
  menu.value = false;
};

const clearInput = () => {
  desclocalcobranca.value = "";
  cadastrarModal.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarLocalCobranca = async () => {
  if (!desclocalcobranca.value) {
    toast.error("A descrição é obrigatória!");
    return;
  }

  console.log("LOCAL COBRANÇA: ", {
    desclocalcobranca: desclocalcobranca.value
  });

  const payload = {
    desclocalcobranca: desclocalcobranca.value
  };

  await financeiroStore.criarLocalCobranca(payload);

  if (!financeiroStore.errorMessage) cadastrarModal.value = false;
};
</script>