<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useActions } from '@/composables/useActions';
import { clone } from '@/helpers/utils';
import { validateForm } from '@/helpers/validation';
import type { Space } from '@/types';

type FormState = { name: string; about?: string; website?: string; avatar?: string };

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

const props = defineProps<{
  open: boolean;
  space: Space;
}>();

const emit = defineEmits(['add', 'close']);

const { updateMetadata } = useActions();

const sending = ref(false);
const form: FormState = reactive(clone(DEFAULT_FORM_STATE));
const avatar = ref('');

const formErrors = computed(() => validateForm(definition, form));

async function handleSubmit() {
  sending.value = true;
  console.log('form', form);
  try {
    await updateMetadata(props.space, {
      name: form.name,
      description: form.about || '',
      external_url: form.website || '',
      avatar: avatar.value || ''
    });
    emit('close');
  } finally {
    sending.value = false;
  }
}

onMounted(() => {
  form.name = props.space.name;
  form.about = props.space.about || '';
  form.website = '';
  avatar.value = '';
});
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template #header>
      <h3>Edit profile</h3>
    </template>
    <div class="relative bg-skin-border h-[100px] -mb-[50px]" />
    <SIUploadImage
      class="relative h-[80px] ml-4 group max-w-max cursor-pointer"
      @image-uploaded="url => (avatar = url)"
    >
      <template #avatar="{ uploading, previewUrl }">
        <Stamp
          :id="space.id"
          :size="80"
          class="pointer-events-none border-[4px] border-skin-bg !bg-skin-bg !rounded-lg group-hover:opacity-80"
          :class="{
            'opacity-80': uploading
          }"
        />
        <div
          class="pointer-events-none absolute group-hover:visible inset-0 z-10 flex flex-row w-full h-full items-center content-center justify-center"
        >
          <IH-pencil v-if="!uploading" class="invisible text-skin-link group-hover:visible" />
          <UiLoading v-if="uploading" class="block bg-green z-5" />
          <img v-if="previewUrl" :src="previewUrl" class="absolute w-full h-full z-3 !rounded-lg" />
        </div>
      </template>
    </SIUploadImage>
    <div class="s-box px-4 pb-4 pt-3">
      <SIObject v-model="form" :error="formErrors" :definition="definition" />
    </div>
    <template #footer>
      <UiButton
        class="w-full"
        :loading="sending"
        :disabled="Object.keys(formErrors).length > 0"
        @click="handleSubmit"
      >
        Save
      </UiButton>
    </template>
  </UiModal>
</template>
