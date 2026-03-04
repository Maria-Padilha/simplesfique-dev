<template>
  <top-all-pages icon="mdi-function-variant">
    <template #titulo>Fórmulas</template>

    <template #section>
      <v-card elevation="0" class="background-secondary">
        <!-- Top bar (igual ao sistema do print) -->
        <v-card-text class="pa-3">
          <v-row align="center" dense>
            <v-col cols="12" md="4">
              <v-select
                  v-model="forms.matriz"
                  :items="matrizes"
                  item-title="label"
                  item-value="value"
                  label="Matriz"
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon="mdi-domain"
                  hide-details="auto"
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
              />
            </v-col>

            <v-col cols="12" md="8" class="d-flex justify-end">
              <v-chip variant="tonal" class="mr-2" prepend-icon="mdi-file-code-outline">
                FORMULA
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-text class="pa-3">
          <v-row dense>
            <!-- Coluna esquerda: botões (Novo/Excluir/Salvar/Relatório/Localizar/Sair) -->
            <v-col cols="12" md="2">
              <v-card variant="flat" class="pa-2" style="border: 1px solid rgba(0,0,0,.08);">
                <v-btn block class="mb-2" color="primary" variant="tonal" @click="novo">
                  Novo
                </v-btn>
                <v-btn block class="mb-2" color="error" variant="tonal" :disabled="!forms.id" @click="abrirExcluir">
                  Excluir
                </v-btn>
                <v-btn block class="mb-2" color="success" variant="tonal" :loading="loading" @click="salvar">
                  Salvar
                </v-btn>
                <v-btn block class="mb-2" variant="tonal" disabled>
                  Relatório
                </v-btn>
                <v-btn block class="mb-2" variant="tonal" @click="localizar">
                  Localizar
                </v-btn>
                <v-btn block variant="tonal" @click="sair">
                  Sair
                </v-btn>

                <v-divider class="my-3" />

                <div class="text-caption text-medium-emphasis">
                  Registros: <strong>{{ totalRegistros }}</strong>
                </div>
              </v-card>
            </v-col>

            <!-- Coluna do meio: cabeçalho + editor -->
            <v-col cols="12" md="7">
              <v-row dense>
                <v-col cols="12" md="3">
                  <v-text-field
                      v-model="forms.id"
                      label="Código"
                      density="compact"
                      variant="outlined"
                      hide-details="auto"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      :disabled="editando"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                      v-model="forms.descricao"
                      label="Descrição *"
                      class="required-left-border"
                      density="compact"
                      variant="outlined"
                      hide-details="auto"
                      :rules="validacaoDescricao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <div class="text-caption mb-1">Tipo</div>
                  <v-radio-group v-model="forms.tipo" density="compact" hide-details>
                    <v-radio label="Itens venda" value="itens_venda" />
                    <v-radio label="Itens compra" value="itens_compra" />
                  </v-radio-group>
                </v-col>

                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="primary" variant="tonal" prepend-icon="mdi-play" @click="compilar">
                    Compilar
                  </v-btn>
                </v-col>

                <!-- Editor -->
                <v-col cols="12">
                  <v-card
                      class="pa-0"
                      style="border: 1px solid rgba(0,0,0,.08); overflow: hidden;"
                  >
                    <!-- “Editor fake” com textarea (se você tiver Monaco/CodeMirror, substitui aqui) -->
                    <v-textarea
                        v-model="forms.formula"
                        auto-grow
                        rows="18"
                        label="Código da Fórmula"
                        variant="solo"
                        hide-details="auto"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;"
                    />
                  </v-card>

                  <div v-if="compileResult.msg" class="mt-2">
                    <v-alert
                        :type="compileResult.ok ? 'success' : 'error'"
                        variant="tonal"
                        density="compact"
                        border="start"
                    >
                      {{ compileResult.msg }}
                    </v-alert>
                  </div>
                </v-col>

                <!-- Campos solicitados pela fórmula -->
                <v-col cols="12">
                  <v-card variant="flat" class="pa-3" style="border: 1px solid rgba(0,0,0,.08);">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="text-subtitle-2">
                        Campos solicitados pela fórmula ({{ requiredFields.length }})
                      </div>

                      <v-btn size="small" variant="text" @click="autoPreencherExemplo">
                        Preencher exemplo
                      </v-btn>
                    </div>

                    <v-row dense v-if="requiredFields.length">
                      <v-col
                          v-for="f in requiredFields"
                          :key="f"
                          cols="12"
                          md="6"
                      >
                        <v-text-field
                            v-model="forms.campos[f]"
                            :label="f"
                            density="compact"
                            variant="outlined"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            prepend-inner-icon="mdi-variable"
                        />
                      </v-col>
                    </v-row>

                    <div v-else class="text-caption text-medium-emphasis">
                      Nenhum campo identificado ainda. Cole/edite a fórmula acima.
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>

            <!-- Coluna direita: grupos (FILIAL / CLIENTE / PRODUTO / ICMS...) -->
            <v-col cols="12" md="3">
              <v-card class="pa-2" variant="flat" style="border: 1px solid rgba(0,0,0,.08);">
                <div class="text-subtitle-2 mb-2">Campos disponíveis</div>

                <v-treeview
                    :items="grupos"
                    item-title="title"
                    item-value="id"
                    item-children="children"
                    density="compact"
                    open-on-click
                >
                  <template #prepend="{ item, isOpen }">
                    <v-icon v-if="item.children" size="18">
                      {{ isOpen ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else size="18">mdi-code-tags</v-icon>
                  </template>

                  <template #title="{ item }">
                    <span
                        :style="item.children ? '' : 'cursor:pointer;'"
                        @click="!item.children && inserirNoEditor(item.title)"
                    >
                      {{ item.title }}
                    </span>
                  </template>
                </v-treeview>

                <div class="text-caption text-medium-emphasis mt-2">
                  Clique em um campo para inserir no editor.
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- modal excluir (opcional) -->
        <excluir-modal
            :cancelar="cancelarModalExcluir"
            :deletar="confirmarExclusao"
            :loading="loading"
            v-model:modal-excluir="modalExcluir"
        >
          <template #item>{{ forms.descricao || 'Fórmula' }}</template>
        </excluir-modal>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import { useThemeStore } from "@/stores/config-temas/theme";

const themeStore = useThemeStore();

const loading = ref(false);
const totalRegistros = ref(1);
const editando = ref(false);

const matrizes = [
  { label: "001-002-FERMAT - MATRIZ", value: "001-002" },
  { label: "002-001-FERMAT - FILIAL", value: "002-001" },
];

const forms = reactive({
  matriz: "001-002",
  id: "",
  descricao: "",
  tipo: "itens_venda",
  formula: "",
  campos: {}, // campos identificados na fórmula: { pALIQUOTAICMSItem: '...', ... }
});

const validacaoDescricao = [
  v => !!v || "Descrição é obrigatória.",
  v => (v && v.length <= 120) || "Máximo 120 caracteres."
];

/**
 * 🔎 Extrai “campos solicitados pela fórmula”
 * Regra simples (ajuste como quiser):
 * - pega tokens que começam com p (parâmetro) tipo pALIQUOTA..., pAliq...
 * - ignora palavras reservadas comuns
 */
const reserved = new Set([
  "begin","end","case","of","if","then","else","and","or","not","div",
  "true","false","nil","var","function","procedure"
]);

function extractFields(code) {
  if (!code) return [];

  // pega identificadores: letras/números/underscore, começando por p ou P
  const found = code.match(/\b[pP][A-Za-z_][A-Za-z0-9_]*\b/g) || [];
  const unique = [...new Set(found)]
      .filter(x => !reserved.has(x.toLowerCase()))
      .sort((a,b) => a.localeCompare(b));

  return unique;
}

const requiredFields = computed(() => extractFields(forms.formula));

watch(requiredFields, (list) => {
  // garante que exista forms.campos[chave]
  list.forEach((k) => {
    if (forms.campos[k] === undefined) forms.campos[k] = "";
  });

  // remove chaves que não existem mais
  Object.keys(forms.campos).forEach((k) => {
    if (!list.includes(k)) delete forms.campos[k];
  });
}, { immediate: true });

const compileResult = reactive({ ok: true, msg: "" });

function compilar() {
  // aqui você chamaria seu backend /service de validação
  // por enquanto só valida básico:
  if (!forms.descricao) {
    compileResult.ok = false;
    compileResult.msg = "Informe a descrição antes de compilar.";
    return;
  }
  if (!forms.formula || forms.formula.trim().length < 10) {
    compileResult.ok = false;
    compileResult.msg = "Cole a fórmula (mín. 10 caracteres).";
    return;
  }

  compileResult.ok = true;
  compileResult.msg = "Compilação OK (validação local).";
}

function inserirNoEditor(token) {
  // insere no final (simples). Se quiser, insere na posição do cursor usando um editor de verdade.
  forms.formula = (forms.formula || "") + (forms.formula.endsWith(" ") ? "" : " ") + token;
}

function novo() {
  editando.value = false;
  forms.id = "";
  forms.descricao = "";
  forms.tipo = "itens_venda";
  forms.formula = "";
  forms.campos = {};
  compileResult.msg = "";
}

function salvar() {
  compilar();
  if (!compileResult.ok) return;

  // aqui: montar payload incluindo campos extraídos
  // exemplo:
  // payload = { id, descricao, tipo, formula, campos: forms.campos }
  // enviar para store/service
  console.log("SALVAR payload:", {
    id: forms.id,
    descricao: forms.descricao,
    tipo: forms.tipo,
    matriz: forms.matriz,
    formula: forms.formula,
    campos: forms.campos,
  });
}

function localizar() {
  // abrir modal/página de busca
  console.log("LOCALIZAR");
}

function sair() {
  // navegar para outra rota
  console.log("SAIR");
}

/** só pra você ver a geração dos campos funcionando */
function autoPreencherExemplo() {
  Object.keys(forms.campos).forEach((k) => (forms.campos[k] = "0"));
}

/** EXCLUIR */
const modalExcluir = ref(false);
function abrirExcluir() {
  modalExcluir.value = true;
}
function cancelarModalExcluir() {
  modalExcluir.value = false;
}
async function confirmarExclusao() {
  modalExcluir.value = false;
  novo();
}

/** Árvore da direita (ajuste para seus campos reais) */
const grupos = [
  { id: "filial", title: "FILIAL", children: [
      { id: "FILIAL.ID", title: "FILIAL.ID" },
      { id: "FILIAL.UF", title: "FILIAL.UF" },
    ]},
  { id: "cliente", title: "CLIENTE/FORNECEDOR", children: [
      { id: "CLI.CPF_CNPJ", title: "CLI.CPF_CNPJ" },
      { id: "CLI.UF", title: "CLI.UF" },
    ]},
  { id: "produto", title: "PRODUTO", children: [
      { id: "PROD.NCM", title: "PROD.NCM" },
      { id: "PROD.CEST", title: "PROD.CEST" },
    ]},
  { id: "icms", title: "ICMS", children: [
      { id: "ICMS.CST", title: "ICMS.CST" },
      { id: "ICMS.ALIQ", title: "ICMS.ALIQ" },
    ]},
  { id: "ipi", title: "IPI", children: [
      { id: "IPI.CST", title: "IPI.CST" },
      { id: "IPI.ALIQ", title: "IPI.ALIQ" },
    ]},
  { id: "pis", title: "PIS", children: [
      { id: "PIS.CST", title: "PIS.CST" },
      { id: "PIS.ALIQ", title: "PIS.ALIQ" },
    ]},
  { id: "cofins", title: "COFINS", children: [
      { id: "COFINS.CST", title: "COFINS.CST" },
      { id: "COFINS.ALIQ", title: "COFINS.ALIQ" },
    ]},
  { id: "issqn", title: "ISSQN", children: [
      { id: "ISSQN.ALIQ", title: "ISSQN.ALIQ" },
    ]},
  { id: "cbsibs", title: "CBS/IBS", children: [
      { id: "CBS.ALIQ", title: "CBS.ALIQ" },
      { id: "IBS.ALIQ", title: "IBS.ALIQ" },
    ]},
];
</script>

<style scoped>
.required-left-border :deep(.v-field) {
  border-left: 3px solid #b71c1c22; /* bem discreto */
}
</style>