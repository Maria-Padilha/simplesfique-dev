<template>
  <v-dialog max-width="350" v-model="openModalDelete">
    <v-card class="background-navbar py-5 px-4">
      <div class="d-flex flex-column align-center justify-center">
        <v-icon icon="mdi-alert-circle-outline" size="50px" color="red"></v-icon>
        <p class="mt-3 text-2xl">Desculpe, ocorreu um erro inesperado!</p>
        <p class="mt-3 texto-pequeno-15"><slot name="erro" /></p>
      </div>

      <v-btn
          @click="closeModalDelete" class="w-[100%] mt-4 px-3 text-none"
          size="small" variant="flat" color="red"
      >
        Fechar
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
// import {useThemeStore} from "@/stores/config-temas/theme";
import {watch, defineProps, defineModel} from 'vue';

// const darkMode = useThemeStore();

const props = defineProps({
  modal: { type: Boolean },
});

const openModalDelete = defineModel('modal');

watch(() => props.modal, (newValue) => {
  openModalDelete.value = newValue;
});

const closeModalDelete = () => {
  openModalDelete.value = false;
}
</script>