<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Devolução de Compra</template>

    <template #section>
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
            @click="salvarFormulario"
            variant="flat"
            :loading="produtosStore.loading"
        >
          Salvar devolução
        </v-btn>
      </div>

      <forms-devolucao
          :forms="forms"
          :validacao="validacao"
          :pessoas="pessoas"
          @preencher-itens="(itens) => preencherItensDevolucao(itens)"
          :entradas="entradasFormatadas"
          :cfops="aliquotasFormatadas"
          :almoxarifados="almoxarifados"
          forms-nf="formsNf"
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

              <template v-else-if="col.key === 'qtd_devolver'">
                <v-text-field
                    v-model.number="item.qtd_devolver"
                    type="number"
                    density="compact"
                    variant="outlined"
                    hide-details
                    min="0"
                    :max="item.quantidade"
                    style="max-width: 100px"
                />
              </template>

              <template v-else-if="col.key === 'vlr_devolver'">
                <span class="money">
                  {{ formatarReal(Number(item.qtd_devolver || 0) * Number(item.vlr_unitario || 0)) }}
                </span>
              </template>

              <template v-else-if="col.key === 'vlr_unitario'">
                <span class="money">
                  <span class="money">{{ formatarReal(item.vlr_unitario) }}</span>
                </span>
              </template>

              <template v-else-if="col.key === 'vlr_ipi_item'">
                <span class="money">{{ formatarReal(item.vlr_ipi_item) }}</span>
              </template>

              <template v-else-if="col.key === 'vlr_icms_item'">
                <span class="money">{{ item.vlr_icms_item }}</span>
              </template>

              <template v-else-if="col.key === 'vlr_total_item'">
                <span class="money">{{ formatarReal(item.vlr_total_item) }}</span>
              </template>

              <template v-else>
                {{ item[col.key] }}
              </template>
            </td>
          </tr>
        </template>
      </tabela-padrao>

      <div class="d-flex justify-end mt-4">
        <v-card class="pa-4 background-laranja" elevation="0" width="320">
          <p class="text-caption mb-1">Valor total a devolver</p>
          <h2 class="text-h6 font-weight-bold">
            {{ formatarReal(valorTotalDevolver) }}
          </h2>
        </v-card>
      </div>
    </template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import FormsDevolucao from "@/components/base/produtos/entrada/FormsDevolucao.vue";

import {usePessoasStore} from "@/stores/APIs/pessoas";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {useEstoqueStore} from "@/stores/APIs/estoque";

import {computed, onMounted, reactive, ref} from "vue";
import {toast} from "vue3-toastify";

const pessoasStore = usePessoasStore();
const produtosStore = useProdutosStore();
const estoqueStore = useEstoqueStore();

const idEmpresa = JSON.parse(localStorage.getItem("empresaSelecionada"));

const pessoas = computed(() => pessoasStore.pessoas);

const editando = ref(false);
const search = ref("");

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

// ======================= HEADERS (tabela) =======================
const headers = ref([
  {title: "N. Item", key: "id_seq"},
  {title: "Descrição do Produto", key: "descprodutoxml"}, // se você já usa do XML
  {title: "Unidade", key: "quant_item"}, // se você já usa do XML
  {title: "Vlr. Unitário", key: "vlr_unitario"},
  {title: "Vlr. IPI Item", key: "vlr_ipi_item"},
  {title: "Vlr ICMS Item", key: "vlr_icms_item"},
  {title: "Quantidade", key: "quantidade"},
  {title: "Total", key: "vlr_total_item"},
  {title: "Qtd. Devolver", key: "qtd_devolver"},
  {title: "Vlr. Devolver", key: "vlr_devolver"},
]);

// Itens que irão para payload (já no formato da sua tabela)
const itensTabela = ref([]);

const preencherItensDevolucao = (itens) => {
  itensTabela.value = itens.map((item, index) => ({
    ...item,
    id_seq: item.id_seq ?? index + 1, // 👈 aqui resolve
    qtd_devolver: 0,
    vlr_devolver: 0,
  }));
};

// ======================= VALIDAÇÃO =======================
const validacao = [v => !!v || "Campo obrigatório"];

