<script setup lang="ts">
import { ref } from 'vue';
import { _n } from '@/helpers/utils';
import { apollo, CATEGORIES_QUERY, LATEST_DISCUSSIONS_QUERY } from '@/helpers/api';
import { Space } from '@/types';

defineProps<{ space: Space }>();

const loadingCategories = ref<boolean>(false);
const loadingDiscussions = ref<boolean>(false);
const loadedCategories = ref<boolean>(false);
const loadedDiscussions = ref<boolean>(false);
const categories = ref<any[]>([]);
const discussions = ref<any[]>([]);

async function loadCategories() {
  loadingCategories.value = true;

  const { data } = await apollo.query({
    query: CATEGORIES_QUERY
  });

  categories.value = data.categories;
  loadingCategories.value = false;
  loadedCategories.value = true;
}

async function loadDiscussions() {
  loadingDiscussions.value = true;

  const { data } = await apollo.query({
    query: LATEST_DISCUSSIONS_QUERY
  });

  discussions.value = data.discussions;
  loadingDiscussions.value = false;
  loadedDiscussions.value = true;
}

onMounted(() => {
  loadCategories();
  loadDiscussions();
});
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto" />
    <router-link :to="{ name: 'new-category' }">
      <UiTooltip title="New category">
        <UiButton class="!px-0 w-[46px]">
          <IH-plus-sm class="inline-block" />
        </UiButton>
      </UiTooltip>
    </router-link>
    <UiTooltip title="Settings">
      <UiButton class="!px-0 w-[46px]">
        <IH-cog class="inline-block" />
      </UiButton>
    </UiTooltip>
  </div>
  <div class="space-y-4">
    <div>
      <Label label="Categories" sticky />
      <UiLoading v-if="loadingCategories && !loadedCategories" class="px-4 py-3 block" />
      <div
        v-else-if="loadedCategories && categories.length === 0"
        class="px-4 py-3 flex items-center text-skin-link"
      >
        <IH-exclamation-circle class="inline-block mr-2" />
        There are no categories.
      </div>
      <div v-else>
        <router-link
          v-for="(category, i) in categories"
          :key="i"
          :to="{ name: 'discussions-category', params: { category: category.category_id } }"
          class="flex justify-between items-center mx-4 py-3 border-b"
        >
          <div>
            <div
              class="w-[48px] h-[48px] bg-skin-border rounded-lg items-center justify-center flex mr-3"
            >
              <IH-folder class="inline-block" />
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-skin-link" v-text="category.name" />
            <div class="text-skin-text space-x-2">
              <span>{{ _n(category.discussion_count) }} discussion(s)</span>
            </div>
          </div>
          <div>
            <span
              v-if="category.discussion_count > 4"
              class="w-[8px] h-[8px] bg-blue rounded-full inline-block mb-1"
            />
          </div>
        </router-link>
      </div>
    </div>
    <div>
      <Label label="Latest discussions" sticky />
      <UiLoading v-if="loadingDiscussions && !loadedDiscussions" class="px-4 py-3 block" />
      <div
        v-else-if="loadedDiscussions && discussions.length === 0"
        class="px-4 py-3 flex items-center text-skin-link"
      >
        <IH-exclamation-circle class="inline-block mr-2" />
        There are no discussions.
      </div>
      <div v-else>
        <Discussion v-for="(discussion, i) in discussions" :key="i" :discussion="discussion" />
      </div>
    </div>
  </div>
</template>
