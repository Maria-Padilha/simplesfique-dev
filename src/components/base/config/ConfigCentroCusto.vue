<template>
  <div class="centro-custo-config">
    <v-form ref="formRef" v-model="formValid">
      <!-- Switch Principal -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-switch
            v-model="config.possui_centro_custo"
            label="Possui centro de custo?"
            color="var(--text-color-laranja)"
            hide-details
          ></v-switch>
        </v-col>
      </v-row>

      <!-- Configuração de Níveis (aparece apenas se possui_centro_custo = true) -->
      <v-expand-transition>
        <div v-if="config.possui_centro_custo">
          <div class="config-section mb-6">
            <h4 class="text-lg font-medium mb-4 texto-color-primary">Estrutura de Níveis</h4>
            
            <v-row class="mb-6">
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="config.nivel1"
                  label="Nível 1"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="1"
                  max="9"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="config.nivel2"
                  label="Nível 2"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="1"
                  max="9"
                  hide-details="auto"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="config.nivel3"
                  label="Nível 3"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="1"
                  max="9"
                  hide-details="auto"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Exemplo de Estrutura -->
            <div class="structure-example p-4 rounded-lg bg-opacity-10 bg-white">
              <h5 class="text-sm font-medium mb-2">Exemplo de Estrutura:</h5>
              <p class="text-sm opacity-80">
                {{ gerarExemploEstrutura() }}
              </p>
            </div>
          </div>
        </div>
      </v-expand-transition>
    </v-form>

    <!-- Botões de Ação -->
    <div class="action-buttons mt-6">
      <v-btn
        color="var(--text-color-laranja)"
        variant="flat"
        @click="salvarConfiguracoes"
        :loading="loading"
        :disabled="loading"
        class="text-white"
      >
        <v-icon class="mr-2">mdi-content-save</v-icon>
        Salvar Configurações
      </v-btn>
      
      <v-btn
        variant="outlined"
        @click="resetarConfiguracoes"
        class="ml-3"
      >
        <v-icon class="mr-2">mdi-refresh</v-icon>
        Resetar
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useConfigParfinStore } from '@/stores/APIs/config'
import { useEmpresaStore } from '@/stores/APIs/empresa'

const useConfig = useConfigParfinStore()
const empresaStore = useEmpresaStore()
const formRef = ref(null)
const formValid = ref(false)
const loading = computed(() => useConfig.loading)
const dadosExistem = ref(false)

// Dados de configuração
const config = reactive({
  possui_centro_custo: false,
  nivel1: 1,
  nivel2: 1,
  nivel3: 1,
  separador: '.'
})

// Computed para gerar exemplo da estrutura
const gerarExemploEstrutura = () => {
  const sep = config.separador || '.'
  const n1 = '0'.repeat(config.nivel1)
  const n2 = '0'.repeat(config.nivel2)
  const n3 = '0'.repeat(config.nivel3)
  
  return `${n1}${sep}${n2}${sep}${n3} (Ex: 1${sep}01${sep}01)`
}

// Carregar parâmetros de centro de custo
const carregarParametrosCentroCusto = async () => {
  try {
    const response = await useConfig.buscarparfin()
    
    // API retorna objeto único (não paginado); store já devolve response.data diretamente
    const dados = response && typeof response === 'object' && !Array.isArray(response) ? response : null
    if (dados && Object.keys(dados).length > 0) {
      config.possui_centro_custo = dados.utiliza_ccusto === 'S' || dados.utiliza_ccusto === 1 || dados.utiliza_ccusto === true
      config.nivel1 = dados.ccusto_nivel1 || 1
      config.nivel2 = dados.ccusto_nivel2 || 1
      config.nivel3 = dados.ccusto_nivel3 || 1
      config.separador = dados.separador || '.'

      dadosExistem.value = true
    } else {
      dadosExistem.value = false
    }
  } catch (error) {
    console.error('Erro ao carregar parâmetros de centro de custo:', error)
    dadosExistem.value = false
  }
}

// Métodos
const salvarConfiguracoes = async () => {
  try {
    const dadosParaEnvio = {
      data: [{
        utiliza_ccusto: config.possui_centro_custo ? 'S' : 'N',
        ccusto_nivel1: config.nivel1,
        ccusto_nivel2: config.nivel2,
        ccusto_nivel3: config.nivel3,
        separador: config.separador
      }]
    }
    
    // PUT se dados existem, POST se não existem
    if (dadosExistem.value) {
      await useConfig.alterarParfin(dadosParaEnvio)
    } else {
      await useConfig.cadastrarParfin(dadosParaEnvio)
    }
    
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
  }
}

const resetarConfiguracoes = () => {
  config.possui_centro_custo = false
  config.nivel1 = 1
  config.nivel2 = 1
  config.nivel3 = 1
  config.separador = '.'
}

// Carregar configurações ao montar o componente
onMounted(async () => {
  try {
    // Carregar empresa selecionada do localStorage se não houver id
    if (!empresaStore.empresa?.id && !empresaStore.empresaSelecionada?.id) {
      empresaStore.carregarEmpresaSelecionada()
    }
    
    // Sincroniza empresaStore.empresa com empresaSelecionada se necessário
    if (!empresaStore.empresa?.id && empresaStore.empresaSelecionada?.id) {
      empresaStore.empresa = empresaStore.empresaSelecionada
    }
    
    const idEmpresa = empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id
    if (idEmpresa) {
      await carregarParametrosCentroCusto()
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})

// Watch para garantir que busca os parâmetros quando o id da empresa estiver disponível
watch(
  () => empresaStore.empresa?.id || empresaStore.empresaSelecionada?.id,
  async (id) => {
    if (id) {
      await carregarParametrosCentroCusto()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.centro-custo-config {
  padding: 20px 0;
}

.section-header {
  margin-bottom: 24px;
}

.config-section {
  padding-bottom: 24px;
}

.structure-example {
  border: 1px solid rgba(var(--text-color-laranja-rgb), 0.3);
}

.action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
