<template>
  <top-all-pages icon="mdi-view-grid-outline">
    <template #titulo>Grade de Produtos</template>
    <template #section>
      <v-card elevation="0" class="background-secondary mt-10">
        <v-card-text class="pa-4">
          <botao-expand-transition
              v-if="!exibirGrade"
              :formulario-aberto="formularioAbertoGrade"
              @toggle="toggleFormularioGrade"
          >
            <template #default>
              {{ formularioAbertoGrade ? 'Cancelar' : 'Cadastrar Grade' }}
            </template>
          </botao-expand-transition>
        </v-card-text>

        <forms-expand-transition
            :salvar-formulario="salvarFormularioGrade"
            :cancelar-formulario="cancelarFormularioGrade"
            :formulario-aberto="formularioAbertoGrade"
            :loading="loading"
            :editando="editandoGrade"
        >
          <template #form>
            <v-form ref="formRefGrade">
              <v-row>
                <!-- PRODUTO -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-bind="fieldProps"
                      v-model="formGrade.id_produto"
                      label="Produto"
                      item-title="descproduto"
                      item-value="id"
                      :items="produtos"
                      :readonly="editandoGrade"
                      class="required-left-border"
                      :rules="validacaoObrigatorio"
                  />
                </v-col>

                <!-- CÓDIGO DE BARRAS -->
                <v-col cols="12" md="4">
                  <div class="barcode-field-wrap">
                    <v-text-field
                        v-bind="fieldProps"
                        v-model="formGrade.codigo_grade"
                        label="Código de barras"
                        maxlength="25"
                        counter="25"
                        placeholder="Informe o código manualmente"
                        v-mask-number
                        :rules="validacaoCodigoGrade"
                    >
                      <template #prepend-inner>
                        <v-icon icon="mdi-barcode" class="me-2" />
                      </template>
                    </v-text-field>
                  </div>
                </v-col>

                <!-- LOCALIZAÇÃO -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      v-bind="fieldProps"
                      v-model="formGrade.id_localizacao"
                      label="Localização"
                      item-title="descricao"
                      item-value="id"
                      :items="locais"
                      class="required-left-border"
                      :rules="validacaoObrigatorio"
                  />
                </v-col>

                <!-- COR -->
                <v-col cols="12" md="4">
                  <v-select
                      v-bind="fieldProps"
                      v-model="formGrade.id_cor"
                      label="Cor"
                      :readonly="editandoGrade"
                      :items="coresDisponiveis"
                      item-title="descricao"
                      item-value="id"
                      class="required-left-border"
                      :rules="validacaoObrigatorio"
                  >
                    <template #selection="{ item }">
                      <div class="d-flex align-center gap-2">
                    <span
                        class="cor-dot"
                        :style="{ background: item.raw?.cor_hexa || '#999' }"
                    />
                        <span>{{ item.raw?.descricao }}</span>
                      </div>
                    </template>

                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                      <span
                          class="cor-dot"
                          :style="{ background: item.raw?.cor_hexa || '#999' }"
                      />
                        </template>
                      </v-list-item>
                    </template>

                    <template #append-item>
                      <v-divider class="my-2" />
                      <div class="px-3 pb-2">
                        <v-btn
                            block
                            variant="tonal"
                            color="var(--text-color-laranja)"
                            prepend-icon="mdi-plus"
                            @click="abrirModalNovaCor"
                        >
                          Adicionar Cor
                        </v-btn>
                      </div>
                    </template>
                  </v-select>
                </v-col>

                <!-- TAMANHO -->
                <v-col cols="12" md="4">
                  <v-text-field
                      v-bind="fieldProps"
                      :readonly="editandoGrade"
                      v-model="formGrade.id_tamanho"
                      label="Tamanho"
                      placeholder="Ex: P, M, G, XG, XL, U, 38, 120"
                      maxlength="3"
                      counter="3"
                      class="required-left-border"
                      :rules="validacaoTamanho"
                      @input="formGrade.id_tamanho = normalizarTamanho(formGrade.id_tamanho)"
                  />
                </v-col>

                <!-- STATUS -->
                <v-col cols="12" md="4">
                  <v-select
                      v-bind="fieldProps"
                      v-model="formGrade.status"
                      label="Status"
                      :items="statusOptions"
                      item-title="title"
                      item-value="value"
                      readonly
                      class="required-left-border"
                      :rules="validacaoObrigatorio"
                  />
                </v-col>

                <v-col cols="12">
                  <v-alert
                      type="warning" icon="mdi-barcode"
                      title="Código de Barras"
                      text="Caso não informado, será gerado automaticamente com base no produto, cor e tamanho."
                      density="compact" variant="tonal" size="small"
                  />
                </v-col>
              </v-row>
            </v-form>
          </template>
        </forms-expand-transition>

        <tabela-padrao
            :formulario-aberto="formularioAbertoGrade"
            :headers="headers"
            :items="grades"
            :loading="loading"
            :search="search"
            @update:search="(value) => (search = value)"
            search-label="Pesquisar grades"
            item-key="id"
            no-data-icon="mdi-view-grid-outline"
            no-data-text="Nenhuma grade cadastrada"
        >
          <template #[`item.status`]="{ item }">
            <v-chip
                size="small"
                :color="item.status === 'A' ? 'success' : 'error'"
                variant="tonal"
            >
              {{ item.status === 'A' ? 'Ativo' : 'Inativo' }}
            </v-chip>
          </template>

          <template #[`item.cor`]="{ item }">
            <div class="d-flex align-center">
          <span
              class="cor-dot"
              :style="{ background: item.cor_hexa || '#999' }"
          />
              <span>{{ item.desccor || item.id_cor }}</span>
            </div>
          </template>

          <template #[`item.acoes`]="{ item }">
            <v-btn
                icon="mdi-pencil"
                size="small"
                color="primary"
                variant="text"
                @click="editarGrade(item)"
            />

            <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="excluirGrade(item)"
            />
          </template>
        </tabela-padrao>

        <excluir-modal
            v-model:modal-excluir="modalExcluir"
            :cancelar="cancelarModalExcluir"
            :deletar="confirmarExclusao"
            :loading="loading"
        >
          <template #item>{{ itemSelecionado?.codigo_grade }}</template>
        </excluir-modal>

        <!-- CADASTRAR / EDITAR COR -->
        <cadastrar-modal
            v-model:cadastrar-modal="modalNovaCor"
            :clear-input="resetNovaCor"
            :cadastrarcidade="salvarOuEditarCor"
            :width="450"
            :loading="produtosStore.loading"
            :titulo-acao="modoCor === 'edit' ? 'Editar' : 'Cadastrar'"
            :texto-botao="modoCor === 'edit' ? 'Salvar alterações' : 'Cadastrar'"
            :icone-botao="modoCor === 'edit' ? 'mdi-content-save-outline' : 'mdi-plus-circle-outline'"
        >
          <template #titulo>Cor</template>

          <template #textfields>
            <v-row dense class="px-4 py-5">
              <v-col cols="12" class="mb-2">
                <v-text-field
                    density="compact"
                    variant="outlined"
                    label="Descrição"
                    v-model="novaCor.descricao"
                    placeholder="Ex: AMARELO"
                    hide-details="auto"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                    density="compact"
                    variant="outlined"
                    label="Cor Denatran"
                    :items="coresDenatran"
                    item-title="title"
                    item-value="value"
                    v-model="novaCor.id_cor_denatran"
                    hide-details="auto"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                    density="compact"
                    variant="outlined"
                    label="Cor HEX"
                    v-model="novaCor.cor_hexa"
                    placeholder="#FFFF00"
                    hide-details="auto"
                >
                  <template #append-inner>
                <span
                    class="cor-dot"
                    :style="{ background: novaCor.cor_hexa || '#999' }"
                />
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12">
                <v-color-picker
                    width="100%"
                    class="mt-2"
                    v-model="novaCor.cor_hexa"
                    hide-inputs
                    elevation="0"
                />
              </v-col>
            </v-row>
          </template>
        </cadastrar-modal>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import { computed, onMounted, reactive, ref } from "vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import CadastrarModal from "@/components/base/modais/CadastrarModal.vue";
