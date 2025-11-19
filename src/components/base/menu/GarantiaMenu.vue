<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="garantias"
      :loading="loading"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionargarantia"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="garantias"
          :height="80"
          item-height="42"
          class="mt-3"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ tipoGarantia[item.tipo] + ' - ' + item.descgarantia || 'Sem nome' }}</p>
          </div>
        </template>
      </v-virtual-scroll>
      <p class="text-sm opacity-50">Exibindo {{ garantias?.length }} de {{ garantiaStore.recordsGarantias }}</p>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrargarantia"
  >
    <template #titulo>garantia</template>
    <template #textfields>

      <v-card-text>
        <v-form class="d-flex flex-column gap-3 w-100">
          <v-text-field
              label="garantia"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="garantia"
          />

          <div class="flex items-center gap-3">
            <v-select
                label="Tipo"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="w-[50%]"
                v-model="tipo"
                :items="garantiaStore.tiposGarantias"
                item-value="value"
                item-title="title"
            />
            <v-text-field
                label="Quantidade"
                type="number"
                min="0"
                class="w-[50%]"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                v-model="quantidade"
            />
          </div>
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

const garantia = ref("");
const tipo = ref(null);
const quantidade = ref(0);

const garantiaStore = useProdutosStore();
const garantias = computed(() => garantiaStore.garantias);
const tipoGarantia = computed(() => garantiaStore.tiposGarantiasObj);
const loading = computed(() => garantiaStore.loading)

watchEffect(() => {
  if (garantias.value.length === 0) {
    garantiaStore.buscarGarantias("", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.lenght < 2) {
    garantias.value = [];
    return;
  }
  console.log("Pesquisando garantia: ", pesquisa);
  await garantiaStore.buscarGarantias(pesquisa);
})

const selecionargarantia = (garantiaSelecionado) => {
  emit("selecionar", garantiaSelecionado);
  menu.value = false;
};

const clearInput = () => {
  garantia.value = "";
  tipo.value = "";
  quantidade.value = "";
  cadastrarModal.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrargarantia = async () => {
  if (!garantia.value) {
    toast.error("O garantia é obrigatório!");
    return;
  }

  await garantiaStore.cadastrarGarantia({
    data: [
      {
        descgarantia: garantia.value,
        tipo: tipo.value,
        quantidade: quantidade.value
      }
    ]
  })

  if (!garantiaStore.errorMessage) cadastrarModal.value = false;
};
</script>