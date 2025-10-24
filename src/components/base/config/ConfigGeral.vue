<template>
  <div>
    <h2 class="text-2xl font-bold mb-8">Configurações Gerais</h2>
    <p class="text-sm opacity-70 mb-12">Configure os parâmetros gerais da aplicação</p>

    <v-form class="space-y-8">
      <v-text-field
          label="Nome da Aplicação"
          placeholder="Digite o nome"
          variant="outlined"
          density="comfortable"
      />

      <v-text-field
          label="URL Base"
          placeholder="https://example.com"
          variant="outlined"
          density="comfortable"
      />

      <v-switch
          label="Modo Manutenção"
          description="Ativar modo de manutenção da aplicação"
      />

      <div class="pt-4">
        <v-btn color="success" size="large">
          Salvar Configurações
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup>
// Componente para configurações gerais do sistema
</script>
