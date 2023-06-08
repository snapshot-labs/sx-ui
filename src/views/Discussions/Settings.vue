<script setup lang="ts">
const route = useRoute();

const category = parseInt(route.params.category as string);
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto flex items-center space-x-3">
      <router-link :to="{ name: 'space-discussions' }">
        <UiButton class="!px-0 w-[46px]">
          <IH-arrow-narrow-left class="inline-block" />
        </UiButton>
      </router-link>
      <h3 v-text="'Settings'" />
    </div>
  </div>
  <div>
    <div class="px-4 mb-4">
      <div class="flex align-middle">
        <IH-refresh class="inline-block my-1 mr-2" /> Sync with parent category?
        <div class="rounded-full w-[36px] h-[24px] p-[3px] bg-skin-text inline-block ml-4">
          <span class="rounded-full w-[18px] h-[18px] bg-skin-bg block" />
        </div>
      </div>
    </div>
    <div>
      <Label label="Who can add a discussion?" sticky />
      <div class="flex flex-row flex-wrap gap-4 p-4">
        <div class="border border-skin-link rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Anyone</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Need to hold a token</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Need to hold an NFT</b>
        </div>
      </div>
    </div>
    <div>
      <Label label="Who can reply?" sticky />
      <div class="flex flex-row flex-wrap gap-4 p-4">
        <div class="border border-skin-link rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Anyone</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Need to hold a token</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Need to hold an NFT</b>
        </div>
      </div>
    </div>
    <div>
      <Label label="Who can vote?" sticky />
      <div class="flex flex-row flex-wrap gap-4 p-4">
        <div class="border border-skin-link rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Anyone</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Need to hold a token</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>Need to hold an NFT</b>
        </div>
      </div>
    </div>
    <div>
      <Label label="What's the voting power?" sticky />
      <div class="flex flex-row flex-wrap gap-4 p-4">
        <div class="border border-skin-link rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>1 per account</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>1 voting power per token</b>
        </div>
        <div class="border rounded-lg px-4 py-3 w-[240px] h-[60px]">
          <b>1 voting power per NFT</b>
        </div>
      </div>
    </div>
    <div class="px-4 mt-3">
      <UiButton primary> Save </UiButton>
    </div>
  </div>
</template>
