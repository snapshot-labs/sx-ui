<script setup lang="ts">
import { ProposalTypes } from '@walletconnect/types';
import { clone } from '@/helpers/utils';
import { validateForm } from '@/helpers/validation';
import { Transaction } from '@/types';

const DEFAULT_FORM_STATE = {
  pairingCode: ''
};

const definition = {
  type: 'object',
  title: 'WalletConnectConnection',
  additionalProperties: false,
  required: ['pairingCode'],
  properties: {
    pairingCode: {
      type: 'string',
      title: 'Pairing code',
      minLength: 1,
      examples: ['wc:7a96b74baf1bb28beae7cbbf485e0dfc17ec3fc7d3f2eed9337ca2e7524e1d1d']
    }
  }
};

const props = defineProps<{
  open: boolean;
  address: string;
  network: number;
  networkId: string;
}>();

const emit = defineEmits<{
  (e: 'add', transaction: Transaction);
  (e: 'close');
}>();

const { loading, logged, connect, logout } = useWalletConnect();

const step: Ref<'INIT' | 'APPROVE'> = ref('INIT');
const proposal: Ref<ProposalTypes.Struct | null> = ref(null);
const approveFn: Ref<((value: boolean) => void) | null> = ref(null);
const approving: Ref<boolean> = ref(false);

const form: {
  pairingCode: string;
} = reactive(clone(DEFAULT_FORM_STATE));

const formErrors = computed(() => {
  const errors = validateForm(definition, form);
  return errors;
});

async function approveCallback(newProposal: ProposalTypes.Struct) {
  step.value = 'APPROVE';
  proposal.value = newProposal;

  return new Promise<boolean>(resolve => {
    approveFn.value = resolve;
  });
}

async function incomingTransactionCallback(transaction: Transaction) {
  emit('add', transaction);
  emit('close');
}

async function handleSubmit() {
  await connect(
    props.network,
    props.address,
    form.pairingCode,
    approveCallback,
    incomingTransactionCallback
  );
}

function handleApprove(approved: boolean) {
  approveFn.value?.(approved);

  if (approved) approving.value = true;
  else {
    form.pairingCode = '';
    step.value = 'INIT';
    proposal.value = null;
  }
}

watch(logged, () => {
  if (logged.value) {
    form.pairingCode = '';
    step.value = 'INIT';
  }
});

watch(loading, () => {
  if (!loading.value) {
    approving.value = false;
  }
});
</script>

<template>
  <UiModal :open="open" @close="emit('close')">
    <template #header>
      <h3>Connect to WalletConnect</h3>
    </template>
    <div class="s-box p-4">
      <template v-if="logged && proposal">
        <div class="flex flex-col items-center">
          <img :src="proposal.proposer.metadata.icons[0]" class="w-[48px] mb-3" />
          <span class="text-center mb-2">
            <strong class="text-skin-link">{{ proposal.proposer.metadata.name }}</strong>
            <span> is connected</span>
          </span>
          <span>You can start interacting with the app.</span>
        </div>
      </template>
      <SIObject
        v-else-if="step === 'INIT'"
        :model-value="form"
        :error="formErrors"
        :definition="definition"
      />
      <div v-else-if="step === 'APPROVE' && proposal" class="flex flex-col items-center">
        <img :src="proposal.proposer.metadata.icons[0]" class="w-[48px] mb-3" />
        <span class="text-center mb-2">
          <strong class="text-skin-link">{{ proposal.proposer.metadata.name }}</strong>
          <span> wants to connect</span>
        </span>
        <div class="font-mono tracking-tighter text-sm">{{ proposal.proposer.metadata.url }}</div>
      </div>
    </div>
    <template #footer>
      <UiButton
        v-if="logged"
        class="w-full"
        @click="
          logout();
          step = 'INIT';
        "
      >
        Disconnect
      </UiButton>
      <UiButton
        v-else-if="step === 'INIT'"
        class="w-full"
        :loading="loading"
        :disabled="Object.keys(formErrors).length > 0"
        @click="handleSubmit"
      >
        Confirm
      </UiButton>
      <div v-else-if="step === 'APPROVE' && approveFn" class="flex space-x-3">
        <UiButton class="w-full" @click="handleApprove(false)">Reject</UiButton>
        <UiButton :primary="true" :loading="approving" class="w-full" @click="handleApprove(true)">
          Approve
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>
