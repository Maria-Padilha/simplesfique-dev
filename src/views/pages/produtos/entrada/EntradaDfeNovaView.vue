<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Entrada de Nota</template>
    <template #section>
      <v-form ref="formsNf" @submit.prevent="salvarFormulario">
        <div class="flex items-center justify-end gap-3 mb-4">
          <v-btn size="small" color="var(--text-color-laranja)" variant="tonal" @click="cancelarFormulario">
            Cancelar
          </v-btn>

          <v-btn size="small" color="var(--text-color-laranja)" class="text-white" type="submit" variant="flat" :loading="produtosStore.loading">
            Salvar entrada
          </v-btn>
        </div>

        <forms-entrada
            :forms="forms"
            :validacao="validacao"
            :pessoas="pessoas"
            :ufs="ufsFiltradas"
            :cfops="cfopsFiltrados"
            :almoxarifado-nome="almoxarifadoNome"
            :cfop-nome="cfopNome"
            :editando="editando"
            :selecionar-almoxarifado="selecionarAlmoxarifado"
            @ler-xml="lerXML"
            :themeStore="themeStore"
        />

        <tabela-padrao
            titulo-pesquisa="Produtos da Nota"
            :headers="headers"
            :items="produtos"
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
            <tr
                v-bind="props"
                :class="{ 'linha-ativa': openId === item.id_seq }"
            >
              <td v-for="col in columns" :key="col.key">
                <!-- COLUNA DE EXPAND -->
                <template v-if="col.key === 'data-table-expand'">
                  <v-icon
                      size="20"
                      class="cursor-pointer"
                      @click.stop="toggle(item)"
                  >
                    {{ expanded.includes(item.id_seq)
                      ? 'mdi-chevron-up'
                      : 'mdi-chevron-down' }}
                  </v-icon>
                </template>

                <!-- DEMAIS COLUNAS -->
                <template v-else>
                  {{ item[col.key] }}
                </template>
              </td>
            </tr>
          </template>

          <template v-slot:[`item.vlr_unitario`]="{ item }">
            <span class="money">
              {{ formatarReal(item.vlr_unitario) }}
            </span>
          </template>

          <!-- Valor IPI -->
          <template v-slot:[`item.vlr_ipi_item`]="{ item }">
            <span class="money">
              {{ formatarReal(item.vlr_ipi_item) }}
            </span>
          </template>

          <!-- Valor ICMS -->
          <template v-slot:[`item.vlr_icms_item`]="{ item }">
            <span class="money">
              {{ formatarReal(item.vlr_icms_item) }}
            </span>
          </template>

          <!-- Total -->
          <template v-slot:[`item.vlr_total_item`]="{ item }">
            <span class="money">
              {{ formatarReal(item.vlr_total_item) }}
            </span>
          </template>

          <template #expanded-row="{ columns, item }">
            <tr :class="{ 'linha-ativa-expand': openId === item.id_seq }" class="background-primary z-0">
              <td :colspan="columns.length" class="pa-0">
                <transition name="row-expand">
                  <div
                      v-show="openId === item.id_seq"
                      class="row-expand__wrap"
                  >
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
import {usePessoasStore} from "@/stores/APIs/pessoas";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {useEstoqueStore} from "@/stores/APIs/estoque";
import {computed, onMounted, reactive, ref, watch,} from "vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import FormsEntrada from "@/components/base/produtos/entrada/FormsEntrada.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {toast} from "vue3-toastify";
import {useFuncoesStore} from "@/stores/funcoes/funcoes";
import VincularProdutos from "@/components/base/modais/VincularProdutos.vue";

const themeStore = useThemeStore();
const funcoesStore = useFuncoesStore();
const pessoasStore = usePessoasStore();
const produtosStore = useProdutosStore();
const estoqueStore = useEstoqueStore();
const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));
const cnpjEmpresa = idEmpresa?.cnpj || null;

const pessoas = computed(() => pessoasStore.pessoas);
const todosProdutos = computed(() => produtosStore.produtos);

const aliquotas = computed(() => estoqueStore.aliquotas ?? []);