// ======================= FORMS (CAMPOS DAS IMAGENS) =======================
const forms = reactive({
  id_entrada_origem: null, // id da entrada selecionada

  // cabeçalho (imagem 1)
  id_empresa: idEmpresa?.id ?? null,
  id_fornecedor: null,
  dtentrada: null,
  dtEmissao: null,
  vlr_total_produto: null,
  observacao: null,
  id_transportadora: null,
  id_cfop: null,
  id_uf: null,

  // frete
  usa_frete: false,
  tipo_frete: '9',
  vlr_frete: '0,00',
  qtd_volume: 0,
  peso_bruto: '0,075',
  peso_liquido: '0,075',
  placa_veiculo: '',
  especie_volume: '',
  vlr_seguro: '0,000',
  vlr_outras: '0,000',

  // campos faltando
  id_sass: null,
  numero_nf: 0,
  serie_nf: 0,
  id_almoxarifado: null,
  vlr_nf: 0,
  nf_exportada: false,
  tipo_origem: null
});

// ======================= ALIQUOTAS/CFOPS (para selecionar no autocomplete) =======================
const aliquotas = computed(() => estoqueStore.aliquotas ?? []);

const aliquotasFormatadas = computed(() => {
  const idUfSelecionado = forms?.id_uf;

  return (aliquotas.value || [])
      .filter(a => {
        if (!idUfSelecionado) return true;
        return a.id_uf === idUfSelecionado;
      })
      .map(a => ({
        ...a,
        title: `${a.id_cfop} - ${a.desccfop}`,
        value: a.id_cfop
      }));
});

// ========================== ALMOXARIFADOS ========================
const almoxarifados = computed(() => estoqueStore.almoxarifados ?? []);

onMounted(async () => {
  await estoqueStore.buscarAlmoxarifados(idEmpresa?.id)
})

// ======================= RESET =======================
const cancelarFormulario = () => {
  for (const key in forms) forms[key] = null;

  forms.id_empresa = idEmpresa?.id ?? null;
  itensTabela.value = [];

  editando.value = false;
};

// ======================= NORMALIZAÇÃO =======================
const camposFloat = ["vlr_total_produto", "vlr_frete",];

