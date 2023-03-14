<script setup lang="ts">
import { useWeb3 } from '@/composables/useWeb3';
import { _n } from '@/helpers/utils';

defineProps<{
  loading: boolean;
  votingPower: bigint;
  decimals: number;
}>();

const { web3 } = useWeb3();
</script>

<template>
  <UiButton
    v-if="web3.account && web3.type !== 'argentx'"
    :loading="loading"
    :class="{
      '!px-0 w-[46px]': loading
    }"
    class="flex flex-row items-center justify-center"
    title="Voting power"
  >
    <IH-lightning-bolt class="inline-block" />
    <span class="ml-1">{{ _n(Number(votingPower) / 10 ** decimals) }}</span>
  </UiButton>
</template>
