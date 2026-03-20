<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Devolução de Entrada</template>

    <template #section>
      <v-form ref="formsNf" @submit.prevent="salvarFormulario">
        <div class="flex items-center justify-end gap-3 mb-4">
          <v-btn
              size="small"
              color="var(--text-color-laranja)"
              variant="tonal"
              @click="cancelarFormulario"
          >
            Cancelar
          </v-btn>

          <v-btn
              size="small"
              color="var(--text-color-laranja)"
              class="text-white"
              type="submit"
              variant="flat"
              :loading="produtosStore.loading"
          >
            Salvar devolução
          </v-btn>
        </div>

        <!-- ✅ Você pode reaproveitar o FormsEntrada se ele suportar os campos,
             ou criar um FormsDevolucaoEntrada com os inputs corretos -->
        <forms-devolucao
            :forms="forms"
            :validacao="validacao"
            :pessoas="pessoas"
            :ufs="ufsFiltradas"
            :cfops="cfopsFiltrados"
            :almoxarifado-nome="almoxarifadoNome"
            :cfop-nome="cfopNome"
            :selecionar-almoxarifado="selecionarAlmoxarifado"
            @ler-xml="lerXML"
            @preencher-itens="(itens) => (produtos.value = itens)"
            :entradas="entradasFormatadas"
            :themeStore="themeStore"
        />

        <tabela-padrao
            titulo-pesquisa="Itens da Devolução"
            :headers="headers"
            :items="itensTabela"
            :show-search="true"
            :item-key="'id_seq'"
            no-data-icon="mdi-database-off"
            :item-por-pag="10"
            no-data-text="Nenhum item encontrado"
            v-model:expanded="expanded"
            :expand-on-click="false"
            :expandable="true"
            v-model:search="search"
        >
          <template #item="{ item, columns, props }">
            <tr v-bind="props" :class="{ 'linha-ativa': openId === item.id_seq }">
              <td v-for="col in columns" :key="col.key">
                <template v-if="col.key === 'data-table-expand'">
                  <v-icon size="20" class="cursor-pointer" @click.stop="toggle(item)">
                    {{ expanded.includes(item.id_seq) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </template>

                <template v-else>
                  {{ item[col.key] }}
                </template>
              </td>
            </tr>
          </template>

          <template v-slot:[`item.vlr_unitario`]="{ item }">
            <span class="money">{{ formatarReal(item.vlr_unitario) }}</span>
          </template>

          <template v-slot:[`item.vlr_ipi_item`]="{ item }">
            <span class="money">{{ formatarReal(item.vlr_ipi_item) }}</span>
          </template>

          <template v-slot:[`item.vlr_icms_item`]="{ item }">
            <span class="money">{{ formatarReal(item.vlr_icms_item) }}</span>
          </template>

          <template v-slot:[`item.vlr_total_item`]="{ item }">
            <span class="money">{{ formatarReal(item.vlr_total_item) }}</span>
          </template>

          <template #expanded-row="{ columns, item }">
            <tr :class="{ 'linha-ativa-expand': openId === item.id_seq }" class="background-primary z-0">
              <td :colspan="columns.length" class="pa-0">
                <transition name="row-expand">
                  <div v-show="openId === item.id_seq" class="row-expand__wrap">
                    <VincularProdutos
                        titulo-pesquisa="Vincular a um produto"
                        v-model:modalItemAberto="modalItemAberto"
                        :todosProdutos="todosProdutos"
                        :itemSelecionado="item"
                        @vincular="vincularProduto"
                        v-model:search="pesquisarProdutos"
                    />
                  </div>
                </transition>
              </td>
            </tr>
          </template>
        </tabela-padrao>
      </v-form>
    </template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import FormsDevolucao from "@/components/base/produtos/entrada/FormsDevolucao.vue";
import VincularProdutos from "@/components/base/modais/VincularProdutos.vue";

import { useThemeStore } from "@/stores/config-temas/theme";
import { usePessoasStore } from "@/stores/APIs/pessoas";
import { useProdutosStore } from "@/stores/APIs/produtos";
import { useEstoqueStore } from "@/stores/APIs/estoque";
import { useFuncoesStore } from "@/stores/funcoes/funcoes";

import { computed, onMounted, reactive, ref, watch } from "vue";
import { toast } from "vue3-toastify";

const themeStore = useThemeStore();
const funcoesStore = useFuncoesStore();
const pessoasStore = usePessoasStore();
const produtosStore = useProdutosStore();
const estoqueStore = useEstoqueStore();

const idEmpresa = JSON.parse(localStorage.getItem("empresaSelecionada"));
const cnpjEmpresa = idEmpresa?.cnpj || null;

const pessoas = computed(() => pessoasStore.pessoas);
const todosProdutos = computed(() => produtosStore.produtos);
const aliquotas = computed(() => estoqueStore.aliquotas ?? []);

const almoxarifadoNome = ref("");
const cfopNome = ref("");
const editando = ref(false);

const search = ref("");
const pesquisarProdutos = ref("");

const expanded = ref([]);
const openId = ref(null);
const ANIM_MS = 320;

const toggle = async (item) => {
  const id = item.id_seq;

  if (openId.value === id) {
    openId.value = null;
    setTimeout(() => {
      if (openId.value === null) expanded.value = [];
    }, ANIM_MS);
    return;
  }

  openId.value = id;
  expanded.value = [id];
};

// ======================= XML (mantive igual ao seu) =======================
const xmlData = ref(null);
const ide = ref(null);
const emit = ref(null);
const dest = ref(null);
const itens = ref([]);
const total = ref(null);
const transp = ref(null);
const pag = ref(null);
const infAdic = ref(null);

// ======================= HEADERS (tabela) =======================
const headers = ref([
  { title: "N. Item", key: "id_seq" },
  { title: "Descrição do Produto", key: "descprodutoxml" }, // se você já usa do XML
  { title: "Unidade", key: "quant_item" }, // se você já usa do XML
  { title: "Vlr. Unitário", key: "vlr_unitario" },
  { title: "Vlr. IPI Item", key: "vlr_ipi_item" },
  { title: "Vlr ICMS Item", key: "vlr_icms_item" },
  { title: "Quantidade", key: "quantidade" },
  { title: "Total", key: "vlr_total_item" },
  { title: "Código VST", key: "id_produto" },
  { title: "Ação", key: "data-table-expand" },
]);

// Itens que irão para payload (já no formato da sua tabela)
const itensTabela = ref([]);

// ======================= VALIDAÇÃO =======================
const validacao = [v => !!v || "Campo obrigatório"];

// ======================= FORMS (CAMPOS DAS IMAGENS) =======================
const forms = reactive({
  // cabeçalho (imagem 1)
  id_empresa: idEmpresa?.id ?? null,
  id_fornecedor: null,
  numero_nf: null,
  serie_nf: null,
  tipo: null,
  id_almoxarifado: null,
  id_uf: null,
  id_cfop: null,
  dtcadastro: null,
  dtemissao: null,
  dtsaida: null,
  dtcancelamento: null,
  vlr_total_produto: null,
  vlr_nf: null,
  gerou_financeiro: "N",
  gerou_estoque: "N",
  observacao: null,
  id_planopagto: null,
  nf_exportada: "N",
  id_transportadora: null,
  placa_veiculo: null,
  id_modelo_nf: null,
  id_saida_origem: null,
  tipo_saida_origem: null,
  situacao: null,
  nfe_impressa: "N",

  // totais/impostos gerais (imagem 2)
  base_icms: null,
  aliquota_icms: null,
  vlr_icms: null,
  isento_icms: null,
  outras_despesas: null,
  outras_despesas_foranf: null,
  base_icms_subst: null,
  vlr_icms_subst: null,
  base_ipi: null,
  vlr_ipi: null,
  isento_ipi: null,
  vlr_seguro: null,
  vlr_desconto: null,
  tipo_frete: null,
  vlr_frete: null,
  qtd_volume: null,
  especie_volume: null,
  peso_bruto: null,
  peso_liquido: null,
  base_ii: null,
  vlr_ii: null,
  base_iss: null,
  vlr_iss: null,
  vlr_pis_produto: null,
  vlr_cofins_produto: null,
  base_cbsibs: null,
  vlr_cbs: null,
  vlr_ibsuf: null,
  vlr_ibsmun: null,

  // dados NFe (imagem 3)
  nfe_numero: null,
  nfe_numero_serie: null,
  nfe_acesso: null,
  nfe_chavedeacesso_origem: null,
  nfe_modelo: null,
  nfe_nrlote: null,
  nfe_nrrecibo: null,
  nfe_status: null,
  nfe_chavedeacesso: null,
  nfe_tp_emissao_danfe: null,
  nfe_nrprotocolo_envio: null,
  nfe_nrprotocolo_inutil: null,
  nfe_nrprotocolo_cancelamento: null,
  msg_nfe_nfce: null,
  arquivoxml: null,
});

// ======================= AUX: selecionar almox/cfop =======================
const selecionarAlmoxarifado = (almoxarifado) => {
  forms.id_almoxarifado = almoxarifado.id;
  almoxarifadoNome.value = almoxarifado.descalmoxarifado || almoxarifado.nome || "";
};

const cfopsFiltrados = computed(() => {
  const base = forms.id_uf ? aliquotas.value.filter(a => a.id_uf === forms.id_uf) : aliquotas.value;

  return [...new Set(base.map(a => a.id_cfop))]
      .filter(Boolean)
      .map(v => ({ title: v, value: v }));
});

const ufsFiltradas = computed(() => {
  const base = forms.id_cfop ? aliquotas.value.filter(a => a.id_cfop === forms.id_cfop) : aliquotas.value;

  return [...new Set(base.map(a => a.id_uf))]
      .filter(Boolean)
      .map(v => ({ title: v, value: v }));
});

watch(() => forms.id_uf, (uf) => {
  if (!uf || !forms.id_cfop) return;
  const existe = aliquotas.value.some(a => a.id_uf === uf && a.id_cfop === forms.id_cfop);
  if (!existe) forms.id_cfop = null;
});

watch(() => forms.id_cfop, (cfop) => {
  if (!cfop || !forms.id_uf) return;
  const existe = aliquotas.value.some(a => a.id_cfop === cfop && a.id_uf === forms.id_uf);
  if (!existe) forms.id_uf = null;
});

// ======================= RESET =======================
const cancelarFormulario = () => {
  for (const key in forms) forms[key] = null;

  forms.id_empresa = idEmpresa?.id ?? null;

  // defaults char/bool
  forms.gerou_financeiro = "N";
  forms.gerou_estoque = "N";
  forms.nf_exportada = "N";
  forms.nfe_impressa = "N";

  almoxarifadoNome.value = "";
  cfopNome.value = "";

  itens.value = [];
  itensTabela.value = [];

  editando.value = false;
};

// ======================= NORMALIZAÇÃO =======================
const camposFloat = [
  // gerais
  "vlr_total_produto", "vlr_nf",
  "base_icms", "aliquota_icms", "vlr_icms", "isento_icms",
  "outras_despesas", "outras_despesas_foranf",
  "base_icms_subst", "vlr_icms_subst",
  "base_ipi", "vlr_ipi", "isento_ipi",
  "vlr_seguro", "vlr_desconto", "vlr_frete",
  "peso_bruto", "peso_liquido",
  "base_ii", "vlr_ii",
  "base_iss", "vlr_iss",
  "vlr_pis_produto", "vlr_cofins_produto",
  "base_cbsibs", "vlr_cbs", "vlr_ibsuf", "vlr_ibsmun",
];

const camposInteiros = [
  "id_empresa",
  "id_fornecedor",
  "numero_nf",
  "id_almoxarifado",
  "id_transportadora",
  "id_planopagto",
  "id_modelo_nf",
  "id_saida_origem",
  "qtd_volume",
  "nfe_numero",
  "nfe_numero_serie",
  "nfe_acesso",
];

const normalizarForm = (data) => {
  const result = {};

  for (const key in data) {
    const value = data[key];

    if (camposFloat.includes(key)) {
      const num = Number(value);
      result[key] = Number.isFinite(num) ? Number(num.toFixed(2)) : 0;
      continue;
    }

    if (camposInteiros.includes(key)) {
      const num = Number(value);
      result[key] = Number.isFinite(num) ? parseInt(num) : 0;
      continue;
    }

    if (value === "" || value === undefined) {
      result[key] = null;
      continue;
    }

    result[key] = value;
  }

  return result;
};

// ======================= ENTRADAS (para selecionar no autocomplete) =======================

const entradas = computed(() => produtosStore.entradasdfe ?? []);

// deixa “bonitinho” no autocomplete
const entradasFormatadas = computed(() =>
    console.log("Formatando entradas para autocomplete: ", entradas.value),
    (entradas.value || []).map(e => ({
      ...e,
      label: `#${e.id} • NF ${e.numero_nf ?? e.id_nota ?? '-'} Série ${e.serie_nf ?? e.id_serie ?? '-'} • ${e.nome_razao ?? ''}`.trim()
    }))
);

// ao montar: buscar entradas (pra poder selecionar)
onMounted(async () => {
  await produtosStore.buscarEntradasDfe(idEmpresa?.id ?? 1);
});


// ======================= SALVAR =======================
const formsNf = ref(null);

const salvarFormulario = async () => {
  if (formsNf.value && !(await formsNf.value.validate())) {
    toast.error("Por favor, preencha os campos obrigatórios.");
    return;
  }

  // arquivo XML (se você usa File no input)
  forms.arquivoxml = forms.arquivoxml?.name ? forms.arquivoxml.name : null;

  // 🔁 ajuste para o método REAL do seu store
  await produtosStore.cadastrarDevEntrada(
      {
        data: [normalizarForm(forms)],
        item: itensTabela.value,
      },
      idEmpresa?.id ?? 1
  );

  cancelarFormulario();
};

// ======================= XML helpers (iguais ao seu) =======================
function xmlToJson(element) {
  let obj = {};
  for (let node of element.children) {
    if (node.children.length > 0) obj[node.tagName] = xmlToJson(node);
    else obj[node.tagName] = node.textContent;
  }
  return obj;
}

const lerXML = (file) => {
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    const xmlString = reader.result;
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    xmlData.value = xml;

    ide.value = xml.getElementsByTagName("ide")[0] ? xmlToJson(xml.getElementsByTagName("ide")[0]) : null;
    emit.value = xml.getElementsByTagName("emit")[0] ? xmlToJson(xml.getElementsByTagName("emit")[0]) : null;
    dest.value = xml.getElementsByTagName("dest")[0] ? xmlToJson(xml.getElementsByTagName("dest")[0]) : null;
    total.value = xml.getElementsByTagName("total")[0] ? xmlToJson(xml.getElementsByTagName("total")[0]) : null;
    transp.value = xml.getElementsByTagName("transp")[0] ? xmlToJson(xml.getElementsByTagName("transp")[0]) : null;
    pag.value = xml.getElementsByTagName("pag")[0] ? xmlToJson(xml.getElementsByTagName("pag")[0]) : null;
    infAdic.value = xml.getElementsByTagName("infAdic")[0] ? xmlToJson(xml.getElementsByTagName("infAdic")[0]) : null;

    if (!ide.value || !emit.value || !total.value) {
      toast.error("XML inválido ou incompleto.");
      return;
    }

    if (cnpjEmpresa && dest.value?.CNPJ && dest.value.CNPJ !== cnpjEmpresa) {
      toast.error("CNPJ do destinatário não corresponde ao CNPJ da empresa selecionada!");
      return;
    }

    // montar itens do XML (mantive a sua lógica base)
    const detNodes = xml.getElementsByTagName("det");
    itens.value = [];

    for (let det of detNodes) {
      let item = {};
      item.nItem = det.getAttribute("nItem") ?? null;

      const prod = det.getElementsByTagName("prod")[0];
      if (prod) item.prod = xmlToJson(prod);

      const imposto = det.getElementsByTagName("imposto")[0];
      if (imposto) item.imposto = xmlToJson(imposto);

      itens.value.push(item);
    }

    funcoesStore.preencherFormsDevolucao(
        ide.value, total.value, emit.value, xml,
        dest.value, itens.value, transp.value,
        pag.value, infAdic.value, forms, itensTabela
    );
  };

  reader.readAsText(file);
};

// ======================= VINCULAR PRODUTO =======================
const modalItemAberto = ref(false);

const vincularProduto = async ({ item, produto }) => {
  item.id_produto = produto.id;
  expanded.value = [];
};

// ======================= FORMATAÇÃO =======================
function formatarReal(valor) {
  if (valor === null || valor === undefined || valor === "") return "R$ 0,00";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ======================= INIT =======================
onMounted(() => {
  if (pessoas.value.length === 0) pessoasStore.buscarTodasPessoas();

  if (estoqueStore.aliquotas.length === 0) {
    estoqueStore.buscarTodasAliquotas(idEmpresa?.id, "");
  }

  if (produtosStore.produtos.length === 0) {
    produtosStore.buscarProdutos();
  }
});
</script>

<style scoped>
.linha-ativa {
  border-right: 0.5px solid var(--text-color-laranja);
  border-left: 0.5px solid var(--text-color-laranja);
  background: rgba(253, 124, 0, 0.2);
}

.linha-ativa-expand {
  background: rgba(253, 124, 0, 0.09);
}

.money {
  text-align: right;
  font-weight: 500;
}
</style>