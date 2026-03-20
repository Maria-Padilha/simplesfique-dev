<template>
  <v-dialog
    v-model="dialog"
    max-width="700"
    persistent
    scrollable
    :theme="themeStore.darkMode ? 'dark' : 'light'"
  >
    <v-card class="background-secondary agenda-modal" rounded="xl" elevation="8">

      <!-- ===== HEADER ===== -->
      <v-card-title class="d-flex align-center justify-space-between pa-5 pb-2">
        <div class="d-flex align-center gap-3">
          <v-avatar color="var(--text-color-laranja)" size="38">
            <v-icon icon="mdi-calendar-clock" color="white" size="20"></v-icon>
          </v-avatar>
          <div>
            <p class="text-h6 font-weight-bold" style="line-height:1.2">Agenda</p>
            <p class="text-caption opacity-60">Gerencie seus compromissos</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="fechar" />
      </v-card-title>

      <!-- ===== TABS ===== -->
      <v-tabs
        v-model="abaAtiva"
        color="var(--text-color-laranja)"
        class="px-4"
        density="compact"
      >
        <v-tab value="novo">
          <v-icon icon="mdi-plus-circle-outline" size="18" class="mr-1"></v-icon>
          {{ editandoId ? 'Editar Compromisso' : 'Novo Compromisso' }}
        </v-tab>
        <v-tab value="lista">
          <v-icon icon="mdi-calendar-check-outline" size="18" class="mr-1"></v-icon>
          Próximos
          <v-chip
            v-if="agendaStore.quantidadeProximos > 0"
            size="x-small"
            color="var(--text-color-laranja)"
            class="ml-2 text-white"
          >{{ agendaStore.quantidadeProximos }}</v-chip>
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <!-- ===== CONTEÚDO ===== -->
      <v-card-text class="pa-0" style="max-height: 560px; overflow-y: auto;">
        <v-tabs-window v-model="abaAtiva">

          <!-- ======================= ABA: FORMULÁRIO ======================= -->
          <v-tabs-window-item value="novo">
            <div class="pa-5">
              <v-form ref="formRef" v-model="formValido" @submit.prevent="salvarCompromisso">
                <v-row dense>

                  <!-- Assunto (vstb_agenda.assunto) -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="form.assunto"
                      label="Assunto *"
                      placeholder="Título do compromisso"
                      prepend-inner-icon="mdi-text-short"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter="100"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                    ></v-text-field>
                  </v-col>

                  <!-- Corpo (vstb_agenda.corpo) -->
                  <v-col cols="12">
                    <v-textarea
                      v-model="form.corpo"
                      label="Corpo"
                      placeholder="Detalhes do compromisso"
                      prepend-inner-icon="mdi-text"
                      variant="outlined"
                      density="compact"
                      rows="2"
                      auto-grow
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                    ></v-textarea>
                  </v-col>

                  <!-- Contato: Nome (vstb_contato.nome) -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.contato_nome"
                      label="Remetente *"
                      placeholder="Nome do responsável"
                      prepend-inner-icon="mdi-account-outline"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                    ></v-text-field>
                  </v-col>

                  <!-- Contato: Telefone (vstb_contato.telefone) -->
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="form.contato_telefone"
                      label="Telefone"
                      placeholder="(00) 00000-0000"
                      prepend-inner-icon="mdi-phone-outline"
                      variant="outlined"
                      density="compact"
                      maxlength="15"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                      @input="formatarTelefone"
                    ></v-text-field>
                  </v-col>

                  <!-- Notificação (vstb_agenda.notificar: 1=15min, 2=30min, 3=1h) -->
                  <v-col cols="12" sm="6">
                    <v-select
                      v-model="form.notificar"
                      :items="OPCOES_NOTIFICAR"
                      item-title="label"
                      item-value="value"
                      label="Notificação *"
                      prepend-inner-icon="mdi-bell-ring-outline"
                      variant="outlined"
                      density="compact"
                      :rules="[rules.required]"
                      :theme="themeStore.darkMode ? 'dark' : 'light'"
                      color="var(--text-color-laranja)"
                    ></v-select>
                  </v-col>

                  <!-- Tipo de Alarme (vstb_agenda.tipo_alarme: 1=Data, 2=Dia semana) -->
                  <v-col cols="12">
                    <p class="text-caption font-weight-bold opacity-70 mb-2">Tipo de Recorrência *</p>
                    <v-btn-toggle
                      v-model="form.tipo_alarme"
                      mandatory
                      variant="outlined"
                      density="compact"
                      color="var(--text-color-laranja)"
                      rounded="lg"
                      class="mb-3"
                    >
                      <v-btn :value="1" prepend-icon="mdi-calendar">Data específica</v-btn>
                      <v-btn :value="2" prepend-icon="mdi-calendar-week">Dia(s) da semana</v-btn>
                    </v-btn-toggle>
                  </v-col>

                  <!-- TIPO 1: Data + Horário -->
                  <template v-if="form.tipo_alarme === 1">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.data_notificacao"
                        label="Data *"
                        type="date"
                        prepend-inner-icon="mdi-calendar"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        color="var(--text-color-laranja)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.horario_notificacao"
                        label="Horário *"
                        type="time"
                        prepend-inner-icon="mdi-clock-outline"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        color="var(--text-color-laranja)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="form.data_notificacao">
                      <div class="d-flex align-center gap-2">
                        <v-icon icon="mdi-calendar-week" size="16" class="opacity-60"></v-icon>
                        <span class="text-caption opacity-70">Dia da semana:</span>
                        <v-chip size="small" :color="corDiaSemana" variant="flat" class="text-white font-weight-bold">
                          {{ diaSemanaAutoLabel }}
                        </v-chip>
                      </div>
                    </v-col>
                  </template>

                  <!-- TIPO 2: Dias da Semana + Horário -->
                  <template v-else>
                    <v-col cols="12">
                      <p class="text-caption opacity-70 mb-2">Selecione os dias *</p>
                      <div class="d-flex flex-wrap gap-2">
                        <v-btn
                          v-for="dia in DIAS_SEMANA_CAMPOS"
                          :key="dia.field"
                          size="small"
                          rounded="pill"
                          :variant="form[dia.field] === 'S' ? 'flat' : 'outlined'"
                          :color="form[dia.field] === 'S' ? 'var(--text-color-laranja)' : ''"
                          :class="form[dia.field] === 'S' ? 'text-white' : ''"
                          @click="toggleDia(dia.field)"
                        >{{ dia.label }}</v-btn>
                      </div>
                      <p v-if="semDiaSelecionado && tentouSalvar" class="text-caption text-red mt-1">
                        Selecione ao menos um dia da semana
                      </p>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="form.horario_notificacao"
                        label="Horário *"
                        type="time"
                        prepend-inner-icon="mdi-clock-outline"
                        variant="outlined"
                        density="compact"
                        :rules="[rules.required]"
                        :theme="themeStore.darkMode ? 'dark' : 'light'"
                        color="var(--text-color-laranja)"
                      ></v-text-field>
                    </v-col>
                  </template>

                  <!-- Ações -->
                  <v-col cols="12" class="d-flex justify-end gap-2 mt-2">
                    <v-btn variant="text" color="grey" @click="resetarFormulario">Limpar</v-btn>
                    <v-btn
                      type="submit"
                      :disabled="!formValido"
                      color="var(--text-color-laranja)"
                      variant="flat"
                      class="text-white px-6"
                      prepend-icon="mdi-check"
                    >{{ editandoId ? 'Atualizar' : 'Salvar' }}</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-tabs-window-item>

          <!-- ======================= ABA: LISTA ======================= -->
          <v-tabs-window-item value="lista">
            <div class="pa-4">

              <!-- Controles -->
              <div class="d-flex align-center justify-space-between mb-4 gap-3 flex-wrap">
                <v-text-field
                  v-model="pesquisa"
                  placeholder="Pesquisar..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  :theme="themeStore.darkMode ? 'dark' : 'light'"
                  color="var(--text-color-laranja)"
                  style="max-width: 280px;"
                ></v-text-field>

                <v-btn-group variant="outlined" density="compact" rounded="lg">
                  <v-btn
                    icon="mdi-format-list-bulleted"
                    :color="modoVisualizacao === 'lista' ? 'var(--text-color-laranja)' : ''"
                    :variant="modoVisualizacao === 'lista' ? 'flat' : 'outlined'"
                    :class="modoVisualizacao === 'lista' ? 'text-white' : ''"
                    @click="modoVisualizacao = 'lista'"
                  ></v-btn>
                  <v-btn
                    icon="mdi-calendar-month"
                    :color="modoVisualizacao === 'calendario' ? 'var(--text-color-laranja)' : ''"
                    :variant="modoVisualizacao === 'calendario' ? 'flat' : 'outlined'"
                    :class="modoVisualizacao === 'calendario' ? 'text-white' : ''"
                    @click="modoVisualizacao = 'calendario'"
                  ></v-btn>
                </v-btn-group>
              </div>

              <!-- MODO LISTA -->
              <div v-if="modoVisualizacao === 'lista'">
                <div v-if="compromissosFiltrados.length === 0" class="text-center py-10">
                  <v-icon icon="mdi-calendar-blank-outline" size="56" class="mb-3 opacity-40"></v-icon>
                  <p class="text-body-2 opacity-60">Nenhum compromisso encontrado</p>
                </div>

                <v-slide-y-transition group>
                  <v-card
                    v-for="comp in compromissosFiltrados"
                    :key="comp.id"
                    class="background-card mb-3"
                    rounded="lg"
                    elevation="0"
                  >
                    <v-card-text class="pa-3">
                      <div class="d-flex align-start gap-3">
                        <div
                          class="agenda-barra-lateral rounded-pill"
                          :style="{ background: corUrgencia(comp) }"
                        ></div>

                        <div class="flex-1">
                          <div class="d-flex align-start justify-space-between flex-wrap gap-1 mb-1">
                            <p class="text-subtitle-2 font-weight-bold">{{ comp.assunto }}</p>
                            <div class="d-flex align-center gap-1 flex-wrap">
                              <v-chip
                                v-if="comp.tipo_alarme === 1"
                                size="x-small"
                                :color="corUrgencia(comp)"
                                variant="flat"
                                class="text-white"
                              >
                                <v-icon icon="mdi-calendar" size="10" start></v-icon>
                                {{ formatarData(comp.data_notificacao) }} · {{ comp.horario_notificacao }}
                              </v-chip>
                              <v-chip
                                v-else
                                size="x-small"
                                color="purple"
                                variant="flat"
                                class="text-white"
                              >
                                <v-icon icon="mdi-calendar-week" size="10" start></v-icon>
                                {{ diasSemanaAtivos(comp) }} · {{ comp.horario_notificacao }}
                              </v-chip>

                            </div>
                          </div>

                          <p v-if="comp.corpo" class="text-body-2 opacity-80 mb-2">{{ comp.corpo }}</p>

                          <div class="d-flex align-center flex-wrap gap-3">
                            <span class="d-flex align-center text-caption opacity-60 gap-1">
                              <v-icon icon="mdi-account-outline" size="13"></v-icon>
                              {{ comp.contato_nome }}
                            </span>
                            <span v-if="comp.contato_telefone" class="d-flex align-center text-caption opacity-60 gap-1">
                              <v-icon icon="mdi-phone-outline" size="13"></v-icon>
                              {{ comp.contato_telefone }}
                            </span>
                            <span class="d-flex align-center text-caption opacity-60 gap-1">
                              <v-icon icon="mdi-bell-ring-outline" size="13"></v-icon>
                              {{ labelNotificar(comp.notificar) }}
                            </span>
                          </div>
                        </div>

                        <div class="d-flex flex-column gap-1">
                          <v-btn icon="mdi-pencil-outline" variant="text" size="x-small" color="var(--text-color-laranja)" @click="iniciarEdicao(comp)"></v-btn>
                          <v-btn icon="mdi-trash-can-outline" variant="text" size="x-small" color="red" @click="confirmarExclusao(comp)"></v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-slide-y-transition>
              </div>

              <!-- MODO CALENDÁRIO -->
              <div v-else>
                <div class="d-flex align-center justify-space-between mb-3">
                  <v-btn icon="mdi-chevron-left" variant="text" size="small" @click="mesAnterior"></v-btn>
                  <p class="text-subtitle-1 font-weight-bold text-capitalize">{{ mesAtualFormatado }}</p>
                  <v-btn icon="mdi-chevron-right" variant="text" size="small" @click="proximoMes"></v-btn>
                </div>

                <div class="calendario-grid mb-2">
                  <div
                    v-for="dia in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']"
                    :key="dia"
                    class="text-center text-caption font-weight-bold opacity-60 py-1"
                  >{{ dia }}</div>
                </div>

                <div class="calendario-grid">
                  <div v-for="n in primeiroDiaMes" :key="'v-' + n"></div>
                  <div
                    v-for="dia in diasDoMes"
                    :key="dia"
                    class="calendario-dia rounded-lg"
                    :class="{
                      'calendario-hoje': ehHoje(dia),
                      'calendario-com-evento': temEvento(dia),
                    }"
                    @click="selecionarDia(dia)"
                  >
                    <span class="text-caption">{{ dia }}</span>
                    <div v-if="temEvento(dia)" class="d-flex justify-center flex-wrap gap-1 mt-1">
                      <div
                        v-for="(_, idx) in eventosNoDia(dia).slice(0, 3)"
                        :key="idx"
                        class="evento-dot"
                        style="background: var(--text-color-laranja)"
                      ></div>
                    </div>
                  </div>
                </div>

                <div v-if="diaSelecioando && eventosDiaSelecionado.length > 0" class="mt-4">
                  <v-divider class="mb-3"></v-divider>
                  <p class="text-subtitle-2 font-weight-bold mb-2">
                    <v-icon icon="mdi-calendar-today" size="16" class="mr-1" color="var(--text-color-laranja)"></v-icon>
                    {{ formatarData(dataFormatadaCalendario(diaSelecioando)) }}
                  </p>
                  <v-card
                    v-for="ev in eventosDiaSelecionado"
                    :key="ev.id"
                    class="background-card mb-2"
                    rounded="lg"
                    elevation="0"
                  >
                    <v-card-text class="pa-2">
                      <div class="d-flex align-center justify-space-between">
                        <div>
                          <p class="text-body-2 font-weight-bold">{{ ev.assunto }}</p>
                          <p class="text-caption opacity-70">{{ ev.contato_nome }} · {{ ev.horario_notificacao }}</p>
                        </div>

                      </div>
                    </v-card-text>
                  </v-card>
                </div>
                <div v-else-if="diaSelecioando" class="mt-4 text-center">
                  <p class="text-caption opacity-50">Nenhum compromisso neste dia</p>
                </div>
              </div>

            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Dialog de exclusão -->
  <v-dialog v-model="dialogExclusao" max-width="380" :theme="themeStore.darkMode ? 'dark' : 'light'">
    <v-card class="background-secondary" rounded="xl">
      <v-card-title class="pa-5 d-flex align-center gap-2">
        <v-icon icon="mdi-alert-circle-outline" color="red" size="24"></v-icon>
        Excluir Compromisso
      </v-card-title>
      <v-card-text>
        Tem certeza que deseja excluir <strong>"{{ compromissoParaExcluir?.assunto }}"</strong>? Esta ação não pode ser desfeita.
      </v-card-text>
      <v-card-actions class="pa-4 d-flex justify-end gap-2">
        <v-btn variant="text" @click="dialogExclusao = false">Cancelar</v-btn>
        <v-btn color="red" variant="flat" class="text-white" @click="excluirConfirmado">Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import {
  useAgendaStore,
  OPCOES_NOTIFICAR,
  DIAS_SEMANA_CAMPOS,
} from '@/stores/agenda'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const fechar = () => { dialog.value = false }

