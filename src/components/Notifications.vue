<script lang="ts" setup>
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
</script>

<template>
  <div class="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-0 md:-translate-x-1/2 z-50">
    <UiAlert
      v-for="notification in uiStore.notifications"
      :key="notification.id"
      dismissable
      :type="notification.type"
      class="mb-2 last:mb-0"
      @close="uiStore.dismissNotification(notification.id)"
    >
      {{ notification.message }}
    </UiAlert>
  </div>
</template>