const almoxarifadoNome = ref("");
const cfopNome = ref("");
const editando = ref(false);
const produtos = ref([]);
const search = ref("");
const pesquisarProdutos = ref("");

const expanded = ref([])
const openId = ref(null)
const ANIM_MS = 320

const toggle = async (item) => {
  const id = item.id_seq

  // FECHAR
  if (openId.value === id) {
    openId.value = null
    setTimeout(() => {
      if (openId.value === null)
        expanded.value = [] },
        ANIM_MS)
    return
  }
  openId.value = id
  expanded.value = [id]
}

// DADOS DO XML
const xmlData = ref(null);

const ide = ref(null);
const emit = ref(null);
const dest = ref(null);
const itens = ref([]);
const total = ref(null);
const transp = ref(null);
const pag = ref(null);
const infAdic = ref(null);

const headers = ref([
  {title: 'N. Item', key: 'id_seq'},
  {title: 'Descrição do Produto', key: 'descprodutoxml'},
  {title: 'Unidade', key: 'uCom'},
  {title: 'Vlr. Unitário', key: 'vlr_unitario'},
  {title: 'Vlr. IPI Item', key: 'vlr_ipi_item'},
  {title: 'Vlr ICMS Item', key: 'vlr_icms_item'},
  {title: 'Quantidade', key: 'quantidade'},
  {title: 'Total', key: 'vlr_total_item'},
  {title: 'Código VST', key: 'id_produto'},
  {title: 'Ação', key: 'data-table-expand'},
])

const validacao = [
  v => !!v || 'Campo obrigatório',
];

const forms = reactive({
  "id_empresa": idEmpresa?.id ?? null,
  "id_fornecedor": null,
  "numero_nf": null,
  "serie_nf": null,
  "id_almoxarifado": null,
  "id_cfop": null,
  "id_uf": null,
  "dtemissao": null,
  "dtentrada": null,

  "especie": null,
  "vlr_total_produto": null,
  "vlr_nf": null,
  "situacao": null,
  "observacao": null,

  "base_icms": null,
  "aliquota_icms": null,
  "vlr_icms": null,
  "isento_icms": null,
  "outras_despesas": null,
  "outras_despesas_foranf": null,
  "base_icms_subst": null,
  "vlr_icms_subst": null,

  "base_ipi": null,
  "vlr_ipi": null,
  "isento_ipi": null,

  "vlr_seguro": null,
  "vlr_desconto": null,
  "tipo_frete": null,
  "id_transportadora": null,
  "vlr_frete": null,

  "qtd_volume": null,
  "especie_volume": null,
  "peso_bruto": null,
  "peso_liquido": null,
  "placa_veiculo": null,
  "importacaoxml": false,

  "base_ii": null,
  "vlr_ii": null,
  "base_iss": null,
  "vlr_iss": null,
  "vlr_pis_produto": null,
  "vlr_cofins_produto": null,

  "id_planopagto": null,

  "nf_origem": true,
  "nfe_numero": null,
  "nfe_numero_serie": null,
  "nfe_acesso": null,
  "nfe_chavedeacesso_origem": null,
  "nfe_modelo": null,
  "nfe_nrlote": null,
  "nfe_nrrecibo": null,
  "nfe_status": null,
  "nfe_chavedeacesso": null,
  "nfe_tp_emissao_danfe": null,
  "nfe_nrprotocolo_envio": null,
  "nfe_nrprotocolo_inutil": null,
  "nfe_nrprotocolo_cancelamento": null,
  "msg_nfe_nfce": null,

  "arquivoxml": null,
  "tipo": null,
  "regra_cfop": null,
  "nf_estrangeira": "A",
  "perc_icmsimp": null,
  "vlr_siscomex": null,
  "vlr_afrmm": null,

  // outros campos
  "reducao_base_calc": null,
  "base_cbsibs": null,
  "vlr_cbs": null,
  "vlr_ibsuf": null,
  "vlr_ibsmun": null,
  "vlr_outras_item": null,
  "vlr_outras_item_foranf": null,

  "aliquota_cbs": null,
  "aliquota_ibsuf": null,
  "aliquota_ibsmun": null,
  "aliquota_ipi": null,
  "aliquota_pis": null,
  "aliquota_cofins": null,
  "aliquota_ir": null,
  "aliquota_csll": null,
  "aliquota_ii": null,
  "aliquota_icms_importacao": null,
});

