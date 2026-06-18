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

                <!-- 🔹 COLUNA PRINCIPAL -->
                <v-col cols="12" md="8">
                  <v-row>
                    <v-col cols="12">
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

                    <!-- Editor -->
                    <v-col cols="12">
                      <div class="flex items-center justify-between w-100 mb-4">
                        <p class="text-sm opacity-70">Código (alto nível)</p>

                        <v-btn
                            v-if="editando"
                            color="var(--text-color-laranja)"
                            variant="flat"
                            class="text-none text-white"
                            @click="compilarFormula"
                        >
                          Compilar/Testar Fórmula
                        </v-btn>
                      </div>

                      <MonacoEditor
                          v-model:value="forms.formula"
                          language="pascal"
                          theme="vs-dark"
                          :options="{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: 'on',
              automaticLayout: true
            }"
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
                </v-col>

                <!-- 🔹 SIDEBAR DE VARIÁVEIS -->
                <v-col cols="12" md="4">
                  <v-card elevation="2" class="pa-4 h-100">
                    <p class="font-weight-medium mb-3">Variáveis</p>

                    <v-divider class="mb-3" />

                    <!-- cadastro único -->
                    <v-text-field
                        v-model="novaVariavel.varnome"
                        label="Nome da variável"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="mb-4"
                    />

                    <v-select
                        v-model="novaVariavel.vartype"
                        :items="tiposVariaveis"
                        label="Tipo da variável"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="mb-3"
                    />

                    <v-btn
                        block
                        variant="flat"
                        color="var(--text-color-laranja)"
                        class="text-none text-white mb-4"
                        prepend-icon="mdi-plus"
                        @click="addVariavel"
                    >
                      Adicionar variável
                    </v-btn>

                    <!-- tabela -->
                    <v-table density="compact" class="variaveis-table">
                      <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th class="text-center">Ação</th>
                      </tr>
                      </thead>

                      <tbody>
                      <tr v-if="!variaveis.length">
                        <td colspan="3" class="text-center opacity-60 py-4">
                          Nenhuma variável cadastrada
                        </td>
                      </tr>

                      <tr v-for="(v, i) in variaveis" :key="i">
                        <td>{{ v.varnome }}</td>
                        <td>{{ v.vartype }}</td>
                        <td class="text-center">
                          <v-btn
                              icon="mdi-delete"
                              size="x-small"
                              color="red"
                              variant="text"
                              @click="removeVariavel(i)"
                          />
                        </td>
                      </tr>
                      </tbody>
                    </v-table>
                  </v-card>
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

          <template v-slot:[`item.ativo`]>
            <v-chip color="success" size="small" variant="flat">
              Ativo
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
            <v-btn
                icon="mdi-code-json"
                title="Compilar/Testar Fórmula"
                size="small"
                color="error"
                variant="text"
                @click="compilarFormula"
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
import {computed, reactive, ref, watchEffect} from "vue";
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

const idEmpresa = JSON.parse(localStorage.getItem("empresaSelecionada"));
const loading = computed(() => estoqueStore.loading);
const formulas = computed(() => estoqueStore.formulas ?? []); // garanta que exista no store

watchEffect(() => {
  estoqueStore.buscarTodasFormulas(idEmpresa?.id); // ajuste o nome caso seja diferente
});

// Estado UI
const exibirFormulas = ref(false);
const formularioAberto = ref(false);

const errosCompilacao = ref([]);

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
  Object.assign(forms, {
    descformula: "",
    formula: "",
  });

  if (formRef.value) formRef.value.resetValidation();
  editando.value = false;
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

// CADASTRANDO VARIAVEIS
const variaveis = ref([]);

const novaVariavel = reactive({
  varnome: "",
  vartype: "string",
});

