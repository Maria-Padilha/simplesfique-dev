<template>
  <top-all-pages icon="mdi-package-variant">
    <template #titulo>Produtos</template>
    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition
              v-if="!exibirProdutos"
              :formulario-aberto="formularioAberto"
              @toggle="toggleFormulario"
          >
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Novo Produto' }}</template>
          </botao-expand-transition>
        </v-card-text>

        <forms-expand-transition
            :salvar-formulario="salvarFormulario"
            :cancelar-formulario="cancelarFormulario"
            :formulario-aberto="formularioAberto"
            :loading="loading"
        >
          <template #form>
            <v-form ref="formRef">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Descrição do Produto"
                      hide-details="auto"
                      :rules="validacao"
                      class="required-left-border"
                      v-model="forms.descproduto"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Aplicação"
                      item-title="title"
                      class="required-left-border"
                      item-value="value"
                      :items="[
                        { title: 'Produto para comercialização - venda', value: 'V' },
                        { title: 'Produto para consumo', value: 'C' },
                        { title: 'Matéria-Prima', value: 'M' },
                        { title: 'Imobilizado', value: 'I' },
                      ]"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.aplicacao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                      density="compact"
                      variant="outlined"
                      label="Tipo"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.tipo"
                      class="required-left-border"
                      item-title="title"
                      item-value="value"
                      :items="[
                        { title: 'Produto', value: 'P' },
                        { title: 'Serviço', value: 'S' },
                      ]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código GTIN"
                      class="required-left-border"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_gtin"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código SKU"
                      class="required-left-border"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_sku"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Código Fabricação"
                      class="required-left-border"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_fab"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      class="required-left-border"
                      label="Código Referência"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.codigo_ref"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Grupo"
                      hide-details="auto"
                      class="required-left-border"
                      :rules="validacao"
                      v-model="descgrupo"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione o Grupo"
                  >
                    <template #append-inner>
                      <grupos-menu @selecionar="selecionarGrupo" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                      density="compact"
                      variant="outlined"
                      :label="`Subgrupo ${forms.id_grupo ? '' : '(Selecione o Grupo primeiro)'}`"
                      item-title="descsubgrupo"
                      item-value="id"
                      :items="subgrupos"
                      hide-details="auto"
                      v-model="forms.id_subgrupo"
                      :loading="estoqueStore.loading"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      :readonly="!forms.id_grupo"
                  >
                    <template #no-data><p class="pa-3">Nenhum Subgrupo cadastrado!</p></template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Classe"
                      hide-details="auto"
                      class="required-left-border"
                      :rules="validacao"
                      v-model="descclasse"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a classe"
                  >
                    <template #append-inner>
                      <classes-menu @selecionar="selecionarClasse" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="NCM"
                      hide-details="auto"
                      class="required-left-border"
                      :rules="validacao"
                      v-model="forms.id_ncm"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione o NCM"
                  >
                    <template #append-inner>
                      <ncm-menu @selecionar="selecionarNcm" />
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Marca"
                      hide-details="auto"
                      class="required-left-border"
                      :rules="validacao"
                      v-model="descmarca"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a marca"
                  >
                    <template #append-inner>
                      <marcas-menu @selecionar="selecionarMarca" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Garantia"
                      hide-details="auto"
                      class="required-left-border"
                      :rules="validacao"
                      v-model="descgarantia"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a garantia"
                  >
                    <template #append-inner>
                      <garantia-menu @selecionar="selecionarGarantia" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Medida"
                      hide-details="auto"
                      :rules="validacao"
                      class="required-left-border"
                      v-model="descmedida"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      readonly
                      placeholder="Selecione a medida"
                  >
                    <template #append-inner>
                      <medidas-menu @selecionar="selecionarMedida" />
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="12">
                  <v-textarea
                      density="compact"
                      variant="outlined"
                      class="required-left-border"
                      label="Descrição do Produto"
                      hide-details="auto"
                      :rules="validacao"
                      v-model="forms.observacao"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      rows="2"
                  />
                </v-col>

                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Balança? ${forms.utiliza_balanca ? 'Sim' : 'Não'}`"
                      v-model="forms.utiliza_balanca"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza N. Série? ${forms.utiliza_nrserie ? 'Sim' : 'Não'}`"
                      v-model="forms.utiliza_nrserie"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Lote? ${forms.utiliza_lote ? 'Sim' : 'Não'}`"
                      v-model="forms.utiliza_lote"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Em Promoção? ${forms.em_promocao ? 'Sim' : 'Não'}`"
                      v-model="forms.em_promocao"
                      color="var(--text-color-laranja)"
                  />
                </v-col>
                <v-col cols="6" md="2">
                  <v-switch
                      hide-details="auto"
                      :label="`Utiliza Grade? ${forms.utiliza_grade ? 'Sim' : 'Não'}`"
                      v-model="forms.utiliza_grade"
                      color="var(--text-color-laranja)"
                  />
                </v-col>

                <v-col cols="12" v-if="forms.utiliza_grade">
                  <v-sheet class="grade-erp" rounded="lg" border>
                    <!-- Header -->
                    <div class="grade-erp__top mb-6">
                      <div>
                        <div class="text-subtitle-1 font-weight-medium">Grade de Cores x Tamanhos</div>
                        <div class="text-caption opacity-70">Adicione cores e tamanhos e informe as quantidades.</div>
                      </div>

                      <v-chip size="small" variant="flat" color="var(--text-color-laranja)">Qtd. Total: {{ totalGrade }}</v-chip>
                    </div>

                    <!-- Área principal -->
                    <div class="grade-erp__body ">
                      <!-- COLUNA CORES (esquerda) -->
                      <div class="grade-erp__left">
                        <div class="h-[44px] mb-1" />

                        <div class="grade-erp__left-title">
                          <span class="text-caption font-weight-medium">CORES</span>
                        </div>

                        <div class="grade-erp__left-list">
                          <div
                              v-for="corId in forms.grade.cores"
                              :key="corId"
                              class="grade-erp__left-item"
                          >
                            <div class="d-flex align-center gap-2">
                              <span class="cor-dot" :style="{ background: getCor(corId)?.cor_hexa || '#999' }"></span>
                              <span class="text-body-2 font-weight-medium">{{ getCor(corId)?.descricao || `Cor ${corId}` }}</span>
                            </div>

                            <v-btn
                                icon="mdi-close"
                                size="x-small"
                                variant="text"
                                @click="removeCor(corId)"
                            />
                          </div>
                        </div>

                        <!-- ADD COR (embaixo) igual seu exemplo -->
                        <div class="grade-erp__left-add">
                          <v-select
                              density="compact"
                              variant="outlined"
                              placeholder="Selecione"
                              :items="coresDisponiveis"
                              item-title="descricao"
                              item-value="id"
                              v-model="selectCor"
                              hide-details
                          >
                            <template #selection="{ item }">
                              <div class="d-flex align-center gap-2">
                                <v-btn
                                    icon="mdi-pencil" size="x-small" variant="flat" class="mr-3 text-white" color="orange"
                                    @click.prevent="abrirEditarCor(item.raw)"
                                />
                                <span class="cor-dot" :style="{ background: item.raw?.cor_hexa || '#999' }"></span>
                                <span>{{ item.raw?.descricao }}</span>
                              </div>
                            </template>

                            <template #item="{ props, item }">
                              <v-list-item v-bind="props">
                                <template #prepend>
                                  <span class="cor-dot" :style="{ background: item.raw?.cor_hexa || '#999' }"></span>
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

                          <v-btn
                              class="grade-erp__btn-plus"
                              icon="mdi-plus"
                              variant="tonal"
                              size="small"
                              :disabled="selectCor === null || selectCor === '' || selectCor === undefined"
                              @click="addCor"
                          />
                        </div>
                      </div>

                      <!-- DIREITA: tamanhos + grid -->
                      <div class="grade-erp__right">
                        <div class="grade-erp__left-title mb-3">
                          <span class="text-caption font-weight-medium">TAMANHOS</span>
                        </div>

                        <!-- Cabeçalho tamanhos -->
                        <div
                            class="grade-erp__sizes"
                            :style="{ gridTemplateColumns: `repeat(${Math.max(forms.grade.tamanhos.length, 1)}, 120px) 220px`}"
                        >
                          <div
                              v-for="tam in forms.grade.tamanhos"
                              :key="tam"
                              class="grade-erp__size-cell"
                          >
                            <span>{{ tam }}</span>
                            <v-btn
                                icon="mdi-close"
                                size="x-small"
                                variant="text"
                                @click="removeTamanho(tam)"
                            />
                          </div>

                          <!-- botão + de tamanho no fim do cabeçalho -->
                          <div class="grade-erp__size-add">
                            <v-select
                                density="compact"
                                variant="outlined"
                                :items="tamanhosDisponiveis"
                                item-title="title"
                                item-value="value"
                                v-model="selectTamanho"
                                hide-details
                                min-width="130px"
                                placeholder=""
                            />
                            <v-btn
                                class="grade-erp__btn-plus"
                                icon="mdi-plus"
                                size="small"
                                variant="tonal"
                                :disabled="!selectTamanho"
                                @click="addTamanho"
                            />
                          </div>
                        </div>

                        <!-- Grid de inputs -->
                        <div class="grade-erp__grid-wrap">
                          <div
                              class="grade-erp__grid"
                              :style="{ gridTemplateColumns: `repeat(${forms.grade.tamanhos.length}, 120px)` }"
                          >
                            <template v-for="corId in forms.grade.cores" :key="corId">
                              <div
                                  v-for="tam in forms.grade.tamanhos"
                                  :key="`${corId}-${tam}`"
                                  class="grade-erp__cell"
                              >
                                <v-text-field
                                    density="compact"
                                    variant="outlined"
                                    type="number"
                                    min="0"
                                    hide-details
                                    class="grade-erp__input mt-3"
                                    v-model.number="forms.grade.qtd[Number(corId)][tam]"
                                />
                              </div>
                            </template>
                          </div>
                        </div>

                        <!-- Estado vazio -->
                        <v-alert
                            v-if="forms.grade.cores.length === 0 || forms.grade.tamanhos.length === 0"
                            type="info"
                            variant="tonal"
                            density="compact"
                            class="mt-3"
                        >
                          Adicione pelo menos <b>1 cor</b> e <b>1 tamanho</b> para liberar a grade.
                        </v-alert>
                      </div>
                    </div>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-form>
          </template>
        </forms-expand-transition>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="produtos"
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
                icon="mdi-eye-off" size="small"
                color="var(--text-color-laranja)" variant="tonal"
                :to="`/paginas/produtos/${item.id}`"
            />
          </template>
        </tabela-padrao>
      </v-card>

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
    </template>
  </top-all-pages>
