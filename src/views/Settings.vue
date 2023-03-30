<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUiStore } from '@/stores/ui';
import { useWeb3 } from '@/composables/useWeb3';

const uiStore = useUiStore();
const route = useRoute();
const { web3Account } = useWeb3();
</script>

<template>
  <div>
    <div>
      <div
        class="ml-0 lg:translate-x-0"
        :class="{
          'translate-x-[240px]': !route.meta.hideNav && uiStore.sidebarOpen,
          'lg:ml-[240px] xl:mr-[240px]': !route.meta.hideNav
        }"
      >
        <router-view v-if="web3Account" :key="web3Account.toLowerCase()" />
      </div>
      <div
        v-if="!route.meta.hideNav"
        class="invisible xl:visible fixed w-[240px] border-l bottom-0 top-[72px] right-0"
      />
    </div>
  </div>
</template>
