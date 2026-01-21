<template>
  <busca-padrao-menu
      v-model="menu"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="cfops"
      :loading="estoqueStore.loading"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarCfop"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <div class="cfop-menu-scroll-container" style="height: 200px; overflow-y: auto;">
        <template v-if="cfops.length">
          <div
              v-for="item in cfops"
              :key="item.id"
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer transition-colors w-[400px]"
              @click="selecionar(item)"
          >
            <p class="text-body-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {{ item.id_cfop || 'Sem código' }} - {{ item.descricao || 'Sem descrição' }}
            </p>
          </div>
        </template>
        <template v-else>
          <div class="px-3 py-4">
            <p class="text-sm opacity-50">Nenhum resultado encontrado</p>
          </div>
        </template>
      </div>
      <p class="text-sm opacity-50 px-3 py-2">Exibindo {{ cfops?.length }} de {{ estoqueStore.recordsCfop }}</p>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrarCfop"
  >
    <template #titulo>CFOP</template>
    <template #textfields>

      <v-card-text>
        <v-form class="d-flex flex-column gap-3 w-100">
          <v-text-field
              label="Código"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="cfopCodigo"
          />
          <v-text-field
              label="Descrição"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="cfopDescricao"
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

const cfopCodigo = ref("");
const cfopDescricao = ref("");

const estoqueStore = useEstoqueStore();
const cfops = computed(() => estoqueStore.cfops);

watchEffect(() => {
  if (cfops.value.length === 0) {
    estoqueStore.buscarCfops("", 15);
  }
})

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 2) {
    cfops.value = [];
    return;
  }
  console.log("Pesquisando CFOP: ", pesquisa);
  await estoqueStore.buscarCfops(pesquisa);
})

const selecionarCfop = (cfopSelecionado) => {
  emit("selecionar", cfopSelecionado);
  menu.value = false;
};

const clearInput = () => {
  cfopCodigo.value = "";
  cfopDescricao.value = "";
  cadastrarModal.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarCfop = async () => {
  if (!cfopCodigo.value || !cfopDescricao.value) {
    toast.error("Código e descrição são obrigatórios!");
    return;
  }

  await estoqueStore.cadastrarCfop({
    data: [
      {
        codigo: cfopCodigo.value,
        descricao: cfopDescricao.value
      }
    ]
  })

  if (!estoqueStore.errorMessage) {
    clearInput();
  }
};
</script>

