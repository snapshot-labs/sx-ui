<script setup lang="ts">
import { reactive, ref, computed, watch, nextTick, Ref } from 'vue';
import { Interface } from '@ethersproject/abi';
import { parseUnits } from '@ethersproject/units';
import { useNfts } from '@/composables/useNfts';
import erc721 from '@/helpers/abis/erc721.json';
import erc1155 from '@/helpers/abis/erc1155.json';
import type { SendNftTransaction } from '@/types';

const props = defineProps({
  open: Boolean,
  address: String
});

const emit = defineEmits(['add', 'close']);

const searchInput: Ref<HTMLElement | null> = ref(null);
const showPicker = ref(false);
const searchValue = ref('');

const form: { to: string; nft: string; amount: string | number } = reactive({
  to: '',
  nft: '',
  amount: ''
});

const { loading, loaded, nfts, nftsMap, loadNfts } = useNfts();

const currentNft = computed(() => nftsMap.value?.get(form.nft));
const formValid = computed(
  () =>
    currentNft.value &&
    form.to &&
    (currentNft.value.type !== 'erc1155' || form.amount !== '')
);

function handlePickerClick() {
  if (!loaded.value) {
    loadNfts(props.address);
  }

  showPicker.value = true;

  nextTick(() => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  });
}

function handleSubmit() {
  let data = '';

  const baseAmount = parseUnits(
    form.amount.toString(),
    currentNft?.value.contract_decimals
  );

  if (currentNft.value.type === 'erc1155') {
    const iface = new Interface(erc1155);

    data = iface.encodeFunctionData('safeTransferFrom', [
      props.address,
      form.to,
      currentNft.value.tokenId,
      baseAmount,
      0
    ]);
  } else if (currentNft.value.type === 'erc721') {
    const iface = new Interface(erc721);

    data = iface.encodeFunctionData(
      'safeTransferFrom(address, address, uint256)',
      [props.address, form.to, currentNft.value.tokenId]
    );
  } else {
    throw new Error('Unknown NFT type');
  }

  const decodedTx: SendNftTransaction = {
    _type: 'sendNft',
    _form: {
      recipient: form.to,
      amount: baseAmount.toString(),
      nft: {
        address: currentNft.value.contract_address,
        id: currentNft.value.tokenId,
        name: currentNft.value.title,
        collection: currentNft.value.contract_name
      }
    },
    to: currentNft.value.contract_address,
    data,
    value: '0'
  };

  emit('add', decodedTx);
  emit('close');
}

watch(
  () => props.open,
  () => {
    showPicker.value = false;
  }
);
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3 v-text="'Send NFT'" />
      <template v-if="showPicker">
        <a
          class="absolute left-0 -top-1 p-4 text-color"
          @click="showPicker = false"
        >
          <IH-arrow-narrow-left class="mr-2" />
        </a>
        <div class="flex items-center border-t px-2 py-2 mt-3 -mb-3">
          <IH-search class="mr-2" />
          <input
            v-model="searchValue"
            ref="searchInput"
            type="text"
            placeholder="Search"
            class="flex-auto bg-transparent text-skin-link"
          />
        </div>
      </template>
    </template>
    <BlockNftPicker
      v-if="showPicker"
      :nfts="nfts"
      :loading="loading"
      :searchValue="searchValue"
      @pick="
        form.nft = $event;
        showPicker = false;
      "
    />
    <div class="s-box p-4" v-if="!showPicker">
      <SIString
        v-model="form.to"
        :definition="{
          type: 'string',
          title: 'Recipient',
          examples: ['Address or ENS']
        }"
      />
      <div class="s-base">
        <div v-text="'NFT'" class="s-label" />
        <button class="s-input text-left h-[61px]" @click="handlePickerClick">
          <div class="flex items-center">
            <NftPreview
              v-if="currentNft"
              :item="currentNft"
              class="mr-1"
              :size="20"
            />

            {{ currentNft?.displayTitle || 'Select token' }}
          </div>
        </button>
      </div>
      <SINumber
        v-if="currentNft?.type === 'erc1155'"
        v-model="form.amount"
        :definition="{
          type: 'number',
          title: 'Amount',
          examples: ['0']
        }"
      />
    </div>
    <template v-slot:footer v-if="!showPicker">
      <UiButton class="w-full" :disabled="!formValid" @click="handleSubmit">
        Confirm
      </UiButton>
    </template>
  </UiModal>
</template>
