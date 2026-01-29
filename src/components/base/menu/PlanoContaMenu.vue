<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="planosConta"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarPlanoConta"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="planosConta"
          :height="80"
          item-height="42"
          class="mt-3"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.descconta || item.descricao || 'Sem nome' }}</p>
            <p v-if="item.codigoplanoconta" class="text-body-2 text-medium-emphasis">{{ item.codigoplanoconta }}</p>
          </div>
        </template>
      </v-virtual-scroll>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrarPlanoConta"
  >
    <template #titulo>Plano de Conta</template>
    <template #textfields>
      <v-card-text>
        <v-form class="d-flex flex-column gap-3 w-100">
          <v-text-field
              label="Descrição do Plano de Conta"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="descricaoPlanoConta"
          />
          <v-text-field
              label="Código"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="codigoPlanoConta"
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

const descricaoPlanoConta = ref("");
const codigoPlanoConta = ref("");

const financeiroStore = useFinanceiroStore();
const planosConta = computed(() => financeiroStore.planosConta || []);

// Carregar dados na montagem do componente
onMounted(async () => {
  await financeiroStore.buscarPlanosConta();
});

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 2) {
    return;
  }
  console.log("Pesquisando plano de conta: ", pesquisa);
  await financeiroStore.buscarPlanosConta(pesquisa);
})

const pesquisar = async () => {
  if (!termoPesquisa.value || termoPesquisa.value.length < 2) {
    return;
  }
  await financeiroStore.buscarPlanosConta(termoPesquisa.value);
};

const selecionarPlanoConta = (planoSelecionado) => {
  emit("selecionar", planoSelecionado);
  menu.value = false;
};

const clearInput = () => {
  descricaoPlanoConta.value = "";
  codigoPlanoConta.value = "";
  cadastrarModal.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarPlanoConta = async () => {
  if (!descricaoPlanoConta.value) {
    toast.error("A descrição do plano de conta é obrigatória!");
    return;
  }

  console.log("PLANO DE CONTA: ", {
    descricao: descricaoPlanoConta.value,
    codigo: codigoPlanoConta.value
  });

  try {
    const payload = {
      descricao: descricaoPlanoConta.value,
      codigo: codigoPlanoConta.value
    };
    
    await financeiroStore.criarPlanoConta(payload);
    
    if (!financeiroStore.errorMessage) {
      cadastrarModal.value = false;
      // Recarregar a lista
      await financeiroStore.buscarPlanosConta();
    }
  } catch (error) {
    console.error("Erro ao cadastrar plano de conta:", error);
    toast.error("Erro ao cadastrar plano de conta");
  }
};
</script>