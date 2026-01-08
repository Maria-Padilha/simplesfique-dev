<template>
  <busca-padrao-menu
      v-model="menu"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="almoxarifados"
      :loading="almoxStore.loading"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarAlmoxarifado"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <div class="almoxarifado-menu-scroll-container" style="height: 200px; overflow-y: auto;">
        <template v-if="almoxarifados.length">
          <div
              v-for="item in almoxarifados"
              :key="item.id"
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer transition-colors"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.descalmoxarifado || 'Sem nome' }}</p>
          </div>
        </template>
        <template v-else>
          <div class="px-3 py-4">
            <p class="text-sm opacity-50">Nenhum resultado encontrado</p>
          </div>
        </template>
      </div>
      <p class="text-sm opacity-50 px-3 py-2">Exibindo {{ almoxarifados?.length }} de {{ almoxStore.recordsAlmoxarifados }}</p>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrarAlmoxarifado"
  >
    <template #titulo>Almoxarifado</template>
    <template #textfields>

      <v-card-text>
        <v-form class="d-flex flex-column gap-3 w-100">
          <v-text-field
              label="Almoxarifado"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="almoxarifado"
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
import {useEstoqueStore} from "@/stores/APIs/estoque";
import { toast } from "vue3-toastify";

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");
const cadastrarModal = ref(false);

const almoxarifado = ref("");

const almoxStore = useEstoqueStore();
const almoxarifados = computed(() => almoxStore.almoxarifados);

// Obtém ID da empresa do localStorage
const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'))?.id;

watchEffect(() => {
  if (almoxarifados.value.length === 0 && idEmpresa) {
    almoxStore.buscarAlmoxarifados(idEmpresa, "", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.lenght < 2) {
    almoxarifados.value = [];
    return;
  }
  console.log("Pesquisando almoxarifado: ", pesquisa);
  if (idEmpresa) {
    await almoxStore.buscarAlmoxarifados(idEmpresa, pesquisa);
  }
})

const selecionarAlmoxarifado = (almoxarifadoSelecionado) => {
  emit("selecionar", almoxarifadoSelecionado);
  menu.value = false;
};

const clearInput = () => {
  almoxarifado.value = "";
  cadastrarModal.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarAlmoxarifado = async () => {
  if (!almoxarifado.value) {
    toast.error("O almoxarifado é obrigatório!");
    return;
  }

  if (!idEmpresa) {
    toast.error("Empresa não selecionada!");
    return;
  }

  await almoxStore.cadastrarAlmoxarifado(idEmpresa, {
    data: [
      {
        descalmox: almoxarifado.value
      }
    ]
  })

  if (!almoxStore.errorMessage) {
    clearInput();
  }
};
</script>

