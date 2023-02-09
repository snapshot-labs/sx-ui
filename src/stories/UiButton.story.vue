<script lang="ts" setup>
import { ref } from 'vue';
// import { logEvent } from 'histoire/client';
import UiButton from '../components/Ui/Button.vue';

const text = ref('Click me');
// import 'uno.css';
</script>

<template>
  <Story>
    <UiButton>
      {{ text }}
    </UiButton>
    <h1>hello</h1>

    <!-- <template #controls>
      <HstText v-model="text" title="default slot" />
    </template> -->
  </Story>
</template>