const cancelarFormulario = () => {
  for (const key in forms) {
    forms[key] = null;
  }
  forms.id_empresa = idEmpresa?.id ?? null;
  almoxarifadoNome.value = "";
  cfopNome.value = "";
  itens.value = [];
  produtos.value = [];
  editando.value = false;
};

const selecionarAlmoxarifado = (almoxarifado) => {
  forms.id_almoxarifado = almoxarifado.id;
  almoxarifadoNome.value = almoxarifado.descalmoxarifado || almoxarifado.nome || '';
};

const cfopsFiltrados = computed(() => {
  // se UF selecionada -> só CFOPs daquela UF
  const base = forms.id_uf
      ? aliquotas.value.filter(a => a.id_uf === forms.id_uf)
      : aliquotas.value;

  // retornar CFOPs únicos
  return [...new Set(base.map(a => a.id_cfop))]
      .filter(Boolean)
      .map(v => ({ title: v, value: v }));
});

const ufsFiltradas = computed(() => {
  // se CFOP selecionado -> só UFs daquele CFOP
  const base = forms.id_cfop
      ? aliquotas.value.filter(a => a.id_cfop === forms.id_cfop)
      : aliquotas.value;

  // retornar UFs únicas
  return [...new Set(base.map(a => a.id_uf))]
      .filter(Boolean)
      .map(v => ({ title: v, value: v }));
});

watch(
    () => forms.id_uf,
    (uf) => {
      if (!uf || !forms.id_cfop) return;

      const existe = aliquotas.value.some(a => a.id_uf === uf && a.id_cfop === forms.id_cfop);
      if (!existe) forms.id_cfop = null;
    }
);

watch(
    () => forms.id_cfop,
    (cfop) => {
      if (!cfop || !forms.id_uf) return;

      const existe = aliquotas.value.some(a => a.id_cfop === cfop && a.id_uf === forms.id_uf);
      if (!existe) forms.id_uf = null;
    }
);

const formsNf = ref(null);

const aliquotasInfos = computed(() => produtosStore.aliquotaInfos);

const salvarFormulario = async () => {
  if (formsNf.value && !(await formsNf.value.validate())) {
    toast.error("Por favor, preencha os campos obrigatórios.");
    return;
  }

  console.log(produtos.value);

  forms.importacaoxml = forms.importacaoxml ? 'S' : 'N';
  forms.nf_origem = forms.nf_origem ? 'S' : 'N';
  forms.arquivoxml = forms.arquivoxml ? forms.arquivoxml.name : null;

  if (forms.id_cfop && forms.id_uf) {
    await produtosStore.buscarAliquotasInfos(idEmpresa?.id ?? 1, forms.id_uf, forms.id_cfop);

    if (produtosStore.errorMessage) {
      toast.error(produtosStore.errorMessage);
      return;
    }

    forms.aliquota_cbs = aliquotasInfos.value?.aliquota_cbs;
    forms.aliquota_ibsuf = aliquotasInfos.value?.aliquota_ibsuf;
    forms.aliquota_ibsmun = aliquotasInfos.value?.aliquota_ibsmun;
    forms.aliquota_ipi = aliquotasInfos.value?.aliquota_ipi;
    forms.aliquota_pis = aliquotasInfos.value?.aliquota_pis;
    forms.aliquota_cofins = aliquotasInfos.value?.aliquota_cofins;
    forms.aliquota_ir = aliquotasInfos.value?.aliquota_ir;
    forms.aliquota_csll = aliquotasInfos.value?.aliquota_csll;
    forms.aliquota_ii = aliquotasInfos.value?.aliquota_ii;
    forms.aliquota_icms_importacao = aliquotasInfos.value?.aliquota_icms_importacao;
  }

  await produtosStore.cadastrarEntradaDfe(
      {
        data: [normalizarForm(forms)],
        item: produtos.value
      },
      idEmpresa?.id ?? 1
  )

  cancelarFormulario();

};