import { useProdutosStore } from "@/stores/APIs/produtos";
import { useThemeStore } from "@/stores/config-temas/theme";

const produtosStore = useProdutosStore();
const themeStore = useThemeStore();

const idEmpresa = JSON.parse(localStorage.getItem("empresaSelecionada"));

// DADOS
const loading = computed(() => produtosStore.loading);
const produtos = computed(() => produtosStore.produtos || []);
const locais = computed(() => produtosStore.localizacoes || []);
const cores = computed(() => produtosStore.cores || []);
const grades = computed(() => produtosStore.grades || []);

// FORMULÁRIO
const formRefGrade = ref(null);
const formularioAbertoGrade = ref(false);
const exibirGrade = ref(false);
const editandoGrade = ref(false);
const itemSelecionado = ref(null);

const formGrade = reactive({
  id_empresa: idEmpresa?.id || null,
  id_produto: null,
  id_cor: null,
  id_tamanho: null,
  id_localizacao: null,
  status: 'A',
  codigo_grade: ""
});

const fieldProps = computed(() => ({
  variant: "outlined",
  density: "compact",
  hideDetails: "auto",
  theme: themeStore.darkMode ? "dark" : "light",
}));

const validacaoObrigatorio = [
  (v) => !!v || "Campo obrigatório",
];

