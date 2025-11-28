<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Entrada de DFe</template>
    <template #section>
      <v-card elevation="0" class="background-secondary pa-4">
        <botao-expand-transition
            v-if="!exibir"
            :formulario-aberto="formularioAberto"
            @toggle="toggleFormulario"
        >
          <template #default>{{ formularioAberto ? 'Cancelar' : 'Entrada de Nota' }}</template>
        </botao-expand-transition>

        <forms-expand-transition
            :salvar-formulario="salvarFormulario"
            :cancelar-formulario="cancelarFormulario"
            :editando="editando"
            :formulario-aberto="formularioAberto"
            :loading="loading"
        >
          <template #form>
            <v-form ref="formsNf">
              <v-expansion-panels
                  elevation="0" multiple :theme="themeStore.darkMode ? 'dark' : 'light'"
                  bg-color="var(--bg-color-secondary)"
                  v-model="panels"
              >
                <v-expansion-panel title="Relações">
                  <template #text>
                    <v-row dense>
                      <!-- id_fornecedor -->
                      <v-col cols="12" md="3">
                        <v-autocomplete
                            density="compact" variant="outlined" label="Fornecedor" hide-details="auto"
                            v-model="forms.id_fornecedor" :rules="validacao"
                            :items="pessoas" item-title="nome_razao" item-value="id"
                        />
                      </v-col>

                      <!-- id_nota -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Nota" hide-details="auto"
                            v-model="forms.id_nota" :rules="validacao" @input="Number(forms.id_nota)"
                        />
                      </v-col>

                      <!-- id_serie -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Série" hide-details="auto"
                            v-model="forms.id_serie" :rules="validacao"
                        />
                      </v-col>

                      <!-- id_almoxarifado -->
                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Almoxarifado" hide-details="auto"
                                      v-model="almoxarifadoNome" readonly>
                          <template #append-inner>
                            <almoxarifado-menu @selecionar="selecionarAlmoxarifado"/>
                          </template>
                        </v-text-field>
                      </v-col>

                      <!-- id_cfop -->
                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="C.F.O.P" hide-details="auto"
                                      v-model="cfopNome" readonly>
                          <template #append-inner>
                            <cfop-menu @selecionar="selecionarCfop"/>
                          </template>
                        </v-text-field>
                      </v-col>

                      <!-- id_uf -->
                      <v-col cols="12" md="3">
                        <v-autocomplete
                            density="compact" variant="outlined" label="UF" hide-details="auto"
                            v-model="forms.id_uf" :rules="validacao"
                            :items="ufs" item-title="sigla" item-value="sigla"
                        />
                      </v-col>

                      <!-- Observação -->
                      <v-col cols="12" md="6">
                        <v-text-field density="compact" variant="outlined" label="Observação" hide-details="auto"
                                      v-model="forms.observacao"/>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="Valores Iniciais">
                  <template #text>
                    <v-row dense>
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
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="ICMS">
                  <template #text>
                    <v-row dense>
                      <!-- ICMS -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Base ICMS" hide-details="auto" type="number"
                            v-model="forms.base_icms" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Alíquota ICMS" hide-details="auto" type="number"
                            v-model="forms.aliquota_icms" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Valor ICMS" hide-details="auto" type="number"
                            v-model="forms.vlr_icms" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Isento ICMS" hide-details="auto" type="number"
                            v-model="forms.isento_icms" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Outras Despesas" hide-details="auto" type="number"
                            v-model="forms.outras_despesas" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Desp. Fora NF" hide-details="auto" type="number"
                            v-model="forms.outras_despesas_foranf"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Base ICMS ST" hide-details="auto" type="number"
                            v-model="forms.base_icms_subst" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Valor ICMS ST" hide-details="auto" type="number"
                            v-model="forms.vlr_icms_subst" :rules="validacao"
                        />
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="IPI">
                  <template #text>
                    <v-row dense>
                      <!-- IPI -->
                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Base IPI" hide-details="auto" type="number"
                                      v-model="forms.base_ipi" :rules="validacao"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Valor IPI" hide-details="auto" type="number"
                                      v-model="forms.vlr_ipi" :rules="validacao"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Isento IPI" hide-details="auto" type="number"
                                      v-model="forms.isento_ipi" :rules="validacao"/>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="Seguro / Desconto / Frete">
                  <template #text>
                    <v-row dense>
                      <!-- Seguro / desconto / frete -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Valor Seguro" hide-details="auto" type="number"
                            v-model="forms.vlr_seguro" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Valor Desconto" hide-details="auto" type="number"
                            v-model="forms.vlr_desconto" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Tipo Frete" hide-details="auto"
                            v-model="forms.tipo_frete"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-autocomplete
                            density="compact" variant="outlined" label="Transportadora" hide-details="auto"
                            v-model="forms.id_transportadora" clearable
                            :items="pessoas" item-title="nome_razao" item-value="id"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Valor Frete" hide-details="auto" type="number"
                            v-model="forms.vlr_frete"
                        />
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="Volume / Veículo">
                  <template #text>
                    <v-row dense>
                      <v-col cols="12" md="12">
                        <v-switch
                            v-model="forms.importacaoxml"
                            :label="`Importação XML? ${forms.importacaoxml ? 'Sim' : 'Não'}`"
                            hide-details="auto" color="var(--text-color-laranja)"
                        />
                      </v-col>

                      <!-- Volume -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Qtd Volume" hide-details="auto" type="number"
                            v-model="forms.qtd_volume"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Espécie Volume" hide-details="auto"
                            v-model="forms.especie_volume"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Peso Bruto" hide-details="auto" type="number"
                            v-model="forms.peso_bruto"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Peso Líquido" hide-details="auto" type="number"
                            v-model="forms.peso_liquido"
                        />
                      </v-col>

                      <!-- Veículo -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Placa" hide-details="auto"
                            v-model="forms.placa_veiculo"
                        />
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="Imposto Diversos / PIS-COFINS">
                  <template #text>
                    <v-row dense>
                      <!-- Impostos diversos -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Base II" hide-details="auto" type="number"
                            v-model="forms.base_ii" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Valor II" hide-details="auto" type="number"
                            v-model="forms.vlr_ii" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Base ISS" hide-details="auto" type="number"
                            v-model="forms.base_iss" :rules="validacao"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Valor ISS" hide-details="auto" type="number"
                            v-model="forms.vlr_iss" :rules="validacao"
                        />
                      </v-col>

                      <!-- PIS/COFINS -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="PIS Produto" hide-details="auto" type="number"
                            v-model="forms.vlr_pis_produto"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Cofins Produto" hide-details="auto" type="number"
                            v-model="forms.vlr_cofins_produto"
                        />
                      </v-col>

                      <!-- Plano Pagamento -->
                      <v-col cols="12" md="3">
                        <v-text-field
                            density="compact" variant="outlined" label="Plano Pagamento" hide-details="auto"
                            v-model="forms.id_planopagto"
                        />
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="Origem / NF-e">
                  <template #text>
                    <v-row dense>
                      <!-- Origem / NF-e -->
                      <v-col cols="12" md="12">
                        <v-switch
                            v-model="forms.nf_origem"
                            :label="`NF Origem? ${forms.nf_origem ? 'Sim' : 'Não'}`"
                            hide-details="auto" color="var(--text-color-laranja)"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Número NFe" hide-details="auto"
                                      v-model="forms.nfe_numero" type="number"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Série NFe" hide-details="auto"
                                      v-model="forms.nfe_numero_serie" type="number" />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Acesso NFe" hide-details="auto"
                                      v-model="forms.nfe_acesso" type="number" />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Chave Origem" hide-details="auto"
                                      v-model="forms.nfe_chavedeacesso_origem"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Modelo NFe" hide-details="auto"
                                      v-model="forms.nfe_modelo"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Nº Lote" hide-details="auto"
                                      v-model="forms.nfe_nrlote"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Nº Recibo" hide-details="auto"
                                      v-model="forms.nfe_nrrecibo"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Status" hide-details="auto"
                                      v-model="forms.nfe_status"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Chave Acesso" hide-details="auto"
                                      v-model="forms.nfe_chavedeacesso"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="TP Emissão DANFE" hide-details="auto"
                                      v-model="forms.nfe_tp_emissao_danfe"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Protocolo Envio" hide-details="auto"
                                      v-model="forms.nfe_nrprotocolo_envio"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Prot. Inutilização" hide-details="auto"
                                      v-model="forms.nfe_nrprotocolo_inutil"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Prot. Cancelamento" hide-details="auto"
                                      v-model="forms.nfe_nrprotocolo_cancelamento"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Mensagem NFe/NFCe" hide-details="auto"
                                      v-model="forms.msg_nfe_nfce"/>
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel>

                <v-expansion-panel title="Fiscal / Importação">
                  <template #text>
                    <v-row dense>
                      <!-- Fiscal -->
                      <v-col cols="12" md="3">
                        <v-autocomplete
                            density="compact" variant="outlined" label="Usuário Aprovou" hide-details="auto"
                            v-model="forms.id_usuario_aprovou_fiscal"
                            :items="pessoas" item-title="nome_razao" item-value="id"
                        />
                      </v-col>

                      <!-- XML -->
                      <v-col cols="12" md="9">
                        <v-text-field density="compact" variant="outlined" label="Arquivo XML" hide-details="auto"
                                      v-model="forms.arquivoxml"/>
                      </v-col>

                      <!-- extras -->
                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Tipo" hide-details="auto"
                                      v-model="forms.tipo" :rules="validacao" maxlength="1" />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="Regra CFOP" hide-details="auto"
                                      v-model="forms.regra_cfop"/>
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="NF Estrangeira" hide-details="auto"
                                      v-model="forms.nf_estrangeira"/>
                      </v-col>

                      <!-- Importação -->
                      <v-col cols="12" md="3">
                        <v-text-field density="compact" variant="outlined" label="% ICMS Importação" hide-details="auto" type="number"
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
                    </v-row>
                  </template>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-form>
          </template>
        </forms-expand-transition>

        <tabela-padrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="entradaDfe"
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
                icon="mdi-pencil" size="small"
                color="primary" variant="text"
                @click="editarItem(item)"
            />

            <v-btn
                icon="mdi-delete" size="small"
                color="error" variant="text"
                @click="excluirItem(item)"
            />
          </template>
        </tabela-padrao>
      </v-card>

      <ExcluirModal
          :cancelar="cancelarModalExcluir"
          :deletar="confirmarExclusao"
          :loading="loading"
          v-model:modal-excluir="excluirModal"
      >
        <template #item>entrada {{itemSelecionado?.id}}</template>
      </ExcluirModal>
    </template>
  </top-all-pages>

