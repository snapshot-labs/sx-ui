<script setup lang="ts">
import { _n } from '@/helpers/utils';

defineProps<{ discussion: any }>();
</script>

<template>
  <div class="flex justify-between items-center mx-4 py-3 border-b">
    <Score :discussion="discussion" class="mr-3" />
    <router-link
      :to="{ name: 'discussion', params: { discussion: discussion.discussion_id } }"
      class="flex-1"
    >
      <h3 class="text-skin-link" v-text="discussion.title" />
      <div class="text-skin-text space-x-2">
        <IH-annotation class="inline-block" />
        <span>{{ _n(discussion.reply_count) }} replies</span>
      </div>
    </router-link>
  </div>
</template>