const camposFloat = [
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
  "perc_icmsimp", "vlr_siscomex", "vlr_afrmm",
  "reducao_base_calc", "base_cbsibs", "vlr_cbs",
  "vlr_ibsuf", "vlr_ibsmun", "vlr_outras_item",
  "vlr_outras_item_foranf",
  "aliquota_cbs", "aliquota_ibsuf",
  "aliquota_ibsmun", "aliquota_ipi",
  "aliquota_pis", "aliquota_cofins",
  "aliquota_ir", "aliquota_csll",
  "aliquota_ii", "aliquota_icms_importacao",
];

const camposInteiros = [
  "id_fornecedor", "numero_nf", "serie_nf",
  "id_almoxarifado",
  "id_transportadora", "qtd_volume",
  "id_planopagto",
  "nfe_numero", "nfe_numero_serie", "nfe_acesso",
];

/**
 * NORMALIZAR FORMULÁRIO ANTES DE ENVIAR
 */

const normalizarForm = (data) => {
  const result = {};

  for (const key in data) {
    const value = data[key];

    // FLOATS → enviar sempre string "0.00"
    if (camposFloat.includes(key)) {
      const num = Number(value);
      result[key] = Number(num.toFixed(2));
      continue;
    }

    // INTEIROS → 0
    if (camposInteiros.includes(key)) {
      const num = Number(value);
      result[key] = isNaN(num) ? 0 : parseInt(num);
      continue;
    }

    // TEXTOS → null se vazio
    if (value === "" || value === undefined) {
      result[key] = null;
      continue;
    }

    // MANTÉM O VALOR ORIGINAL
    result[key] = value;
  }

  return result;
};

/**
 * TRABALHANDO COM XML
 */

function xmlToJson(element) {
  let obj = {};

  for (let node of element.children) {
    if (node.children.length > 0) {
      obj[node.tagName] = xmlToJson(node);
    } else {
      obj[node.tagName] = node.textContent;
    }
  }

  return obj;
}

/**
 * LER AQUIVO XML
 */

