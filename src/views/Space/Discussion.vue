<script setup lang="ts">
import { shorten } from '@/helpers/utils';
import forum from '@/helpers/forum.json';

const route = useRoute();
const id = route.params.discussion as string;

const discussion = forum.discussions[id];
</script>

<template>
  <div class="space-y-4">
    <div>
      <div class="mx-4 pt-5">
        <div>
          <h1 v-text="discussion.title" />
          <router-link :to="{ name: 'space-discussions' }">
            {{ forum.categories[0].title }}
          </router-link>
        </div>
        <Reply :reply="discussion" />
        <Reply v-for="(reply, i) in forum.replies" :key="i" :reply="reply" />
      </div>
    </div>
  </div>
</template>
