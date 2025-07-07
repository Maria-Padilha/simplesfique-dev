<template>
  <v-dialog max-width="350" v-model="openModalDelete">
    <v-card class="background-navbar">
      <div class="d-flex align-center justify-end px-3 py-3">
        <v-icon icon="mdi-close" size="25px" @click="closeModalDelete" class="cursor-pointer"></v-icon>
      </div>
      <div class="d-flex flex-column align-center justify-center mb-2 px-3">
        <v-icon icon="mdi-alert-circle-outline" size="50px" color="red"></v-icon>
        <p class="mt-3 text-2xl">Desculpe, ocorreu um erro inesperado!</p>
        <p class="mt-3 texto-pequeno-15 mx-2 opacity-70"><slot name="erro" /></p>
      </div>
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