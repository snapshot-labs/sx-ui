<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { useWeb3 } from '@/composables/useWeb3';

const uiStore = useUiStore();
const { web3Account } = useWeb3();
</script>

<template>
  <div>
    <div>
      <div
        class="ml-0 lg:ml-[240px] mr-0 xl:mr-[240px]"
        :class="{ 'translate-x-[240px] lg:translate-x-0': uiStore.sidebarOpen }"
      >
        <NavSettings />
        <router-view v-if="web3Account" />
      </div>
      <div class="invisible xl:visible fixed w-[240px] border-l bottom-0 top-[72px] right-0" />
    </div>
  </div>
</template>
