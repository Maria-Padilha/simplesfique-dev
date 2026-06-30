<template>
  <top-all-pages icon="mdi-file-table-box-outline">
    <template #titulo>CEST</template>
    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition
              v-if="!exibir"
              :formulario-aberto="formularioAberto"
              @toggle="toggleFormulario"
          >
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Cadastrar' }}</template>
          </botao-expand-transition>
        </v-card-text>

        <forms-expand-transition
            :salvar-formulario="salvarFormulario"
            :cancelar-formulario="cancelarFormulario"
            :editando="editando"
            :formulario-aberto="formularioAberto"
            :loading="loading"
        >
          <template #form>
            <v-form ref="formRef">
              <v-row>
                <v-col v-if="!editando" cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="ID"
                      hide-details="auto"
                      :rules="validacao"
                      class="required-left-border"
                      v-model="forms.id"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-identifier"
                  />
                </v-col>
                <v-col v-if="!editando" cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="UF"
                      hide-details="auto"
                      :rules="regraUF"
                      placeholder="Ex: SP"
                      v-model="forms.id_uf"
                      class="required-left-border"
                      @input="forms.id_uf = forms.id_uf.toUpperCase()"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-map-marker"
                  />
                </v-col>

                <v-col v-if="!editando" cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="NCM"
                      hide-details="auto"
                      :rules="validacao"
                      class="required-left-border"
                      v-model="forms.id_ncm"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-barcode"
                  >
                    <template #append-inner>
                      <ncm-menu @selecionar="selecionarNcm" />
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" :md="editando ? 12 : 3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="PMVA"
                      class="required-left-border"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.pmva"
                      type="number"
                      min="0"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-currency-usd"
                  />
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea
                      rows="2"
                      density="compact"
                      variant="outlined"
                      label="Descrição"
                      class="required-left-border"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.descricao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      prepend-inner-icon="mdi-text"
                  />
                </v-col>
              </v-row>
            </v-form>
          </template>
        </forms-expand-transition>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="cests"
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
                icon="mdi-pencil" size="small"
                color="primary" variant="text"
                @click="editarItem(item)"
            />

            <v-btn
                icon="mdi-delete" size="small"
                color="error" variant="text"
                @click="excluirItem(item)"
            />
          </template>
        </tabela-padrao>

        <ExcluirModal
            :cancelar="cancelarModalExcluir"
            :deletar="confirmarExclusao"
            :loading="loading"
            v-model:modal-excluir="excluirModal"
        >
          <template #item>{{itemSelecionado?.id}}</template>
        </ExcluirModal>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import NcmMenu from "@/components/base/menu/NcmMenu.vue";
import {toast} from "vue3-toastify";

const themeStore = useThemeStore();
const estoqueStore = useEstoqueStore();

const cests = computed(() => estoqueStore.cests);
const loading = computed(() => estoqueStore.loading);

watchEffect(() => {
  if (cests.value.length === 0) {
    estoqueStore.buscarCests();
  }
});

// Estado do formulário
const exibir = ref(false);
const formularioAberto = ref(false);
const editando = ref(false);

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;

  if (editando.value) {
    editando.value = false;
    cancelarFormulario();
  }
};

// FORMULÁRIO
const formRef = ref(null);
const itemSelecionado = ref(null);

const validacao = [
  (v) => !!v || "Campo obrigatório",
];

const regraUF = [
  ...validacao,
  (v) => (v && v.length === 2) || "UF deve conter exatamente 2 caracteres",
];

const forms = reactive({
  id_uf: "",
  id_ncm: "",
  descricao: "",
  pmva: "",
  id: ""
});

const cancelarFormulario = () => {
  Object.assign(forms, {
    id_uf: "",
    id_ncm: "",
    descricao: "",
    pmva: "",
    id: ""
  });
  if (formRef.value) formRef.value.resetValidation()

  editando.value = false;
  formularioAberto.value = false;
};

// CAMPOS DA TABELA
const search = ref("");

const headers = [
  { title: "ID", key: "id" },
  { title: "Descrição", key: "descricao" },
  { title: "UF", key: "id_uf" },
  { title: "NCM", key: "id_ncm" },
  { title: "PMVA", key: "pmva" },
  { title: "Ações", key: "acoes", align: "center", sortable: false },
];

/**
 * SELECIONAR NCM
 */

const selecionarNcm = (ncmSelecionado) => {
  forms.id_ncm = ncmSelecionado.id;
  console.log("NCM Selecionado: ", ncmSelecionado);
}

/**
 * SALVAR FORMULÁRIO
 */
const salvarFormulario = async () => {
  forms.pmva = Number(forms.pmva);

  if (!forms.id_ncm) {
    toast.error("Por favor, selecione um NCM válido.");
    return
  }


  await estoqueStore.buscarNcms(forms.id_ncm);

  if (estoqueStore.ncms.length === 0) {
    toast.error("NCM não encontrado. Por favor, selecione um NCM válido.");
    return;
  }

  if (!editando.value) {
    await estoqueStore.cadastrarCest({
      id_uf: forms.id_uf,
      id_ncm: forms.id_ncm,
      descricao: forms.descricao,
      pmva: forms.pmva,
      id: forms.id
    });
  }
  else {
    await estoqueStore.editarCest(
        itemSelecionado.value.id,
        itemSelecionado.value.id_ncm,
        itemSelecionado.value.id_uf,
        {
          descricao: forms.descricao,
          pmva: forms.pmva,
    });
  }
  cancelarFormulario();
};

/**
 * EDITAR ITEM
 */
const editarItem = (item) => {
  itemSelecionado.value = item;
  Object.assign(forms, item)
  editando.value = true;
  formularioAberto.value = true;
};

/**
 * EXCLUIR ITEM
 */
const excluirModal = ref(false);

const excluirItem = (item) => {
  itemSelecionado.value = item;
  excluirModal.value = true;
};

const cancelarModalExcluir = () => {
  excluirModal.value = false;
  itemSelecionado.value = null;
};

const confirmarExclusao = async () => {
  await estoqueStore.deletarCest(
      itemSelecionado.value.id,
      itemSelecionado.value.id_ncm,
      itemSelecionado.value.id_uf
  );
  cancelarModalExcluir();
};
</script>