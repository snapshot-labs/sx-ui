<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUiStore } from '@/stores/ui';

import IHUsers from '~icons/heroicons-outline/users';
import IHStop from '~icons/heroicons-outline/stop';

const route = useRoute();
const uiStore = useUiStore();

const navigationItems = computed(() => ({
  spaces: {
    name: 'My spaces',
    icon: IHStop
  },
  contacts: {
    name: 'Contacts',
    icon: IHUsers
  }
}));
</script>

<template>
  <div
    class="lg:visible fixed w-[240px] border-r left-[72px] top-0 bottom-0 z-10 bg-skin-bg"
    :class="{
      invisible: !uiStore.sidebarOpen
    }"
  >
    <div class="h-[72px] border-b" />
    <div class="py-4">
      <router-link
        v-for="(item, key) in navigationItems"
        :key="key"
        :to="{ name: `settings-${key}` }"
        class="px-4 py-[6px] space-x-2 text-skin-text flex items-center"
        :class="route.name === `settings-${key}` && 'text-skin-link'"
      >
        <component :is="item.icon" class="inline-block"></component>
        <span v-text="item.name" />
      </router-link>
    </div>
  </div>
</template>