const themeStore = useThemeStore()
const agendaStore = useAgendaStore()

const abaAtiva = ref('novo')
const modoVisualizacao = ref('lista')
const pesquisa = ref('')

const formRef = ref(null)
const formValido = ref(false)
const editandoId = ref(null)
const tentouSalvar = ref(false)

const formVazio = () => ({
  assunto: '',
  corpo: '',
  tipo_alarme: 1,
  notificar: 1,
  data_notificacao: '',
  horario_notificacao: '',
  segunda: 'N',
  terca: 'N',
  quarta: 'N',
  quinta: 'N',
  sexta: 'N',
  sabado: 'N',
  domingo: 'N',
  contato_nome: '',
  contato_telefone: '',
})

const form = ref(formVazio())

const rules = {
  required: (v) => !!v || 'Campo obrigatório',
}

const toggleDia = (field) => {
  form.value[field] = form.value[field] === 'S' ? 'N' : 'S'
}

const semDiaSelecionado = computed(() =>
  DIAS_SEMANA_CAMPOS.every(d => form.value[d.field] !== 'S')
)

const NOMES_DIA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const CORES_DIA = ['red', '#F57C00', 'purple', 'blue', 'teal', 'green', 'indigo']

const diaSemanaAutoLabel = computed(() => {
  if (!form.value.data_notificacao) return ''
  const d = new Date(form.value.data_notificacao + 'T00:00:00')
  return NOMES_DIA[d.getDay()]
})

