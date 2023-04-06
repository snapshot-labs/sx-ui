<script setup lang="ts">
import { useWeb3 } from '@/composables/useWeb3';

const { web3Account } = useWeb3();
</script>

<template>
  <Layout>
    <router-view v-if="web3Account" :key="web3Account.toLowerCase()" />
  </Layout>
</template>
