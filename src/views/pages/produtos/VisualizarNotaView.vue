<template>
  <top-all-pages icon="mdi-file-document-outline">
    <template #titulo>Visualizar Nota Fiscal</template>
    <template #section>
      <v-form ref="formsNf" @submit="salvarFormulario">

        <v-expansion-panels :theme="themeStore.darkMode ? 'dark' : 'light'" color="var(--bg-card)">
          <v-expansion-panel elevation="1" class="mb-5" title="Entrada de Nota" color="var(--bg-card)">
            <template #text>
              <v-row dense>
                <v-col cols="12" md="12">
                  <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Arquivo XML"
                      hide-details="auto"
                      v-model="forms.arquivoxml"
                      readonly
                  />
                </v-col>

                <!-- id_fornecedor -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      density="compact" variant="outlined" label="Fornecedor" hide-details="auto"
                      v-model="forms.id_fornecedor" readonly :items="pessoas" item-title="nome_razao" item-value="id"
                  />
                </v-col>

                <!-- id_nota -->
                <v-col cols="12" md="1">
                  <v-text-field
                      density="compact" variant="outlined" label="Nota" hide-details="auto"
                      v-model="forms.id_nota" readonly
                  />
                </v-col>

                <!-- id_serie -->
                <v-col cols="12" md="1">
                  <v-text-field
                      density="compact" variant="outlined" label="Série" hide-details="auto"
                      v-model="forms.id_serie" readonly
                  />
                </v-col>

                <!-- id_almoxarifado -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Almoxarifado" hide-details="auto"
                      v-model="forms.id_almoxarifado" readonly
                  />
                </v-col>

                <!-- id_cfop -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="C.F.O.P" hide-details="auto"
                      v-model="forms.id_cfop" readonly>
                  </v-text-field>
                </v-col>

                <!-- id_uf -->
                <v-col cols="12" md="2">
                  <v-autocomplete
                      density="compact" variant="outlined" label="UF" hide-details="auto" :rules="validacao"
                      v-model="forms.id_uf" readonly
                  />
                </v-col>

                <!-- valores iniciais -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Espécie" hide-details="auto"
                      v-model="forms.especie" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Valor Total Produtos" hide-details="auto"
                      v-model="forms.vlr_total_produto" type="number" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Valor NF" hide-details="auto" type="number"
                      v-model="forms.vlr_nf" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Situação" hide-details="auto"
                      v-model="forms.situacao" readonly
                  />
                </v-col>

                <!-- Volume -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Qtd Volume" hide-details="auto" type="number"
                      v-model="forms.qtd_volume" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Espécie Volume" hide-details="auto"
                      v-model="forms.especie_volume" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Peso Bruto" hide-details="auto" type="number"
                      v-model="forms.peso_bruto" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Peso Líquido" hide-details="auto" type="number"
                      v-model="forms.peso_liquido" readonly
                  />
                </v-col>

                <!-- Veículo -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Placa" hide-details="auto"
                      v-model="forms.placa_veiculo" readonly
                  />
                </v-col>

                <!-- Origem / NF-e -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Número NFe" hide-details="auto"
                      v-model="forms.nfe_numero" type="number" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Série NFe" hide-details="auto"
                      v-model="forms.nfe_numero_serie" type="number" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Acesso NFe" hide-details="auto"
                      v-model="forms.nfe_acesso" type="number" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Chave Origem" hide-details="auto"
                      v-model="forms.nfe_chavedeacesso_origem" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Modelo NFe" hide-details="auto"
                      v-model="forms.nfe_modelo" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Nº Lote" hide-details="auto"
                      v-model="forms.nfe_nrlote" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Nº Recibo" hide-details="auto"
                      v-model="forms.nfe_nrrecibo" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Status" hide-details="auto"
                      v-model="forms.nfe_status" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Chave Acesso" hide-details="auto"
                      v-model="forms.nfe_chavedeacesso" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="TP Emissão DANFE" hide-details="auto"
                      v-model="forms.nfe_tp_emissao_danfe" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Protocolo Envio" hide-details="auto"
                      v-model="forms.nfe_nrprotocolo_envio" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Prot. Inutilização" hide-details="auto"
                      v-model="forms.nfe_nrprotocolo_inutil" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Prot. Cancelamento" hide-details="auto"
                      v-model="forms.nfe_nrprotocolo_cancelamento" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Mensagem NFe/NFCe" hide-details="auto"
                      v-model="forms.msg_nfe_nfce" readonly
                  />
                </v-col>

                <!-- Fiscal -->
                <v-col cols="12" md="4">
                  <v-autocomplete
                      density="compact" variant="outlined" label="Usuário Aprovou" hide-details="auto"
                      v-model="forms.id_usuario_aprovou_fiscal" readonly
                      :items="pessoas" item-title="nome_razao" item-value="id"
                  />
                </v-col>

                <!-- extras -->
                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Tipo" hide-details="auto"
                      v-model="forms.tipo" maxlength="1" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="Regra CFOP" hide-details="auto"
                      v-model="forms.regra_cfop" readonly
                  />
                </v-col>

                <v-col cols="12" md="2">
                  <v-text-field
                      density="compact" variant="outlined" label="NF Estrangeira" hide-details="auto"
                      v-model="forms.nf_estrangeira" readonly
                  />
                </v-col>

                <!-- Importação -->
                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="% ICMS Importação" hide-details="auto"
                      type="number" v-model="forms.perc_icmsimp" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="Siscomex" hide-details="auto" type="number"
                      v-model="forms.vlr_siscomex" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="AFRMM" hide-details="auto" type="number"
                      v-model="forms.vlr_afrmm" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-text-field
                      density="compact" variant="outlined" label="NFe Impressa" hide-details="auto"
                      v-model="forms.nfe_impressa" readonly
                  />
                </v-col>

                <!-- Booleans -->
                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.gerou_financeiro"
                      :label="`Gerou Financeiro? ${forms.gerou_financeiro ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.gerou_estoque"
                      :label="`Gerou Estoque? ${forms.gerou_estoque ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.importacaoxml"
                      :label="`Importação XML? ${forms.importacaoxml ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)" readonly
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <v-switch
                      v-model="forms.nf_origem"
                      :label="`NF Origem? ${forms.nf_origem ? 'Sim' : 'Não'}`"
                      hide-details="auto" color="var(--text-color-laranja)" readonly
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
            :loading="produtosStore.loading"
            :show-search="false"
            item-key="id"
            no-data-icon="mdi-database-off"
            :item-por-pag="5"
            no-data-text="Nenhum item encontrado"
        />

        <v-row class="mt-5" dense>
          <!-- ICMS -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ICMS" hide-details="auto" type="number"
                v-model="forms.base_icms" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Alíquota ICMS" hide-details="auto" type="number"
                v-model="forms.aliquota_icms" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ICMS" hide-details="auto" type="number"
                v-model="forms.vlr_icms" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Isento ICMS" hide-details="auto" type="number"
                v-model="forms.isento_icms" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Outras Despesas" hide-details="auto" type="number"
                v-model="forms.outras_despesas" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Desp. Fora NF" hide-details="auto" type="number"
                v-model="forms.outras_despesas_foranf" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ICMS ST" hide-details="auto" type="number"
                v-model="forms.base_icms_subst" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ICMS ST" hide-details="auto" type="number"
                v-model="forms.vlr_icms_subst" readonly
            />
          </v-col>

          <!-- IPI -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Base IPI" hide-details="auto" type="number"
                          v-model="forms.base_ipi" readonly />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor IPI" hide-details="auto" type="number"
                          v-model="forms.vlr_ipi" readonly />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Isento IPI" hide-details="auto"
                          type="number" v-model="forms.isento_ipi" readonly />
          </v-col>

          <!-- Impostos diversos -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base II" hide-details="auto" type="number"
                v-model="forms.base_ii" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor II" hide-details="auto" type="number"
                v-model="forms.vlr_ii" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ISS" hide-details="auto" type="number"
                v-model="forms.base_iss" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ISS" hide-details="auto" type="number"
                v-model="forms.vlr_iss" readonly
            />
          </v-col>

          <!-- PIS/COFINS -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="PIS Produto" hide-details="auto" type="number"
                v-model="forms.vlr_pis_produto" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Cofins Produto" hide-details="auto" type="number"
                v-model="forms.vlr_cofins_produto" readonly
            />
          </v-col>

          <!-- Plano Pagamento -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Plano Pagamento" hide-details="auto"
                v-model="forms.id_planopagto" readonly
            />
          </v-col>

          <!-- Seguro / desconto / frete -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor Seguro" hide-details="auto" type="number"
                v-model="forms.vlr_seguro" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor Desconto" hide-details="auto" type="number"
                v-model="forms.vlr_desconto" readonly
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Tipo Frete" hide-details="auto"
                v-model="forms.tipo_frete" readonly
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
                density="compact" variant="outlined" label="Transportadora" hide-details="auto"
                v-model="forms.id_transportadora" readonly
                :items="pessoas" item-title="nome_razao" item-value="id"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor Frete" hide-details="auto" type="number"
                v-model="forms.vlr_frete" readonly
            />
          </v-col>
        </v-row>
      </v-form>
    </template>
  </top-all-pages>
</template>

<script setup>
import TopAllPages from "@/components/base/padrao-paginas/TopAllPages.vue";
import TabelaPadrao from "@/components/base/padrao-paginas/TabelaPadrao.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {useProdutosStore} from "@/stores/APIs/produtos";
import {usePessoasStore} from "@/stores/APIs/pessoas";
import {reactive, ref, watchEffect, computed} from "vue";
import {useRoute} from "vue-router";

const themeStore = useThemeStore();
const pessoasStore = usePessoasStore();
const produtosStore = useProdutosStore();
const route = useRoute();

const idEmpresa = JSON.parse(localStorage.getItem('empresaSelecionada'));
const pessoas = computed(() => pessoasStore.pessoas);
const id = route.params.id;

const forms = reactive({});

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
]);

watchEffect(async () => {
  if (id) {
    await produtosStore.buscarEntradaDfePorId(idEmpresa?.id ?? 1, id);
    Object.assign(forms, produtosStore.entradadfeItem);
    if (pessoas.value.length === 0) {
      await pessoasStore.buscarTodasPessoas();
    }
  }
});
</script>