</template>

<script setup>
import {ref, computed, watchEffect, reactive} from "vue";
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useProdutosStore} from "@/stores/APIs/produtos";
import BotaoExpandTransition from "@/components/base/padrao-paginas/BotaoExpandTransition.vue";
import FormsExpandTransition from "@/components/base/padrao-paginas/FormsExpandTransition.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {usePessoasStore} from "@/stores/APIs/pessoas";
import {useLocalizacaoStore} from "@/stores/APIs/localizacao";
import ExcluirModal from "@/components/base/modais/ExcluirModal.vue";
import AlmoxarifadoMenu from "@/components/base/menu/AlmoxarifadoMenu.vue";
import CfopMenu from "@/components/base/menu/CfopMenu.vue";

const localizacaoStore = useLocalizacaoStore();
const produtosStore = useProdutosStore();
const pessoasStore = usePessoasStore();
const themeStore = useThemeStore();

const entradaDfe = computed(() => produtosStore.entradadfe);
const loading = computed(() => produtosStore.loading);
const pessoas = computed(() => pessoasStore.pessoas);
const ufs = computed(() => localizacaoStore.ufs);

const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));

console.log('Empresa Selecionada ID:', idEmpresa?.id);

const formularioAberto = ref(false);
const exibir = ref(false);
const itemSelecionado = ref(null);
const editando = ref(false);
const panels = ref([]);
const search = ref("");
const almoxarifadoNome = ref("");
const cfopNome = ref("");

