<template>
  <particle-background/>
  <main class="mx-auto my-10 z-10 w-[90%] md:w-[80%]">
    <h1 class='text-2xl text-uppercase texto-card position-relative z-10 mb-5'>Cadastrar Empresa</h1>
    <v-form ref="formRef" v-model="isValid" class="forms">
      <v-container>
        <!-- SWITCHES NO TOPO -->
        <div class="flex items-center justify-end gap-10">
          <v-switch
              v-model="data.matriz"
              label="Matriz"
              color="primary"
              hide-details="auto"
              true-value="S"
              false-value="N"
          />

          <v-switch
              v-model="data.ativo"
              label="Ativo"
              color="success"
              hide-details="auto"
              true-value="S"
              false-value="N"
          />
        </div>

        <!-- CAMPOS GERAIS -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
                label="Razão Social"
                v-model="data.razao_social"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
                label="Nome Fantasia"
                v-model="data.fantasia"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
                label="Telefone"
                v-model="data.telefone"
                variant="outlined"
                hide-details="auto"
                prefix="55"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
                v-mask-phone.br
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="Celular"
                v-model="data.celular"
                variant="outlined"
                hide-details="auto"
                prefix="55"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
                v-mask-phone.br
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="WhatsApp"
                v-model="data.whatsapp"
                variant="outlined"
                hide-details="auto"
                prefix="55"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
                v-mask-phone.br
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
                label="CNPJ"
                v-model="data.cnpj"
                variant="outlined"
                hide-details="auto"
                v-mask-cnpj
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="Inscrição Estadual"
                v-model="data.insc_estadual"
                variant="outlined"
                hide-details="auto"
                v-mask-number
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="Inscrição Municipal"
                v-model="data.insc_municipal"
                variant="outlined"
                hide-details="auto"
                v-mask-number
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
                label="Inscrição Suframa"
                v-model="data.insc_suframa"
                variant="outlined"
                hide-details="auto"
                v-mask-number
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
                label="Inscrição Subst. Tributária"
                v-model="data.insc_subst_trib"
                variant="outlined"
                hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
                label="CEP"
                v-model="data.cep"
                variant="outlined"
                hide-details="auto"
                v-mask-cep
            />
          </v-col>
          <v-col cols="12" md="7">
            <v-text-field
                label="Endereço"
                v-model="data.endereco"
                variant="outlined"
                hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
                label="Número"
                v-model="data.numero"
                variant="outlined"
                hide-details="auto"
                v-mask-number
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
                label="ID Cidade"
                v-model="cidade"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
                append-inner-icon="mdi-magnify"
                @click:appendInner="modalCidade = !modalCidade"
                :prefix="`ID: ${data.id_cidade ? data.id_cidade : '00'}`"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="ID Bairro"
                v-model="bairro"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
                append-inner-icon="mdi-magnify"
                @click:appendInner="modalBairro = !modalBairro"
                :prefix="`ID: ${data.id_bairro ? data.id_bairro : '00'}`"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="ID Atividade"
                v-model="atividade"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
                append-inner-icon="mdi-magnify"
                @click:appendInner="modalAtividade = !modalAtividade"
                :prefix="`ID: ${data.id_atividade ? data.id_atividade : '00'}`"
                :theme="themeStore.darkMode ? 'dark' : 'light'"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
                label="Complemento"
                v-model="data.complemento"
                variant="outlined"
                hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
                label="Perfil"
                v-model="data.perfil"
                variant="outlined"
                hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
                label="CRT"
                v-model="data.crt"
                variant="outlined"
                hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="CNAE"
                v-model="data.cnae"
                variant="outlined"
                hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="Ident. Interna"
                v-model="data.ident_interna"
                variant="outlined"
                hide-details="auto"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
                label="ID CliFor VST"
                v-model="data.id_clifor_vst"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="Tipo Contrato"
                v-model="data.tp_contrato"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
                label="Tipo Perfil"
                v-model="data.tp_perfil"
                variant="outlined"
                hide-details="auto"
                :rules="[rules.required]"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="var(--text-color-laranja)" variant="text" @click="limparForm">
              Limpar
            </v-btn>

            <v-btn color="var(--text-color-laranja)" variant="flat" class="ml-2 text-white" @click="submitForm">
              Salvar
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <cidade-modal v-model:modal="modalCidade" :close-modal="closeModalCidade" @selecionar="preencherCamposCidade" />
    <bairro-modal v-model:modal="modalBairro" :close-modal="closeModalBairro" @selecionar="preencherCamposBairro" />
    <atividade-modal v-model:modal="modalAtividade" :close-modal="closeModalAtividade" @selecionar="preencherCamposAtividade" />
  </main>
