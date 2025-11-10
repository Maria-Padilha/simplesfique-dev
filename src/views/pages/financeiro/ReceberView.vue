<template>
  <div class="pa-4">
    <v-card class="background-secondary mx-auto">
      <v-card-title class="text-h5 pa-4">
        <v-icon icon="mdi-cash-plus" class="mr-3"></v-icon>
        Contas a Receber
      </v-card-title>
      <v-card-text class="pa-4">
        <TabelaPadrao
          :headers="[
            { text: 'Cliente', value: 'cliente' },
            { text: 'Valor', value: 'valor' },
            { text: 'Data de Vencimento', value: 'dataVencimento' },
            { text: 'Status', value: 'status' },
            { text: 'Ações', value: 'actions', sortable: false }
          ]"
          :items="[]"
          item-key="id"
          :loading="false"
          show-edit-action
          show-delete-action
          edit-title="Editar Conta a Receber"
          delete-title="Excluir Conta a Receber"
          />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
// Componente em desenvolvimento para contas a receber
</script>

<style scoped>
.background-secondary {
  background-color: var(--bg-color-secondary);
  color: var(--text-color);
}
</style>