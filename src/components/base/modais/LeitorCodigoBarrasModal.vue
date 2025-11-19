<template>
  <v-dialog v-model="dialogLocal" max-width="600" persistent>
    <v-card class="modal-leitor">
      <v-card-title class="text-h5 pa-4 d-flex align-center justify-space-between">
        <span>Escanear Código de Barras</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="fechar"></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-4">
        <!-- Input para leitores de código de barras laser -->
        <div class="input-laser mb-4">
          <v-text-field
            v-model="inputLaser"
            label="Digite ou escaneie o código de barras"
            variant="outlined"
            density="comfortable"
            autofocus
            @keydown.enter="processarCodigoLaser"
            prepend-inner-icon="mdi-barcode-scan"
            hint="Use o leitor laser ou digite manualmente"
            persistent-hint
            clearable
          >
          </v-text-field>
        </div>

        <!-- Divisor -->
        <div class="divisor-ou my-4">
          <v-divider></v-divider>
          <span class="divisor-texto">OU</span>
          <v-divider></v-divider>
        </div>

        <!-- Área do leitor de câmera -->
        <div id="qr-reader" class="leitor-container"></div>

        <!-- Mensagem de status -->
        <div v-if="mensagemStatus" class="status-message mt-4">
          <v-alert
            :type="tipoStatus"
            density="compact"
            closable
            @click:close="mensagemStatus = ''"
          >
            {{ mensagemStatus }}
          </v-alert>
        </div>

        <!-- Resultado -->
        <div v-if="codigoLido" class="resultado mt-4">
          <v-text-field
            v-model="codigoLido"
            label="Código lido"
            variant="outlined"
            readonly
            density="comfortable"
          >
            <template v-slot:append>
              <v-btn
                icon="mdi-content-copy"
                variant="text"
                size="small"
                @click="copiarCodigo"
              ></v-btn>
            </template>
          </v-text-field>
        </div>

        <!-- Instruções -->
        <div class="instrucoes mt-4">
          <p class="text-caption opacity-75">
            <v-icon icon="mdi-information" size="small"></v-icon>
            Posicione o código de barras em frente à câmera
          </p>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="fechar"
          class="text-none"
        >
          Cancelar
        </v-btn>
        <v-btn
          v-if="codigoLido"
          variant="flat"
          color="primary"
          @click="confirmar"
          class="text-none"
        >
          Usar Código
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'codigo-lido']);

const dialogLocal = ref(props.modelValue);
const codigoLido = ref('');
const inputLaser = ref('');
const mensagemStatus = ref('');
const tipoStatus = ref('info');
let html5QrCode = null;
let scannerAtivo = false;

watch(() => props.modelValue, (newVal) => {
  dialogLocal.value = newVal;
  if (newVal) {
    iniciarScanner();
  } else {
    pararScanner();
  }
});

watch(dialogLocal, (newVal) => {
  emit('update:modelValue', newVal);
  if (!newVal) {
    pararScanner();
  }
});

const iniciarScanner = async () => {
  try {
    // Limpar código anterior
    codigoLido.value = '';
    mensagemStatus.value = 'Iniciando câmera...';
    tipoStatus.value = 'info';

    // Pequeno delay para garantir que o elemento está renderizado
    await new Promise(resolve => setTimeout(resolve, 100));

    html5QrCode = new Html5Qrcode("qr-reader");

    // Configuração do scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      aspectRatio: 1.7777778
    };

    // Iniciar scanner
    await html5QrCode.start(
      { facingMode: "environment" }, // Usar câmera traseira
      config,
      onScanSuccess,
      onScanError
    );

    scannerAtivo = true;
    mensagemStatus.value = 'Câmera ativa. Aponte para o código de barras.';
    tipoStatus.value = 'success';

    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      if (mensagemStatus.value.includes('Câmera ativa')) {
        mensagemStatus.value = '';
      }
    }, 3000);

  } catch (err) {
    console.error('Erro ao iniciar scanner:', err);
    mensagemStatus.value = 'Erro ao acessar a câmera. Verifique as permissões.';
    tipoStatus.value = 'error';
  }
};

const onScanSuccess = (decodedText, decodedResult) => {
  codigoLido.value = decodedText;

  console.log('Código lido via câmera:', decodedText, decodedResult);

  // Para o scanner
  pararScanner();

  // Emite o código e fecha o modal automaticamente
  emit('codigo-lido', decodedText);
  fechar();
};

const onScanError = () => {
  // Ignorar erros de não encontrar código (são muito frequentes)
};

const pararScanner = async () => {
  if (html5QrCode && scannerAtivo) {
    try {
      await html5QrCode.stop();
      scannerAtivo = false;
    } catch (err) {
      console.error('Erro ao parar scanner:', err);
    }
  }
};

const processarCodigoLaser = () => {
  if (inputLaser.value.trim()) {
    const codigo = inputLaser.value.trim();

    console.log('Código lido via laser:', codigo);

    // Para o scanner da câmera se estiver ativo
    pararScanner();

    // Emite o código e fecha o modal automaticamente
    emit('codigo-lido', codigo);
    fechar();
  }
};

const copiarCodigo = () => {
  if (codigoLido.value) {
    navigator.clipboard.writeText(codigoLido.value);
    mensagemStatus.value = 'Código copiado!';
    tipoStatus.value = 'success';
    setTimeout(() => {
      mensagemStatus.value = '';
    }, 2000);
  }
};

const confirmar = () => {
  if (codigoLido.value) {
    emit('codigo-lido', codigoLido.value);
    fechar();
  }
};

const fechar = () => {
  pararScanner();
  dialogLocal.value = false;
  codigoLido.value = '';
  inputLaser.value = '';
  mensagemStatus.value = '';
};

// Limpar ao desmontar o componente
onUnmounted(() => {
  pararScanner();
});
</script>

<style scoped>
.modal-leitor {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}

.leitor-container {
  width: 100%;
  min-height: 300px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #000;
}

:deep(#qr-reader) {
  border: none !important;
}

:deep(#qr-reader video) {
  border-radius: 8px;
}

:deep(#qr-reader__dashboard) {
  display: none !important;
}

:deep(#qr-reader__dashboard_section_csr) {
  display: none !important;
}

.status-message {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.instrucoes {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: var(--bg-color);
  border-radius: 8px;
}

.resultado {
  animation: slideIn 0.3s ease-out;
}

.input-laser {
  background-color: var(--bg-color);
  padding: 16px;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
}

.divisor-ou {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.divisor-texto {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color);
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 8px;
  white-space: nowrap;
}
</style>

