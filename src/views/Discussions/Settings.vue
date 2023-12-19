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
    <Label label="Permissions" sticky class="mb-4" />
    <div>
      <h3 class="px-4">Who can add a topic?</h3>
      <CategoryValidations />
    </div>
    <div>
      <h3 class="px-4">Who can comment?</h3>
      <CategoryValidations />
    </div>
    <div>
      <h3 class="px-4">Who can vote?</h3>
      <CategoryValidations />
    </div>
    <div>
      <h3 class="px-4">How voting power works?</h3>
      <div class="flex flex-row flex-wrap gap-3 p-4">
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
