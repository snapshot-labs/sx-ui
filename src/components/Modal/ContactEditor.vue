<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { clone } from '@/helpers/utils';
import { useContactsStore } from '@/stores/contacts';

const DEFAULT_FORM_STATE = {
  name: '',
  address: ''
};

const props = defineProps<{
  open: boolean;
  initialState?: any;
}>();

const emit = defineEmits<{
  (e: 'close');
}>();

const contactsStore = useContactsStore();

const form: {
  name: string;
  address: string;
} = reactive(clone(DEFAULT_FORM_STATE));

const addressDuplicated = computed(() => {
  const duplicate = contactsStore.contacts.find(c => c.address === form.address);
  if (duplicate) {
    if (duplicate.address === props.initialState?.address) {
      return undefined;
    }
    return 'Contact already exists';
  }
  return undefined;
});

const formValid = computed(
  () => form.name !== '' && form.address !== '' && !addressDuplicated.value
);

function handleSubmit() {
  contactsStore.saveContact(clone(form));
  emit('close');
}

watch(
  () => props.open,
  () => {
    if (props.initialState) {
      form.name = props.initialState.name;
      form.address = props.initialState.address;
    } else {
      form.name = DEFAULT_FORM_STATE.name;
      form.address = DEFAULT_FORM_STATE.address;
    }
  }
);
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template #header>
      <h3 v-text="initialState?.address ? 'Edit contact' : 'Add contact'" />
    </template>
    <div class="s-box p-4">
      <SIString
        v-model="form.name"
        :definition="{
          type: 'string',
          title: 'Name'
        }"
      />
      <SIString
        v-model="form.address"
        :error="addressDuplicated"
        :definition="{
          type: 'string',
          title: 'Address',
          examples: ['Address or ENS']
        }"
      />
    </div>
    <template #footer>
      <UiButton class="w-full" :disabled="!formValid" @click="handleSubmit"> Confirm </UiButton>
    </template>
  </UiModal>
</template>
