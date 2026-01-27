<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Entrada de DFe</template>
    <template #section>
      <v-card elevation="0" class="background-secondary pa-4">
        <div class="flex justify-end">
          <v-btn
              color="var(--text-color-laranja)"
              to="entradadfe/nova"
              :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
              variant="flat"
              size="small"
              class="mb-3 ml-3 text-white"
          >
            Nova Entrada
          </v-btn>
        </div>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="entradaDfe"
            :loading="loading"
            :search="search"
            @update:search="(value) => search = value"
            search-label="Pesquisar Items"
            item-key="id"
            no-data-icon="mdi-database-off"
            no-data-text="Nenhum item encontrado"

        >
          <template v-slot:[`item.acoes`]='{ item }'>
            <v-btn
                icon="mdi-eye-off-outline" size="small"
                color="primary" variant="text"
                :to="`/paginas/entradadfe/visualizar/${item.id}`"
            />

            <v-btn
                icon="mdi-delete-outline" size="small"
                color="red" variant="text"
                @click="modalDelete(item)"
            />
          </template>
        </tabela-padrao>
      </v-card>

      <excluir-modal
          :cancelar="cancelarModal"
          :deletar="deletarEntrada"
          :loading="produtosStore.loading"
          v-model:modal-excluir="abrirModal"
      >
        <template #item>Item ID {{itemSelecionado.id}}</template>
      </excluir-modal>
    </template>
  </top-all-pages>

</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {usePessoasStore} from "@/stores/APIs/pessoas";
import {useLocalizacaoStore} from "@/stores/APIs/localizacao";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";

const localizacaoStore = useLocalizacaoStore();
const produtosStore = useProdutosStore();
const pessoasStore = usePessoasStore();

const entradaDfe = computed(() => produtosStore.entradadfe);
const loading = computed(() => produtosStore.loading);
const pessoas = computed(() => pessoasStore.pessoas);
const ufs = computed(() => localizacaoStore.ufs);
const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));

const formularioAberto = ref(false);
const search = ref("");
const itemSelecionado = ref({});

const headers = ref([
  {title: 'ID', key: 'id'},
  {title: 'Fornecedor', key: 'nome_razao'},
  {title: 'C.F.O.P', key: 'id_cfop'},
  {title: 'Nota', key: 'id_nota'},
  {title: 'Série', key: 'id_serie'},
  {title: 'Importação XML', key: 'importacaoxml'},
  {title: 'Valor NF', key: 'vlr_nf'},
  {title: 'Ações', key: 'acoes', sortable: false},
]);

/**
 * DELETANDO ENTRADA
 */

const abrirModal = ref(false);

const modalDelete = (item) => {
  itemSelecionado.value = item;
  abrirModal.value = true;
};

const cancelarModal = () => {
  abrirModal.value = false;
  itemSelecionado.value = {};
};

const deletarEntrada = async () => {
  await produtosStore.deletarEntradaDfe(idEmpresa?.id ?? 1, itemSelecionado.value.id);
  abrirModal.value = false;
  itemSelecionado.value = {};
};

onMounted(() => {
  if (entradaDfe.value.length === 0)
    produtosStore.buscarEntradasDfe(idEmpresa?.id ?? 1);

  if (pessoas.value.length === 0 && formularioAberto.value)
    pessoasStore.buscarTodasPessoas();

  if (ufs.value.length === 0 && formularioAberto.value)
    localizacaoStore.buscarTodasUfs();
});
</script>