const toggleFormulario = () => {
  formularioAberto.value = !formularioAberto.value;
  if (!formularioAberto.value) {
    cancelarFormulario();
  }

  if (editando.value) {
    editando.value = false;
    cancelarFormulario();
  }

  panels.value = [];
};

const selecionarAlmoxarifado = (almoxarifado) => {
  forms.id_almoxarifado = almoxarifado.id;
  almoxarifadoNome.value = almoxarifado.descalmoxarifado || almoxarifado.nome || '';
};

const selecionarCfop = (cfop) => {
  forms.id_cfop = cfop.id;
  cfopNome.value = cfop.codigo + ' - ' + (cfop.descricao || '');
};

const headers = ref([
  {title: 'ID', key: 'id'},
  {title: 'Fornecedor', key: 'nome_razao'},
  {title: 'C.F.O.P', key: 'id_cfop'},
  {title: 'Nota', key: 'id_nota'},
  {title: 'Série', key: 'id_serie'},
  {title: 'Importação XML', key: 'importacaoxml'},
  {title: 'Valor NF', key: 'vlr_nf'},
  {title: 'Ações', key: 'acoes', sortable: false},
]);

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

  formularioAberto.value = false;
};

watchEffect(() => {
  if (entradaDfe.value.length === 0)
    produtosStore.buscarEntradasDfe(1);

  if (pessoas.value.length === 0 && formularioAberto.value)
    pessoasStore.buscarTodasPessoas();

  if (ufs.value.length === 0 && formularioAberto.value)
    localizacaoStore.buscarTodasUfs();
});

