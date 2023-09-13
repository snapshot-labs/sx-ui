<script setup lang="ts">
import { _n } from '@/helpers/utils';

defineProps<{ topic: any }>();
</script>

<template>
  <div class="flex justify-between items-center mx-4 py-3 border-b">
    <Score :topic="topic" class="mr-3" />
    <router-link :to="{ name: 'topic', params: { topic: topic.id } }" class="flex-1">
      <h3 class="text-skin-link" v-text="topic.title" />
      <div class="text-skin-text space-x-2">
        <Stamp :id="topic.author.id" :size="18" class="mr-1" />
        <IH-annotation class="inline-block" />
        <span>{{ _n(topic.reply_count) }} comments</span>
      </div>
    </router-link>
  </div>
</template>
