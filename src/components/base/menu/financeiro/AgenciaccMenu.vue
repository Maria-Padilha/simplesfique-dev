<template>
  <!-- MENU DE BUSCA -->
  <busca-padrao-menu
      v-model="menu"
      :pesquisar="true"
      :modalCadastrar="abrirModalCadastrar"
      :modelInput="termoPesquisa"
      :resultados="agenciasFiltradas"
      :id-banco="idBanco"
      @update:modelInput="termoPesquisa = $event"
      @selecionar="selecionarAgencia"
      :cadastrar-btn="true"
  >
    <template #resultados="{ selecionar }">
      <div style="height: 200px; overflow-y: auto;">
        <template v-if="agenciasFiltradas.length">
          <div
              v-for="item in agenciasFiltradas"
              :key="item.ID"
              class="hover:bg-surface-variant rounded-md px-3 py-2 cursor-pointer transition-colors"
              @click="selecionar(item)"
          >
            <p class="text-body-1">
              {{ item.DISPLAY_NAME }}
            </p>
          </div>
        </template>

        <template v-else>
          <div class="px-3 py-4">
            <p class="text-sm opacity-50">
              Nenhuma agência encontrada
            </p>
          </div>
        </template>
      </div>
    </template>
  </busca-padrao-menu>

  <!-- MODAL CADASTRAR AGÊNCIA -->
   <CadastrarModal
       :width="450"
       :cadastrarModal="openAgenciaModal"
      :clearInput="fecharModalAgencia"
      :cadastrarcidade="salvarAgencia"
  >
    <template #titulo>Agência</template>
    <template #textfields>
      <v-row dense class="pt-5 px-5">
        <v-col cols="12" md="8">
          <v-text-field
              v-model="agenciaForm.id"
              label="Número da Agência *"
              variant="outlined"
              density="compact"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
              v-model="agenciaForm.digito_ag"
              label="Dígito"
              maxlength="1"
              variant="outlined"
              density="compact"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
              v-model="agenciaForm.id_uf"
              :items="financeiroStore.ufs || []"
              item-title="SIGLA"
              item-value="SIGLA"
              label="UF"
              variant="outlined"
              density="compact"
          />
        </v-col>

        <v-col cols="12" md="8">
          <v-text-field
              v-model="agenciaForm.descagencia"
              label="Descrição *"
              variant="outlined"
              density="compact"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
              v-model="agenciaForm.contato"
              label="Contato"
              variant="outlined"
              density="compact"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
              v-model="agenciaForm.telefone"
              label="Telefone"
              variant="outlined"
              density="compact"
          />
        </v-col>
      </v-row>
    </template>
   </CadastrarModal>
</template>

<script setup>
import {ref, computed, watch, defineEmits, defineProps} from 'vue'
import BuscaPadraoMenu from '@/components/base/menu/BuscaPadraoMenu.vue'
import CadastrarModal from '@/components/base/modais/CadastrarModal.vue'
import { useFinanceiroStore } from '@/stores/APIs/financeiro'
import {toast} from "vue3-toastify";

const emit = defineEmits(['selecionar', 'criar-nova'])

const props = defineProps({
  idBanco: {
    type: [String, Number],
    required: true
  }
})

/* stores */
const financeiroStore = useFinanceiroStore()

/* state */
const menu = ref(false)
const termoPesquisa = ref('')
const openAgenciaModal = ref(false)

/* formulário */
const agenciaForm = ref({
  id: '',
  digito_ag: '',
  descagencia: '',
  id_banco: null,
  id_uf: '',
  contato: '',
  telefone: ''
})

/* agências filtradas */
const agenciasFiltradas = computed(() => {
  if (!props.idBanco) return []

  const list = Array.isArray(financeiroStore.agencias)
      ? financeiroStore.agencias
      : []

  return list
      .filter(a => {
        const bankId =
            a.ID_BANCO ??
            a.id_banco ??
            a.IDBANCO ??
            a.idBanco

        return String(bankId) === String(props.idBanco)
      })
      .map(a => {
        const id = a.ID ?? a.id ?? a.id_agencia ?? a.ID_AGENCIA ?? ''
        const desc =
            a.DESCAGENCIA ??
            a.descagencia ??
            a.DESCRICAO ??
            a.descricao ??
            ''
        const dig = a.DIGITO_AG ?? a.digito_ag ?? a.digito ?? ''

        const display = desc
            ? `${desc} — ${id}${dig ? '-' + dig : ''}`
            : `${id}${dig ? '-' + dig : ''}`

        return { ...a, DISPLAY_NAME: display, ID: id }
      })
})


/* busca */
watch(termoPesquisa, async (pesquisa) => {
  if (!pesquisa || pesquisa.length < 2) return
  await financeiroStore.buscarAgencias({ termo: pesquisa })
})

/* ações */
const selecionarAgencia = (agencia) => {
  emit('selecionar', agencia)
  menu.value = false
}

const abrirModalCadastrar = () => {
  // Garantir que id_banco seja setado ao abrir o modal
  agenciaForm.value.id_banco = props.idBanco || null
  console.log('Modal aberto com id_banco:', agenciaForm.value.id_banco) // Debug

  // Emitir evento para notificar o pai
  emit('criar-nova')

  openAgenciaModal.value = true
}

const fecharModalAgencia = () => {
  openAgenciaModal.value = false
  Object.assign(agenciaForm.value, {
    id: '',
    digito_ag: '',
    descagencia: '',
    id_banco: null,
    id_uf: '',
    contato: '',
    telefone: ''
  })
}

const salvarAgencia = async () => {
  if (!agenciaForm.value.id || !agenciaForm.value.descagencia) {
    toast.error('Preencha número e descrição da agência')
    return
  }

  if (!agenciaForm.value.id_banco) {
    toast.error('Banco não selecionado')
    return
  }

  try {
    const payload = {
      ...agenciaForm.value,
      id: String(agenciaForm.value.id),
      id_banco: agenciaForm.value.id_banco // Garantir que id_banco é enviado
    }

    console.log('Salvando agência com payload:', payload) // Debug
    await financeiroStore.criarAgencia(payload)

    await financeiroStore.buscarAgencias()
    toast.success('Agência cadastrada com sucesso')
    fecharModalAgencia()
  } catch (e) {
    toast.error('Erro ao cadastrar agência')
  }
}
</script>