</template>

<script setup>
import {reactive, ref, computed, onMounted, watch} from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import {useThemeStore} from "@/stores/config-temas/theme";
import NcmMenu from "@/components/base/menu/NcmMenu.vue";
import GruposMenu from "@/components/base/menu/GruposMenu.vue";
import ClassesMenu from "@/components/base/menu/ClassesMenu.vue";
import MarcasMenu from "@/components/base/menu/MarcasMenu.vue";
import GarantiaMenu from "@/components/base/menu/GarantiaMenu.vue";
import MedidasMenu from "@/components/base/menu/MedidasMenu.vue";
import CadastrarModal from "@/components/base/modais/CadastrarModal.vue";

const produtosStore = useProdutosStore();
const estoqueStore = useEstoqueStore();
const themeStore = useThemeStore();

const loading = computed(() => produtosStore.loading);
const produtos = computed(() => produtosStore.produtos);

// CORES E TAMANHOS PARA GRADE
const cores = computed(() => produtosStore.cores);
const tamanhos = computed(() => produtosStore.tamanhos);

const selectTamanho = ref(null);
const selectCor = ref(null);

// selects
const subgrupos = computed(() => estoqueStore.subgrupos);

// ABRIR E FECHAR FORMULÁRIO
const exibirProdutos = ref(false);
const formularioAberto = ref(false);

