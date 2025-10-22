<template>
  <busca-padrao-menu
      v-model:menu="menu"
      v-model:overlay="overlay"
      :pesquisar="pesquisar"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="bairros"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarBairro"
  >
    <template #resultados="{ selecionar }">
      <div
          v-for="bairro in bairros"
          :key="bairro.ID"
          class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
          @click="selecionar(bairro)"
      >
        <p class="text-body-1">{{ bairro.DESCBAIRRO }}</p>
      </div>
    </template>
  </busca-padrao-menu>

  <!-- Modal de cadastro (abre quando não há resultado ou botão + é clicado) -->
  <v-dialog v-model="cadastrarModal" max-width="400">
    <v-card color="var(--bg-card)" class="texto-color-primary">
      <v-card-title class="background-laranja d-flex align-center">
        <p>Cadastrar Bairro</p>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="cadastrarModal = false" />
      </v-card-title>

      <v-card-text>
        <v-form class="d-flex flex-column gap-3">
          <v-text-field
              label="Bairro"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="bairro"
          />

          <v-btn
              color="var(--text-color-laranja)"
              class="w-100 text-none"
              variant="tonal"
              density="comfortable"
              @click="cadastrarBairro"
          >
            Cadastrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import {ref, computed, watchEffect, defineEmits} from "vue";
import {useLocalizacaoStore} from "@/stores/APIs/localizacao";
import {toast} from "vue3-toastify";

const emit = defineEmits(["selecionar"]);

// ====== Estados base ======
const menu = ref(false);
const overlay = ref(false);
const termoPesquisa = ref("");
const cadastrarModal = ref(false);
const bairro = ref("");

// ====== Store ======
const bairroStore = useLocalizacaoStore();
const bairros = computed(() => bairroStore.bairros);

// ====== Buscar e cadastrar ======
const limit = ref(50);
const offsetAtual = ref(0);

const pesquisar = async () => {
  await bairroStore.buscarTodosBairros(limit.value, offsetAtual.value, true);
};

// ====== Seleção ======
const selecionarBairro = (bairroSelecionado) => {
  emit("selecionar", bairroSelecionado);
  menu.value = false;
  overlay.value = false;
};

// ====== Modal cadastrar ======
const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarBairro = async () => {
  if (!bairro.value) {
    toast.error("O Bairro é obrigatório!");
    return;
  }

  // await bairroStore.cadastrarBairro({
  //   data: [{descbairro: bairro.value}],
  // });

  if (!bairroStore.errorMessage) {
    toast.success("Bairro cadastrado com sucesso!");
    bairro.value = "";
    cadastrarModal.value = false;
    await pesquisar();
  } else {
    toast.error(bairroStore.errorMessage);
  }
};

// ====== Carregar inicialmente ======
watchEffect(async () => {
  if (!bairros.value.length) {
    await pesquisar();
  }
});
</script>