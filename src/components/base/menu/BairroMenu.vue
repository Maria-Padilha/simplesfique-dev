<template>
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="pesquisar"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="bairros"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarBairro"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <v-virtual-scroll
          :items="bairros"
          :height="80"
          item-height="42"
          class="mt-3"
      >
        <template #default="{ item }">
          <div
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer"
              @click="selecionar(item)"
          >
            <p class="text-body-1">{{ item.DESCBAIRRO || item.nome || 'Sem nome' }}</p>
          </div>
        </template>
      </v-virtual-scroll>
    </template>
  </busca-padrao-menu>

   <CadastrarModal
      :cadastrarModal="cadastrarModal"
      :clearInput="clearInput"
      :cadastrarcidade="cadastrarBairro"
  >
    <template #titulo>Cidade</template>
    <template #textfields>

      <v-card-text>
        <v-form class="d-flex flex-column gap-3">
          <v-text-field
              label="Bairro"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="bairro"
          />
          <v-text-field
              label="Cidade"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              v-model="id_cidade"
          />
        </v-form>
      </v-card-text>
    </template>
   </CadastrarModal>
</template>

<script setup>
import BuscaPadraoMenu from "@/components/base/menu/BuscaPadraoMenu.vue";
import {ref, computed, defineEmits, watch} from "vue";
import { useLocalizacaoStore } from "@/stores/APIs/localizacao";
import { toast } from "vue3-toastify";

const emit = defineEmits(["selecionar"]);

const menu = ref(false);
const termoPesquisa = ref("");
const cadastrarModal = ref(false);
const bairro = ref("");
const id_cidade = ref("");

const bairroStore = useLocalizacaoStore();
const bairros = computed(() => bairroStore.bairros);

watch( () => termoPesquisa.value, async (pesquisa) => {
  if (!pesquisa || pesquisa.lenght < 2) {
    bairros.value = [];
    return;
  }
  await bairroStore.buscarTodosBairros(pesquisa);
})

const selecionarBairro = (bairroSelecionado) => {
  emit("selecionar", bairroSelecionado);
  bairroStore.bairros = [];
  menu.value = false;
};

const abrirModalCadastrar = () => {
  cadastrarModal.value = true;
};

const cadastrarBairro = async () => {
  if (!bairro.value) {
    toast.error("O Bairro é obrigatório!");
    return;
  }

  await bairroStore.cadastrarBairro({
    data: [{ descbairro: bairro.value, id_cidade: id_cidade.value }]
  });
  toast.success("Bairro cadastrado com sucesso!");

  bairro.value = "";
  id_cidade.value = "";
  cadastrarModal.value = false;
};
</script>
<script setup lang="ts">
</script>