function toggleFormulario() {
  formularioAberto.value = !formularioAberto.value;
  if (formularioAberto.value) cancelarFormulario();
}

// TABELA
const search = ref('');

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Produto', key: 'descproduto' },
  { title: 'Observação', key: 'observacao' },
  { title: 'Código Referência', key: 'codigo_ref' },
  { title: 'Código Fabricação', key: 'codigo_fab' },
  { title: 'Ativo', key: 'ativo' },
  { title: 'Ações', key: 'acoes', sortable: false },
];

// FORMULÁRIO
const formRef = ref(null);
const validacao = [
  v => !!v || 'Campo obrigatório',
];

const forms = reactive({
  "descproduto": "",
  "aplicacao": "",
  "tipo": "",
  "codigo_gtin": "",
  "codigo_sku": "",
  "codigo_fab": "",
  "codigo_ref": "",
  "id_grupo": null,
  "id_subgrupo": null,
  "id_marca": null,
  "id_medida": null,
  "id_classe": null,
  "id_garantia": null,
  "utiliza_balanca": "",
  "utiliza_grade": false,
  "utiliza_nrserie": "",
  "utiliza_lote": "",
  "id_ncm": "",
  "em_promocao": "",
  "observacao": "",
  "ativo": "S",
});

const descgrupo = ref('');
const descclasse = ref('');
const descmarca = ref('');
const descgarantia = ref('');
const descmedida = ref('');

