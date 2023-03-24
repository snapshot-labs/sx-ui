<script setup>
defineProps({
  label: String,
  sticky: Boolean
});
</script>

<template>
  <h4
    class="eyebrow border-b py-2 px-4 text-skin-text"
    :class="{
      'sticky top-[71.5px] bg-skin-bg': sticky
    }"
    v-text="label"
  />
</template>