const validacaoCodigoGrade = [
  (v) => !v || String(v).length <= 25 || "Máximo de 25 caracteres",
  (v) => !v || /^[0-9]+$/.test(String(v)) || "Informe apenas números",
];

function normalizarTamanho(valor) {
  if (valor === null || valor === undefined) return "";

  return String(valor)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3);
}

const validacaoTamanho = [
  (v) => !!String(v || "").trim() || "Campo obrigatório",
  (v) => {
    const valor = normalizarTamanho(v);

    // letras permitidas, simples ou combinadas:
    // P, M, G, L, S, X, U
    // combinações como XG, XL, XP, XXG etc
    const regexLetras = /^(?=.{1,3}$)[PMGLSXU]+$/;

    // números de 1 até 3 dígitos
    const regexNumeros = /^\d{1,3}$/;

    return (
        regexLetras.test(valor) || regexNumeros.test(valor)
    ) || "Informe letras válidas (P, M, G, L, S, X, U e combinações) ou número com até 3 dígitos";
  }
];

// TABELA
const search = ref("");

const headers = [
  { title: "ID", key: "id" },
  { title: "Código Grade", key: "codigo_grade" },
  { title: "Produto", key: "descproduto" },
  { title: "Cor", key: "cor" },
  { title: "Tamanho", key: "id_tamanho" },
  { title: "Localização", key: "localizacao" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "acoes", sortable: false },
];

const statusOptions = [
  { title: "Ativo", value: 'A' },
  { title: "Inativo", value: 'I' },
];

// ABRIR/FECHAR
function toggleFormularioGrade() {
  formularioAbertoGrade.value = !formularioAbertoGrade.value;
  if (formularioAbertoGrade.value && !editandoGrade.value) {
    resetFormularioGrade();
  }
}

function resetFormularioGrade() {
  Object.assign(formGrade, {
    id_empresa: idEmpresa?.id || null,
    id_produto: null,
    id_cor: null,
    id_tamanho: null,
    id_localizacao: null,
    status: 'A',
    codigo_grade: ""
  });

  editandoGrade.value = false;
  itemSelecionado.value = null;

  if (formRefGrade.value) {
    formRefGrade.value.resetValidation();
  }
}

function cancelarFormularioGrade() {
  resetFormularioGrade();
  formularioAbertoGrade.value = false;
}

// SALVAR
async function salvarFormularioGrade() {
  const validacao = await formRefGrade.value?.validate();
  if (!validacao?.valid) return;

  const payload = {
    data: [
      {
        id_empresa: formGrade.id_empresa,
        id_produto: formGrade.id_produto,
        id_cor: String(formGrade.id_cor),
        id_tamanho: normalizarTamanho(formGrade.id_tamanho),
        id_localizacao: formGrade.id_localizacao,
        status: String(formGrade.status),
        codigo_grade: formGrade.codigo_grade
            ? String(formGrade.codigo_grade).trim()
            : null,
      }
    ]
  };



  if (editandoGrade.value && itemSelecionado.value?.id_produto) {
    await produtosStore.atualizarGradeProduto(
        idEmpresa?.id,
        itemSelecionado.value.id_produto,
        itemSelecionado.value.id_cor,
        itemSelecionado.value.id_tamanho,
        payload
    );
  } else {
    await produtosStore.cadastrarGradeProduto(payload, idEmpresa?.id);
  }

  if (!produtosStore.errorMessage) {
    await produtosStore.buscarGradeProduto(idEmpresa?.id);
    cancelarFormularioGrade();
  }
}

