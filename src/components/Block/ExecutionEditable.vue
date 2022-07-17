<script setup lang="ts">
import { ref, computed, Ref } from 'vue';
import draggable from 'vuedraggable';
import { formatUnits } from '@ethersproject/units';
import { _n, shorten } from '@/helpers/utils';
import spaces from '@/helpers/spaces.json';
import { Transaction } from '@/types';

const address = spaces.pasta.wallets[0];

const props = defineProps<{
  modelValue: Transaction[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Transaction[]): void;
}>();

const editedTx: Ref<string | null> = ref(null);
const modalState: Ref<{
  sendToken?: any;
  sendNft?: any;
  contractCall?: any;
}> = ref({});
const modalOpen = ref({
  sendToken: false,
  sendNft: false,
  contractCall: false
});

const txsMap = computed(() =>
  Object.fromEntries(props.modelValue.map(tx => [tx.id, tx]))
);

const formattedTxs = computed({
  get: () =>
    props.modelValue.map(tx => {
      let title = '';
      if (tx._type === 'sendToken') {
        title = `Send <b>${_n(
          formatUnits(tx._form.amount, tx._form.token.decimals)
        )}</b> ${tx._form.token.symbol} to <b>${shorten(
          tx._form.recipient
        )}</b>`;
      } else if (tx._type === 'sendNft') {
        title = `Send <b>${_n(
          formatUnits(tx._form.amount, 0)
        )}</b> NFT to <b>${shorten(tx._form.recipient)}</b>`;
      } else if (tx._type === 'contractCall') {
        title = `Contract call to <b>${shorten(tx.to)}</b>`;
      }

      return { ...tx, title };
    }),
  set: newValue => {
    const updatedList = newValue.reduce((acc: Transaction[], tx) => {
      acc.push(txsMap.value[tx.id]);
      return acc;
    }, []);

    emit('update:modelValue', updatedList);
  }
});

function addTx(tx: Transaction) {
  const newValue = [...props.modelValue];

  if (editedTx.value !== null) {
    const index = props.modelValue.findIndex(tx => tx.id === editedTx.value);
    newValue[index] = tx;
  } else {
    newValue.push(tx);
  }

  emit('update:modelValue', newValue);
}

function removeTx(id: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter(tx => tx.id !== id)
  );
}

function openModal(type: 'sendToken' | 'sendNft' | 'contractCall') {
  editedTx.value = null;
  modalState.value[type] = null;
  modalOpen.value[type] = true;
}

function editTx(id: string) {
  const tx = props.modelValue.find(tx => tx.id === id);
  if (!tx) return;

  editedTx.value = id;
  modalState.value[tx._type] = tx._form;
  modalOpen.value[tx._type] = true;
}
</script>
<template>
  <div>
    <div class="overflow-hidden w-auto">
      <div
        class="mb-3 flex flex-no-wrap overflow-x-scroll no-scrollbar scrolling-touch items-start space-x-3"
      >
        <a
          class="px-4 py-3 border-b border rounded-lg block min-w-[165px]"
          @click="openModal('sendToken')"
        >
          <IH-stop />
          Send token
        </a>
        <a
          class="px-4 py-3 border-b border rounded-lg block min-w-[165px]"
          @click="openModal('sendNft')"
        >
          <IH-photograph />
          Send NFT
        </a>
        <a
          class="px-4 py-3 border-b border rounded-lg block min-w-[165px]"
          @click="openModal('contractCall')"
        >
          <IH-chip />
          Contract call
        </a>
      </div>
    </div>
    <div v-if="formattedTxs.length > 0" class="x-block !border-x rounded-lg">
      <draggable v-model="formattedTxs" item-key="_type">
        <template #item="{ element: tx }">
          <div
            class="border-b last:border-b-0 px-4 py-3 space-x-2 flex items-center justify-between group"
          >
            <div class="flex items-center max-w-[70%]">
              <IH-switch-vertical
                class="mr-2 opacity-50 hidden group-hover:block"
              />
              <IH-stop v-if="tx._type === 'sendToken'" />
              <IH-photograph v-else-if="tx._type === 'sendNft'" />
              <IH-chip v-else />
              <div class="ml-2 truncate text-skin-link" v-html="tx.title" />
            </div>
            <div class="flex gap-3">
              <a @click="editTx(tx.id)">
                <IH-pencil />
              </a>
              <a @click="removeTx(tx.id)">
                <IH-trash />
              </a>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <teleport to="#modal">
      <ModalSendToken
        :open="modalOpen.sendToken"
        :address="address"
        :initial-state="modalState.sendToken"
        @close="modalOpen.sendToken = false"
        @add="addTx"
      />
      <ModalSendNft
        :open="modalOpen.sendNft"
        :address="address"
        :initial-state="modalState.sendNft"
        @close="modalOpen.sendNft = false"
        @add="addTx"
      />
      <ModalTransaction
        :open="modalOpen.contractCall"
        :initial-state="modalState.contractCall"
        @close="modalOpen.contractCall = false"
        @add="addTx"
      />
    </teleport>
  </div>
</template>
