<template>
  <top-all-pages icon="mdi-function-variant">
    <template #titulo>Fórmulas</template>

    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition
              v-if="!exibirFormulas"
              :formulario-aberto="formularioAberto"
              @toggle="toggleFormulario"
          >
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Nova Fórmula' }}</template>
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
                      v-model="forms.descformula"
                      label="Descrição da Fórmula"
                      variant="outlined"
                      density="compact"
                      :rules="validacaoDesc"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="required-left-border"
                  />
                </v-col>

                <!-- Editor do código normal -->
                <v-col cols="12" md="12">
                  <div class="text-sm opacity-70 mb-2">Código (alto nível)</div>
                  <MonacoEditor
                      v-model:value="forms.formula"
                      language="pascal"
                      theme="vs-dark"
                      :options="{fontSize: 14,minimap: { enabled: false }, wordWrap: 'on',automaticLayout: true}"
                      height="420px"
                  />
                </v-col>

                <!-- Erros -->
                <v-col cols="12" v-if="errosCompilacao.length">
                  <v-alert type="error" variant="tonal" class="mt-2">
                    <div v-for="(e, i) in errosCompilacao" :key="i">
                      Linha {{ e.line }}: {{ e.message }}
                    </div>
                  </v-alert>
                </v-col>
              </v-row>
            </v-form>
          </template>
        </forms-expand-transition>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="formulas"
            :loading="loading"
            :search="search"
            @update:search="(value) => (search = value)"
            search-label="Pesquisar Fórmulas"
            item-key="id"
            no-data-icon="mdi-database-off"
            no-data-text="Nenhuma fórmula encontrada"
        >

          <template v-slot:[`item.formula`]="{ item }">
            <v-expand-transition>
              <details class="formula-code">
                <summary class="texto-color-laranja">Ver fórmula</summary>
                <pre>{{ formatarFormula(item.formula) }}</pre>
              </details>
            </v-expand-transition>
          </template>

          <template v-slot:[`item.ativo`]="{ item }">
            <v-chip :color="item.ativo === 's' ? 'success' : 'error'" size="small" variant="flat">
              {{ item.ativo === 's' ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>

          <template v-slot:[`item.acoes`]="{ item }">
            <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editarItem(item)"
            />
            <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
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
          <template #item>{{ itemSelecionado?.descricao }}</template>
        </excluir-modal>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import { useThemeStore } from "@/stores/config-temas/theme";
import { useEstoqueStore } from "@/stores/APIs/estoque";
import MonacoEditor from "@guolao/vue-monaco-editor";

const estoqueStore = useEstoqueStore();
const themeStore = useThemeStore();

const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));
const loading = computed(() => estoqueStore.loading);
const formulas = computed(() => estoqueStore.formulas ?? []); // garanta que exista no store

watchEffect(() => {
  if (formulas.value.length === 0) {
    estoqueStore.buscarTodasFormulas(idEmpresa?.id); // ajuste o nome caso seja diferente
  }
});

// Estado UI
const exibirFormulas = ref(false);
const formularioAberto = ref(false);

const errosCompilacao = ref([]);

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
};

// Tabela
const headers = [
  { title: "ID", key: "id" },
  { title: "Descrição", key: "descformula" },
  { title: "Fórmula", key: "formula" },
  { title: "Ativo", key: "ativo", align: "center" },
  { title: "Ações", key: "acoes", align: "center", sortable: false },
];

const search = ref("");

// Form
const editando = ref(false);
const formRef = ref(null);
const itemSelecionado = ref(null);

const validacaoDesc = [
  v => !!v || 'A descrição é obrigatória.',
  v => (v && v.length <= 60) || 'Máx. 60 caracteres.'
];

const forms = reactive({
  id_empresa: idEmpresa?.id,
  descformula: "",
  formula: "",
});

const cancelarFormulario = () => {
  Object.assign(forms, {
    descformula: "",
    formula: "",
  });

  if (formRef.value) formRef.value.resetValidation();
  editando.value = false;
  formularioAberto.value = false;
};

// Salvar
const salvarFormulario = async () => {
  if (formRef.value && !(await formRef.value.validate())) return;

  const payload = {
    data: [
      {
        id_empresa: forms.id_empresa,
        descformula: forms.descformula,
        formula: forms.formula,
      }
    ]
  };

  if (editando.value) {
    await estoqueStore.editarFormula(payload, idEmpresa?.id, itemSelecionado.value);
    cancelarFormulario();
    return;
  }

  await estoqueStore.cadastrarFormula(payload, idEmpresa?.id);
  cancelarFormulario();
};

// Editar
const editarItem = (item) => {
  editando.value = true;
  itemSelecionado.value = item.id;

  Object.assign(forms, {
    descformula: item.descformula,
    formula: item.formula,
    id_empresa: forms.id_empresa
  });

  formularioAberto.value = true;
};

// Excluir
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
  await estoqueStore.deletarFormula(idEmpresa?.id, itemSelecionado.value?.id);
  cancelarModalExcluir();
};

/**
 * FORMARTAR FORMULA
 */

const formatarFormula = (txt) => {
  if (!txt) return "";

  return txt
      .replace(/;/g, ";\n")
      .replace(/begin/gi, "begin\n")
      .replace(/end/gi, "\nend");
};
</script>

<style scoped>
.monospace-textarea :deep(textarea) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  line-height: 1.35;
}

.formula-code {
  background: var(--bg-card); /* azul bem escuro */
  color: var(--text-color);
  border-radius: 8px;
  padding: 10px 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 12px;
  line-height: 1.35;
  max-height: 110px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>