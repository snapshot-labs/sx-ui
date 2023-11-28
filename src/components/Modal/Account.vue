<script setup lang="ts">
import { shorten, explorerUrl } from '@/helpers/utils';

import { useConnect, useDisconnect } from 'use-wagmi';

import metamaskIcon from '@/assets/connectors/metamask.png';
import coinbaseIcon from '@/assets/connectors/coinbase.png';
import walletconnectIcon from '@/assets/connectors/walletconnect.png';
import gnosisIcon from '@/assets/connectors/gnosis.png';
import starknetIcon from '@/assets/connectors/starknet.png';

const props = defineProps<{
  open: boolean;
  ensName: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { web3Account, chain } = useWeb3();
const { connect, connectors, isLoading, pendingConnector } = useConnect({
  onSuccess: () => {
    emit('close');
  }
});
const { disconnect } = useDisconnect({
  onSuccess: () => {
    emit('close');
  }
});

let step = ref('');

function getWalletIcons(id: string) {
  switch (id) {
    case 'injected':
      return metamaskIcon;
    case 'coinbaseWallet':
      return coinbaseIcon;
    case 'walletConnect':
      return walletconnectIcon;
    case 'safe':
      return gnosisIcon;
    case 'argentx':
      return starknetIcon;
    default:
      return metamaskIcon;
  }
}

watch(
  () => props.open,
  () => {
    step.value = '';
  }
);
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template #header>
      <h3 v-if="!web3Account || step === 'connect'" v-text="'Connect wallet'" />
      <h3 v-else v-text="'Account'" />
    </template>
    <div v-if="!web3Account || step === 'connect'">
      <div class="m-4 space-y-2">
        <template v-for="connector in connectors" :key="connector.id">
          <UiButton
            v-if="connector.ready"
            class="button-outline w-full flex justify-center items-center"
            @click="connect({ connector })"
          >
            <UiLoading v-if="isLoading && connector.id === pendingConnector?.id" />

            <template v-else>
              <img
                :src="getWalletIcons(connector.id)"
                height="28"
                width="28"
                class="mr-2 -mt-1"
                :alt="connector.name"
              />
              {{ connector.name }}
            </template>
          </UiButton>
        </template>
      </div>
    </div>
    <div v-else>
      <div v-if="web3Account" class="m-4 space-y-2">
        <a :href="explorerUrl(chain.id, web3Account)" target="_blank" class="block">
          <UiButton class="button-outline w-full flex justify-center items-center">
            <Stamp :id="web3Account" :size="18" class="mr-2 -ml-1" />
            <span v-text="ensName || shorten(web3Account)" />
            <IH-arrow-sm-right class="inline-block ml-1 -rotate-45" />
          </UiButton>
        </a>
        <router-link to="/settings" class="block">
          <UiButton
            class="button-outline w-full flex justify-center items-center"
            @click="emit('close')"
          >
            <span>Settings</span>
          </UiButton>
        </router-link>
        <UiButton class="button-outline w-full" @click="step = 'connect'">
          Connect wallet
        </UiButton>
        <UiButton class="button-outline w-full !text-red" @click="disconnect()">
          Disconnect
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>