const lerXML = (file) => {
  console.log('Lendo XML...', file);

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async () => {
    const xmlString = reader.result;

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    xmlData.value = xml;

    // CAPTURA PRINCIPAIS TAGS
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

    if (cnpjEmpresa && dest.value.CNPJ !== cnpjEmpresa) {
      toast.error(`CNPJ do destinatário não corresponde ao CNPJ da empresa selecionada!`);
      return;
    }

    // --- PARSE DET / PROD / IMPOSTO ---
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

    // NÃO sobrescrever o array original — procurar correspondência
    const encontrado = pessoasStore.pessoas.find(pessoa =>
        pessoa.nome_razao === emit.value?.xNome ||
        pessoa.apelido_fantasia === (emit.value?.xFant || emit.value?.xNome)
    );

    const payloadPessoa = ref({
      tipo_pessoa: null,
      nome_razao:  null,
      apelido_fantasia: null,
      cpf_cnpj: null,
      rg_inscricao: null,
      telefone: null,
      celular: null,
      whats: '',
      website: '',
      cliente: 'N',
      fornecedor: 'N',
      transportadora: 'N',
      colaborador: 'N',
      representante: 'N',
      instagram: '',
      facebook: '',
      twitter_x: '',
      tik_tok: '',
      telegram: '',
      latitude: null,
      longitude: null,
      ativo: 'S'
    });

    // fornecedor
    if (encontrado) {
      forms.id_fornecedor = encontrado.id;
    }
    else {
      payloadPessoa.value.tipo_pessoa = emit.value?.CNPJ ? 'J' : 'F';
      payloadPessoa.value.nome_razao = emit.value?.xNome || 'Fornecedor Importado';
      payloadPessoa.value.apelido_fantasia = emit.value?.xFant || emit.value?.xNome || 'Fornecedor Importado';
      payloadPessoa.value.cpf_cnpj = emit.value?.CNPJ || emit.value?.CPF || null;
      payloadPessoa.value.rg_inscricao = emit.value?.IE || null;
      payloadPessoa.value.telefone = emit.value?.fone || null;
      payloadPessoa.value.fornecedor = 'S';


      // aguarda cadastro (tornar async para usar await)
      try {
        await pessoasStore.cadastrarPessoa({ data: [{ ...payloadPessoa.value }] });
        // tentar recuperar o recém-criado no store
        const novo = pessoasStore.pessoas.find(p =>
            (payloadPessoa.value.cpf_cnpj && p.cpf_cnpj === payloadPessoa.value.cpf_cnpj) ||
            p.nome_razao === payloadPessoa.value.nome_razao
        );
        if (novo) {
          forms.id_fornecedor = novo.id;
        } else {
          // fallback: deixar nulo ou tratar conforme necessidade
          forms.id_fornecedor = null;
        }
      } catch (err) {
        console.error('Erro ao cadastrar fornecedor:', err);
        forms.id_fornecedor = null;
      }
    }

    // transportadora
    if (transp.value && transp.value?.transporta) {
      const encontradoTransp = pessoasStore.pessoas.find(pessoa =>
          pessoa.nome_razao === transp.value.transporta?.xNome ||
          pessoa.apelido_fantasia === (transp.value.transporta?.xFant || transp.value.transporta?.xNome)
      );

      if (encontradoTransp) {
        forms.id_transportadora = encontradoTransp.id;
      }
      else {
        payloadPessoa.value.tipo_pessoa = transp.value.transporta?.CNPJ ? 'J' : 'F';
        payloadPessoa.value.nome_razao = transp.value.transporta?.xNome || 'Transportadora Importada';
        payloadPessoa.value.apelido_fantasia = transp.value.transporta?.xFant || transp.value.transporta?.xNome || 'Transportadora Importada';
        payloadPessoa.value.cpf_cnpj = transp.value.transporta?.CNPJ || transp.value.transporta?.CPF || null;
        payloadPessoa.value.rg_inscricao = transp.value.transporta?.IE || null;
        payloadPessoa.value.telefone = null;
        payloadPessoa.value.transportadora = 'S';

        // aguarda cadastro (tornar async para usar await)
        try {
          await pessoasStore.cadastrarPessoa({ data: [{ ...payloadPessoa.value }] });
          // tentar recuperar o recém-criado no store
          const novo = pessoasStore.pessoas.find(p =>
              (payloadPessoa.value.cpf_cnpj && p.cpf_cnpj === payloadPessoa.value.cpf_cnpj) ||
              p.nome_razao === payloadPessoa.value.nome_razao
          );
          if (novo) {
            forms.id_transportadora = novo.id;
          } else {
            // fallback: deixar nulo ou tratar conforme necessidade
            forms.id_transportadora = null;
          }
        } catch (err) {
          console.error('Erro ao cadastrar transportadora:', err);
          forms.id_transportadora = null;
        }
      }
    }

    funcoesStore.preencherForms(
        ide.value, total.value,
        emit.value, xml,
        dest.value, itens.value,
        transp.value, pag.value,
        infAdic.value, forms,
        produtos
    );
  };

  reader.readAsText(file);
}


/**
 * FORMATAÇÕES
 */

function formatarReal(valor) {
  if (valor === null || valor === undefined || valor === "") return "R$ 0,00";

  return Number(valor)
      .toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      });
}


/**
 * ADICIONANDO ITENS
 */

const modalItemAberto = ref(false);

const vincularProduto = async ({ item, produto }) => {
  item.id_produto = produto.id;
  expanded.value = [];
};


onMounted(() => {
  if (pessoas.value.length === 0 && !forms.arquivoxml) {
    pessoasStore.buscarTodasPessoas();
  }

  if (estoqueStore.aliquotas.length === 0) {
    estoqueStore.buscarTodasAliquotas(idEmpresa?.id, "");
  }

  if (produtosStore.produtos.length === 0) {
    produtosStore.buscarProdutos();
  }
})
</script>

<style scoped>
.linha-ativa {
  border-right: .5px solid var(--text-color-laranja);
  border-left: .5px solid var(--text-color-laranja);
  background: rgba(253, 124, 0, 0.2);
}

.linha-ativa-expand {
  background: var(--bg-card);
  background: rgba(253, 124, 0, 0.09);
}

.money {
  text-align: right;
  font-weight: 500;
}
</style>