const salvarFormulario = async () => {

  forms.gerou_financeiro = forms.gerou_financeiro ? 'S' : 'N';
  forms.gerou_estoque = forms.gerou_estoque ? 'S' : 'N';
  forms.importacaoxml = forms.importacaoxml ? 'S' : 'N';
  forms.nf_origem = forms.nf_origem ? 'S' : 'N';

  if (!editando.value) {
    console.log('Payload para salvar: ', payload);

    const payload = normalizarForm(forms);
    await produtosStore.cadastrarEntradaDfe(
        { data: [ payload ] },
        idEmpresa?.id
    );
  }
  else {
    console.log('Payload para editar: ', forms);
    await produtosStore.atualizarEntradaDfe(
        idEmpresa?.id,
        forms.id,
        { data: [ forms ] }
    );
  }

  editando.value = false;
  cancelarFormulario();
  formularioAberto.value = false;
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
  "id_almoxarifado", "id_cfop", "id_uf",
  "id_transportadora", "qtd_volume",
  "id_planopagto", "id_usuario_aprovou_fiscal",
  "nfe_numero", "nfe_numero_serie", "nfe_acesso"
];

const normalizarForm = (data) => {
  const result = {};

  for (const key in data) {
    const value = data[key];

    // FLOATS → sempre retornar 0.00
    if (camposFloat.includes(key)) {
      const num = Number(value);
      result[key] = isNaN(num) ? parseFloat("0.00") : parseFloat(num.toFixed(2));
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
 * EXCLUIR ITEM
 */
const excluirModal = ref(false);

const excluirItem = (item) => {
  itemSelecionado.value = item;
  excluirModal.value = true;
};

const cancelarModalExcluir = () => {
  excluirModal.value = false;
  itemSelecionado.value = null;
};

const confirmarExclusao = async () => {
  await produtosStore.deletarEntradaDfe(
      itemSelecionado.value.id,
      idEmpresa?.id
  );
  cancelarModalExcluir();
};

/**
 * EDITAR ITEM
 */

const editarItem = async (item) => {
  await produtosStore.buscarEntradaDfePorId(
      idEmpresa?.id,
      item.id
  );

  const entrada = produtosStore.entradadfeItem;
  itemSelecionado.value = entrada;

  panels.value = [0,1,2,3,4,5,6,7,8,9];

  Object.assign(forms, itemSelecionado.value);

  // Carregar nome do almoxarifado se existir
  if (entrada?.id_almoxarifado) {
    // Se os dados já vêm com descalmox, usar diretamente
    if (entrada.descalmox) {
      almoxarifadoNome.value = entrada.descalmox;
    } else {
      // Caso contrário, deixar em branco (será preenchido ao selecionar novamente)
      almoxarifadoNome.value = '';
    }
  }

  // Carregar nome do CFOP se existir
  if (entrada?.id_cfop) {
    // Se os dados já vêm com a descrição do CFOP, usar diretamente
    if (entrada.codigo_cfop && entrada.descricao_cfop) {
      cfopNome.value = entrada.codigo_cfop + ' - ' + entrada.descricao_cfop;
    } else {
      // Caso contrário, deixar em branco (será preenchido ao selecionar novamente)
      cfopNome.value = '';
    }
  }

  editando.value = true;
  formularioAberto.value = true;
}
</script>