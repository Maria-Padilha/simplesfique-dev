<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Entrada de Nota</template>
    <template #section>
      <v-form ref="formsNf" @submit="salvarFormulario">
        <div class="flex items-center justify-end gap-3 mb-4">
          <v-btn size="small" color="var(--text-color-laranja)" variant="tonal" @click="cancelarFormulario">
            Cancelar
          </v-btn>

          <v-btn size="small" color="var(--text-color-laranja)" class="text-white" type="submit" variant="flat" :loading="produtosStore.loading">
            Salvar entrada
          </v-btn>
        </div>

        <v-expansion-panels :theme="themeStore.darkMode ? 'dark' : 'light'" color="var(--bg-card)">
          <v-expansion-panel elevation="1" class="mb-5" title="Entrada de Nota" color="var(--bg-card)">
            <template #text>
              <v-row dense>
                <v-col cols="12" md="12">
                  <v-file-input
                      density="compact"
                      variant="outlined"
                      label="Arquivo XML"
                      hide-details="auto"
                      v-model="forms.arquivoxml"
                      @change="lerXML" accept=".xml"
                  />
                </v-col>

                <!-- id_fornecedor -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      density="compact" variant="outlined" label="Fornecedor" hide-details="auto"
                      v-model="forms.id_fornecedor" :rules="validacao"
                      :items="pessoas" item-title="nome_razao" item-value="id"
                  />
                </v-col>

                <!-- id_nota -->
                <v-col cols="12" md="1">
                  <v-text-field
                      density="compact" variant="outlined" label="Nota" hide-details="auto"
                      v-model="forms.id_nota" :rules="validacao" @input="Number(forms.id_nota)"
                  />
                </v-col>

                <!-- id_serie -->
                <v-col cols="12" md="1">
                  <v-text-field
                      density="compact" variant="outlined" label="Série" hide-details="auto"
                      v-model="forms.id_serie" :rules="validacao"
                  />
                </v-col>

                <!-- id_almoxarifado -->
                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Almoxarifado" hide-details="auto"
                                v-model="almoxarifadoNome" readonly :rules="validacao">
                    <template #append-inner>
                      <almoxarifado-menu @selecionar="selecionarAlmoxarifado"/>
                    </template>
                  </v-text-field>
                </v-col>

                <!-- id_cfop -->
                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="C.F.O.P" hide-details="auto"
                                v-model="cfopNome" readonly :rules="validacao">
                    <template #append-inner>
                      <cfop-menu @selecionar="selecionarCfop"/>
                    </template>
                  </v-text-field>
                </v-col>

                <!-- id_uf -->
                <v-col cols="12" md="2">
                  <v-autocomplete
                      density="compact" variant="outlined" label="UF" hide-details="auto" :rules="validacao"
                      v-model="forms.id_uf" :items="ufs" item-title="sigla" item-value="sigla"
                  />
                </v-col>

                <!-- valores iniciais -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Espécie" hide-details="auto"
                      v-model="forms.especie"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Valor Total Produtos" hide-details="auto"
                      v-model="forms.vlr_total_produto" type="number" :rules="validacao"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Valor NF" hide-details="auto" type="number"
                      v-model="forms.vlr_nf" :rules="validacao"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Situação" hide-details="auto"
                      v-model="forms.situacao"
                  />
                </v-col>

                <!-- Volume -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Qtd Volume" hide-details="auto" type="number"
                      v-model="forms.qtd_volume"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Espécie Volume" hide-details="auto"
                      v-model="forms.especie_volume"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Peso Bruto" hide-details="auto" type="number"
                      v-model="forms.peso_bruto"
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Peso Líquido" hide-details="auto" type="number"
                      v-model="forms.peso_liquido"
                  />
                </v-col>

                <!-- Veículo -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Placa" hide-details="auto"
                      v-model="forms.placa_veiculo"
                  />
                </v-col>

                <!-- Origem / NF-e -->
                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Número NFe" hide-details="auto"
                                v-model="forms.nfe_numero" type="number"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Série NFe" hide-details="auto"
                                v-model="forms.nfe_numero_serie" type="number"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Acesso NFe" hide-details="auto"
                                v-model="forms.nfe_acesso" type="number"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Chave Origem" hide-details="auto"
                                v-model="forms.nfe_chavedeacesso_origem"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Modelo NFe" hide-details="auto"
                                v-model="forms.nfe_modelo"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Nº Lote" hide-details="auto"
                                v-model="forms.nfe_nrlote"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Nº Recibo" hide-details="auto"
                                v-model="forms.nfe_nrrecibo"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Status" hide-details="auto"
                                v-model="forms.nfe_status"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Chave Acesso" hide-details="auto"
                                v-model="forms.nfe_chavedeacesso"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="TP Emissão DANFE" hide-details="auto"
                                v-model="forms.nfe_tp_emissao_danfe"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Protocolo Envio" hide-details="auto"
                                v-model="forms.nfe_nrprotocolo_envio"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Prot. Inutilização" hide-details="auto"
                                v-model="forms.nfe_nrprotocolo_inutil"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Prot. Cancelamento" hide-details="auto"
                                v-model="forms.nfe_nrprotocolo_cancelamento"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Mensagem NFe/NFCe" hide-details="auto"
                                v-model="forms.msg_nfe_nfce"/>
                </v-col>

                <!-- Fiscal -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      density="compact" variant="outlined" label="Usuário Aprovou" hide-details="auto"
                      v-model="forms.id_usuario_aprovou_fiscal"
                      :items="pessoas" item-title="nome_razao" item-value="id"
                  />
                </v-col>

                <!-- extras -->
                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Tipo" hide-details="auto"
                                v-model="forms.tipo" :rules="validacao" maxlength="1"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="Regra CFOP" hide-details="auto"
                                v-model="forms.regra_cfop"/>
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field density="compact" variant="outlined" label="NF Estrangeira" hide-details="auto"
                                v-model="forms.nf_estrangeira"/>
                </v-col>

                <!-- Importação -->
                <v-col cols="12" md="3">
                  <v-text-field density="compact" variant="outlined" label="% ICMS Importação" hide-details="auto"
                                type="number"
                                v-model="forms.perc_icmsimp"/>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field density="compact" variant="outlined" label="Siscomex" hide-details="auto" type="number"
                                v-model="forms.vlr_siscomex"/>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field density="compact" variant="outlined" label="AFRMM" hide-details="auto" type="number"
                                v-model="forms.vlr_afrmm"/>
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field density="compact" variant="outlined" label="NFe Impressa" hide-details="auto"
                                v-model="forms.nfe_impressa"/>
                </v-col>

                <!-- Booleans -->
                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.gerou_financeiro"
                      :label="`Gerou Financeiro? ${forms.gerou_financeiro ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.gerou_estoque"
                      :label="`Gerou Estoque? ${forms.gerou_estoque ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.importacaoxml"
                      :label="`Importação XML? ${forms.importacaoxml ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.nf_origem"
                      :label="`NF Origem? ${forms.nf_origem ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)"
                  />
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel>
        </v-expansion-panels>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="produtos"
            :loading="loading"
            :show-search="false"
            item-key="id"
            no-data-icon="mdi-database-off"
            :item-por-pag="5"
            no-data-text="Nenhum item encontrado"
        >
          <template v-slot:[`item.acoes`]='{ item }'>
            <v-btn
              variant="text"
              icon="mdi-plus-circle-outline"
              color="var(--text-color-laranja)"
              @click="abrirModalAdd(item)"
            />
          </template>
        </tabela-padrao>

        <v-row class="mt-5" dense>
          <!-- ICMS -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ICMS" hide-details="auto" type="number"
                v-model="forms.base_icms" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Alíquota ICMS" hide-details="auto" type="number"
                v-model="forms.aliquota_icms" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ICMS" hide-details="auto" type="number"
                v-model="forms.vlr_icms" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Isento ICMS" hide-details="auto" type="number"
                v-model="forms.isento_icms" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Outras Despesas" hide-details="auto" type="number"
                v-model="forms.outras_despesas" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Desp. Fora NF" hide-details="auto" type="number"
                v-model="forms.outras_despesas_foranf"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ICMS ST" hide-details="auto" type="number"
                v-model="forms.base_icms_subst" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ICMS ST" hide-details="auto" type="number"
                v-model="forms.vlr_icms_subst" :rules="validacao"
            />
          </v-col>

          <!-- IPI -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Base IPI" hide-details="auto" type="number"
                          v-model="forms.base_ipi" :rules="validacao"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor IPI" hide-details="auto" type="number"
                          v-model="forms.vlr_ipi" :rules="validacao"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Isento IPI" hide-details="auto"
                          type="number"
                          v-model="forms.isento_ipi" :rules="validacao"/>
          </v-col>

          <!-- Impostos diversos -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base II" hide-details="auto" type="number"
                v-model="forms.base_ii" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor II" hide-details="auto" type="number"
                v-model="forms.vlr_ii" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ISS" hide-details="auto" type="number"
                v-model="forms.base_iss" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ISS" hide-details="auto" type="number"
                v-model="forms.vlr_iss" :rules="validacao"
            />
          </v-col>

          <!-- PIS/COFINS -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="PIS Produto" hide-details="auto" type="number"
                v-model="forms.vlr_pis_produto"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Cofins Produto" hide-details="auto" type="number"
                v-model="forms.vlr_cofins_produto"
            />
          </v-col>

          <!-- Plano Pagamento -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Plano Pagamento" hide-details="auto"
                v-model="forms.id_planopagto"
            />
          </v-col>

          <!-- Seguro / desconto / frete -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor Seguro" hide-details="auto" type="number"
                v-model="forms.vlr_seguro" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor Desconto" hide-details="auto" type="number"
                v-model="forms.vlr_desconto" :rules="validacao"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Tipo Frete" hide-details="auto"
                v-model="forms.tipo_frete"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
                density="compact" variant="outlined" label="Transportadora" hide-details="auto"
                v-model="forms.id_transportadora" clearable
                :items="pessoas" item-title="nome_razao" item-value="id"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor Frete" hide-details="auto" type="number"
                v-model="forms.vlr_frete"
            />
          </v-col>
        </v-row>
      </v-form>

      <VincularProdutos
          v-model:modalItemAberto="modalItemAberto"
          :todosProdutos="todosProdutos"
          :itemSelecionado="itemSelecionado"
          @vincular="vincularProduto"
      />
    </template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import {usePessoasStore} from "@/stores/APIs/pessoas";
