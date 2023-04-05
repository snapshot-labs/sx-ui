<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useSpacesStore } from '@/stores/spaces';
import type { NetworkID } from '@/types';

const uiStore = useUiStore();
const route = useRoute();
const spacesStore = useSpacesStore();
const id = route.params.id as string;
const [networkId, spaceId] = id.split(':');

onMounted(() => {
  spacesStore.fetchSpace(spaceId, networkId as NetworkID);
});
</script>

<template>
  <div>
    <div>
      <div
        class="ml-0 mr-0 lg:translate-x-0"
        :class="{
          'translate-x-[240px]': !route.meta.hideNav && uiStore.sidebarOpen,
          'lg:ml-[240px] xl:mr-[240px]': !route.meta.hideNav
        }"
      >
        <UiLoading v-if="!spacesStore.spacesMap.has(id)" class="block p-4" />
        <router-view v-else :space="spacesStore.spacesMap.get(id)" />
      </div>
      <div
        v-if="!route.meta.hideNav"
        class="invisible xl:visible fixed w-[240px] border-l bottom-0 top-[72px] right-0"
      />
    </div>
  </div>
</template>
