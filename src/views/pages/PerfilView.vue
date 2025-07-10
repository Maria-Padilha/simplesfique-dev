<template>
  <top-all-pages :botao="true" :items="['Home', 'Perfil']" :salvar="atualizarPerfil" @update-editar="editarAtivo = $event">
    <template #titulo>Perfil do Usuário</template>

    <template #section>
      <!-- primeira sessão - informações pessoais -->
      <section v-if="!editarAtivo" class="background-third px-2 py-2 gap-5 display-start-center">
        <v-sheet width="250px" height="200px" class="bg-transparent">
          <v-img
              alt="foto de perfil" class="w-[100%] h-[100%] rounded-md" cover
              :src="themeStore.darkMode ? require('@/assets/img/profile/profileDark.jpg') : require('@/assets/img/profile/profile.jpg')"
          />
        </v-sheet>

        <div class="mt-5">
          <h2 class="text-2xl font-semibold texto-color-laranja">Sandra Adams</h2>

          <div v-for="(info, index) in infos" :key="index" class="flex items-center gap-2 mt-4">
            <v-icon :icon="info.icon" size="18px"/>
            <p class="texto-pequeno font-semibold">{{ info.title }}: <span class="font-normal">{{ info.value }}</span></p>
          </div>
        </div>
      </section>
      <section v-else class="background-third px-2 py-2 gap-5 display-start-center">
        <div class="w-[350px]">
          <upload-image width="100%" height="200px">
            <template #default>Atualizar Foto de Perfil</template>
          </upload-image>
        </div>

        <div class="w-100">
          <v-text-field hide-details variant="underlined"/>

          <div class="flex flex-col gap-3 mt-5">
            <v-text-field density="compact" hide-details variant="underlined">
              <template #label><p class="texto-pequeno">Nível de Acesso</p></template>
              <template #prepend-inner><v-icon icon="mdi-shield-account-outline" size="18px" /></template>
            </v-text-field>

            <v-text-field density="compact" hide-details variant="underlined">
              <template #label><p class="texto-pequeno">E-mail</p></template>
              <template #prepend-inner><v-icon icon="mdi-email-outline" size="18px" /></template>
            </v-text-field>

            <v-text-field density="compact" hide-details variant="underlined">
              <template #label><p class="texto-pequeno">Telefone</p></template>
              <template #prepend-inner><v-icon icon="mdi-phone-outline" size="18px" /></template>
            </v-text-field>
          </div>
        </div>
      </section>

      <section class="mt-10">
        <div
            v-for="input in inputs" :key="input.id"
            class="flex items-center gap-3 flex-col md:flex-row mb-3"
            :class="editarAtivo ? 'cursor-pointer' : 'cursor-not-allowed'"
        >
          <v-text-field
              v-for="(textField, index) in input.textFields" :key="index"
              :disabled="!editarAtivo" variant="outlined" hide-details="auto" density="compact"
              class="w-[100%] texto-color-primary" v-model="textField.model"
          >
            <template #label><p class="texto-pequeno">{{textField.label}}</p></template>
          </v-text-field>
        </div>
      </section>
    </template>
  </top-all-pages>
</template>

<script setup>
import UploadImage from "@/components/base/image/UploadImage.vue";
import TopAllPages from "@/components/base/TopAllPages.vue";
import {useThemeStore} from "@/stores/config-temas/theme";
import {ref} from "vue";

const themeStore = useThemeStore();

// valores dos inputs

const nomeEmpresa = ref('teste aqui');

const infos = ref([
  {title: 'Nível de Acesso', value: 'Admin', icon: 'mdi-shield-account-outline'},
  {title: 'E-mail', value: 'sandra_a88@gmail.com', icon: 'mdi-email-outline'},
  {title: 'Telefone', value: '(65) 98469-9999', icon: 'mdi-phone-outline'},
]);

const inputs = ref([
  {
    id: 1,
    textFields: [
      { label: 'Nome da Empresa', model: nomeEmpresa, width: '100%' },
      { label: 'Nome da Filial', model: nomeEmpresa, width: '100%' },
    ]
  },
  {
    id: 2,
    textFields: [
      { label: 'Cidade', model: nomeEmpresa, width: '70%' },
      { label: 'Estado', model: nomeEmpresa, width: '30%' },
    ]
  },
  {
    id: 2,
    textFields: [
      { label: 'Endereço', model: nomeEmpresa, width: '70%' },
      { label: 'CEP', model: nomeEmpresa, width: '30%' },
    ]
  },
])

const editarAtivo = ref(false);

const atualizarPerfil = () => {
  alert('Perfil Atualizado!');
}
</script>

<style scoped>
.display-start-center {
  display: flex;
  align-items: start;
  justify-content: start;
}

@media screen and (max-width: 497px) {
  .display-start-center {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>