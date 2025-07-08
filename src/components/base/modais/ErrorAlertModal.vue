<template>
  <v-dialog max-width="350" v-model="openModalDelete">
    <v-card class="background-navbar py-5 px-4">
      <div class="d-flex flex-column align-center justify-center">
        <v-icon
            icon="mdi-alert-circle-outline" size="50px"
            :color="typeModal ? 'red' : 'primary'"
        />

        <p class="mt-3 text-2xl">
          {{typeModal ? 'Desculpe, ocorreu um erro inesperado!' : 'Temos um aviso importante!'}}
        </p>

        <p class="mt-3 texto-pequeno-15"><slot name="erro" /></p>
      </div>

      <v-btn
          @click="closeModalDelete" class="w-[100%] mt-4 px-3 text-none"
          size="small" variant="flat"
          :color="typeModal ? 'red' : 'primary'"
      >
        Fechar
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
// import {useThemeStore} from "@/stores/config-temas/theme";
import {watch, defineProps, defineModel, computed} from 'vue';

// const darkMode = useThemeStore();

const props = defineProps({
  modal: { type: Boolean },
  error: { type: Boolean, default: true }
});

const openModalDelete = defineModel('modal');

const typeModal = computed(() => props.error);

watch(() => props.modal, (newValue) => {
  openModalDelete.value = newValue;
});

const closeModalDelete = () => {
  openModalDelete.value = false;
}
</script>