/**
 * TRABALHANDO COM GRADE
 */

function ensureGradeShape() {
  if (!forms.grade) forms.grade = {}
  if (!Array.isArray(forms.grade.cores)) forms.grade.cores = []
  if (!Array.isArray(forms.grade.tamanhos)) forms.grade.tamanhos = []
  if (!forms.grade.qtd || typeof forms.grade.qtd !== "object") forms.grade.qtd = {}
}

function ensureCell(corId, tamanho) {
  const cid = Number(corId)
  if (!forms.grade.qtd[cid]) forms.grade.qtd[cid] = {}
  if (forms.grade.qtd[cid][tamanho] === undefined) forms.grade.qtd[cid][tamanho] = 0
}

function ensureMatrix() {
  ensureGradeShape()

  const coresArr = forms.grade.cores
  const tamsArr = forms.grade.tamanhos

  if (!coresArr.length || !tamsArr.length) return

  coresArr.forEach((corId) => {
    tamsArr.forEach((tam) => ensureCell(corId, tam))
  })
}

// mantém a matriz consistente
watch(
    () => [forms.grade?.cores?.length, forms.grade?.tamanhos?.length],
    () => ensureMatrix(),
    { immediate: true }
)

function addTamanho() {
  const t = selectTamanho.value
  if (!t) return
  if (forms.grade.tamanhos.includes(t)) return

  forms.grade.tamanhos.push(t)
  selectTamanho.value = null
  ensureMatrix()
}

function removeTamanho(t) {
  forms.grade.tamanhos = forms.grade.tamanhos.filter((x) => x !== t)

  // remove coluna do objeto qtd
  Object.keys(forms.grade.qtd).forEach((corId) => {
    if (forms.grade.qtd?.[corId]) delete forms.grade.qtd[corId][t]
  })
}

function addCor() {
  if (selectCor.value === null || selectCor.value === undefined || selectCor.value === "") return

  const corId = Number(selectCor.value)
  if (Number.isNaN(corId)) return
  if (forms.grade.cores.includes(corId)) return

  forms.grade.cores.push(corId)
  selectCor.value = null
  ensureMatrix()
}

function removeCor(corId) {
  const cid = Number(corId)
  forms.grade.cores = forms.grade.cores.filter((x) => Number(x) !== cid)
  delete forms.grade.qtd[cid]
}

// pra mostrar nome/hexa na linha
function getCor(corId) {
  const cid = Number(corId)
  return cores.value.find((c) => Number(c.id) === cid) || null
}

// TOTAL (você usa no chip)
const totalGrade = computed(() => {
  ensureGradeShape()

  let total = 0
  forms.grade.cores.forEach((corId) => {
    forms.grade.tamanhos.forEach((tam) => {
      total += Number(forms.grade.qtd?.[Number(corId)]?.[tam] ?? 0)
    })
  })
  return total
})

// UX: lista de opções sem duplicar
const tamanhosDisponiveis = computed(() =>
    tamanhos.value.filter((t) => !forms.grade.tamanhos.includes(t.value))
)

const coresDisponiveis = computed(() =>
    cores.value.filter((c) => !forms.grade.cores.includes(Number(c.id)))
)

