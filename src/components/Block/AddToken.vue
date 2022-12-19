<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import snapshot from '@snapshot-labs/snapshot.js';
import { isAddress } from '@ethersproject/address';
import { abis } from '@/helpers/abis';
import { validateForm } from '@/helpers/validation';

const { Multicaller, getProvider } = snapshot.utils;

const loading = ref(false);
const tokenAddress = ref('');

const errors = computed(() =>
  validateForm(
    {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          format: 'address'
        }
      },
      additionalProperties: true
    },
    { address: tokenAddress.value }
  )
);

watch(tokenAddress, async value => {
  if (!isAddress(value)) return;

  loading.value = true;

  const network = '5';
  const provider = getProvider(network);
  const tokens = [value];

  const multi = new Multicaller(network, provider, abis.erc20);
  tokens.forEach(token => {
    multi.call(`${token}.name`, token, 'name');
    multi.call(`${token}.symbol`, token, 'symbol');
    multi.call(`${token}.decimals`, token, 'decimals');
    multi.call(`${token}.balance`, token, 'balanceOf', [
      '0x556B14CbdA79A36dC33FcD461a04A5BCb5dC2A70'
    ]);
  });

  const result = await multi.execute();
  console.log('Multicaller result', result);
});
</script>

<template>
  <div class="s-box p-4">
    <div class="relative">
      <UiLoading v-if="loading" class="absolute top-[14px] right-3 z-10" />
      <SIAddress
        v-model="tokenAddress"
        :error="errors.address"
        :show-picker="false"
        :definition="{ type: 'string', title: 'Token address', examples: ['ERC20 token address'] }"
      />
    </div>
  </div>

  <div class="border-t p-4 text-center">
    <UiButton class="w-full">Confirm</UiButton>
  </div>
</template>
