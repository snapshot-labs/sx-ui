<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useUiStore } from '@/stores/ui';

defineProps({
  loading: { type: Boolean, default: false },
  hideRightBorder: { type: Boolean, default: false }
});

const uiStore = useUiStore();
const route = useRoute();
const routeWithNav = computed(() =>
  ['space', 'settings'].includes(route.matched[0]?.name as string)
);
</script>

<template>
  <div>
    <div
      class="ml-0 lg:translate-x-0"
      :class="{
        'translate-x-[240px]': routeWithNav && !route.meta.hideNav && uiStore.sidebarOpen,
        'lg:ml-[240px] xl:mr-[240px]': routeWithNav && !route.meta.hideNav
      }"
    >
      <UiLoading v-if="loading" class="block p-4" />
      <slot v-else />
    </div>
    <div
      v-if="!hideRightBorder && !route.meta.hideNav"
      class="invisible xl:visible fixed w-[240px] border-l bottom-0 top-[72px] right-0"
    />
  </div>
</template>
