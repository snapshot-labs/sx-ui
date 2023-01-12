<script setup lang="ts">
import { useActions } from '@/composables/useActions';
import type { Proposal as ProposalType } from '@/types';

const props = defineProps<{ proposal: ProposalType }>();

const { receiveProposal, executeTransactions } = useActions();

async function handleReceiveProposalClick() {
  return receiveProposal(props.proposal);
}

async function handleExecuteTransactionsClick() {
  return executeTransactions(props.proposal);
}
</script>

<template>
  <div class="x-block !border-x rounded-lg p-3">
    <UiButton :disabled="true" class="block mb-2 w-full flex justify-center items-center">
      <IH-check-circle class="inline-block mr-2" />
      Finalize proposal
    </UiButton>
    <UiButton
      class="block mb-2 w-full flex justify-center items-center"
      @click="handleReceiveProposalClick"
    >
      <IH-database class="inline-block mr-2" />
      Receive proposal
    </UiButton>
    <UiButton
      class="block mb-2 w-full flex justify-center items-center"
      @click="handleExecuteTransactionsClick"
    >
      <IH-play class="inline-block mr-2" />
      Execute transactions
    </UiButton>
  </div>
</template>
