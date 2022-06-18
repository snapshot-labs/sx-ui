<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useBalances } from '@/composables/useBalances';
import spaces from '@/helpers/spaces.json';

const props = defineProps({
  open: Boolean
});

const emit = defineEmits(['close']);

const form = reactive({
  to: '',
  token: '',
  amount: '',
  value: ''
});

const showPicker = ref(false);
const searchValue = ref('');
const { assets, assetsMap, loadBalances } = useBalances();

onMounted(() => {
  loadBalances(spaces.pasta.wallets[0]);
});

const currentToken = computed(() => assetsMap.value?.get(form.token));

function handleAmountUpdate(value) {
  form.amount = value;

  if (value === '') {
    form.value = '';
  } else if (currentToken.value) {
    form.value = parseFloat((value * currentToken.value.quote_rate).toFixed(2));
  }
}

function handleValueUpdate(value) {
  form.value = value;

  if (value === '') {
    form.amount = '';
  } else if (currentToken.value) {
    form.amount = value / currentToken.value.quote_rate;
  }
}

watch(
  () => props.open,
  () => {
    showPicker.value = false;
  }
);

watch(currentToken, token => {
  if (!token || form.amount === '') return;

  form.value = parseFloat((form.amount * token.quote_rate).toFixed(2));
});
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3 v-text="'Send token'" />
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
            type="text"
            placeholder="Search"
            class="flex-auto bg-transparent text-skin-link"
          />
        </div>
      </template>
    </template>
    <BlockTokenPicker
      v-if="showPicker"
      :assets="assets"
      :searchValue="searchValue"
      @pick="
        form.token = $event;
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
        <div v-text="'Token'" class="s-label" />
        <input
          placeholder="Select token"
          class="s-input h-[61px]"
          :value="currentToken?.contract_name || ''"
          @click="showPicker = true"
        />
      </div>
      <div class="grid grid-cols-2 gap-[12px]">
        <SINumber
          :value="form.amount"
          @input="handleAmountUpdate"
          :definition="{
            type: 'number',
            title: 'Amount',
            examples: ['0']
          }"
        />
        <SINumber
          :value="form.value"
          @input="handleValueUpdate"
          :definition="{ type: 'number', title: 'USD', examples: ['0'] }"
        />
      </div>
    </div>
    <template v-slot:footer v-if="!showPicker">
      <UiButton class="w-full">Confirm</UiButton>
    </template>
  </UiModal>
</template>
