<script setup lang="ts">
import { shorten, _n } from '@/helpers/utils';
import forum from '@/helpers/forum.json';
import '@/helpers/highlight';
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto" />
    <router-link :to="{ name: 'discuss' }">
      <UiTooltip title="New discussion">
        <UiButton class="!px-0 w-[46px]">
          <IH-pencil-alt class="inline-block" />
        </UiButton>
      </UiTooltip>
    </router-link>
  </div>
  <div class="space-y-4">
    <div>
      <Label label="Categories" sticky />
      <a
        v-for="(category, i) in forum.categories"
        :key="i"
        class="flex justify-between items-center mx-4 py-3 border-b"
      >
        <div class="flex-1">
          <h3 class="text-skin-link" v-text="category.title" />
          <div class="text-skin-text text-sm" v-text="category.about" />
        </div>
        <h3 v-text="_n(category.discussions)" />
      </a>
    </div>
    <div>
      <Label label="Latest discussions" sticky />
      <router-link
        v-for="(discussion, i) in forum.discussions"
        :key="i"
        :to="{ name: 'discussion', params: { discussion: i } }"
        class="flex justify-between items-center mx-4 py-3 border-b"
      >
        <div class="flex-1">
          <h3 class="text-skin-link" v-text="discussion.title" />
          <div class="text-skin-text text-sm" v-text="shorten(discussion.author)" />
        </div>
        <h3 v-text="_n(discussion.comments)" />
      </router-link>
      <a class="px-4 py-2 block">See more</a>
    </div>
  </div>
</template>
