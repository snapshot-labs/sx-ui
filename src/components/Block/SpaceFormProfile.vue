<script setup lang="ts">
import { computed } from 'vue';
import { validateForm } from '@/helpers/validation';

const props = defineProps<{
  form: any;
}>();

const emit = defineEmits<{
  (e: 'errors', value: any);
}>();

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

const formErrors = computed(() => {
  const errors = validateForm(definition, props.form);

  emit('errors', errors);

  return errors;
});
</script>

<template>
  <h3>Space profile</h3>
  <div class="s-box pt-4">
    <SIObject :model-value="form" :error="formErrors" :definition="definition" />
  </div>
</template>
