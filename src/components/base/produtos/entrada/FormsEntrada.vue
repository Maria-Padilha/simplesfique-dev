<template>
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
                @update:modelValue="onXmlSelected" accept=".xml"
            />
          </v-col>

          <!-- id_fornecedor -->
          <v-col cols="12" md="2">
            <v-autocomplete
                density="compact" variant="outlined" label="Fornecedor" hide-details="auto"
                v-model="forms.id_fornecedor" :rules="validacao"
                :items="pessoas" item-title="nome_razao" item-value="id"
                class="required-left-border"
            />
          </v-col>

          <!-- id_nota -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Nota" hide-details="auto"
                v-model="forms.id_nota" :rules="validacao" @input="Number(forms.id_nota)"
                class="required-left-border"
            />
          </v-col>

          <!-- id_serie -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Série" hide-details="auto"
                v-model="forms.id_serie" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <!-- id_almoxarifado -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Almoxarifado" hide-details="auto"
                          v-model="almoxarifadoNome" readonly :rules="validacao" class="required-left-border">
              <template #append-inner>
                <almoxarifado-menu @selecionar="selecionarAlmoxarifado"/>
              </template>
            </v-text-field>
          </v-col>

          <!-- UF -->
          <v-col cols="12" md="2">
            <v-autocomplete
                density="compact"
                variant="outlined"
                label="UF"
                hide-details="auto"
                :rules="validacao"
                class="required-left-border"
                v-model="forms.id_uf"
                :items="ufs"
                item-title="title"
                item-value="value"
                clearable
            />
          </v-col>

          <!-- CFOP -->
          <v-col cols="12" md="2">
            <v-autocomplete
                density="compact"
                variant="outlined"
                label="Aliquota"
                hide-details="auto"
                :rules="validacao"
                class="required-left-border"
                v-model="forms.id_cfop"
                :items="cfops"
                item-title="title"
                item-value="value"
                clearable
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
                v-model="forms.vlr_total_produto" type="number" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
                density="compact" variant="outlined" label="Valor NF" hide-details="auto" type="number"
                v-model="forms.vlr_nf" :rules="validacao" class="required-left-border"
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

          <!-- extras -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Tipo" hide-details="auto"
                          v-model="forms.tipo" :rules="validacao" class="required-left-border" maxlength="1"/>
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

          <!-- Booleans -->
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

    <v-expansion-panel elevation="1" class="mb-5" title="Cálculos da Nota" color="var(--bg-card)">
      <template #text>
        <v-row class="mt-5" dense>
          <!-- ICMS -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ICMS" hide-details="auto" type="number"
                v-model="forms.base_icms" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Alíquota ICMS" hide-details="auto" type="number"
                v-model="forms.aliquota_icms" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ICMS" hide-details="auto" type="number"
                v-model="forms.vlr_icms" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Isento ICMS" hide-details="auto" type="number"
                v-model="forms.isento_icms" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Outras Despesas" hide-details="auto" type="number"
                v-model="forms.outras_despesas" :rules="validacao" class="required-left-border"
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
                v-model="forms.base_icms_subst" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ICMS ST" hide-details="auto" type="number"
                v-model="forms.vlr_icms_subst" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <!-- IPI -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Base IPI" hide-details="auto" type="number"
                          v-model="forms.base_ipi" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor IPI" hide-details="auto" type="number"
                          v-model="forms.vlr_ipi" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Isento IPI" hide-details="auto"
                          type="number"
                          v-model="forms.isento_ipi" :rules="validacao" class="required-left-border"/>
          </v-col>

          <!-- Impostos diversos -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base II" hide-details="auto" type="number"
                v-model="forms.base_ii" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor II" hide-details="auto" type="number"
                v-model="forms.vlr_ii" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Base ISS" hide-details="auto" type="number"
                v-model="forms.base_iss" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor ISS" hide-details="auto" type="number"
                v-model="forms.vlr_iss" :rules="validacao" class="required-left-border"
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
                v-model="forms.vlr_seguro" :rules="validacao" class="required-left-border"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Valor Desconto" hide-details="auto" type="number"
                v-model="forms.vlr_desconto" :rules="validacao" class="required-left-border"
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
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import AlmoxarifadoMenu from "@/components/base/menu/AlmoxarifadoMenu.vue";
import { defineProps, toRefs, defineEmits } from 'vue';

const props = defineProps({
  forms: {
    type: Object,
    required: true
  },
  selecionarAlmoxarifado: {
    type: Function,
    required: true
  },
  themeStore: {
    type: Object,
    required: true
  },
  validacao: {
    type: Array,
    required: true
  },
  pessoas: {
    type: Array,
    required: true
  },
  almoxarifadoNome: {
    type: String,
    required: false
  },
  cfopNome: {
    type: String,
    required: false
  },
  ufs: {
    type: Array,
    required: true
  },
  cfops: {
    type: Array
  }
});
const { forms, validacao, themeStore, pessoas, almoxarifadoNome, ufs, selecionarAlmoxarifado, cfops } = toRefs(props);

const emit = defineEmits(['ler-xml'])

const onXmlSelected = (files) => {
  const file = Array.isArray(files) ? files[0] : files
  emit('ler-xml', file)
}
</script>