import CfopMenu from "@/components/base/menu/CfopMenu.vue";
import AlmoxarifadoMenu from "@/components/base/menu/AlmoxarifadoMenu.vue";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {computed, onMounted, reactive, ref} from "vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {toast} from "vue3-toastify";
import {useLocalizacaoStore} from "@/stores/APIs/localizacao";
import VincularProdutos from "@/components/base/modais/VincularProdutos.vue";
// import router from "@/router";

const themeStore = useThemeStore();
const pessoasStore = usePessoasStore();
const produtosStore = useProdutosStore();
const localizacaoStore = useLocalizacaoStore();
const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));
const cnpjEmpresa = idEmpresa?.cnpj || null;

const pessoas = computed(() => pessoasStore.pessoas);
const ufs = computed(() => localizacaoStore.ufs);
const todosProdutos = computed(() => produtosStore.produtos);

const almoxarifadoNome = ref("");
const cfopNome = ref("");
const editando = ref(false);
const produtos = ref([{ "descproduto": "CURVA 90 SCH 40 8", "und": "PC", "vlr_unitario": "R$ 632,30", "qtd": "5.0000", "vlr_total": "R$ 3.161,50", "icms": "R$ 12,00", "bc_icms": "2783.00", "vlr_icms": "333.96", "ipi": null, "cor": null, "tamanho": null, "bc_ii": null }]);
const itemSelecionado = ref({});

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
  {title: 'Cod. Ref', key: 'id'},
  {title: 'Descrição do Produto', key: 'descproduto'},
  {title: 'Unidade', key: 'und'},
  {title: 'Vlr. Unitário', key: 'vlr_unitario'},
  {title: 'IPI', key: 'ipi'},
  {title: 'ICMS ST', key: 'icms'},
  {title: 'Quantidade', key: 'qtd'},
  {title: 'Total', key: 'vlr_total'},
  {title: 'Cor', key: 'cor'},
  {title: 'Tamanho', key: 'tamanho'},
  {title: 'BC ICMS', key: 'bc_icms'},
  {title: 'Vlr ICMS', key: 'vlr_icms'},
  {title: 'BC II', key: 'bc_ii'},
  {title: 'Ações', key: 'acoes', sortable: false},
])

