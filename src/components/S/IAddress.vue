<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script setup lang="ts">
type Props = {
  showPicker?: boolean;
  path?: string;
  definition: any;
};

withDefaults(defineProps<Props>(), {
  showPicker: true
});

const emit = defineEmits<{
  (e: 'pick', path: string);
}>();
</script>

<template>
  <div class="relative">
    <div v-if="showPicker" class="absolute top-[20px] right-3 z-10">
      <a @click="emit('pick', path || '')"><IH-identification /></a>
    </div>
    <SIString v-bind="$attrs as Props" class="!pr-7" />
  </div>
</template>
