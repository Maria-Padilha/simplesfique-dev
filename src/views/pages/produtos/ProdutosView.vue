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
                      :label="`Utiliza Grade? ${forms.utiliza_grade ? 'Sim' : 'Não'}`"
                      v-model="forms.utiliza_grade"
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
import {useEstoqueStore} from "@/stores/APIs/estoque";
import {useThemeStore} from "@/stores/config-temas/theme";
import NcmMenu from "@/components/base/menu/NcmMenu.vue";
import GruposMenu from "@/components/base/menu/GruposMenu.vue";
import ClassesMenu from "@/components/base/menu/ClassesMenu.vue";
import MarcasMenu from "@/components/base/menu/MarcasMenu.vue";
import GarantiaMenu from "@/components/base/menu/GarantiaMenu.vue";
import MedidasMenu from "@/components/base/menu/MedidasMenu.vue";

const produtosStore = useProdutosStore();
const estoqueStore = useEstoqueStore();
const themeStore = useThemeStore();

const loading = computed(() => produtosStore.loading);
const produtos = computed(() => produtosStore.produtos);

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
  "utiliza_grade": "",
  "utiliza_nrserie": "",
  "utiliza_lote": "",
  "id_ncm": "",
  "em_promocao": "",
  "observacao": "",
  "ativo": "S"
});

const descgrupo = ref('');
const descclasse = ref('');
const descmarca = ref('');
const descgarantia = ref('');
const descmedida = ref('');


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
    data: [
      {
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
      }
    ]
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
watchEffect(async () => {
  if (produtosStore.produtos.length === 0) {
    await produtosStore.buscarProdutos();
  }
})

const buscarSubgrupos = async (id_grupo) => {
  await estoqueStore.buscarTodosSubgrupos(id_grupo);
}
</script>