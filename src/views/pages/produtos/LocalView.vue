<template>
  <top-all-pages icon="mdi-package-variant">
    <template #titulo>Localizações</template>
    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition
              v-if="!exibirlocalizacoes"
              :formulario-aberto="formularioAberto"
              @toggle="toggleFormulario"
          >
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Nova localizacao' }}</template>
          </botao-expand-transition>
        </v-card-text>

        <forms-expand-transition
            :salvar-formulario="salvarFormulario"
            :cancelar-formulario="cancelarFormulario"
            :formulario-aberto="formularioAberto"
            :loading="loading"
            :editando="editando"
        >
          <template #form>
            <v-form ref="formRef">
              <v-row>
                <!-- Descrição -->
                <v-col cols="12" md="6">
                  <v-text-field
                      v-bind="textFieldProps"
                      v-model="forms.descricao"
                      label="Descrição"
                      hide-details="auto"
                      class="required-left-border"
                      :rules="validacaoObrigatorio"
                  />
                </v-col>

                <!-- Rua (máx 10) -->
                <v-col cols="12" md="6">
                  <v-text-field
                      v-bind="textFieldProps"
                      v-model="forms.rua"
                      label="Rua"
                      hide-details="auto"
                      class="required-left-border"
                      :rules="validacaoRua"
                      maxlength="10"
                      counter="10"
                  />
                </v-col>

                <!-- Bloco -->
                <v-col cols="12" md="3">
                  <v-text-field
                      v-bind="textFieldProps"
                      v-model="descalmx"
                      label="Almoxarifado"
                      :rules="validacaoObrigatorio"
                      class="required-left-border"
                  >
                    <template #append-inner>
                      <almoxarifado-menu @selecionar="selecionarAlmoxarifado" />
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      v-bind="textFieldProps"
                      v-model="forms.bloco"
                      label="Bloco"
                      class="required-left-border"
                      :rules="validacaoObrigatorio"
                  />
                </v-col>

                <!-- Prateleira -->
                <v-col cols="12" md="3">
                  <v-text-field
                      v-bind="textFieldProps"
                      v-model="forms.prateleira"
                      label="Prateleira"
                      :rules="validacaoObrigatorio"
                  />
                </v-col>

                <!-- Coluna -->
                <v-col cols="12" md="3">
                  <v-text-field
                      v-bind="textFieldProps"
                      v-model="forms.coluna"
                      class="required-left-border"
                      label="Coluna"
                      :rules="validacaoObrigatorio"
                  />
                </v-col>
              </v-row>
            </v-form>
          </template>
        </forms-expand-transition>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="localizacoes"
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

        <excluir-modal
            :cancelar="cancelarModalExcluir"
            :deletar="confirmarExclusao"
            :loading="loading"
            v-model:modal-excluir="modalExcluir"
        >
          <template #item>{{itemSelecionado?.descclasse}}</template>
        </excluir-modal>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import {reactive, ref, computed, watchEffect} from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {useThemeStore} from "@/stores/config-temas/theme";
import AlmoxarifadoMenu from "@/components/base/menu/AlmoxarifadoMenu.vue";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";

const localizacoesStore = useProdutosStore();
const themeStore = useThemeStore();

const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));
const loading = computed(() => localizacoesStore.loading);
const localizacoes = computed(() => localizacoesStore.localizacoes);

// ABRIR E FECHAR FORMULÁRIO
const exibirlocalizacoes = ref(false);
const formularioAberto = ref(false);

function toggleFormulario() {
  formularioAberto.value = !formularioAberto.value;
  if (formularioAberto.value) cancelarFormulario();
}

// TABELA
const search = ref('');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'localizacao', key: 'descricao' },
  { title: 'Rua', key: 'rua' },
  { title: 'Bloco', key: 'bloco' },
  { title: 'Prateleira', key: 'prateleira' },
  { title: 'Coluna', key: 'coluna' },
  { title: 'Ativo', key: 'ativo' },
  { title: 'Ações', key: 'acoes', sortable: false },
];

// FORMULÁRIO
const formRef = ref(null);
const itemSelecionado = ref(null);
const editando = ref(false);

const validacaoObrigatorio = [
  v => !!v || 'Campo obrigatório',
];

const validacaoRua = [
  v => !!v || 'Campo obrigatório',
  v => (v && v.length <= 10) || 'Máximo de 10 caracteres',
];

const textFieldProps = computed(() => ({
  variant: 'outlined',
  density: 'compact',
  hideDetails: 'auto',
  theme: themeStore.darkMode ? 'dark' : 'light',
}))

const descalmx = ref('');

const forms = reactive({
  "id_almoxarifado": 1,
  "descricao": "",
  "id_empresa": null,
  "rua": "",
  "bloco": "",
  "prateleira": "",
  "coluna": ""
});

/**
 * Cancelar formulário
 */
function cancelarFormulario() {
  Object.assign(forms, {
    "id_almoxarifado": null,
    "descricao": "",
    "id_empresa": idEmpresa?.id,
    "rua": "",
    "bloco": "",
    "prateleira": "",
    "coluna": ""
  });
  descalmx.value = '';
  editando.value = false;
  if (formRef.value) formRef.value.resetValidation()
}

/**
 * SELECIONAR ALMOXARIFADO
 */

const selecionarAlmoxarifado = (alm) => {
  forms.id_almoxarifado = alm.id;
  descalmx.value = alm.descalmoxarifado;
};

/**
 * SALVANDO ITEM
 */
const salvarFormulario = async () => {
  if (formRef.value && !(await formRef.value.validate())) {
    return;
  }

  if (editando.value) {
    await localizacoesStore.atualizarLocalizacao(idEmpresa?.id, itemSelecionado.value, {
      data: [
        {
          id_almoxarifado: forms.id_almoxarifado,
          descricao: forms.descricao,
          id_empresa: idEmpresa?.id,
          rua: forms.rua,
          bloco: forms.bloco,
          prateleira: forms.prateleira,
          coluna: forms.coluna
        }
      ]
    });
    cancelarFormulario();
    return;
  }

  await localizacoesStore.cadastrarLocalizacao({
    data: [
      {
        id_almoxarifado: forms.id_almoxarifado,
        descricao: forms.descricao,
        id_empresa: idEmpresa?.id,
        rua: forms.rua,
        bloco: forms.bloco,
        prateleira: forms.prateleira,
        coluna: forms.coluna
      }
    ]
  }, idEmpresa?.id)
  cancelarFormulario();
};

/**
 * EDITANDO ITEM
 */
const editarItem = (item) => {
  editando.value = true
  itemSelecionado.value = item.id;
  Object.assign(forms, item)
  formularioAberto.value = true
};

/**
 * EXCLUINDO ITEM
 */
const modalExcluir = ref(false);

const cancelarModalExcluir = () => {
  modalExcluir.value = false;
  itemSelecionado.value = null;
};

const excluirItem = (item) => {
  itemSelecionado.value = item;
  modalExcluir.value = true;
};

const confirmarExclusao = async () => {
  if (!itemSelecionado.value) return;

  await localizacoesStore.deletarLocalizacao(idEmpresa?.id, itemSelecionado.value?.id);
  cancelarModalExcluir();
};

/**
 * Carregar dados das APIs
 */
watchEffect(async () => {
  if (localizacoesStore.localizacoes.length === 0) {
    await localizacoesStore.buscarLocalizacoes(idEmpresa?.id);
  }
})
</script>