const tiposVariaveis = [
  // 🔢 Inteiros
  { title: "Integer", value: "Integer" },
  { title: "Shortint", value: "Shortint" },
  { title: "Smallint", value: "Smallint" },
  { title: "Longint", value: "Longint" },
  { title: "Int64", value: "Int64" },
  { title: "Byte", value: "Byte" },
  { title: "Word", value: "Word" },
  { title: "Cardinal", value: "Cardinal" },

  // 🔢 Decimais
  { title: "Double", value: "Double" },
  { title: "Real", value: "Real" },
  { title: "Extended", value: "Extended" },
  { title: "Currency", value: "Currency" },

  // 🔘 Booleano
  { title: "Boolean", value: "Boolean" },

  // 🔤 Texto
  { title: "Char", value: "Char" },
  { title: "AnsiChar", value: "AnsiChar" },
  { title: "String", value: "String" },
  { title: "AnsiString", value: "AnsiString" },
  { title: "WideString", value: "WideString" },

  // 📅 Datas
  { title: "TDateTime", value: "TDateTime" },
  { title: "TDate", value: "TDate" },
  { title: "TTime", value: "TTime" },

  // 🔀 Genéricos
  { title: "Variant", value: "Variant" },

  // 📦 Estruturas
  { title: "Array", value: "Array" },
  { title: "Record", value: "Record" },
  { title: "Set", value: "Set" },
];

const addVariavel = () => {
  if (!novaVariavel.varnome || !novaVariavel.vartype) return;

  const nomeJaExiste = variaveis.value.some(
      v => v.varnome.toLowerCase() === novaVariavel.varnome.toLowerCase()
  );

  if (nomeJaExiste) return;

  variaveis.value.push({
    varnome: novaVariavel.varnome.trim(),
    vartype: novaVariavel.vartype,
  });

  novaVariavel.varnome = "";
  novaVariavel.vartype = "string";
};

const removeVariavel = (index) => {
  variaveis.value.splice(index, 1);
};

// LIMPAR FORMULARIO
const cancelarFormulario = () => {
  Object.assign(forms, {
    id_empresa: idEmpresa?.id,
    descformula: "",
    formula: "",
  });

  variaveis.value = [];

  if (formRef.value) formRef.value.resetValidation();

  editando.value = false;
  formularioAberto.value = false;
};

// Salvar
const salvarFormulario = async () => {
  if (formRef.value) {
    const { valid } = await formRef.value.validate();
    if (!valid) return;
  }

  const payload = {
    id_empresa: forms.id_empresa,
    descformula: forms.descformula,
    formula: forms.formula,
    var: variaveis.value
        .filter(v => v.varnome && v.vartype)
        .map(v => ({
          varnome: v.varnome,
          vartype: v.vartype,
        })),
  };

  if (editando.value) {
    await estoqueStore.editarFormula(
        payload,
        idEmpresa?.id,
        itemSelecionado.value
    );

    cancelarFormulario();
    return;
  }

  await estoqueStore.cadastrarFormula(payload, idEmpresa?.id);
  cancelarFormulario();
};

// Editar
const editarItem = async (item) => {
  await estoqueStore.buscarFormulaId(idEmpresa?.id, item.id);

  editando.value = true;
  itemSelecionado.value = item.id;

  Object.assign(forms, {
    descformula: item.descformula,
    formula: item.formula,
    id_empresa: forms.id_empresa
  });

  variaveis.value = (item.variaveis ?? []).map(v => ({
    varnome: v.varnome,
    vartype: v.vartype,
  }));

  formularioAberto.value = true;
};

const compilarFormula = async () => {
  const item = estoqueStore.formula;

  const dataFormula = item?.data?.[0];

  if (!dataFormula?.formula) {
    console.error('Fórmula não encontrada:', dataFormula);
    return;
  }

  const payload = {
    formula: dataFormula.formula,
    id_empresa: forms.id_empresa,
    descformula: dataFormula.descformula,
    var: item?.var
        ?.filter(v => v.varnome && v.vartype)
        ?.map(v => ({
          varnome: v.varnome,
          vartype: v.vartype,
        })) || [],
  };

  await estoqueStore.compilarFormula(payload, idEmpresa?.id);

  if (estoqueStore.errorMessage) return

  cancelarFormulario();
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
.variaveis-table {
  border: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.variaveis-table th {
  font-size: 12px;
  font-weight: 700;
  opacity: 0.7;
}

.variaveis-table td {
  font-size: 13px;
}

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