// EDITAR
function editarGrade(item) {
  editandoGrade.value = true;
  itemSelecionado.value = item;

  Object.assign(formGrade, {
    id_empresa: item.id_empresa ?? idEmpresa?.id,
    id_produto: item.id_produto ?? null,
    id_cor: item.id_cor ?? null,
    id_tamanho: item.id_tamanho ?? null,
    id_localizacao: item.id_localizacao ?? null,
    status: item.status ?? 'A',
    codigo_grade: item.codigo_grade ?? "",
  });

  formularioAbertoGrade.value = true;
}

// EXCLUIR
const modalExcluir = ref(false);

function excluirGrade(item) {
  itemSelecionado.value = item;
  modalExcluir.value = true;
}

function cancelarModalExcluir() {
  modalExcluir.value = false;
  itemSelecionado.value = null;
}

async function confirmarExclusao() {
  if (!itemSelecionado.value?.id_produto) return;

  await produtosStore.deletarGradeProduto(
      idEmpresa?.id,
      itemSelecionado.value.id_produto,
      itemSelecionado.value.id_cor,
      itemSelecionado.value.id_tamanho
  );

  if (!produtosStore.errorMessage) {
    await produtosStore.buscarGradeProduto(idEmpresa?.id);
    cancelarModalExcluir();
  }
}

// CARREGAR DADOS
onMounted(async () => {
  await Promise.all([
    produtosStore.buscarProdutos(),
    produtosStore.buscarLocalizacoes(idEmpresa?.id),
    produtosStore.buscarCores(),
    produtosStore.buscarGradeProduto(idEmpresa?.id),
  ]);
});

// =========================
// CADASTRAR / EDITAR COR
// =========================
const modalNovaCor = ref(false);
const editandoCorId = ref(null);

const coresDisponiveis = computed(() => cores.value);

const coresDenatran = [
  { title: "01 - AMARELO", value: 1 },
  { title: "02 - AZUL", value: 2 },
  { title: "03 - BEGE", value: 3 },
  { title: "04 - BRANCA", value: 4 },
  { title: "05 - CINZA", value: 5 },
  { title: "06 - DOURADA", value: 6 },
  { title: "07 - GRENÁ", value: 7 },
  { title: "08 - LARANJA", value: 8 },
  { title: "09 - MARROM", value: 9 },
  { title: "10 - PRATA", value: 10 },
  { title: "11 - PRETA", value: 11 },
  { title: "12 - ROSA", value: 12 },
  { title: "13 - ROXA", value: 13 },
  { title: "14 - VERDE", value: 14 },
  { title: "15 - VERMELHA", value: 15 },
  { title: "16 - FANTASIA", value: 16 },
];

const modoCor = computed(() => (editandoCorId.value ? "edit" : "create"));

const novaCor = reactive({
  descricao: "",
  id_cor_denatran: null,
  cor_hexa: "",
});

function resetNovaCor() {
  novaCor.descricao = "";
  novaCor.id_cor_denatran = null;
  novaCor.cor_hexa = "";
  modalNovaCor.value = false;
  editandoCorId.value = null;
}

function abrirModalNovaCor() {
  editandoCorId.value = null;
  modalNovaCor.value = true;
}

const corFormValida = computed(() => {
  const descOk = String(novaCor.descricao || "").trim().length >= 2;
  const denOk = !!novaCor.id_cor_denatran;
  const hexOk = /^#([0-9A-Fa-f]{6})$/.test(String(novaCor.cor_hexa || "").trim());
  return descOk && denOk && hexOk;
});

async function salvarOuEditarCor() {
  if (!corFormValida.value) return;

  const payload = {
    descricao: String(novaCor.descricao).trim().toUpperCase(),
    id_cor_denatran: Number(novaCor.id_cor_denatran),
    cor_hexa: String(novaCor.cor_hexa).trim().toUpperCase(),
  };

  if (modoCor.value === "edit") {
    await produtosStore.atualizarCor(editandoCorId.value?.id, {
      data: [payload],
    });
  } else {
    await produtosStore.cadastrarCor({
      data: [payload],
    });
  }

  if (!produtosStore.errorMessage) {
    await produtosStore.buscarCores();
    resetNovaCor();
  }
}
</script>

<style scoped>
.cor-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.18);
  margin-right: 10px;
}

.gap-2 {
  gap: 8px;
}
</style>