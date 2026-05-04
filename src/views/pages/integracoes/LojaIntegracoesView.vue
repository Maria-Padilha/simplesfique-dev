<template>
  <top-all-pages icon="mdi-store-outline">
    <template #titulo>Loja de Integrações</template>

    <template #section>

      <!-- Filtros por categoria -->
      <v-card class="background-secondary mb-4" elevation="0" :color="themeStore.darkMode ? 'transparent' : ''">
        <v-card-text class="pa-3 d-flex flex-wrap align-center gap-3">
          <v-chip-group v-model="categoriaAtiva" mandatory :color="'var(--text-color-laranja)'">
            <v-chip value="todas" variant="tonal">Todas ({{ plataformas.length }})</v-chip>
            <v-chip value="pagamentos" variant="tonal">
              <v-icon start icon="mdi-credit-card-outline"></v-icon>
              Pagamentos
            </v-chip>
            <v-chip value="comunicacao" variant="tonal">
              <v-icon start icon="mdi-message-outline"></v-icon>
              Comunicação
            </v-chip>
            <v-chip value="logistica" variant="tonal">
              <v-icon start icon="mdi-truck-outline"></v-icon>
              Logística
            </v-chip>
            <v-chip value="outros" variant="tonal">
              <v-icon start icon="mdi-dots-grid"></v-icon>
              Outros
            </v-chip>
          </v-chip-group>

          <v-spacer></v-spacer>

          <!-- Filtro status -->
          <v-chip-group v-model="filtroStatus" :color="'var(--text-color-laranja)'">
            <v-chip value="todas" size="small" variant="outlined">Todas</v-chip>
            <v-chip value="conectadas" size="small" variant="outlined">
              <v-icon start icon="mdi-check-circle" size="14" color="success"></v-icon>
              Conectadas
            </v-chip>
            <v-chip value="nao_conectadas" size="small" variant="outlined">
              <v-icon start icon="mdi-circle-outline" size="14"></v-icon>
              Não conectadas
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>

      <!-- Grid de cards -->
      <v-row v-if="!loading">
        <v-col
            v-for="plataforma in plataformasFiltradas"
            :key="plataforma.id"
            cols="12" sm="6" md="4" lg="3"
        >
          <v-card
              class="background-card d-flex flex-column"
              elevation="0"
              :color="themeStore.darkMode ? '' : ''"
              :style="{ borderTop: `3px solid ${plataforma.cor}`, height: '100%' }"
          >
            <!-- Header do card -->
            <v-card-title class="pa-4 pb-2 d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-2">
                <v-avatar :color="plataforma.cor + '22'" size="40" rounded="lg">
                  <v-icon :icon="plataforma.icone" :color="plataforma.cor" size="22"></v-icon>
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold" style="color: var(--text-color)">{{ plataforma.nome }}</div>
                  <v-chip
                      :color="corDificuldade(plataforma.dificuldade).cor"
                      size="x-small"
                      variant="tonal"
                      class="mt-1"
                  >
                    {{ corDificuldade(plataforma.dificuldade).label }}
                  </v-chip>
                </div>
              </div>

              <!-- Badge status conectado -->
              <v-tooltip :text="statusTexto(plataforma.id)" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon
                      v-bind="props"
                      :icon="isConectada(plataforma.id) ? 'mdi-check-circle' : 'mdi-circle-outline'"
                      :color="isConectada(plataforma.id) ? 'success' : 'grey'"
                      size="20"
                  ></v-icon>
                </template>
              </v-tooltip>
            </v-card-title>

            <!-- Categoria -->
            <v-card-subtitle class="px-4 pt-0">
              <v-chip :color="plataforma.cor" size="x-small" variant="tonal">
                {{ labelCategoria(plataforma.categoria) }}
              </v-chip>
            </v-card-subtitle>

            <!-- Descrição -->
            <v-card-text class="pa-4 pt-2 flex-grow-1">
              <p class="text-body-2" style="color: var(--text-color); opacity: 0.75">{{ plataforma.descricao }}</p>

              <!-- Campos necessários (preview) -->
              <div class="mt-3 d-flex flex-wrap gap-1">
                <v-chip
                    v-for="campo in plataforma.campos.filter(c => c.required)"
                    :key="campo.key"
                    size="x-small"
                    variant="outlined"
                    :color="themeStore.darkMode ? 'white' : 'grey'"
                >
                  {{ campo.label }}
                </v-chip>
              </div>
            </v-card-text>

            <!-- Ações -->
            <v-card-actions class="pa-4 pt-0 gap-2">
              <v-btn
                  v-if="isConectada(plataforma.id)"
                  variant="tonal"
                  color="error"
                  size="small"
                  prepend-icon="mdi-connection"
                  @click="desconectar(plataforma.id)"
                  :loading="loadingDesconectar === plataforma.id"
              >
                Desconectar
              </v-btn>

              <v-btn
                  :color="isConectada(plataforma.id) ? 'grey' : plataforma.cor"
                  :variant="isConectada(plataforma.id) ? 'tonal' : 'flat'"
                  size="small"
                  :prepend-icon="isConectada(plataforma.id) ? 'mdi-pencil-outline' : 'mdi-link-variant'"
                  class="text-white"
                  @click="abrirConfigurar(plataforma)"
              >
                {{ isConectada(plataforma.id) ? 'Editar' : 'Conectar' }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- Nenhum resultado -->
        <v-col v-if="plataformasFiltradas.length === 0" cols="12">
          <div class="d-flex flex-column align-center justify-center pa-12" style="color: var(--text-color); opacity: 0.6">
            <v-icon icon="mdi-store-search-outline" size="64" class="mb-4" style="color: var(--text-color)"></v-icon>
            <p class="text-h6">Nenhuma integração encontrada</p>
          </div>
        </v-col>
      </v-row>

      <!-- Skeleton loading -->
      <v-row v-else>
        <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader type="card" class="background-card" elevation="0"></v-skeleton-loader>
        </v-col>
      </v-row>

      <!-- ─── Modal de Configuração ─────────────────────────────────────────── -->
      <v-dialog v-model="dialogAberto" max-width="560" persistent>
        <v-card v-if="plataformaSelecionada" class="background-card" :color="themeStore.darkMode ? '' : ''">

          <!-- Header -->
          <v-card-title class="pa-5 pb-3 d-flex align-center gap-3">
            <v-avatar :color="plataformaSelecionada.cor + '22'" size="44" rounded="lg">
              <v-icon :icon="plataformaSelecionada.icone" :color="plataformaSelecionada.cor" size="24"></v-icon>
            </v-avatar>
            <div>
              <div class="text-h6" style="color: var(--text-color)">{{ plataformaSelecionada.nome }}</div>
              <div class="text-caption" style="color: var(--text-color); opacity: 0.65">{{ labelCategoria(plataformaSelecionada.categoria) }}</div>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" size="small" @click="fecharDialog"></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-5">

            <!-- Aviso de dificuldade -->
            <v-alert
                v-if="plataformaSelecionada.dificuldade === 'medio'"
                type="info"
                variant="tonal"
                density="compact"
                class="mb-4 text-caption"
                icon="mdi-information-outline"
            >
              Esta integração requer configuração OAuth. Você precisará criar um app na plataforma para obter as credenciais.
            </v-alert>

            <!-- Link de documentação -->
            <v-alert
                v-if="plataformaSelecionada.docUrl"
                type="success"
                variant="tonal"
                density="compact"
                class="mb-4 text-caption"
                icon="mdi-book-open-outline"
            >
              <a :href="plataformaSelecionada.docUrl" target="_blank" class="text-decoration-none font-weight-medium">
                Ver documentação da {{ plataformaSelecionada.nome }}
                <v-icon icon="mdi-open-in-new" size="12" class="ml-1"></v-icon>
              </a>
            </v-alert>

            <!-- Formulário dinâmico -->
            <v-form ref="formDialogRef" v-model="formDialogValido">
              <v-row>
                <v-col
                    v-for="campo in plataformaSelecionada.campos"
                    :key="campo.key"
                    :cols="campo.cols || 12"
                >
                  <!-- Toggle / Switch -->
                  <v-switch
                      v-if="campo.type === 'toggle'"
                      v-model="formCredenciais[campo.key]"
                      :label="campo.label"
                      color="var(--text-color-laranja)"
                      density="compact"
                      inset
                      hide-details
                      class="mb-2"
                  ></v-switch>

                  <!-- Campo de texto/senha/email/url -->
                  <v-text-field
                      v-else
                      v-model="formCredenciais[campo.key]"
                      :label="campo.label + (campo.required ? ' *' : '')"
                      :rules="campo.required ? [rules.required] : []"
                      :type="campo.type === 'password' ? (visibilidade[campo.key] ? 'text' : 'password') : campo.type"
                      :append-inner-icon="campo.type === 'password' ? (visibilidade[campo.key] ? 'mdi-eye-off' : 'mdi-eye') : undefined"
                      @click:append-inner="campo.type === 'password' ? toggleVisibilidade(campo.key) : null"
                      :hint="campo.hint"
                      :persistent-hint="!!campo.hint"
                      :placeholder="campo.placeholder"
                      variant="outlined"
                      density="compact"
                      :class="'custom-text-field' + (campo.required ? ' required-left-border' : '')"
                      :prepend-inner-icon="campo.icon || 'mdi-form-textbox'"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-5 pt-0">
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="text" @click="fecharDialog">Cancelar</v-btn>
            <v-btn
                :color="plataformaSelecionada.cor"
                variant="flat"
                class="text-white"
                :loading="loadingSalvar"
                :disabled="!formDialogValido"
                prepend-icon="mdi-content-save-outline"
                @click="salvarConfiguracao"
            >
              Salvar Configuração
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </template>
  </top-all-pages>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useThemeStore } from '@/stores/config-temas/theme'
