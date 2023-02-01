<script setup lang="ts">
import { ref, reactive, computed, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useActions } from '@/composables/useActions';
import { clone } from '@/helpers/utils';
import { validateForm } from '@/helpers/validation';
import { enabledNetworks, getNetwork } from '@/networks';
import type { NetworkID } from '@/types';

type FormState = { name: string; about?: string; website?: string };

const DEFAULT_FORM_STATE: FormState = {
  name: '',
  about: '',
  website: ''
};

const definition = {
  type: 'object',
  title: 'Space',
  additionalProperties: false,
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      minLength: 1,
      examples: ['Space name']
    },
    about: {
      type: 'string',
      format: 'long',
      title: 'About',
      examples: ['Space description']
    },
    website: {
      type: 'string',
      title: 'Website',
      examples: ['Space website URL']
    }
  }
};

const availableNetworks = enabledNetworks.map(id => ({
  id,
  name: getNetwork(id).name
}));

const router = useRouter();
const { createSpace } = useActions();

const sending = ref(false);
const selectedNetworkId: Ref<NetworkID> = ref('sn-tn2');
const form: FormState = reactive(clone(DEFAULT_FORM_STATE));

const formErrors = computed(() => validateForm(definition, form));

async function handleSubmit() {
  sending.value = true;

  try {
    await createSpace(selectedNetworkId.value, {
      name: form.name,
      description: form.about || '',
      external_url: form.website || ''
    });

    router.back();
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div>
    <Container class="pt-5">
      <h2>Deploy space</h2>
      <div class="s-box pt-4">
        <SIObject v-model="form" :error="formErrors" :definition="definition" />
      </div>

      <fieldset class="my-4">
        <legend>Network:</legend>

        <div v-for="network in availableNetworks" :key="network.id">
          <input v-model="selectedNetworkId" :value="network.id" type="radio" />
          <label class="ml-2" :for="network.id">{{ network.name }}</label>
        </div>
      </fieldset>
      <UiButton
        class="w-full"
        :loading="sending"
        :disabled="Object.keys(formErrors).length > 0"
        @click="handleSubmit"
      >
        Save
      </UiButton>
    </Container>
  </div>
</template>
