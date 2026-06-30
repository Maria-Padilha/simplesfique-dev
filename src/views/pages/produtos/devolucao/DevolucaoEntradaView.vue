<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Devolução de Compra</template>

    <template #section>
      <v-card elevation="0" class="background-secondary pa-4">
        <div class="flex justify-end">
          <v-btn
              color="var(--text-color-laranja)"
              to="deventrada/nova"
              :prepend-icon="formularioAberto ? 'mdi-minus' : 'mdi-plus'"
              variant="flat"
              size="small"
              class="mb-3 ml-3 text-white"
          >
            Nova Devolução
          </v-btn>
        </div>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="devolucaoEntrada"
            :loading="loading"
            :search="search"
            @update:search="(value) => (search = value)"
            search-label="Pesquisar Devoluções"
            item-key="id"
            no-data-icon="mdi-database-off"
            no-data-text="Nenhuma devolução encontrada"
        >
          <template v-slot:[`item.acoes`]="{ item }">
            <v-btn
                icon="mdi-eye-off-outline"
                size="small"
                color="primary"
                variant="text"
                :to="`/paginas/deventrada/visualizar/${item.id}`"
            />
          </template>
        </tabela-padrao>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import { useProdutosStore } from "@/stores/APIs/produtos";
import { usePessoasStore } from "@/stores/APIs/pessoas";
import { useLocalizacaoStore } from "@/stores/APIs/localizacao";

// ===================== STORES =====================
const produtosStore = useProdutosStore();
const pessoasStore = usePessoasStore();
const localizacaoStore = useLocalizacaoStore();

// ===================== COMPUTEDS =====================
// ✅ ajuste conforme seu store (ex: produtosStore.devolucaoentrada)
const devolucaoEntrada = computed(() => produtosStore.devolucaoEntradaDfe);
const loading = computed(() => produtosStore.loading);

const pessoas = computed(() => pessoasStore.pessoas);
const ufs = computed(() => localizacaoStore.ufs);

const idEmpresa = JSON.parse(localStorage.getItem("empresaSelecionada"));

// ===================== STATE =====================
const formularioAberto = ref(false);
const search = ref("");

// ===================== HEADERS =====================
const headers = ref([
  { title: "ID", key: "id" },
  { title: "Fornecedor", key: "nome_razao" },
  { title: "C.F.O.P", key: "id_cfop" },
  { title: "Nota", key: "id_nota" },
  { title: "Série", key: "id_serie" },
  { title: "Importação XML", key: "importacaoxml" },
  { title: "Valor NF", key: "vlr_nf" },
  { title: "Ações", key: "acoes", sortable: false },
]);

// ===================== INIT =====================
onMounted(() => {
  // ✅ ajuste conforme seu store
  produtosStore.buscarDevolucoesEntrada(idEmpresa?.id ?? 1);

  if (pessoas.value.length === 0 && formularioAberto.value) {
    pessoasStore.buscarTodasPessoas();
  }

  if (ufs.value.length === 0 && formularioAberto.value) {
    localizacaoStore.buscarTodasUfs();
  }
});
</script>