import { useIntegracoesStore } from '@/stores/APIs/integracoes'
import TopAllPages from '@/components/base/padrao-paginas/TopAllPages.vue'

const themeStore = useThemeStore()
const integracoesStore = useIntegracoesStore()

// ─── State ───────────────────────────────────────────────────────────────────
const categoriaAtiva = ref('todas')
const filtroStatus = ref('todas')
const dialogAberto = ref(false)
const plataformaSelecionada = ref(null)
const formDialogValido = ref(false)
const formDialogRef = ref(null)
const formCredenciais = reactive({})
const visibilidade = reactive({})
const loadingSalvar = ref(false)
const loadingDesconectar = ref(null)

const loading = computed(() => integracoesStore.loading)

// ─── Definição das plataformas ────────────────────────────────────────────────
const plataformas = [
  // ── Pagamentos ──────────────────────────────────────────────────────────
  {
    id: 'asaas',
    nome: 'Asaas',
    categoria: 'pagamentos',
    descricao: 'Cobranças, boletos, Pix e cartão de crédito integrados ao seu ERP.',
    icone: 'mdi-bank-outline',
    cor: '#00ADB5',
    dificuldade: 'facil',
    docUrl: 'https://docs.asaas.com/',
    campos: [
      { key: 'api_key', label: 'Chave de API', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Disponível em Conta > Integrações no painel Asaas' },
      { key: 'sandbox', label: 'Ambiente de teste (Sandbox)', type: 'toggle', required: false },
    ],
  },
  {
    id: 'mercadopago',
    nome: 'Mercado Pago',
    categoria: 'pagamentos',
    descricao: 'Aceite pagamentos via Pix, boleto, cartão e link de pagamento.',
    icone: 'mdi-credit-card-outline',
    cor: '#009EE3',
    dificuldade: 'medio',
    docUrl: 'https://www.mercadopago.com.br/developers/pt/docs',
    campos: [
      { key: 'access_token', label: 'Access Token', type: 'password', required: true, icon: 'mdi-shield-key-outline', hint: 'Obtido via OAuth no painel de desenvolvedores do Mercado Pago' },
      { key: 'public_key', label: 'Public Key', type: 'text', required: false, icon: 'mdi-key-outline', hint: 'Usada para tokenizar cartões no frontend (opcional)' },
    ],
  },
  {
    id: 'pagseguro',
    nome: 'PagSeguro',
    categoria: 'pagamentos',
    descricao: 'Integração com boletos, cartão de crédito e Pix via PagSeguro.',
    icone: 'mdi-shield-check-outline',
    cor: '#00B140',
    dificuldade: 'facil',
    docUrl: 'https://dev.pagbank.uol.com.br/',
    campos: [
      { key: 'email', label: 'E-mail da conta', type: 'email', required: true, icon: 'mdi-email-outline' },
      { key: 'token', label: 'Token', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Gerado em Minha Conta > Preferências > Integrações' },
      { key: 'sandbox', label: 'Ambiente de teste (Sandbox)', type: 'toggle', required: false },
    ],
  },
  {
    id: 'stripe',
    nome: 'Stripe',
    categoria: 'pagamentos',
    descricao: 'Pagamentos internacionais com cartão, Link e muito mais.',
    icone: 'mdi-lightning-bolt',
    cor: '#635BFF',
    dificuldade: 'facil',
    docUrl: 'https://stripe.com/docs/api',
    campos: [
      { key: 'secret_key', label: 'Secret Key', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Começa com sk_live_ (ou sk_test_ em sandbox)' },
      { key: 'public_key', label: 'Publishable Key', type: 'text', required: true, icon: 'mdi-key-outline', hint: 'Começa com pk_live_ (ou pk_test_ em sandbox)', placeholder: 'pk_live_...' },
      { key: 'webhook_secret', label: 'Webhook Secret (opcional)', type: 'password', required: false, icon: 'mdi-webhook', hint: 'Necessário para validar eventos de webhook' },
      { key: 'sandbox', label: 'Modo de teste', type: 'toggle', required: false },
    ],
  },

  // ── Comunicação ─────────────────────────────────────────────────────────
  {
    id: 'whatsapp',
    nome: 'WhatsApp Business',
    categoria: 'comunicacao',
    descricao: 'Envie notificações, boletos e confirmações via WhatsApp para seus clientes.',
    icone: 'mdi-whatsapp',
    cor: '#25D366',
    dificuldade: 'medio',
    docUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    campos: [
      { key: 'token', label: 'Token de Acesso Permanente', type: 'password', required: true, icon: 'mdi-shield-key-outline', hint: 'Gerado no Meta for Developers > WhatsApp > Configuração da API' },
      { key: 'phone_number_id', label: 'Phone Number ID', type: 'text', required: true, icon: 'mdi-phone-outline', hint: 'Encontrado no painel do Meta for Developers' },
      { key: 'account_id', label: 'WhatsApp Business Account ID', type: 'text', required: false, icon: 'mdi-identifier', hint: 'Opcional — usado para gerenciar múltiplos números' },
    ],
  },
  {
    id: 'sendgrid',
    nome: 'SendGrid',
    categoria: 'comunicacao',
    descricao: 'Disparo de e-mails transacionais e marketing com alta entregabilidade.',
    icone: 'mdi-email-fast-outline',
    cor: '#1A82E2',
    dificuldade: 'facil',
    docUrl: 'https://docs.sendgrid.com/',
    campos: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Criada em Settings > API Keys no painel SendGrid' },
      { key: 'from_email', label: 'E-mail remetente', type: 'email', required: false, icon: 'mdi-email-outline', hint: 'E-mail verificado no SendGrid para envios' },
      { key: 'from_name', label: 'Nome remetente', type: 'text', required: false, icon: 'mdi-account-outline', hint: 'Ex: Suporte SimplesFique' },
    ],
  },
  {
    id: 'mailchimp',
    nome: 'Mailchimp',
    categoria: 'comunicacao',
    descricao: 'Automatize campanhas de e-mail marketing e gerencie contatos.',
    icone: 'mdi-email-newsletter',
    cor: '#FFE01B',
    dificuldade: 'facil',
    docUrl: 'https://mailchimp.com/developer/',
    campos: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Obtida em Account > Extras > API Keys' },
      { key: 'data_center', label: 'Data Center (Server Prefix)', type: 'text', required: true, icon: 'mdi-server-outline', hint: 'Últimos caracteres da sua API key após o "-". Ex: us21', placeholder: 'us21' },
      { key: 'list_id', label: 'Audience ID (opcional)', type: 'text', required: false, icon: 'mdi-account-group-outline', hint: 'ID da lista principal de contatos' },
    ],
  },
  {
    id: 'twilio',
    nome: 'Twilio (SMS)',
    categoria: 'comunicacao',
    descricao: 'Envio de SMS para clientes — confirmações, alertas e notificações.',
    icone: 'mdi-message-text-outline',
    cor: '#F22F46',
    dificuldade: 'facil',
    docUrl: 'https://www.twilio.com/docs',
    campos: [
      { key: 'account_sid', label: 'Account SID', type: 'text', required: true, icon: 'mdi-identifier', hint: 'Encontrado no Dashboard do Twilio', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      { key: 'auth_token', label: 'Auth Token', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Encontrado abaixo do Account SID no Dashboard' },
      { key: 'phone_number', label: 'Número Twilio', type: 'text', required: false, icon: 'mdi-phone-outline', hint: 'Número de origem dos SMS. Ex: +5511999999999' },
    ],
  },

  // ── Logística ───────────────────────────────────────────────────────────
  {
    id: 'correios',
    nome: 'Correios',
    categoria: 'logistica',
    descricao: 'Cálculo de frete, rastreamento e geração de etiquetas dos Correios.',
    icone: 'mdi-truck-delivery-outline',
    cor: '#FFCC00',
    dificuldade: 'medio',
    docUrl: 'https://www.correios.com.br/atendimento/developers',
    campos: [
      { key: 'usuario', label: 'Usuário / CNPJ contratante', type: 'text', required: true, icon: 'mdi-account-outline', hint: 'Usuário cadastrado no contrato com os Correios' },
      { key: 'senha', label: 'Senha', type: 'password', required: true, icon: 'mdi-lock-outline' },
      { key: 'cep_origem', label: 'CEP de Origem', type: 'text', required: false, icon: 'mdi-map-marker-outline', hint: 'CEP padrão para cálculo de frete', placeholder: '00000-000' },
      { key: 'contrato', label: 'Número do Contrato (opcional)', type: 'text', required: false, icon: 'mdi-file-sign' },
    ],
  },
  {
    id: 'jadlog',
    nome: 'Jadlog',
    categoria: 'logistica',
    descricao: 'Frete expresso nacional com rastreamento em tempo real.',
    icone: 'mdi-package-variant-closed',
    cor: '#E8000D',
    dificuldade: 'facil',
    docUrl: 'https://developer.jadlog.com.br/',
    campos: [
      { key: 'token', label: 'Token de Acesso', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Obtido ao cadastrar sua empresa na plataforma Jadlog' },
      { key: 'cnpj', label: 'CNPJ da empresa (opcional)', type: 'text', required: false, icon: 'mdi-domain', hint: 'CNPJ vinculado ao contrato Jadlog' },
    ],
  },
  {
    id: 'melhorenvio',
    nome: 'Melhor Envio',
    categoria: 'logistica',
    descricao: 'Compare fretes de múltiplas transportadoras e gere etiquetas em um só lugar.',
    icone: 'mdi-truck-fast-outline',
    cor: '#7ED321',
    dificuldade: 'medio',
    docUrl: 'https://docs.melhorenvio.com.br/',
    campos: [
      { key: 'token', label: 'Token de Acesso', type: 'password', required: true, icon: 'mdi-shield-key-outline', hint: 'Gerado em Minha Conta > Apps e Tokens no Melhor Envio' },
      { key: 'sandbox', label: 'Ambiente de teste (Sandbox)', type: 'toggle', required: false },
    ],
  },

  // ── Outros ──────────────────────────────────────────────────────────────
  {
    id: 'googlecalendar',
    nome: 'Google Calendar',
    categoria: 'outros',
    descricao: 'Sincronize compromissos, tarefas e eventos com o Google Calendar.',
    icone: 'mdi-calendar-month-outline',
    cor: '#4285F4',
    dificuldade: 'medio',
    docUrl: 'https://developers.google.com/calendar/api/guides/overview',
    campos: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true, icon: 'mdi-identifier', hint: 'Criado no Google Cloud Console > APIs & Services > Credenciais' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Gerado junto ao Client ID no Google Cloud Console' },
      { key: 'calendar_id', label: 'Calendar ID (opcional)', type: 'text', required: false, icon: 'mdi-calendar-outline', hint: 'Deixe em branco para usar o calendário principal. Ex: email@gmail.com' },
    ],
  },
  {
    id: 'slack',
    nome: 'Slack',
    categoria: 'outros',
    descricao: 'Receba notificações e alertas do sistema diretamente no seu Slack.',
    icone: 'mdi-slack',
    cor: '#4A154B',
    dificuldade: 'medio',
    docUrl: 'https://api.slack.com/',
    campos: [
      { key: 'bot_token', label: 'Bot Token', type: 'password', required: true, icon: 'mdi-robot-outline', hint: 'Começa com xoxb- — obtido em api.slack.com > Apps > OAuth & Permissions', placeholder: 'xoxb-...' },
      { key: 'channel_id', label: 'Canal padrão (opcional)', type: 'text', required: false, icon: 'mdi-pound', hint: 'ID do canal para envio de alertas. Ex: C012AB3CD' },
    ],
  },
  {
    id: 'rdstation',
    nome: 'RD Station CRM',
    categoria: 'outros',
    descricao: 'Sincronize leads e contatos do seu CRM com o sistema.',
    icone: 'mdi-chart-timeline-variant',
    cor: '#35A5DC',
    dificuldade: 'facil',
    docUrl: 'https://developers.rdstation.com/',
    campos: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true, icon: 'mdi-key-variant', hint: 'Obtida em Configurações > Integrações > API no RD Station' },
      { key: 'identifier', label: 'Identificador da conta (opcional)', type: 'text', required: false, icon: 'mdi-account-outline', hint: 'Geralmente o subdomínio da sua conta RD' },
    ],
  },
]

// ─── Computed ─────────────────────────────────────────────────────────────────
const integracoesConfiguradas = computed(() => integracoesStore.integracoesLoja || [])

const plataformasFiltradas = computed(() => {
  let lista = plataformas

  if (categoriaAtiva.value !== 'todas') {
    lista = lista.filter(p => p.categoria === categoriaAtiva.value)
  }

  if (filtroStatus.value === 'conectadas') {
    lista = lista.filter(p => isConectada(p.id))
  } else if (filtroStatus.value === 'nao_conectadas') {
    lista = lista.filter(p => !isConectada(p.id))
  }

  return lista
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isConectada = (id) => integracoesConfiguradas.value.some(i => i.plataforma === id && i.ativo)

const statusTexto = (id) => isConectada(id) ? 'Conectada e ativa' : 'Não configurada'

const labelCategoria = (cat) => ({
  pagamentos: '💳 Pagamentos',
  comunicacao: '💬 Comunicação',
  logistica: '🚚 Logística',
  outros: '📊 Outros',
}[cat] ?? cat)

const corDificuldade = (d) => ({
  facil: { cor: 'success', label: '🟢 Fácil' },
  medio: { cor: 'warning', label: '🟡 Médio' },
  dificil: { cor: 'error', label: '🔴 Difícil' },
}[d] ?? { cor: 'grey', label: d })

const toggleVisibilidade = (key) => {
  visibilidade[key] = !visibilidade[key]
}

// ─── Regras ───────────────────────────────────────────────────────────────────
const rules = {
  required: (v) => !!v || 'Campo obrigatório',
}

// ─── Ações ────────────────────────────────────────────────────────────────────
const abrirConfigurar = (plataforma) => {
  plataformaSelecionada.value = plataforma

  // Limpar e pré-preencher com dados existentes (se já configurada)
  Object.keys(formCredenciais).forEach(k => delete formCredenciais[k])
  Object.keys(visibilidade).forEach(k => delete visibilidade[k])

  const existente = integracoesConfiguradas.value.find(i => i.plataforma === plataforma.id)
  plataforma.campos.forEach(campo => {
    formCredenciais[campo.key] = existente?.credenciais?.[campo.key] ?? (campo.type === 'toggle' ? false : '')
    if (campo.type === 'password') visibilidade[campo.key] = false
  })

  dialogAberto.value = true
}

const fecharDialog = () => {
  dialogAberto.value = false
  plataformaSelecionada.value = null
  formDialogRef.value?.resetValidation()
}

const salvarConfiguracao = async () => {
  const { valid } = await formDialogRef.value.validate()
  if (!valid) return

  loadingSalvar.value = true
  const payload = {
    plataforma: plataformaSelecionada.value.id,
    nome: plataformaSelecionada.value.nome,
    credenciais: { ...formCredenciais },
    ativo: true,
  }

  await integracoesStore.salvarIntegracaoLoja(payload)
  loadingSalvar.value = false
  fecharDialog()
}

const desconectar = async (plataformaId) => {
  loadingDesconectar.value = plataformaId
  await integracoesStore.deletarIntegracaoLoja(plataformaId)
  loadingDesconectar.value = null
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await integracoesStore.listarIntegracoesLoja()
})
</script>
