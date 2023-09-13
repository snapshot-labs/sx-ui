<script setup lang="ts">
import { ref } from 'vue';
import { faker } from '@faker-js/faker';
import { client } from '@/helpers/client';

const { web3 } = useWeb3();
const router = useRouter();
const route = useRoute();

const category = parseInt(route.params.category as string);

const discussion = ref({
  title: faker.lorem.sentence({ min: 3, max: 8 }).slice(0, -1),
  content: faker.lorem.paragraphs({ min: 1, max: 4 })
});
const loading = ref<boolean>(false);

async function handleSubmit() {
  loading.value = true;
  const account = web3.value.account;

  const result = await client.discussions.addTopic({
    author: account,
    category,
    title: discussion.value.title,
    content: discussion.value.content,
    parent: 0
  });

  loading.value = false;
  console.log('Result', result);

  await router.push({ name: 'space-discussions', params: { category } });
}
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto flex items-center space-x-3">
      <router-link :to="{ name: 'space-discussions' }">
        <UiButton class="!px-0 w-[46px]">
          <IH-arrow-narrow-left class="inline-block" />
        </UiButton>
      </router-link>
      <h3 v-text="'New topic'" />
    </div>
  </div>
  <div class="s-box max-w-[650px] px-4">
    <SIString
      v-model="discussion.title"
      :definition="{
        type: 'string',
        title: 'Title',
        examples: ['Type title']
      }"
    />
    <div class="s-base mb-3">
      <div class="s-label" v-text="'Content'" />
      <textarea
        v-model="discussion.content"
        maxlength="9600"
        class="s-input mb-3 h-[240px]"
        placeholder="Type content here"
      />
    </div>
    <UiButton :loading="loading" class="button-outline" @click="handleSubmit"> Submit </UiButton>
  </div>
</template>
