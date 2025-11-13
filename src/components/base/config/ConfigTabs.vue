<template>
  <div class="config-tabs-container">
    <!-- Navegação das abas -->
    <div class="tabs-navigation">
      <div class="tabs-wrapper">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          :class="[
            'tab-button',
            { 'active': activeTab === tab.id }
          ]"
        >
          <v-icon :icon="tab.icon" size="18" class="mr-2"></v-icon>
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Conteúdo das abas -->
    <div class="tab-content">
      <slot :activeTab="activeTab"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  },
  defaultTab: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['tab-changed'])

const activeTab = ref(props.defaultTab || props.tabs[0]?.id)

const selectTab = (tabId) => {
  activeTab.value = tabId
  emit('tab-changed', tabId)
}

watch(activeTab, (newTab) => {
  emit('tab-changed', newTab)
})
</script>

<style scoped>
.config-tabs-container {
  width: 100%;
}

.tabs-navigation {
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
  padding-bottom: 0;
}

.tabs-wrapper {
  display: flex;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs-wrapper::-webkit-scrollbar {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  opacity: 0.7;
  position: relative;
}

.tab-button:hover {
  opacity: 1;
  background: rgba(var(--text-color-laranja-rgb), 0.05);
}

.tab-button.active {
  opacity: 1;
  color: var(--text-color-laranja);
  border-bottom-color: var(--text-color-laranja);
  background: rgba(var(--text-color-laranja-rgb), 0.08);
}

.tab-content {
  min-height: 400px;
}

/* Responsividade para mobile */
@media (max-width: 768px) {
  .tab-button {
    padding: 10px 16px;
    font-size: 13px;
  }
}
</style>