</template>

<script setup>
import {ref, watch} from 'vue'
import ParticleBackground from "@/components/particle/ParticleBackground.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {useLocalizacaoStore} from "@/stores/APIs/localizacao";
import CidadeModal from "@/components/base/modais/localizacao/CidadeModal.vue";
import BairroModal from "@/components/base/modais/localizacao/BairroModal.vue";
import AtividadeModal from "@/components/base/modais/localizacao/AtividadeModal.vue";

const themeStore = useThemeStore();
const localizacaoStore = useLocalizacaoStore();

const formRef = ref(null)
const isValid = ref(false)

const data = ref({
  id_saas: null,
  razao_social: '',
  fantasia: '',
  telefone: '',
  celular: '',
  whatsapp: '',
  cnpj: '',
  insc_estadual: '',
  insc_municipal: '',
  insc_suframa: '',
  insc_subst_trib: '',
  endereco: '',
  numero: '',
  cep: '',
  id_cidade: null,
  id_bairro: null,
  id_atividade: null,
  complemento: '',
  perfil: '',
  crt: '',
  cnae: '',
  ident_interna: '',
  id_clifor_vst: null,
  matriz: 'N',
  ativo: 'S',
  tp_contrato: '',
  tp_perfil: '',
  dh_cadastro: '',
  dh_ativacao: '',
  dh_expiracao: '',
});

const cidade = ref('');
const bairro = ref('');
const atividade = ref('');

const rules = {
  required: (v) => !!v || 'Campo obrigatório',
}

const limparForm = () => {
  Object.keys(data.value).forEach((key) => {
    if (typeof data.value[key] === 'string') data.value[key] = ''
    else if (typeof data.value[key] === 'number' || data.value[key] === null)
      data.value[key] = null
  })
  // valores padrão dos switches
  data.value.matriz = 'N'
  data.value.ativo = 'S'
}

const submitForm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return
  // Limpar máscaras dos campos antes de enviar

  data.value.cnpj = limparInput(data.value.cnpj)
  data.value.cep = limparInput(data.value.cep)
  data.value.telefone = limparInput(data.value.telefone)
  data.value.celular = limparInput(data.value.celular)
  data.value.whatsapp = limparInput(data.value.whatsapp)

  console.log('Enviando dados:', data.value)

}

function limparInput(input) {
  return input ? input.replace(/\D/g, '') : ''
}

/**
 * BUSCANDO O CEP
 */

watch(
    () => data.value.cep,
    async (novoCep) => {
      if (novoCep) {
        const cepLimpo = limparInput(data.value.cep)
        if (cepLimpo && cepLimpo.length === 8) {
          await localizacaoStore.buscarCep(cepLimpo)

          if (localizacaoStore.cep) {
            data.value.endereco = localizacaoStore.cep?.logradouro || ''
            cidade.value = localizacaoStore.cep?.localidade || null
            bairro.value = localizacaoStore.cep?.bairro || null
            data.value.id_cidade = localizacaoStore.cep?.id_cidade || null
            data.value.id_bairro = localizacaoStore.cep?.id_bairro || null
          }
        }
      }
    }
)

/**
 * PESQUISAR CIDADE, BAIRRO E ATIVIDADE
 */

// cidade
const modalCidade = ref(false);
const closeModalCidade = () => {
  modalCidade.value = false;
}
const preencherCamposCidade = (c) => {
  data.value.id_cidade = c.codigo;
  cidade.value = c.cidade;
};

// bairro
const modalBairro = ref(false);
const closeModalBairro = () => {
  modalBairro.value = false;
};
const preencherCamposBairro = (b) => {
  data.value.id_bairro = b.codigo;
  bairro.value = b.bairro;
};

// atividade
const modalAtividade = ref(false);
const closeModalAtividade = () => {
  modalAtividade.value = false;
}
const preencherCamposAtividade = (a) => {
  data.value.id_atividade = a.codigo;
  atividade.value = a.atividade;
};
</script>

<style scoped>
.forms {
  padding: 10px 0;
  border-radius: 10px;
  background: var(--bg-color);
  border: 2px solid var(--text-secondary-laranja);
  backdrop-filter: blur(10px);
}
</style>