/**
 * Salvar formulário
 */
const salvarFormulario = async () => {
  if (formRef.value && !(await formRef.value.validate())) {
    return;
  }

  forms.utiliza_balanca = forms.utiliza_balanca ? 'S' : 'N';
  forms.utiliza_lote = forms.utiliza_lote ? 'S' : 'N';
  forms.utiliza_grade = forms.utiliza_grade ? 'S' : 'N';
  forms.utiliza_nrserie = forms.utiliza_nrserie ? 'S' : 'N';
  forms.em_promocao = forms.em_promocao ? 'S' : 'N';

  await produtosStore.cadastrarProduto({
    "descproduto": forms.descproduto,
    "aplicacao": forms.aplicacao,
    "tipo": forms.tipo,
    "codigo_gtin": forms.codigo_gtin,
    "codigo_sku": forms.codigo_sku,
    "codigo_fab": forms.codigo_fab,
    "codigo_ref": forms.codigo_ref,
    "id_grupo": forms.id_grupo,
    "id_subgrupo": forms.id_subgrupo,
    "id_marca": forms.id_marca,
    "id_medida": forms.id_medida,
    "id_classe": forms.id_classe,
    "id_garantia": forms.id_garantia,
    "utiliza_balanca": forms.utiliza_balanca,
    "utiliza_grade": forms.utiliza_grade,
    "utiliza_nrserie": forms.utiliza_nrserie,
    "utiliza_lote": forms.utiliza_lote,
    "id_ncm": forms.id_ncm,
    "em_promocao": forms.em_promocao,
    "observacao": forms.observacao,
  });
  cancelarFormulario();
  formularioAberto.value = false;
}

/**
 * Cancelar formulário
 */
function cancelarFormulario() {
  Object.assign(forms, {
    "descproduto": "",
    "aplicacao": "",
    "tipo": "",
    "codigo_gtin": "",
    "codigo_sku": "",
    "codigo_fab": "",
    "codigo_ref": "",
    "id_grupo": null,
    "id_subgrupo": null,
    "id_marca": null,
    "id_medida": null,
    "id_classe": null,
    "id_garantia": null,
    "utiliza_balanca": "",
    "utiliza_grade": "",
    "utiliza_nrserie": "",
    "utiliza_lote": "",
    "id_ncm": "",
    "em_promocao": "",
    "observacao": "",
    "ativo": "S"
  });

  descgrupo.value = '';
  descclasse.value = '';
  descmarca.value = '';
  descgarantia.value = '';
  descmedida.value = '';
  if (formRef.value) formRef.value.resetValidation()
}

/**
 * ADICIONAR NOVA COR
 */

const modalNovaCor = ref(false)

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
]

const editandoCorId = ref(null)

const modoCor = computed(() => (editandoCorId.value ? "edit" : "create"))


const novaCor = reactive({
  descricao: "",
  id_cor_denatran: null,
  cor_hexa: ""
})

function resetNovaCor() {
  novaCor.descricao = ""
  novaCor.id_cor_denatran = null
  novaCor.cor_hexa = ""
  modalNovaCor.value = false
}

function abrirModalNovaCor() {
  editandoCorId.value = null
  modalNovaCor.value = true
}

function abrirEditarCor(cor) {
  console.log('cor pra editar: ', cor)
  editandoCorId.value = cor
  modoCor.value = "edit"

  // preenche form
  novaCor.descricao = cor.descricao
  novaCor.id_cor_denatran = cor.id_cor_denatran
  novaCor.cor_hexa = cor.cor_hexa

  modalNovaCor.value = true
}

// validações simples
const corFormValida = computed(() => {
  const descOk = String(novaCor.descricao || "").trim().length >= 2
  const denOk = !!novaCor.id_cor_denatran
  const hexOk = /^#([0-9A-Fa-f]{6})$/.test(String(novaCor.cor_hexa || "").trim())
  return descOk && denOk && hexOk
})

