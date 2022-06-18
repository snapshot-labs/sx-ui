<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: [Number, String],
  definition: Object
});

const emit = defineEmits(['input']);

const inputValue = computed({
  get() {
    return props.value;
  },
  set(newValue) {
    emit('input', newValue);
  }
});
</script>

<template>
  <SBase :definition="definition">
    <input
      type="number"
      v-model="inputValue"
      class="s-input"
      :placeholder="definition.examples && definition.examples[0]"
    />
  </SBase>
</template>