const corDiaSemana = computed(() => {
  if (!form.value.data_notificacao) return 'grey'
  const d = new Date(form.value.data_notificacao + 'T00:00:00')
  return CORES_DIA[d.getDay()]
})

const formatarTelefone = (e) => {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11)
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d+)$/, '($1) $2')
  } else if (v.length > 0) {
    v = '(' + v
  }
  form.value.contato_telefone = v
}

const salvarCompromisso = async () => {
  tentouSalvar.value = true
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (form.value.tipo_alarme === 2 && semDiaSelecionado.value) return

  if (editandoId.value) {
    agendaStore.editarCompromisso(editandoId.value, { ...form.value })
    editandoId.value = null
  } else {
    agendaStore.adicionarCompromisso({ ...form.value })
  }

  resetarFormulario()
  abaAtiva.value = 'lista'
}

const resetarFormulario = () => {
  form.value = formVazio()
  editandoId.value = null
  tentouSalvar.value = false
  formRef.value?.resetValidation()
}

const iniciarEdicao = (comp) => {
  form.value = { ...formVazio(), ...comp }
  editandoId.value = comp.id
  abaAtiva.value = 'novo'
}

const dialogExclusao = ref(false)
const compromissoParaExcluir = ref(null)

const confirmarExclusao = (comp) => {
  compromissoParaExcluir.value = comp
  dialogExclusao.value = true
}

