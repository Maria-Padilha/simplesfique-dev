<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="tiposDocumento"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarTipoDocumento"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="tiposDocumento"
          :height="80"
          item-height="42"
          class="mt-3"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.desctipodocumento || item.descricao || 'Sem nome' }}</p>
          </div>
        </template>
      </v-virtual-scroll>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrarTipoDocumento"
  >
    <template #titulo>Tipo de Documento</template>
    <template #textfields>
      <v-card-text>
        <v-form class="d-flex flex-column gap-3 w-100">
          <v-text-field
              label="Descrição"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="descricao"
          />
          <v-text-field
              label="Abreviatura"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="abreviatura"
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

const descricao = ref("");
const abreviatura = ref("");

const financeiroStore = useFinanceiroStore();
const tiposDocumento = computed(() => financeiroStore.tiposDocumento || []);

// Carregar dados quando o componente for montado
onMounted(async () => {
  await financeiroStore.buscarTiposDocumento();
});

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 2) {
    return;
  }
  console.log("Pesquisando tipo documento: ", pesquisa);
  await financeiroStore.buscarTiposDocumento();
})

const pesquisar = async () => {
  await financeiroStore.buscarTiposDocumento();
};

const selecionarTipoDocumento = (tipoSelecionado) => {
  emit("selecionar", tipoSelecionado);
  menu.value = false;
};

const clearInput = () => {
  descricao.value = "";
  abreviatura.value = "";
  cadastrarModal.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarTipoDocumento = async () => {
  if (!descricao.value) {
    toast.error("A descrição é obrigatória!");
    return;
  }

  console.log("TIPO DOCUMENTO: ", {
    descricao: descricao.value,
    abreviatura: abreviatura.value
  });

  const payload = {
    descricao: descricao.value,
    abreviatura: abreviatura.value
  };

  await financeiroStore.criarTipoDocumento(payload);

  if (!financeiroStore.errorMessage) cadastrarModal.value = false;
};
</script>