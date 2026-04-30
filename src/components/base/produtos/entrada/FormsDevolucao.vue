<template>
  <v-expansion-panels :theme="themeStore.darkMode ? 'dark' : 'light'" color="var(--bg-card)">
    <v-expansion-panel elevation="1" class="mb-5" title="Devolução de Entrada" color="var(--bg-card)">
      <template #text>
        <v-row dense>

          <!-- ✅ NOVO: selecionar entrada base -->
          <v-col cols="12" md="6">
            <v-autocomplete
                density="compact"
                variant="outlined"
                label="Entrada base (selecionar a nota para devolver)"
                hide-details="auto"
                v-model="entradaSelecionadaId"
                :items="entradas"
                item-title="label"
                item-value="value"
                clearable
                class="required-left-border"
                :rules="validacao"
                @update:modelValue="onSelecionarEntrada"
            />
          </v-col>

          <!-- opcional: mostrar id da entrada selecionada no forms -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact"
                variant="outlined"
                label="ID Entrada Base"
                hide-details="auto"
                v-model="forms.id_entrada_origem"
                readonly
            />
          </v-col>

          <!-- XML (mantém igual ao forms entrada) -->
          <v-col cols="12" md="4">
            <v-file-input
                density="compact"
                variant="outlined"
                label="Arquivo XML (opcional)"
                hide-details="auto"
                v-model="forms.arquivoxml"
                @update:modelValue="onXmlSelected"
                accept=".xml"
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

          <!-- numero_nf (devolução) -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Número NF" hide-details="auto"
                v-model="forms.numero_nf" :rules="validacao"
                class="required-left-border"
            />
          </v-col>

          <!-- serie_nf -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Série NF" hide-details="auto"
                v-model="forms.serie_nf" :rules="validacao"
                class="required-left-border"
            />
          </v-col>

          <!-- id_almoxarifado -->
          <v-col cols="12" md="2">
            <v-text-field
                density="compact" variant="outlined" label="Almoxarifado" hide-details="auto"
                v-model="almoxarifadoNome" readonly :rules="validacao" class="required-left-border"
            >
              <template #append-inner>
                <almoxarifado-menu @selecionar="selecionarAlmoxarifado"/>
              </template>
            </v-text-field>
          </v-col>

          <!-- CFOP -->
          <v-col cols="12" md="2">
            <v-autocomplete
                density="compact"
                variant="outlined"
                label="CFOP"
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
            <v-text-field density="compact" variant="outlined" label="Qtd Volume" hide-details="auto"
                          type="number" v-model="forms.qtd_volume"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Espécie Volume" hide-details="auto"
                          v-model="forms.especie_volume"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Peso Bruto" hide-details="auto"
                          type="number" v-model="forms.peso_bruto"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Peso Líquido" hide-details="auto"
                          type="number" v-model="forms.peso_liquido"/>
          </v-col>

          <!-- Veículo -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Placa" hide-details="auto"
                          v-model="forms.placa_veiculo"/>
          </v-col>

          <!-- NFe (se você quiser manter) -->
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
            <v-text-field density="compact" variant="outlined" label="Mensagem NFe/NFCe" hide-details="auto"
                          v-model="forms.msg_nfe_nfce"/>
          </v-col>

          <!-- Booleans -->
          <v-col cols="12" md="3">
            <v-switch
                v-model="forms.importacaoxml"
                :label="`Importação XML? ${forms.importacaoxml ? 'Sim' : 'Não'}`"
                hide-details="auto"
                color="var(--text-color-laranja)"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-switch
                v-model="forms.nf_origem"
                :label="`NF Origem? ${forms.nf_origem ? 'Sim' : 'Não'}`"
                hide-details="auto"
                color="var(--text-color-laranja)"
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
            <v-text-field density="compact" variant="outlined" label="Base ICMS" hide-details="auto"
                          type="number" v-model="forms.base_icms" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Alíquota ICMS" hide-details="auto"
                          type="number" v-model="forms.aliquota_icms" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor ICMS" hide-details="auto"
                          type="number" v-model="forms.vlr_icms" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Isento ICMS" hide-details="auto"
                          type="number" v-model="forms.isento_icms"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Outras Despesas" hide-details="auto"
                          type="number" v-model="forms.outras_despesas" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Desp. Fora NF" hide-details="auto"
                          type="number" v-model="forms.outras_despesas_foranf"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Base ICMS ST" hide-details="auto"
                          type="number" v-model="forms.base_icms_subst" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor ICMS ST" hide-details="auto"
                          type="number" v-model="forms.vlr_icms_subst" :rules="validacao" class="required-left-border"/>
          </v-col>

          <!-- IPI -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Base IPI" hide-details="auto"
                          type="number" v-model="forms.base_ipi" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor IPI" hide-details="auto"
                          type="number" v-model="forms.vlr_ipi" :rules="validacao" class="required-left-border"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Isento IPI" hide-details="auto"
                          type="number" v-model="forms.isento_ipi"/>
          </v-col>

          <!-- Diversos -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Base II" hide-details="auto"
                          type="number" v-model="forms.base_ii"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor II" hide-details="auto"
                          type="number" v-model="forms.vlr_ii"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Base ISS" hide-details="auto"
                          type="number" v-model="forms.base_iss"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor ISS" hide-details="auto"
                          type="number" v-model="forms.vlr_iss"/>
          </v-col>

          <!-- PIS/COFINS -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="PIS Produto" hide-details="auto"
                          type="number" v-model="forms.vlr_pis_produto"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Cofins Produto" hide-details="auto"
                          type="number" v-model="forms.vlr_cofins_produto"/>
          </v-col>

          <!-- Plano -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Plano Pagamento" hide-details="auto"
                          v-model="forms.id_planopagto"/>
          </v-col>

          <!-- Seguro / desconto / frete -->
          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor Seguro" hide-details="auto"
                          type="number" v-model="forms.vlr_seguro"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor Desconto" hide-details="auto"
                          type="number" v-model="forms.vlr_desconto"/>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Tipo Frete" hide-details="auto"
                          v-model="forms.tipo_frete"/>
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
                density="compact" variant="outlined" label="Transportadora" hide-details="auto"
                v-model="forms.id_transportadora" clearable
                :items="pessoas" item-title="nome_razao" item-value="id"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field density="compact" variant="outlined" label="Valor Frete" hide-details="auto"
                          type="number" v-model="forms.vlr_frete"/>
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import AlmoxarifadoMenu from "@/components/base/menu/AlmoxarifadoMenu.vue";
import {computed, defineEmits, defineProps, ref, toRefs} from "vue";
import {useProdutosStore} from "@/stores/APIs/produtos";