async function salvarOuEditarCor() {
  if (!corFormValida.value) return

  const payload = {
    descricao: String(novaCor.descricao).trim().toUpperCase(),
    id_cor_denatran: Number(novaCor.id_cor_denatran),
    cor_hexa: String(novaCor.cor_hexa).trim().toUpperCase()
  }

  if (modoCor.value === "edit") {
    await produtosStore.atualizarCor(editandoCorId.value?.id, payload);
  }

  else {
    await produtosStore.cadastrarCor(payload);
  }

  if (!produtosStore.errorMessage) {
    resetNovaCor()
    editandoCorId.value = null
  }
}

/**
 * SELECIONAR NCM
 */

const selecionarNcm = (ncmSelecionado) => {
  forms.id_ncm = ncmSelecionado.id;
  console.log("NCM Selecionado: ", ncmSelecionado);
}

/**
 * SELECIONAR GRUPO
 */

const selecionarGrupo = async (grupoSelecionado) => {
  forms.id_grupo = grupoSelecionado.id;
  descgrupo.value = grupoSelecionado.descgrupo;
  await buscarSubgrupos(grupoSelecionado.id);
};

/**
 * SELECIONAR CLASSE
 */

const selecionarClasse = (classeSelecionada) => {
  forms.id_classe = classeSelecionada.id;
  descclasse.value = classeSelecionada.descclasse;
};

/**
 * SELECIONAR MARCA
 */

const selecionarMarca = (itemSelecionado) => {
  forms.id_marca = itemSelecionado.id;
  descmarca.value = itemSelecionado.descmarca;
};

/**
 * SELECIONAR GARANTIA
 */

const selecionarGarantia = (itemSelecionado) => {
  forms.id_garantia = itemSelecionado.id;
  descgarantia.value = itemSelecionado.descgarantia;
};

/**
 * SELECIONAR MEDIDA
 */

const selecionarMedida = (itemSelecionado) => {
  forms.id_medida = itemSelecionado.id;
  descmedida.value = itemSelecionado.descmedida;
};

/**
 * Carregar dados das APIs
 */
onMounted(async () => {
  await produtosStore.buscarProdutos();
  await produtosStore.buscarCores();
  ensureGradeShape();
})

const buscarSubgrupos = async (id_grupo) => {
  await estoqueStore.buscarTodosSubgrupos(id_grupo);
}
</script>

<style scoped>
.grade-erp {
  padding: 16px;
  background: var(--bg-color-secondary) !important;
  color: var(--text-color) !important;
}

.grade-erp__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.grade-erp__body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
}

/* LEFT (cores) */
.grade-erp__left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.grade-erp__left-title {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: rgba(0,0,0,0.04);
  border-radius: 8px;
}

.grade-erp__sizes-title {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: rgba(0,0,0,0.04);
  border-radius: 8px;
}

.grade-erp__left-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 2px;
}

.grade-erp__left-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 8px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.06);
  background: var(--bg-color);
}

.grade-erp__left-add {
  display: grid;
  grid-template-columns: 1fr 42px;
  gap: 8px;
  align-items: center;
}

/* RIGHT (tamanhos e grid) */
.grade-erp__right {
  overflow: auto;
}

.grade-erp__sizes {
  display: grid;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

/* cabeçalho de cada tamanho (cinza igual imagem) */
.grade-erp__size-cell {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-radius: 8px;
  background: var(--bg-color);
  font-weight: 600;
}

/* última “coluna” do cabeçalho com select + botão + */
.grade-erp__size-add {
  display: grid;
  grid-template-columns: 1fr 42px;
  gap: 8px;
  align-items: center;
}

/* grid de inputs */
.grade-erp__grid-wrap {
  overflow: auto;
  padding-bottom: 4px;
}

.grade-erp__grid {
  display: grid;
  gap: 8px;
}

/* célula */
.grade-erp__cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* input pequeno centralizado */
.grade-erp__input :deep(.v-field__input) {
  text-align: center;
}

/* bolinha da cor */
.cor-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid rgba(0,0,0,0.18);
  margin-right: 10px;
}

.gap-2 { gap: 8px; }

/* botão + verde igual exemplo */
.grade-erp__btn-plus {
  background: var(--text-color-laranja) !important;
  color: #fff !important;
}

.gap-2 { gap: 8px; }

/* deixa o input mais “quadradinho” estilo grade */
.grade-input :deep(.v-field__input) {
  text-align: center;
  padding-inline: 8px;
}
</style>