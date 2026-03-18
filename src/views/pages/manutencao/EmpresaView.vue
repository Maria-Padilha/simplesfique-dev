<template>
  <top-all-pages icon="mdi-domain">
    <template #titulo>
      Empresas
    </template>

    <template #section>
      <v-card elevation="0" class="background-secondary">
        <v-card-text class="pa-4">
          <botao-expand-transition :formulario-aberto="formularioAberto" @toggle="toggleFormulario">
            <template #default>{{ formularioAberto ? 'Cancelar' : 'Nova Empresa' }}</template>
          </botao-expand-transition>

          <!-- Formulário expansível -->
          <v-expand-transition>
            <div v-if="formularioAberto">
              <v-card class="background-card mb-7" elevation="0">
                <v-card-title class="text-h6 pa-4">
                  <v-icon :icon="editando ? 'mdi-pencil' : 'mdi-plus'" class="mr-2" size="23px" />
                  {{ editando ? 'Editar Empresa' : 'Nova Empresa' }}
                </v-card-title>

                <v-card-text class="pa-4">
                    <v-form ref="formRef" v-model="formValido">
                        
                        <!-- ===== DADOS GERAIS ===== -->
                        <div class="text-subtitle-2 font-weight-bold mb-3 mt-1 d-flex align-center gap-2">
                            <v-icon size="16" icon="mdi-card-account-details-outline" />
                            Dados Gerais
                        </div>
                        
                        <v-row dense>
                        <!-- Razão Social -->
                        <v-col cols="12" md="3">
                            <v-text-field
                            v-model="form.razao_social"
                            label="Razão Social *"
                            :rules="[rules.required]"
                            maxlength="100"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-domain"
                            />
                        </v-col>
                        
                        <!-- Fantasia -->
                        <v-col cols="12" md="3">
                            <v-text-field
                            v-model="form.fantasia"
                            label="Fantasia *"
                            :rules="[rules.required]"
                            maxlength="100"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field required-left-border"
                            prepend-inner-icon="mdi-rename-box"
                            />
                        </v-col>
                        
                        
                        <!-- Nome interno -->
                        <v-col cols="6" md="3">
                            <v-text-field
                            v-model="form.nome_interno"
                            label="Nome de identificação interna"
                            maxlength="100"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-tag-text-outline"
                            />
                        </v-col>
                        
                        <!-- Status -->
                        
                        <!-- Fone Comercial -->
                        <v-col cols="12" md="2">
                            <v-text-field
                            v-model="form.fone_comercial"
                            label="Fone Comercial"
                            maxlength="15"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-phone"
                            />
                        </v-col>
                        
                        <!-- CPF/CNPJ -->
                        <v-col cols="12" md="3">
                            <v-text-field
                            v-model="form.cpf_cnpj"
                            label="CPF/CNPJ"
                            maxlength="18"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-card-account-details"
                            />
                        </v-col>
                        
                        <!-- Insc. Estadual -->
                        <v-col cols="12" md="2">
                            <v-text-field
                            v-model="form.rg_ie"
                            label="Insc. Estadual"
                            maxlength="20"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-identifier"
                            />
                        </v-col>
                        
                        <!-- E-mail -->
                        <v-col cols="12" md="3">
                            <v-text-field
                            v-model="form.email"
                            label="E-mail"
                            maxlength="100"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-email-outline"
                            />
                        </v-col>
                        
                        <!-- Website -->
                        <v-col cols="12" md="3">
                            <v-text-field
                            v-model="form.website"
                            label="Website / Homepage"
                            maxlength="100"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-web"
                            />
                        </v-col>
                            <!-- Loja Matriz? -->
                            <v-col cols="12" md="2">
                                <div class="text-caption mb-1">Loja Matriz?</div>
                                <v-radio-group v-model="form.matriz" inline hide-details density="compact">
                                    <v-radio label="Sim" value="S" />
                                    <v-radio class="ml-1" label="Não" value="N" />
                                </v-radio-group>
                            </v-col>
                            
                            <v-col cols="12" md="2">
                              <div class="text-caption mb-1">Status</div>
                              <v-radio-group v-model="form.ativo" inline hide-details density="compact">
                                <v-radio label="Ativo" value="S" />
                                <v-radio class="ml-1" label="Inativo" value="N" />
                              </v-radio-group>
                            </v-col>
                    </v-row>
                    
                    <v-divider class="my-4" />

                    <!-- ===== ENDEREÇO ===== -->
                    <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                      <v-icon size="16" icon="mdi-map-marker-outline" />
                      Endereço
                    </div>
                    <v-row dense>
                      <!-- CEP -->
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="form.cep"
                          label="CEP"
                          maxlength="9"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-map-search-outline"
                          :loading="buscandoCep"
                          @blur="buscarCep"
                        />
                      </v-col>

                      <!-- Endereço -->
                      <v-col cols="12" md="3">
                          <v-text-field
                          v-model="form.endereco"
                          label="Endereço"
                          maxlength="100"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-road-variant"
                          />
                        </v-col>

                        <!-- Bairro -->
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="form.bairro"
                            label="Bairro"
                            maxlength="60"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-home-city-outline"
                          />
                        </v-col>
                        
                        <!-- Número -->
                        <v-col cols="12" md="2">
                        <v-text-field
                          v-model="form.numero"
                          label="Número"
                          maxlength="10"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-numeric"
                        />
                      </v-col>

                      <!-- Complemento -->
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="form.complemento"
                          label="Complemento"
                          maxlength="50"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-text-short"
                        />
                      </v-col>


                      <!-- Cidade -->
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="form.cidade"
                          label="Cidade *"
                          :rules="[rules.required]"
                          maxlength="60"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-city-variant-outline"
                        />
                      </v-col>

                      <!-- UF -->
                      <v-col cols="12" md="2">
                        <v-select
                          v-model="form.uf"
                          :items="ufs"
                          label="UF"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-map-outline"
                        />
                      </v-col>
                    </v-row>

                    <v-divider class="my-4" />

                    <!-- ===== INFORMAÇÕES FISCAIS ===== -->
                    <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                      <v-icon size="16" icon="mdi-file-document-outline" />
                      Informações Fiscais
                    </div>
                    <v-row dense>
                      <!-- Insc. Municipal -->
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="form.insc_municipal"
                          label="Insc. Municipal"
                          maxlength="20"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-city"
                        />
                      </v-col>

                      <!-- Insc. Suframa -->
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="form.insc_suframa"
                          label="Insc. da Entidade na Suframa"
                          maxlength="20"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-office-building-outline"
                        />
                      </v-col>

                      <!-- Perfil -->
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="form.perfil"
                          :items="perfis"
                          item-title="label"
                          item-value="value"
                          label="Perfil *"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-badge-account-outline"
                        />
                      </v-col>

                      <!-- Indicador de Tipo de Atividade -->
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="form.ind_tipo_atividade"
                          :items="tiposAtividade"
                          item-title="label"
                          item-value="value"
                          label="Indicador de Tipo de Atividade *"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-domain"
                        />
                      </v-col>

                      <!-- CRT -->
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="form.crt"
                          :items="crts"
                          item-title="label"
                          item-value="value"
                          label="C.R.T *"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-text-box-check-outline"
                        />
                      </v-col>

                      <!-- Segmento -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.segmento"
                          label="Segmento *"
                          :rules="[rules.required]"
                          maxlength="50"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-shape-outline"
                        />
                      </v-col>

                      <!-- RET -->
                      <v-col cols="12" md="4">
                        <v-select
                          v-model="form.ret"
                          :items="rets"
                          item-title="label"
                          item-value="value"
                          label="R.E.T *"
                          :rules="[rules.required]"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field required-left-border"
                          prepend-inner-icon="mdi-receipt-text-outline"
                        />
                      </v-col>

                      <!-- Atividade Município -->
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="form.atividade_municipio"
                          label="Atividade Município"
                          maxlength="60"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-briefcase-outline"
                          />
                        </v-col>
                        <!-- CNAE -->
                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model="form.cnae"
                            label="C.N.A.E"
                            maxlength="10"
                            variant="outlined"
                            density="compact"
                            hide-details="auto"
                            :theme="themeStore.darkMode ? 'dark' : 'light'"
                            class="custom-text-field"
                            prepend-inner-icon="mdi-barcode"
                          />
                        </v-col>

                      <!-- Alíquota ISS -->
                      <v-col cols="12" md="2">
                        <v-text-field
                          v-model="form.aliquota_iss"
                          label="Alíquota ISS"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details="auto"
                          :theme="themeStore.darkMode ? 'dark' : 'light'"
                          class="custom-text-field"
                          prepend-inner-icon="mdi-percent"
                          suffix="%"
                        />
                      </v-col>

                    </v-row>

                    <v-divider class="my-4" />

                    <!-- ===== CONFIGURAÇÕES ===== -->
                    <div class="text-subtitle-2 font-weight-bold mb-3 d-flex align-center gap-2">
                      <v-icon size="16" icon="mdi-cog-outline" />
                      Configurações
                    </div>
                    <v-row dense>
                      <!-- Participa da consolidação? -->
                      <v-col cols="6" md="3">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Participa da consolidação?</div>
                          <v-radio-group v-model="form.participa_consolidacao" inline hide-details density="compact">
                            <v-radio label="Sim" value="S" />
                            <v-radio label="Não" value="N" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Substituto Tributário? -->
                      <v-col cols="6" md="3">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Substituto Tributário?</div>
                          <v-radio-group v-model="form.substituto_tributario" inline hide-details density="compact">
                            <v-radio label="Sim" value="S" />
                            <v-radio label="Não" value="N" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Emite NFe? -->
                      <v-col cols="6" md="3">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Emite NFe?</div>
                          <v-radio-group v-model="form.emite_nfe" inline hide-details density="compact">
                            <v-radio label="Sim" value="S" />
                            <v-radio label="Não" value="N" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Utiliza RENAVE? -->
                      <v-col cols="6" md="3">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Utiliza RENAVE?</div>
                          <v-radio-group v-model="form.utiliza_renave" inline hide-details density="compact">
                            <v-radio label="Sim" value="S" />
                            <v-radio label="Não" value="N" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Tabela para Cálculo do ST -->
                      <v-col cols="12" md="5">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Tabela para Cálculo do ST</div>
                          <v-radio-group v-model="form.tabela_calculo_st" inline hide-details density="compact">
                            <v-radio label="Tabela 1" value="1" />
                            <v-radio label="Tabela 2" value="2" />
                            <v-radio label="Tabela 3" value="3" />
                            <v-radio label="Tabela 4" value="4" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Tipo recolhimento DIFAL -->
                      <v-col cols="12" md="4">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Tipo de recolhimento do DIFAL?</div>
                          <v-radio-group v-model="form.tipo_recolhimento_difal" inline hide-details density="compact">
                            <v-radio label="Por Apuração" value="A" />
                            <v-radio label="Por Operação" value="O" />
                          </v-radio-group>
                        </v-card>
                      </v-col>

                      <!-- Adiantamento ao Cliente -->
                      <v-col cols="12" md="3">
                        <v-card variant="outlined" class="pa-3 h-100">
                          <div class="text-caption text-medium-emphasis mb-2">Adiantamento ao Cliente</div>
                          <v-checkbox
                            v-model="form.adiantamento_vista"
                            label="À vista"
                            hide-details
                            density="compact"
                            true-value="S"
                            false-value="N"
                            color="var(--text-color-laranja)"
                          />
                          <v-checkbox
                            v-model="form.adiantamento_prazo"
                            label="À prazo"
                            hide-details
                            density="compact"
                            true-value="S"
                            false-value="N"
                            color="var(--text-color-laranja)"
                          />
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-spacer />
                  <v-btn color="grey" variant="text" @click="cancelarFormulario">Cancelar</v-btn>
                  <v-btn
                    color="var(--text-color-laranja)"
                    :loading="loading"
                    :disabled="!formValido"
                    variant="flat"
                    class="text-white"
                    @click="salvarEmpresa"
                  >
                    {{ editando ? 'Atualizar' : 'Salvar' }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-expand-transition>

          <!-- Tabela -->
          <TabelaPadrao
            :formulario-aberto="formularioAberto"
            :headers="headers"
            :items="empresasFiltradas"
            :loading="loading"
            :search="search"
            @update:search="(value) => search = value"
            search-label="Pesquisar empresa"
            item-key="id"
            no-data-icon="mdi-domain-off"
            no-data-text="Nenhuma empresa cadastrada"
            delete-item-display-field="razao_social"
            @edit-item="editarEmpresa"
            @confirm-delete="excluirEmpresa"
          >
            <!-- Status -->
            <template v-slot:[`item.ativo`]="{ item }">
              <v-chip
                :color="item.ativo === 'S' ? 'success' : 'error'"
                size="small"
                variant="tonal"
              >
                {{ item.ativo === 'S' ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </template>

            <!-- Loja Matriz -->
            <template v-slot:[`item.matriz`]="{ item }">
              <v-icon
                :icon="item.matriz === 'S' ? 'mdi-check-circle' : 'mdi-minus-circle-outline'"
                :color="item.matriz === 'S' ? 'success' : 'grey'"
                size="20"
              />
            </template>
          </TabelaPadrao>
        </v-card-text>
      </v-card>
    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useEmpresaStore } from '@/stores/APIs/empresa'
import { useLocalizacaoStore } from '@/stores/APIs/localizacao'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'
import BotaoExpandTransition from '@/components/base/padrao-paginas/BotaoExpandTransition.vue'
import TabelaPadrao from '@/components/base/padrao-paginas/TabelaPadrao.vue'

const themeStore = useThemeStore()
const empresaStore = useEmpresaStore()
const localizacaoStore = useLocalizacaoStore()

const formularioAberto = ref(false)
const editando = ref(false)
const formValido = ref(false)
const formRef = ref(null)
const search = ref('')
const buscandoCep = ref(false)
const loading = computed(() => empresaStore.loading)

const form = reactive({
  id: null,
  razao_social: '',
  primeira_empresa: 'N',
  fantasia: '',
  nome_interno: '',
  matriz: 'N',
  ativo: 'S',
  fone_comercial: '',
  cpf_cnpj: '',
  email: '',
  website: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  id_cidade: null,
  id_bairro: null,
  uf: '',
  rg_ie: '',
  insc_suframa: '',
  perfil: null,
  ind_tipo_atividade: null,
  crt: null,
  segmento: '',
  ret: null,
  atividade_municipio: '',
  aliquota_iss: null,
  cnae: '',
  participa_consolidacao: 'S',
  substituto_tributario: 'N',
  tabela_calculo_st: '1',
  tipo_recolhimento_difal: 'A',
  emite_nfe: 'S',
  utiliza_renave: 'N',
  adiantamento_vista: 'N',
  adiantamento_prazo: 'N',
})

const rules = {
  required: (v) => !!v || 'Campo obrigatório'
}

const headers = [
  { title: 'Razão Social', key: 'razao_social', sortable: true },
  { title: 'Fantasia', key: 'fantasia', sortable: true },
  { title: 'CPF/CNPJ', key: 'cpf_cnpj', sortable: true },
  { title: 'Cidade', key: 'cidade', sortable: true },
  { title: 'Matriz', key: 'matriz', sortable: false },
  { title: 'Status', key: 'ativo', sortable: false },
  { title: 'Ações', key: 'actions', sortable: false }
]

const ufs = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA',
  'MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN',
  'RO','RR','RS','SC','SE','SP','TO'
]

const perfis = [
  { value: 'A', label: 'A - Perfil A' },
  { value: 'B', label: 'B - Perfil B' },
]

const tiposAtividade = [
  { value: '0', label: '0 - Industrial ou equiparado a industrial' },
  { value: '1', label: '1 - Outros' },
  { value: '2', label: '2 - Atividade com preponderância de Serviços' },
  { value: '3', label: '3 - Atividade de Comércio' },
]

const crts = [
  { value: '1', label: '1 - Simples Nacional' },
  { value: '2', label: '2 - Simples Nacional - excesso de sublimite' },
  { value: '3', label: '3 - Regime Normal - Lucro Presumido' },
]

const rets = [
  { value: '01', label: '01 - Microempresa Municipal' },
  { value: '02', label: '02 - Estimativa' },
  { value: '03', label: '03 - Sociedade de Profissionais' },
  { value: '04', label: '04 - Cooperativa' },
  { value: '05', label: '05 - MEI - Simples Nacional' },
  { value: '06', label: '06 - ME EPP - Simples Nacional' },
  { value: '07', label: '07 - Lucro Real' },
  { value: '08', label: '08 - Lucro Presumido' },
]

const empresasFiltradas = computed(() => {
  const dados = empresaStore.empresas || []
  return Array.isArray(dados) ? dados : []
})

function toggleFormulario() {
  if (formularioAberto.value) {
    cancelarFormulario()
  } else {
    editando.value = false
    resetarForm()
    formularioAberto.value = true
  }
}

function cancelarFormulario() {
  formularioAberto.value = false
  resetarForm()
}

function resetarForm() {
  Object.assign(form, {
    id: null,
    razao_social: '',
    primeira_empresa: 'N',
    fantasia: '',
    nome_interno: '',
    matriz: 'N',
    ativo: 'S',
    fone_comercial: '',
    cpf_cnpj: '',
    rg_ie: '',
    email: '',
    website: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    id_cidade: null,
    id_bairro: null,
    uf: '',
    insc_municipal: '',
    insc_suframa: '',
    perfil: null,
    ind_tipo_atividade: null,
    crt: null,
    segmento: '',
    ret: null,
    atividade_municipio: '',
    aliquota_iss: null,
    cnae: '',
    participa_consolidacao: 'S',
    substituto_tributario: 'N',
    tabela_calculo_st: '1',
    tipo_recolhimento_difal: 'A',
    emite_nfe: 'S',
    utiliza_renave: 'N',
    adiantamento_vista: 'N',
    adiantamento_prazo: 'N',
  })
  formRef.value?.resetValidation()
}

function editarEmpresa(item) {
  Object.assign(form, item)
  editando.value = true
  formularioAberto.value = true
}

async function buscarCep() {
  const cep = form.cep?.replace(/\D/g, '')
  if (!cep || cep.length !== 8) return

  buscandoCep.value = true
  try {
    await localizacaoStore.buscarCep(cep)
    const dados = localizacaoStore.cep
    if (dados) {
      form.endereco = dados.logradouro || form.endereco
      form.bairro = dados.bairro || form.bairro
      form.cidade = dados.localidade || form.cidade
      form.uf = dados.uf || form.uf
      form.id_cidade = dados.id_cidade || form.id_cidade
      form.id_bairro = dados.id_bairro || form.id_bairro
    }
  } finally {
    buscandoCep.value = false
  }
}

async function salvarEmpresa() {
  const { id, ...payload } = form

  if (editando.value) {
    await empresaStore.alterarEmpresa(id, payload)
  } else {
    await empresaStore.cadastrarEmpresa(payload)
  }

  if (!empresaStore.errorMessage) {
    cancelarFormulario()
    await empresaStore.buscarTodasEmpresas()
  }
}

async function excluirEmpresa(item) {
  await empresaStore.deletarEmpresa(item.id)
  await empresaStore.buscarTodasEmpresas()
}

onMounted(async () => {
  await empresaStore.buscarTodasEmpresas()
})
</script>
