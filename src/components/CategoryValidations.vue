<script setup lang="ts">
defineProps<{ discussion: any }>();
</script>

<template>
  <div class="p-4">
    <div class="flex flex-row flex-wrap gap-3 mb-2">
      <div class="border border-skin-link rounded-lg px-4 py-3 w-[240px] h-[60px]">
        <b>Anyone</b>
      </div>
      <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
        <b>Role(s)</b>
      </div>
      <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
        <b>Need to hold a token</b>
      </div>
      <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
        <b>Need to hold an NFT</b>
      </div>
      <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
        <b>Whitelist</b>
      </div>
    </div>
    <div>Or create a validation strategy.</div>
  </div>
</template>
