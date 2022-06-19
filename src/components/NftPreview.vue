<script setup>
const props = defineProps({
  item: Object,
  size: Number
});

function handleError(e) {
  e.target.src = `https://cdn.stamp.fyi/token/${props.item.contract_address}?s=256`;
}
</script>

<template>
  <img
    :src="item.image"
    @error="handleError"
    class="aspect-square rounded"
    :style="
      size
        ? {
            width: `${size}px`,
            height: `${size}px`
          }
        : {}
    "
  />
</template>