const validacao = [
  v => !!v || 'Campo obrigatório',
];

const forms = reactive({
  "id_empresa": idEmpresa?.id ?? null,
  "id_fornecedor": null,
  "id_nota": null,
  "id_serie": null,
  "id_almoxarifado": null,
  "id_cfop": null,
  "id_uf": null,
  "dtcadastro": null,
  "dtemissao": null,
  "dtentrada": null,

  "especie": null,
  "vlr_total_produto": null,
  "vlr_nf": null,
  "situacao": null,
  "gerou_financeiro": false,
  "gerou_estoque": false,
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

  "id_usuario_aprovou_fiscal": null,
  "arquivoxml": null,
  "tipo": null,
  "regra_cfop": null,
  "nf_estrangeira": null,
  "perc_icmsimp": null,
  "vlr_siscomex": null,
  "vlr_afrmm": null,
  "nfe_impressa": null
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

const selecionarCfop = (cfop) => {
  forms.id_cfop = cfop.id_cfop;
  cfopNome.value = cfop.id_cfop + ' - ' + (cfop.descricao || '');
};

const formsNf = ref(null);

const salvarFormulario = async () => {
  const { valid } = await formsNf.value.validate();

  if (!valid) {
    toast.error('Por favor, preencha os campos obrigatórios.');
    return;
  }

  forms.gerou_financeiro = forms.gerou_financeiro ? 'S' : 'N';
  forms.gerou_estoque = forms.gerou_estoque ? 'S' : 'N';
  forms.importacaoxml = forms.importacaoxml ? 'S' : 'N';
  forms.nf_origem = forms.nf_origem ? 'S' : 'N';
  forms.arquivoxml = forms.arquivoxml ? forms.arquivoxml.name : null;
  forms.id_uf = forms.id_uf ? forms.id_uf.sigla : null;

  const payload = normalizarForm(forms);

  await produtosStore.cadastrarEntradaDfe({
    data: [payload]
  }, idEmpresa?.id ?? 1);

  // cancelarFormulario();

  // setTimeout(() => {
  //   router.push('/paginas/entradadfe')
  // }, 1500);

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
  "perc_icmsimp", "vlr_siscomex", "vlr_afrmm"
];

const camposInteiros = [
  "id_fornecedor", "id_nota", "id_serie",
  "id_almoxarifado",
  "id_transportadora", "qtd_volume",
  "id_planopagto", "id_usuario_aprovou_fiscal",
  "nfe_numero", "nfe_numero_serie", "nfe_acesso"
];

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

// --- Função universal para converter XML → JSON
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

const lerXML = (event) => {
  const file = event.target.files[0];
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

    // --- CONSOLES DE DEPURAÇÃO ---
    console.log("ide:", ide.value);
    console.log("emit:", emit.value);
    console.log("dest:", dest.value);
    console.log("itens:", itens.value);
    console.log("total:", total.value);
    console.log("transp:", transp.value);
    console.log("pag:", pag.value);
    console.log("infAdic:", infAdic.value);

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
      console.log('Nenhum fornecedor encontrado. Cadastrando novo fornecedor...');

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
        console.log('Fornecedor cadastrado.', pessoasStore.pessoas);
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
        console.log('Nenhuma transportadora encontrada. Cadastrando nova transportadora...');

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
          console.log('Transportadora cadastrada.', pessoasStore.pessoas);
        } catch (err) {
          console.error('Erro ao cadastrar transportadora:', err);
          forms.id_transportadora = null;
        }
      }
    }

    // destinatário
    if (dest.value) {
      const encontradoDest = pessoasStore.pessoas.find(pessoa =>
          pessoa.nome_razao === dest.value?.xNome ||
          pessoa.apelido_fantasia === (dest.value?.xFant || dest.value?.xNome)
      );

      if (encontradoDest) {
        forms.id_usuario_aprovou_fiscal = encontradoDest.id;
      }
      else {
        console.log('Nenhum destinatário encontrado. Cadastrando novo destinatário...');

        payloadPessoa.value.tipo_pessoa = dest.value?.CNPJ ? 'J' : 'F';
        payloadPessoa.value.nome_razao = dest.value?.xNome || 'Destinatário Importado';
        payloadPessoa.value.apelido_fantasia = dest.value?.xFant || dest.value?.xNome || 'Destinatário Importado';
        payloadPessoa.value.cpf_cnpj = dest.value?.CNPJ || dest.value?.CPF || null;
        payloadPessoa.value.rg_inscricao = dest.value?.IE || null;
        payloadPessoa.value.cliente = 'S';

        // aguarda cadastro (tornar async para usar await)
        try {
          await pessoasStore.cadastrarPessoa({ data: [{ ...payloadPessoa.value }] });
          // tentar recuperar o recém-criado no store
          const novo = pessoasStore.pessoas.find(p =>
              (payloadPessoa.value.cpf_cnpj && p.cpf_cnpj === payloadPessoa.value.cpf_cnpj) ||
              p.nome_razao === payloadPessoa.value.nome_razao
          );
          if (novo) {
            forms.id_usuario_aprovou_fiscal = novo.id;
          } else {
            // fallback: deixar nulo ou tratar conforme necessidade
            forms.id_usuario_aprovou_fiscal = null;
          }
          console.log('Destinatário cadastrado.', pessoasStore.pessoas);
        } catch (err) {
          console.error('Erro ao cadastrar destinatário:', err);
          forms.id_usuario_aprovou_fiscal = null;
        }
      }
    }
    preencherForms(ide.value, total.value, emit.value, xml, dest.value, itens.value, transp.value, pag.value, infAdic.value);
  };

  reader.readAsText(file);
}

