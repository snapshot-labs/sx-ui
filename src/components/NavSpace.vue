<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUiStore } from '@/stores/ui';
import { useTreasury } from '@/composables/useTreasury';
import { useSpacesStore } from '@/stores/spaces';

import IHGlobeAlt from '~icons/heroicons-outline/cash';
import IHNewspaper from '~icons/heroicons-outline/newspaper';
import IHCash from '~icons/heroicons-outline/cash';
import IHCog from '~icons/heroicons-outline/cog';

const route = useRoute();
const uiStore = useUiStore();
const spacesStore = useSpacesStore();

// TODO if we not get ALL spaces like paginate 1000 we will not find a space here
const space = computed(() => spacesStore.spacesMap.get(route.params.id as string));
const { treasury } = useTreasury(space);

const navigationItems = computed(() => ({
  overview: {
    name: 'Overview',
    icon: IHGlobeAlt
  },
  proposals: {
    name: 'Proposals',
    icon: IHNewspaper
  },
  ...(treasury.value
    ? {
        treasury: {
          name: 'Treasury',
          icon: IHCash
        }
      }
    : {}),
  settings: {
    name: 'Settings',
    icon: IHCog
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
        :to="{ name: `space-${key}` }"
        class="px-4 py-[6px] space-x-2 text-skin-text flex items-center"
        :class="{
          'text-skin-link': route.name === `space-${key}`
        }"
      >
        <component :is="item.icon" class="inline-block"></component>
        <span v-text="item.name" />
      </router-link>
    </div>
  </div>
</template>
