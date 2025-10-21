<template>
  <main class="my-12 mx-10">
    <h1 class="text-2xl mb-5">Modais já disponíveis</h1>

    <v-btn @click="modal = !modal" variant="tonal" color="var(--text-color-laranja)">Modal País</v-btn>
    <país-modal v-model:modal="modal" :close-modal="closeModal" />
  </main>
</template>

<script setup>
import PaísModal from "@/components/base/modais/localizacao/LocalizacaoPadraoModal.vue";
import { ref } from 'vue';

const modal = ref(false);
const closeModal = () => {
  modal.value = false;
};
</script>