const excluirConfirmado = () => {
  agendaStore.excluirCompromisso(compromissoParaExcluir.value.id)
  dialogExclusao.value = false
  compromissoParaExcluir.value = null
}

const compromissosFiltrados = computed(() => {
  const lista = agendaStore.proximosCompromissos
  const term = pesquisa.value.toLowerCase().trim()
  if (!term) return lista
  return lista.filter(c =>
    c.assunto?.toLowerCase().includes(term) ||
    c.corpo?.toLowerCase().includes(term) ||
    c.contato_nome?.toLowerCase().includes(term)
  )
})

const labelNotificar = (val) => {
  const opt = OPCOES_NOTIFICAR.find(o => o.value === val)
  return opt ? opt.label : '-'
}

const formatarData = (dataStr) => {
  if (!dataStr) return ''
  const [ano, mes, dia] = dataStr.split('-')
  return `${dia}/${mes}/${ano}`
}

const diasSemanaAtivos = (comp) =>
  DIAS_SEMANA_CAMPOS.filter(d => comp[d.field] === 'S').map(d => d.label).join(', ') || '-'

const corUrgencia = (comp) => {
  if (comp.tipo_alarme === 2) return 'purple'
  if (!comp.data_notificacao) return 'grey'
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const data = new Date(comp.data_notificacao + 'T00:00:00')
  const diff = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '#9e9e9e'
  if (diff === 0) return '#F57C00'
  if (diff <= 3) return '#e53935'
  if (diff <= 7) return '#fb8c00'
  return '#43a047'
}

