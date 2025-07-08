<template>
  <section
      class="w-[100%] rounded border-dotted border-2 border-gray-400 flex items-center justify-center flex-col cursor-pointer"
      :style="{width: width, height: height}"  @click="addFileInput"
      @dragenter.prevent @dragover.prevent @dragleave="isDragging = false"
      @drop.prevent="handleFileChange" :class="{'dragging': isDragging}"
  >
    <v-img v-if="!$route.path.startsWith('/paginas/perfil')" :src="fileDataUrl" width="100%" height="100%" contain>
      <div
          class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[100%] flex flex-col items-center"
          :class="fileDataUrl ? 'hidden' : 'opacity-100'"
      >
        <v-icon icon="mdi-cloud-upload-outline" size="50px" class="text-gray-400"></v-icon>
        <p class="text-grey">Adicionar <slot></slot></p>
      </div>
    </v-img>

    <!-- mostrar como sem foto de perfil caso o usuário não tenha cadastrado -->
    <v-img
        v-if="$route.path.startsWith('/paginas/perfil')"
        :src="fileDataUrl === null ? (darkMode.darkMode ? profileDataDark : profileData) : fileDataUrl"
        width="100%" height="100%" cover
    >
      <div
          class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[100%] flex flex-col items-center"
           :class="fileDataUrl ? 'hidden' : 'opacity-100'"
      >
        <v-icon icon="mdi-cloud-upload-outline" size="50px" :class="darkMode.darkMode ? 'text-white' : 'text-gray-400'"></v-icon>
        <p class="text-center" :class="darkMode.darkMode ? 'text-white' : 'text-gray-600'"><slot></slot></p>
      </div>
    </v-img>
    <!-- Final da sessão de usuário -->

    <v-file-input ref="fileInput" @change="handleFileChange" style="display: none;"></v-file-input>
  </section>

  <section class="flex w-[100%]">
    <alert-warning class="my-5" :closable="true" @click:close="alert = null" v-if="alert">{{ alert }}</alert-warning>

    <div v-if="fileDataUrl" class="flex w-[100%] p-3 my-5 rounded items-center background-secondary">
      <v-sheet width="70px" height="50px" class="rounded">
        <v-img :src="fileDataUrl" width="100%" height="100%" class="rounded" cover></v-img>
      </v-sheet>

      <p class="ml-5 truncate">{{ fileName }}</p>

      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" size="small" variant="text" @click="deleteFile"></v-btn>
    </div>
  </section>
</template>

<script setup>
import AlertWarning from "@/components/base/alerts/AlertWarning.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import { ref, defineExpose, defineProps, defineEmits } from 'vue';

const darkMode = useThemeStore();

const props = defineProps({
  width: {type: String, default: '100%'},
  height: {type: String, default: '150px'},
  fileDataUrl: { type: String, default: null },
  fileName: { type: String, default: null }
})

const emit = defineEmits(['update:image']);

//
const profileData = ref(require('@/assets/img/profile/profile.jpg'));
const profileDataDark = ref(require('@/assets/img/profile/profileDark.jpg'));

const fileDataUrl = ref(props.fileDataUrl);
const fileName = ref(props.fileName);
const fileInput = ref(null);
const alert = ref(null);
const isDragging = ref(false)

// Abre o diálogo de seleção de arquivos
const addFileInput = () => {
  fileInput.value.click();
}

const handleFileChange = (event) => {
  isDragging.value = false;
  const file = ref(null);

  // Verifica se o arquivo veio do arraste e solta ou do click
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    file.value = event.dataTransfer.files[0];
  } else if (event.target && event.target.files.length > 0) {
    file.value = event.target.files[0];
  }

  // Se o arquivo não foi encontrado, para o processamento
  if (!file.value) {
    alert.value = 'Nenhum arquivo foi selecionado.';
    return;
  }

  // verifica se o arquivo é uma imagem válida
  if(file.value){
    const validTypes = ['image/jpeg','image/png','image/svg+xml'];
    if(!validTypes.includes(file.value.type)){
      fileDataUrl.value = null;
      fileName.value = null;
      resetInput()
      alert.value = 'Adicione uma imagem válida: jpg, png ou xml'
      return
    }

    // veriifca o tamanho da imagem
    const maxSize = 2 * 1024 * 1024;
    if(file.value.size > maxSize){
      fileDataUrl.value = null;
      fileName.value = null;
      resetInput()
      alert.value = 'Arquivo ultrapassou o limite de tamanho: 2MB.'
      return
    }

    // se tudo der certo, limpa o alerta e exibe a imagem
    alert.value = null

    const reader = new FileReader();
    reader.onload = (e) => {
      fileName.value = file.value.name
      fileDataUrl.value = e.target.result;
      emit('update:image', { fileDataUrl: fileDataUrl.value, fileName: fileName.value });
      resetInput()
    };
    reader.readAsDataURL(file.value);
  }
}

// Reseta o input de arquivo
const resetInput = () => {
  if(fileInput.value){
    fileInput.value.value = ''
  }
}

// deleta o input de arquivo quando aperta em fechar alerta
const deleteFile = () => {
  fileDataUrl.value = null;
  fileName.value = null;
  alert.value = null
  resetInput()
}

defineExpose({
  deleteFile
})

</script>