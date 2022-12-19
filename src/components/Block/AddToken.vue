<script setup lang="ts">
import { ref, computed, watch, Ref } from 'vue';
import snapshot from '@snapshot-labs/snapshot.js';
import { isAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { abis } from '@/helpers/abis';
import { _n, shorten } from '@/helpers/utils';
import { validateForm } from '@/helpers/validation';
import space from '@/helpers/space.json';
import type { Token } from '@/helpers/alchemy';

const { Multicaller, getProvider } = snapshot.utils;

const loading = ref(false);
const tokenAddress = ref('');
const token: Ref<Token | null> = ref(null);

const emit = defineEmits<{
  (e: 'add', token: Token);
}>();

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

function handleConfirmClick() {
  if (!token.value) return;

  emit('add', token.value);
}

watch(tokenAddress, async value => {
  if (!isAddress(value)) return;

  loading.value = true;

  const network = space.network;
  const provider = getProvider(network);
  const tokens = [value];

  try {
    const multi = new Multicaller(network.toString(), provider, abis.erc20);
    tokens.forEach(token => {
      multi.call(`${token}.name`, token, 'name');
      multi.call(`${token}.symbol`, token, 'symbol');
      multi.call(`${token}.decimals`, token, 'decimals');
      multi.call(`${token}.balance`, token, 'balanceOf', [space.wallet]);
    });

    const result = await multi.execute();

    const fetchedToken = result[value];

    token.value = {
      logo: null,
      contractAddress: value,
      symbol: fetchedToken.symbol,
      name: fetchedToken.name,
      tokenBalance: fetchedToken.balance._hex,
      decimals: fetchedToken.decimals,
      price: 0,
      change: 0,
      value: 0
    };
  } finally {
    loading.value = false;
  }
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
      <div v-if="token" class="py-[12px] border-b last:border-0 flex justify-between">
        <div class="flex items-center min-w-0 pr-2">
          <Stamp :id="token.contractAddress" type="token" :size="32" />
          <div class="flex flex-col ml-3 leading-[20px] min-w-0">
            <div class="text-skin-link" v-text="shorten(token.symbol, 12)" />
            <div class="text-sm truncate" v-text="shorten(token.name, 24)" />
          </div>
        </div>
        <div class="flex flex-col items-end leading-[20px]">
          <div
            class="text-skin-link"
            v-text="_n(formatUnits(token.tokenBalance, token.decimals))"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="border-t p-4 text-center">
    <UiButton class="w-full" :disabled="loading" @click="handleConfirmClick">Confirm</UiButton>
  </div>
</template>
