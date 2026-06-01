<template>
  <particle-background/>
  <main class="mx-auto my-10 z-10 w-[90%] md:w-[85%]">
    <v-tabs v-model="tab" align-tabs="start" class="mb-5 texto-color-primary">
      <v-tab value="empresa">
        <div class="flex items-center gap-2">
          <v-icon
              :icon="camposFaltando.length ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
              :color="camposFaltando.length ? 'red' : 'green'"
              size="23px"
          />
          <p
              class="text-capitalize font-medium"
              :class="camposFaltando.length ? 'text-red' : 'text-green'"
          >
            Empresa
          </p>
        </div>
      </v-tab>


      <v-tab value="usuario">
        <div class="flex items-center gap-2">
          <v-icon
              :icon="camposFaltandoUsuario.length ? 'mdi-close-circle-outline' : 'mdi-check-circle-outline'"
              :color="camposFaltandoUsuario.length ? 'red' : 'green'"
              size="23px"
          />
          <p
              class="text-capitalize font-medium"
              :class="camposFaltandoUsuario.length ? 'text-red' : 'text-green'"
          >
            Usuário
          </p>
        </div>
      </v-tab>

      <v-tab value="cadastrar"><p class="text-capitalize">Cadastrar</p></v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab" class="texto-color-primary">
      <v-tabs-window-item value="empresa">
        <v-form ref="formRef" v-model="isValid" class="forms">
          <v-container>
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

            <v-row dense>
              <v-col cols="12" md="2">
                <v-text-field
                    label="CNPJ *"
                    v-model="data.cnpj"
                    variant="outlined"
                    hide-details="auto"
                    v-mask-cnpj
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                    label="Razão Social *"
                    v-model="data.razao_social"
                    variant="outlined"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                    label="Nome Fantasia *"
                    v-model="data.fantasia"
                    variant="outlined"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
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

              <v-col cols="12" md="6">
                <v-text-field
                    label="Inscrição Estadual"
                    v-model="data.insc_estadual"
                    variant="outlined"
                    hide-details="auto"
                    v-mask-number
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Inscrição Municipal"
                    v-model="data.insc_municipal"
                    variant="outlined"
                    hide-details="auto"
                    v-mask-number
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                    label="Inscrição Suframa"
                    v-model="data.insc_suframa"
                    variant="outlined"
                    hide-details="auto"
                    v-mask-number
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Inscrição Subst. Tributária"
                    v-model="data.insc_subst_trib"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                    label="CEP *"
                    v-model="data.cep"
                    variant="outlined"
                    hide-details="auto"
                    v-mask-cep
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                    label="Endereço"
                    v-model="data.endereco"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>

              <!-- localização -->
              <v-col cols="12" md="4">
                <v-text-field
                    label="Número"
                    v-model="data.numero"
                    variant="outlined"
                    hide-details="auto"
                    v-mask-number
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                    label="Cidade *"
                    v-model="cidade"
                    variant="outlined"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                >
                  <template #append-inner>
                    <cidade-menu @selecionar="selecionarCidade"/>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <div class="d-flex align-center">
                  <v-text-field
                      label="Bairro *"
                      v-model="bairro"
                      variant="outlined"
                      hide-details="auto"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      class="flex-grow-1"
                  >
                    <template #append-inner>
                      <bairro-menu @selecionar="selecionarBairro"/>
                    </template>
                  </v-text-field>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                    label="Complemento"
                    v-model="data.complemento"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    label="Perfil"
                    v-model="data.perfil"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                    label="CRT"
                    v-model="data.crt"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                    label="CNAE"
                    v-model="data.cnae"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                    label="Ident. Interna"
                    v-model="data.ident_interna"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="var(--text-color-laranja)" variant="text" @click="limparForm" size="small">
                  Limpar
                </v-btn>

                <v-btn color="var(--text-color-laranja)" variant="tonal" @click="tab = 'usuario'" size="small">
                  Avançar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-tabs-window-item>

      <v-tabs-window-item value="usuario">
        <v-form class="forms">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                    label="Senha *"
                    v-model="data.senha"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    :rules="[rules.required]"
                    :append-inner-icon="!verSenha ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="verSenha ? 'text' : 'password'"
                    @click:appendInner="verSenha = !verSenha"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                    label="Confirmar Senha *"
                    v-model="confirmarSenha"
                    variant="outlined"
                    hide-details="auto"
                    :theme="themeStore.darkMode ? 'dark' : 'light'"
                    :rules="[rules.required]"
                    :append-inner-icon="!verSenha ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    :type="verSenha ? 'text' : 'password'"
                    @click:appendInner="verSenha = !verSenha"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn color="var(--text-color-laranja)" variant="text" @click="tab = 'empresa'" size="small">
                  Voltar
                </v-btn>

                <v-btn color="var(--text-color-laranja)" variant="tonal" @click="tab = 'cadastrar'" size="small">
                  Avançar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-tabs-window-item>

      <v-tabs-window-item value="cadastrar">
        <div class="forms w-100 flex items-center justify-center py-5 flex-col">
          <v-icon icon="mdi-check-circle-outline" size="50px" class="opacity-40 mb-2" />
          <h2 class="text-xl mb-2 opacity-70 texto-color-primary">Finalizar Cadastro</h2>
          <p class="text-sm opacity-50">Após concluir o seu cadastro, levará cerca de 20 segundos para validar os seus dados.</p>
          <p class="text-sm opacity-50">Ao final da validação, você será redirecionado para a tela de login!</p>

          <div class="flex items-center gap-2 mt-5">
            <v-btn color="var(--text-color-laranja)" variant="tonal" @click="tab = 'usuario'" size="small">
              Voltar
            </v-btn>

            <v-btn
                color="var(--text-color-laranja)"
                variant="flat" class="text-white"
                @click="submitForm" size="small"
                :class="data.senha === '' ? 'cursor-not-allowed' : ''"
            >
              Cadastrar
            </v-btn>
          </div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </main>
