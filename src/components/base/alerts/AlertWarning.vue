<template>
  <v-alert
      border="start" icon="mdi-alert-circle-outline" variant="tonal"
      :border-color="darkMode.darkMode ? '#9ba4ca' : '#00509d'"
      :color="darkMode.darkMode ? '#9ba4ca' : '#00509d'"
      :closable="activeClosable"
  >
    <slot></slot>
  </v-alert>
</template>

<script setup>
import {useThemeStore} from "@/stores/config-temas/theme";
import {defineProps, toRefs, computed} from "vue";

const darkMode = useThemeStore();

const props = defineProps({
  closable: { type: Boolean, default: false }
})

const { closable } = toRefs(props);
const activeClosable = computed(() => closable.value)
</script>