function preencherForms(ide, total, emit, xml, dest, itens, transp, pag, infAdic) {
  // 🔹 Pegar a chave de acesso da NFe
  const infNFe = xml.getElementsByTagName("infNFe")[0];
  const chave = infNFe ? infNFe.getAttribute("Id")?.replace("NFe", "") : null;

  // 🔹 Preencher campos
  forms.dtemissao = ide?.dhEmi || null;
  forms.dtentrada = ide?.dhSaiEnt || null;

  forms.nfe_numero = ide?.nNF || null;
  forms.id_uf = ufs.value.find(uf => uf.id == ide?.cUF);
  console.log("UF encontrada:", forms.id_uf);
  forms.id_serie = ide?.serie || null;
  forms.nfe_modelo = ide?.mod || null;
  forms.nfe_chavedeacesso = chave || null;

  // Totais
  if (total?.ICMSTot) {
    forms.vlr_total_produto = total.ICMSTot.vProd || null;
    forms.vlr_nf = total.ICMSTot.vNF || null;

    forms.base_icms = total.ICMSTot.vBC || null;
    forms.aliquota_icms = total.ICMSTot?.pICMS || null;
    forms.vlr_icms = total.ICMSTot.vICMS || null;

    forms.base_ipi = total.ICMSTot.vBCIPI || null;
    forms.vlr_ipi = total.ICMSTot.vIPI || null;

    forms.vlr_desconto = total.ICMSTot.vDesc || null;
    forms.vlr_frete = total.ICMSTot.vFrete || null;
    forms.outras_despesas = total.ICMSTot.vOutro || null;
    forms.vlr_ii = total.ICMSTot.vII || null;
    forms.outras_despesas_foranf = total.ICMSTot.vOutro || null;
    forms.vlr_pis_produto = total.ICMSTot.vPIS || null;
    forms.vlr_seguro = total.ICMSTot.vSeg || null;
  }

  if (transp) {
    forms.tipo_frete = transp?.modFrete || null;
  }


  if (itens) {
    produtos.value = itens.map(item => {
      const icmsGroup = item.imposto?.ICMS
          ? Object.values(item.imposto.ICMS)[0]
          : null;

      return {
        descproduto: item.prod?.xProd || null,
        und: item.prod?.uCom || null,
        vlr_unitario: formatarReal(item.prod?.vUnCom) || null,
        qtd: item.prod?.qCom || null,
        vlr_total: formatarReal(item.prod?.vProd) || null,

        // ICMS (pode ser ICMS00, ICMSN900 etc)
        icms: icmsGroup?.pICMS ? formatarReal(icmsGroup.pICMS) : null,
        bc_icms: icmsGroup?.vBC || null,
        vlr_icms: icmsGroup?.vICMS || null,

        // IPI
        ipi: item.imposto?.IPI?.IPITrib?.vIPI
            ? formatarReal(item.imposto.IPI.IPITrib.vIPI)
            : null,

        cor: item.prod?.xCor || null,
        tamanho: item.prod?.xTam || null,

        bc_ii: item.imposto?.II?.vBC || null,
      };
    });
  }

  // Observação
  forms.observacao = infAdic?.infCpl || null;

  // Marcar origem
  forms.importacaoxml = true;
}

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

const abrirModalAdd = (item) => {
  itemSelecionado.value = item;
  modalItemAberto.value = true;
};

const vincularProduto = async ({ item, produto }) => {

  await produtosStore.buscarProdutosSimilares(produto.id);
  const similar = produtosStore.similar.find(s => s.descproduto === item.descproduto);

  if (similar) {
    toast.info('Produto já está vinculado como similar.');
    return;
  }

  const index = produtosStore.similar.length - 1;
  const ids = produtosStore.similar.map(s => s.id_similar);

  await produtosStore.cadastrarProdutoSimilar({
    data: [{
      id_produto: produto.id,
      id_similar: ids[index]+1,
      descproduto: item.descproduto,
      ativo: 'S'
    }]
  }, produto.id);
};


onMounted(() => {
  if (pessoas.value.length === 0 && !forms.arquivoxml) {
    pessoasStore.buscarTodasPessoas();
  }

  if (localizacaoStore.ufs.length === 0) {
    localizacaoStore.buscarTodasUfs();
  }

  if (produtosStore.produtos.length === 0) {
    produtosStore.buscarProdutos();
  }
})
</script>