const produtosStore = useProdutosStore();

const props = defineProps({
  forms: { type: Object, required: true },
  selecionarAlmoxarifado: { type: Function, required: true },
  themeStore: { type: Object, required: true },
  validacao: { type: Array, required: true },
  pessoas: { type: Array, required: true },
  almoxarifadoNome: { type: String, required: false },
  ufs: { type: Array, required: true },
  cfops: { type: Array, required: true },

  // ✅ NOVO: lista de entradas para selecionar (com itens já cadastrados)
  entradas: { type: Array, required: true },
});

const { forms, validacao, themeStore, pessoas, almoxarifadoNome, ufs, selecionarAlmoxarifado, cfops, entradas } =
    toRefs(props);

const emit = defineEmits(["ler-xml", "preencher-itens", "entrada-selecionada"]);

const entradaSelecionadaId = ref(null);

const onXmlSelected = (files) => {
  const file = Array.isArray(files) ? files[0] : files;
  emit("ler-xml", file);
};

const onSelecionarEntrada = async (entradaId) => {
  // limpar
  console.log('entrada id: ', entradaId);

  if (!entradaId) {
    forms.value.id_entrada_origem = null;
    emit("preencher-itens", []);
    emit("entrada-selecionada", null);
    return;
  }

  console.log('preenchendo nota')

  try {
    const idEmpresa = JSON.parse(localStorage.getItem("empresaSelecionada"));

    await produtosStore.buscarEntradaDfePorId(idEmpresa?.id, entradaId);

    const entrada = computed(() => produtosStore.entradadfeItem);

    console.log('visualizando nota selecionada: ', entrada.value);

    if (!entrada.value) return;

    console.log('começando a preencher forms')

    // 1) salva ID origem no forms
    forms.value.id_entrada_origem = entrada.value.id;

    // 2) Preenche cabeçalho
    forms.value.id_fornecedor = entrada.value.id_fornecedor ?? forms.value.id_fornecedor ?? null;
    forms.value.numero_nf = entrada.value.numero_nf ?? entrada.value.id_nota ?? forms.value.numero_nf ?? null;
    forms.value.serie_nf = entrada.value.serie_nf ?? entrada.value.id_serie ?? forms.value.serie_nf ?? null;

    forms.value.id_almoxarifado = entrada.value.id_almoxarifado ?? forms.value.id_almoxarifado ?? null;
    forms.value.id_cfop = entrada.value.id_cfop ?? forms.value.id_cfop ?? null;
    forms.value.id_uf = entrada.value.id_uf ?? forms.value.id_uf ?? null;

    forms.value.dtemissao = entrada.value.dtemissao ?? forms.value.dtemissao ?? null;
    forms.value.dtsaida = entrada.value.dtentrada ?? entrada.value.dtsaida ?? forms.value.dtsaida ?? null;

    forms.value.especie = entrada.value.especie ?? forms.value.especie ?? null;
    forms.value.vlr_total_produto = entrada.value.vlr_total_produto ?? forms.value.vlr_total_produto ?? null;
    forms.value.vlr_nf = entrada.value.vlr_nf ?? forms.value.vlr_nf ?? null;
    forms.value.situacao = entrada.value.situacao ?? forms.value.situacao ?? null;

    const t = entrada.value.totais ?? entrada.value;

    forms.value.base_icms = t.base_icms ?? forms.value.base_icms ?? null;
    forms.value.aliquota_icms = t.aliquota_icms ?? forms.value.aliquota_icms ?? null;
    forms.value.vlr_icms = t.vlr_icms ?? forms.value.vlr_icms ?? null;
    forms.value.isento_icms = t.isento_icms ?? forms.value.isento_icms ?? null;

    forms.value.base_ipi = t.base_ipi ?? forms.value.base_ipi ?? null;
    forms.value.vlr_ipi = t.vlr_ipi ?? forms.value.vlr_ipi ?? null;
    forms.value.isento_ipi = t.isento_ipi ?? forms.value.isento_ipi ?? null;

    forms.value.base_icms_subst = t.base_icms_subst ?? forms.value.base_icms_subst ?? null;
    forms.value.vlr_icms_subst = t.vlr_icms_subst ?? forms.value.vlr_icms_subst ?? null;

    forms.value.vlr_seguro = t.vlr_seguro ?? forms.value.vlr_seguro ?? null;
    forms.value.vlr_desconto = t.vlr_desconto ?? forms.value.vlr_desconto ?? null;
    forms.value.tipo_frete = t.tipo_frete ?? forms.value.tipo_frete ?? null;
    forms.value.vlr_frete = t.vlr_frete ?? forms.value.vlr_frete ?? null;

    forms.value.outras_despesas = t.outras_despesas ?? forms.value.outras_despesas ?? null;
    forms.value.outras_despesas_foranf = t.outras_despesas_foranf ?? forms.value.outras_despesas_foranf ?? null;

    forms.value.peso_bruto = t.peso_bruto ?? forms.value.peso_bruto ?? null;
    forms.value.peso_liquido = t.peso_liquido ?? forms.value.peso_liquido ?? null;
    forms.value.qtd_volume = t.qtd_volume ?? forms.value.qtd_volume ?? null;
    forms.value.especie_volume = t.especie_volume ?? forms.value.especie_volume ?? null;
    forms.value.placa_veiculo = t.placa_veiculo ?? forms.value.placa_veiculo ?? null;

    // NFe
    forms.value.nfe_numero = entrada.value.nfe_numero ?? forms.value.nfe_numero ?? null;
    forms.value.nfe_numero_serie = entrada.value.nfe_numero_serie ?? forms.value.nfe_numero_serie ?? null;
    forms.value.nfe_acesso = entrada.value.nfe_acesso ?? forms.value.nfe_acesso ?? null;
    forms.value.nfe_chavedeacesso = entrada.value.nfe_chavedeacesso ?? forms.value.nfe_chavedeacesso ?? null;
    forms.value.nfe_modelo = entrada.value.nfe_modelo ?? forms.value.nfe_modelo ?? null;
    forms.value.id_transportadora = entrada.value.id_transportadora ?? null

    forms.value.importacaoxml = entrada.value.importacaoxml === 'S' ?? false
    forms.value.nf_origem = entrada.value.nf_origem === 'S' ?? false

    // 3) Preenche itens
    const itensOrigem = entrada.value.itens ?? entrada.value.items ?? [];

    const itensDevolucao = itensOrigem.map((i) => ({
      ...i,
    }));

    emit("preencher-itens", itensDevolucao);
    emit("entrada-selecionada", entrada.value);
  } catch (error) {
    console.error("Erro ao buscar entrada por ID:", error);
    emit("preencher-itens", []);
    emit("entrada-selecionada", null);
  }
};
</script>