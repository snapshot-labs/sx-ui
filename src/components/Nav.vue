<script lang="ts" setup>
import { useUiStore } from '@/stores/ui';
import { useSpacesStore } from '@/stores/spaces';

// TODO: need to import all icons https://github.com/antfu/unplugin-icons/issues/5
// move to this when stable to avoid imports https://www.npmjs.com/package/@iconify/tailwind
import IHGlobeAlt from '~icons/heroicons-outline/cash';
import IHNewspaper from '~icons/heroicons-outline/newspaper';
import IHCash from '~icons/heroicons-outline/cash';
import IHCog from '~icons/heroicons-outline/cog';
import IHUsers from '~icons/heroicons-outline/users';

const route = useRoute();

const currentRouteName = computed(() => String(route.matched[0]?.name));
</script>

<template>
  <NavSpace v-if="currentRouteName === 'space'" />
  <NavSettings v-if="currentRouteName === 'settings'" />
</template>
