<script setup lang="ts">
import { ref } from 'vue';
import { useWalletConnect } from '@/composables/useWalletConnect';
import { ContractCallTransaction } from '@/types';
import { explorerUrl, shorten } from '@/helpers/utils';
import spaceData from '@/helpers/space.json';

const loading = ref(false);
const connectionLink = ref('');

const props = defineProps({
  open: Boolean
});

const emit = defineEmits(['add', 'close']);

const { connect, logout, isAuthenticated, onTransaction } = useWalletConnect(spaceData);

async function handleSubmit() {
  loading.value = true;
  await connect(connectionLink.value);
  connectionLink.value = '';
  loading.value = false;
  emit('close');
}

onTransaction((tx: ContractCallTransaction) => {
  emit('add', tx);
});

async function handleLogout() {
  loading.value = true;
  await logout();
  loading.value = false;
}
</script>

<template>
  <UiModal :open="props.open" @close="$emit('close')">
    <template #header>
      <h3 v-text="'WalletConnect'" />
    </template>
    <div v-if="!isAuthenticated" class="s-box p-4">
      <div class="relative">
        <UiLoading v-if="loading" class="absolute top-[14px] right-3 z-10" />
        <SIAddress
          v-model="connectionLink"
          :definition="{
            type: 'string',
            title: 'Connection link',
            examples: ['e.g. wc:a7577083-65eb...']
          }"
          :show-picker="false"
        />
      </div>
    </div>
    <template v-if="isAuthenticated" #footer>
      <div class="space-y-2">
        <a :href="explorerUrl(spaceData.network, spaceData.wallet)" target="_blank" class="block">
          <UiButton class="button-outline w-full flex justify-center items-center">
            <Stamp :id="spaceData.wallet" :size="18" class="mr-2 -ml-1" />
            <span v-text="shorten(spaceData.wallet)" />
            <IH-external-link class="inline-block ml-1" />
          </UiButton>
        </a>
        <UiButton class="button-outline w-full !text-red" @click="handleLogout"> Log out </UiButton>
      </div>
    </template>
    <template v-else #footer>
      <UiButton class="w-full" :loading="loading" :disabled="!connectionLink" @click="handleSubmit">
        Confirm
      </UiButton>
    </template>
  </UiModal>
</template>