const camposInteiros = [
  "id_empresa",
  "id_fornecedor",
  "id_transportadora",
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
const entradas = computed(() => produtosStore.entradadfe ?? []);

const entradasFormatadas = computed(() => {
  return (entradas.value || []).map(e => ({
    ...e,
    label: `#${e.id} • NF ${e.numero_nf ?? e.id_nota ?? '-'} - Série ${e.serie_nf ?? e.id_serie ?? '-'} • ${e.nome_razao ?? ''}`.trim(),
    value: e.id
  }));
});

// ao montar: buscar entradas (pra poder selecionar)
onMounted(async () => {
  await produtosStore.buscarEntradasDfe(idEmpresa?.id ?? 1);
});


// ======================= SALVAR =======================
// const formsNf = ref(null);

const valorTotalDevolver = computed(() => {
  return itensTabela.value.reduce((total, item) => {
    const qtd = Number(item.qtd_devolver || 0);
    const vlrUnitario = Number(item.vlr_unitario || 0);

    item.vlr_devolver = Number((qtd * vlrUnitario).toFixed(2));

    return total + item.vlr_devolver;
  }, 0);
});

const salvarFormulario = async () => {
  if (!forms.id_entrada_origem || itensTabela.value.length === 0) {
    toast.error("Por favor, preencha os campos obrigatórios.");
    return;
  }

  const itensParaEnviar = itensTabela.value.map(item => {
    const qtd = Number(item.qtd_devolver || 0);
    const vlrUnitario = Number(item.vlr_unitario || 0);

    return {
      id_produto: item.id_produto,
      id_cor: item.id_cor,
      id_tamanho: item.id_tamanho,
      quantidade: item.quantidade,
      vlr_unitario: item.vlr_unitario,
      desconto_total_item: item.desconto_total_item,
      vlr_total_item: item.vlr_total_item,
      vlr_seguro_item: item.vlr_seguro_item,
      vlr_frete_item: item.vlr_frete_item,
      vlr_outras_item: item.vlr_outras_item,
      custo_medio: item.custo_medio,
      qtd_devolver: qtd,
      vlr_devolver: Number((qtd * vlrUnitario).toFixed(2)),
      id_evento: item.id_evento,
      id: item.id,
      id_empresa: item.id_empresa,
      id_seq: item.id_seq,
      id_cfop_item: item.id_cfop_item,
      cst_item: item.cst_item,
      csosn_item: item.csosn_item,
      cest_item: item.cest_item,
      aliquota_icms_item: item.aliquota_icms_item,
      base_icms_item: item.base_icms_item,
      vlr_icms_item: item.vlr_icms_item,
      aliquota_subst_item: item.aliquota_subst_item,
      base_icms_subst_item: item.base_icms_subst_item,
      vlr_icms_subst_item: item.vlr_icms_subst_item,
      cst_ipi: item.cst_ipi,
      aliquota_ipi_item: item.aliquota_ipi_item,
      cenqipi: item.cenqipi,
      base_ipi_item: item.base_ipi_item,
      vlr_ipi_item: item.vlr_ipi_item,
      cst_pis: item.cst_pis,
      aliquota_pis_item: item.aliquota_pis_item,
      base_pis_item: item.base_pis_item,
      cst_cofins: item.cst_cofins,
      aliquota_cofins_item: item.aliquota_cofins_item,
      base_cofins_item: item.base_cofins_item,
      reducao_base_calc: item.reducao_base_calc,
      aliq_mva: item.aliq_mva,
      pmva_item: item.pmva_item,
      mod_bc: item.mod_bc,
      mod_bcst: item.mod_bcst,
      predbc: item.predbc,
      predbcst: item.predbcst,
      id_ncm_item: item.id_ncm_item,
      incidenciafiscal_item: item.incidenciafiscal_item,
      vlr_iss_item: item.vlr_iss_item,
      vlr_ir_item: item.vlr_ir_item,
      vlr_csll_item: item.vlr_csll_item,
      classctrib_item: item.classctrib_item,
      cst_cbsibs_item: item.cst_cbsibs_item,
      base_cbsibs_item: item.base_cbsibs_item,
      perc_cbs_item: item.perc_cbs_item,
      vlr_cbs_item: item.vlr_cbs_item,
      perc_ibsuf_item: item.perc_ibsuf_item,
      vlr_ibsuf_item: item.vlr_ibsuf_item,
      perc_ibsmu_item: item.perc_ibsmu_item,
      vlr_ibsmu_item: item.vlr_ibsmu_item,
    };
  });

  const itemInvalido = itensTabela.value.find(item => {
    const qtdDevolver = Number(item.qtd_devolver || 0);
    const quantidade = Number(item.quantidade || 0);

    return qtdDevolver > quantidade;
  });

  if (itemInvalido) {
    console.log('Item inválido:', itemInvalido);

    toast.error("Quantidade a devolver não pode ser maior que a quantidade da entrada original.");
    return;
  }

  await produtosStore.cadastrarDevEntrada(
      {
        data: [
          {
            ...normalizarForm(forms),
            valor_total_devolver: Number(valorTotalDevolver.value.toFixed(2)),
          }
        ],
        item: itensParaEnviar,
      },
      idEmpresa?.id ?? 1
  );

  cancelarFormulario();
};

// ======================= FORMATAÇÃO =======================
function formatarReal(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return "R$ 0,00";
  }

  // Converte string tipo "74,85" → 74.85
  if (typeof valor === "string") {
    valor = valor.replace(/\./g, "").replace(",", ".");
  }

  const numero = Number(valor);

  if (isNaN(numero)) {
    return "R$ 0,00";
  }

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// ======================= INIT =======================
onMounted(() => {
  if (pessoas.value.length === 0) pessoasStore.buscarTodasPessoas();

  if (produtosStore.produtos.length === 0) {
    produtosStore.buscarProdutos();
  }

  if (estoqueStore.aliquotas.length === 0) {
    estoqueStore.buscarTodasAliquotas(idEmpresa?.id, "");
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