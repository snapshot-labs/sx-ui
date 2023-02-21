<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useActions } from '@/composables/useActions';
import { clone } from '@/helpers/utils';
import type { Space, SpaceMetadata } from '@/types';

const DEFAULT_FORM_STATE: SpaceMetadata = {
  name: '',
  description: '',
  externalUrl: '',
  twitterUrl: '',
  githubUrl: '',
  discordUrl: '',
  treasuryAddress: ''
};

const props = defineProps<{
  open: boolean;
  space: Space;
}>();

const emit = defineEmits(['add', 'close']);

const { updateMetadata } = useActions();

const sending = ref(false);
const formErrors = ref({} as Record<string, string>);
const form: SpaceMetadata = reactive(clone(DEFAULT_FORM_STATE));

async function handleSubmit() {
  sending.value = true;

  try {
    await updateMetadata(props.space, form);
    emit('close');
  } finally {
    sending.value = false;
  }
}

onMounted(() => {
  form.name = props.space.name;
  form.description = props.space.about || '';
  form.externalUrl = '';
  form.githubUrl = '';
  form.discordUrl = '';
  form.twitterUrl = '';
  form.treasuryAddress = '';
});
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template #header>
      <h3>Edit profile</h3>
    </template>
    <div class="p-4">
      <BlockSpaceFormProfile :show-title="false" :form="form" @errors="v => (formErrors = v)" />
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