const hoje = new Date()
const calMes = ref(hoje.getMonth())
const calAno = ref(hoje.getFullYear())
const diaSelecioando = ref(null)

const mesAtualFormatado = computed(() =>
  new Date(calAno.value, calMes.value, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
)
const diasDoMes = computed(() => new Date(calAno.value, calMes.value + 1, 0).getDate())
const primeiroDiaMes = computed(() => new Date(calAno.value, calMes.value, 1).getDay())

const mesAnterior = () => {
  if (calMes.value === 0) { calMes.value = 11; calAno.value-- } else calMes.value--
  diaSelecioando.value = null
}
const proximoMes = () => {
  if (calMes.value === 11) { calMes.value = 0; calAno.value++ } else calMes.value++
  diaSelecioando.value = null
}

const dataFormatadaCalendario = (dia) => {
  const m = String(calMes.value + 1).padStart(2, '0')
  const d = String(dia).padStart(2, '0')
  return `${calAno.value}-${m}-${d}`
}

const ehHoje = (dia) => {
  const h = new Date()
  return dia === h.getDate() && calMes.value === h.getMonth() && calAno.value === h.getFullYear()
}

const eventosNoDia = (dia) => agendaStore.compromissosPorData[dataFormatadaCalendario(dia)] || []
const temEvento = (dia) => eventosNoDia(dia).length > 0
const eventosDiaSelecionado = computed(() => diaSelecioando.value ? eventosNoDia(diaSelecioando.value) : [])
const selecionarDia = (dia) => { diaSelecioando.value = diaSelecioando.value === dia ? null : dia }

watch(dialog, (val) => {
  if (!val) {
    resetarFormulario()
    pesquisa.value = ''
    diaSelecioando.value = null
  }
})
</script>

<style scoped>
.agenda-modal {
  background-color: var(--bg-color-secondary);
}

.agenda-barra-lateral {
  width: 4px;
  min-height: 100%;
  flex-shrink: 0;
  align-self: stretch;
  border-radius: 4px;
}

.calendario-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendario-dia {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 44px;
  padding: 4px;
  cursor: pointer;
  transition: background 0.15s ease;
  border: 1px solid transparent;
}

.calendario-dia:hover {
  background-color: rgba(245, 124, 0, 0.08);
  border-color: rgba(245, 124, 0, 0.2);
}

.calendario-hoje {
  background-color: rgba(245, 124, 0, 0.15) !important;
  border-color: var(--text-color-laranja) !important;
}

.calendario-hoje .text-caption {
  color: var(--text-color-laranja);
  font-weight: 800;
}

.calendario-com-evento {
  background-color: rgba(245, 124, 0, 0.05);
}

.evento-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.flex-1 { flex: 1; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