</template>

<script setup>
import CidadeMenu from "@/components/base/menu/CidadeMenu.vue";
import BairroMenu from "@/components/base/menu/BairroMenu.vue";
import {computed, ref, watch, onMounted} from "vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {useLocalizacaoStore} from "@/stores/APIs/localizacao";
import {useEmpresaStore} from "@/stores/APIs/empresa";
import {useApiStore} from "@/stores/APIs/api";
import {toast} from "vue3-toastify";
import router from "@/router";

const themeStore = useThemeStore();
const localizacaoStore = useLocalizacaoStore();
const empresaStore = useEmpresaStore();
const apiStore = useApiStore();

const dataEmpresa = computed(() => apiStore.dataEmpresa);
const tokenEmpresa = computed(() => apiStore.tokenEmpresa);

onMounted(() => {
  dataEmpresa.value ? data.value.email = dataEmpresa.value.email : null;
  dataEmpresa.value ? data.value.id_saas = dataEmpresa.value.idsaas : null;
})

const formRef = ref(null)
const isValid = ref(false)
const verSenha = ref(false)
const tab = ref('empresa');

const data = ref({
  id_saas: dataEmpresa.value ? dataEmpresa.value.idsaas : null,
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
  matriz: 'S',
  ativo: 'S',
  primeira_empresa: 'S',
  senha: '',
  email: dataEmpresa.value ? dataEmpresa.value.email : '',
});

const confirmarSenha = ref('');

const cidade = ref('');
const bairro = ref('');

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
  bairro.value = ''
  cidade.value = ''
}

function limparInput(input) {
  return input ? input.replace(/\D/g, '') : ''
}

/**
 * CADASTRANDO EMPRESA
 * @returns {Promise<void>}
 */
const submitForm = async () => {
  if (camposFaltandoUsuario.value.length && camposFaltando.value.length) {
    toast.error("Por favor, preencha os campos obrigatórios.");
    return;
  }

  if (data.value.senha === '') {
    toast.error("Por favor, cadastre o usuário na aba ao lado.");
    return;
  }

  if (data.value.senha !== confirmarSenha.value) {
    toast.error("As senhas não coincidem.");
    return;
  }

  // limpando os inputs antes de enviar
  data.value.cnpj = limparInput(data.value.cnpj)
  data.value.cep = limparInput(data.value.cep)
  data.value.telefone = limparInput(data.value.telefone)
  data.value.celular = limparInput(data.value.celular)
  data.value.whatsapp = limparInput(data.value.whatsapp)

  if (!localizacaoStore.errorMessage) {
    await empresaStore.cadastrarEmpresa({
      data: [data.value]
    }, tokenEmpresa.value);

    limparForm();

    toast.info('Você será redirecionado para a tela de login.', {
      autoClose: 3500,
    });
    setTimeout(() => {
      router.push('/login');
    }, 3500);
  }
}

/**
 * BUSCANDO O CEP
 */

watch(
    () => data.value.cep,
    async (novoCep) => {
      if (novoCep && !data.value.cnpj) {
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
 * BUSCANDO O CNPJ
 */

watch(
    () => data.value.cnpj,
    async (novocnpj) => {
      if (novocnpj) {
        const cnpjLimpo = limparInput(data.value.cnpj)
        if (cnpjLimpo.length === 14) {
          await localizacaoStore.buscarCnpj(cnpjLimpo);
          if (localizacaoStore.cnpj) {
            data.value.razao_social = localizacaoStore.cnpj?.nome || '';
            data.value.fantasia = localizacaoStore.cnpj?.fantasia || '';
            data.value.cep = localizacaoStore.cnpj?.cep || '';
            data.value.endereco = localizacaoStore.cnpj?.logradouro || '';
            data.value.numero = localizacaoStore.cnpj?.numero || '';
            data.value.id_cidade = localizacaoStore.cnpj?.id_cidade || '';
            cidade.value = localizacaoStore.cnpj?.municipio || '';
            data.value.id_bairro = localizacaoStore.cnpj?.id_bairro || '';
            bairro.value = localizacaoStore.cnpj?.bairro || '';
            data.value.complemento = localizacaoStore.cnpj?.complemento || '';
          }
        }
      }
    }
)

/**
 * TRABALHANDO COM A CIDADE
 */

const selecionarCidade = (c) => {
  data.value.id_cidade = c.id;
  cidade.value = c.desccidade;
};

/**
 * TRABALHANDO COM O BAIRRO
 * @param b
 */

const selecionarBairro = (b) => {
  data.value.id_bairro = b.id;
  bairro.value = b.descbairro;
};


// Campos obrigatórios que você quer monitorar
const camposObrigatorios = [
  'razao_social',
  'fantasia',
  'cnpj',
  'cep',
  'cidade',
  'bairro',
];

const camposObrigatoriosUsuario = [
  'senha',
   'confirmarSenha',
];

// computed que verifica quais campos ainda estão vazios
const camposFaltando = computed(() => {
  return camposObrigatorios.filter((campo) => {
    if (campo === 'cidade') return !cidade.value
    if (campo === 'bairro') return !bairro.value
    return !data.value[campo]
  })
});

const camposFaltandoUsuario = computed(() => {
  return camposObrigatoriosUsuario.filter((campo) => {
    if (campo === 'confirmarSenha') return !confirmarSenha.value
    return !data.value[campo]
  })
});
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