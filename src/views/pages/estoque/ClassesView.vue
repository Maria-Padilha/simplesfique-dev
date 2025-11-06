<template>
  <top-all-pages icon="mdi-clipboard-text-outline">
    <template #titulo>Classes de Estoque</template>

    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition
              v-if="!exibirClasses"
              :formulario-aberto="formularioAberto"
              @toggle="toggleFormulario"
          >
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Nova Classe' }}</template>
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
                <v-col cols="12" md="12">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Descrição da Classe"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.descclasse"
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
            :items="classes"
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
import {ref, computed, watchEffect, reactive} from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";

const estoqueStore = useEstoqueStore();
const themeStore = useThemeStore();

const loading = computed(() => estoqueStore.loading);
const classes = computed(() => estoqueStore.classes);

watchEffect(() => {
  if (classes.value.length === 0) {
    estoqueStore.buscarTodasClasses();
  }
});

// Estado para exibir ou ocultar a seção de classes
const exibirClasses = ref(false);
const formularioAberto = ref(false);
const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
};

// CAMPOS DA TABELA
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome da Classe', key: 'descclasse' },
  { title: 'Ativo', key: 'ativo' },
  { title: "Ações", key: "acoes", align: "center", sortable: false},
];

// PESQUISANDO NA TABELA
const search = ref('');

// FORMULARIO
const editando = ref(false);
const formRef = ref(null);
const itemSelecionado = ref(null);

const validacao = [
  v => !!v || 'A descrição da classe é obrigatória.',
  v => (v && v.length <= 100) || 'A descrição da classe deve ter no máximo 100 caracteres.'
];

const forms = reactive({
  descclasse: '',
})

const cancelarFormulario = () => {
  Object.assign(forms, {
    descclasse: "",
  });
  if (formRef.value) formRef.value.resetValidation()

  editando.value = false;
  formularioAberto.value = false;
}

/**
 * SALVANDO CLASSE
 */
const salvarFormulario = async () => {
  if (formRef.value && !(await formRef.value.validate())) {
    return;
  }

  if (editando.value) {
    await estoqueStore.editarClasse(itemSelecionado.value, {
      data: [
        {
          descclasse: forms.descclasse,
        }
      ]
    });
    cancelarFormulario();
    return;
  }

  await estoqueStore.cadastrarClasse({
    data: [
      {
        descclasse: forms.descclasse,
      }
    ]
  })
  cancelarFormulario();
};

/**
 * EDITANDO CLASSE
 */
const editarItem = (item) => {
  editando.value = true
  itemSelecionado.value = item.id;
  Object.assign(forms, item)
  formularioAberto.value = true
};

/**
 * EXCLUINDO CLASSE
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

  await estoqueStore.deletarClasse(itemSelecionado.value?.id);
  cancelarModalExcluir();
};
</script>