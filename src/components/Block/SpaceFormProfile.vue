<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { validateForm } from '@/helpers/validation';

const props = withDefaults(
  defineProps<{
    showTitle?: boolean;
    form: any;
  }>(),
  {
    showTitle: true
  }
);

const emit = defineEmits<{
  (e: 'errors', value: any);
}>();

const definition = {
  type: 'object',
  title: 'Space',
  additionalProperties: false,
  required: ['name', 'treasuryAddress'],
  properties: {
    name: {
      type: 'string',
      title: 'Name',
      minLength: 1,
      examples: ['Space name']
    },
    description: {
      type: 'string',
      format: 'long',
      title: 'About',
      examples: ['Space description']
    },
    externalUrl: {
      type: 'string',
      title: 'Website',
      examples: ['Website URL']
    },
    githubUrl: {
      type: 'string',
      title: 'Github',
      examples: ['Github URL']
    },
    twitterUrl: {
      type: 'string',
      title: 'Twitter',
      examples: ['Twitter URL']
    },
    discordUrl: {
      type: 'string',
      title: 'Discord',
      examples: ['Discord URL']
    },
    treasuryAddress: {
      type: 'string',
      minLength: 1,
      title: 'Treasury address',
      examples: ['0x0000…']
    }
  }
};

const formErrors = computed(() => validateForm(definition, props.form));

watch(formErrors, value => emit('errors', value));

onMounted(() => {
  emit('errors', formErrors.value);
});
</script>

<template>
  <h3 v-if="showTitle" class="mb-4">Space profile</h3>
  <div class="s-box">
    <SIObject :model-value="form" :error="formErrors" :definition="definition" />
  </div>
</template>
