<script setup lang="ts">
import { Transaction } from '@/types';

defineProps<{
  open: boolean;
  transaction: Transaction | null;
}>();

const emit = defineEmits<{
  (e: 'accept');
  (e: 'reject');
  (e: 'close');
}>();

function handleAccept() {
  emit('accept');
  emit('close');
}

function handleReject() {
  emit('reject');
  emit('close');
}
</script>

<template>
  <UiModal :open="open" @close="emit('close')">
    <template #header>
      <h3>Connect to apps</h3>
    </template>
    <div class="s-box p-4">
      <div class="text-center">New transaction has been detected</div>
      <BlockExecution v-if="transaction" :txs="[transaction]" class="mt-3" />
    </div>
    <template #footer>
      <div class="flex space-x-3">
        <UiButton class="w-full" @click="handleReject()">Reject</UiButton>
        <UiButton :primary="true" class="w-full" @click="handleAccept()">Approve</UiButton>
      </div>
    </template>
  </UiModal>
</template>
