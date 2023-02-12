<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUiStore } from '@/stores/ui';

// TODO: need to import all icons https://github.com/antfu/unplugin-icons/issues/5
import IHGlobeAlt from '~icons/heroicons-outline/cash';
import IHNewspaper from '~icons/heroicons-outline/newspaper';
import IHCash from '~icons/heroicons-outline/cash';
import IHCog from '~icons/heroicons-outline/cog';
import IHUsers from '~icons/heroicons-outline/users';

const route = useRoute();
const uiStore = useUiStore();

const navGroups = {
  space: {
    overview: {
      name: 'Overview',
      icon: IHGlobeAlt
    },
    proposals: {
      name: 'Proposals',
      icon: IHNewspaper
    },
    treasury: {
      name: 'Treasury',
      icon: IHCash
    },
    settings: {
      name: 'Settings',
      icon: IHCog
    }
  },
  settings: {
    contacts: {
      name: 'Contacts',
      icon: IHUsers
    }
  }
};
const navGroupKey = computed(() => String(route.matched[0]?.name));
const navGroup = computed(() => navGroups[navGroupKey.value || '']);
</script>

<template>
  <div
    v-if="navGroup"
    class="lg:visible fixed w-[240px] border-r left-[72px] top-0 bottom-0 z-10 bg-skin-bg"
    :class="{
      invisible: !uiStore.sidebarOpen
    }"
  >
    <div class="h-[72px] border-b" />
    <div class="py-4">
      <router-link
        v-for="(item, itemKey) in navGroup"
        :key="itemKey"
        :to="{ name: `${navGroupKey}-${itemKey}` }"
        class="px-4 py-[7px] block space-x-2 text-skin-text flex items-center"
        :class="route.name === `${navGroupKey}-${itemKey}` && 'text-skin-link'"
      >
        <component :is="item.icon" class="inline-block"></component>
        <span v-text="item.name" />
      </router-link>
    </div>
  </div>
</template>
