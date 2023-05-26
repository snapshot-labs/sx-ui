<script setup lang="ts">
import { ref } from 'vue';
import { faker } from '@faker-js/faker';
import { addCategory } from '@/helpers/highlight';
import { sleep } from '@/helpers/utils';

const router = useRouter();

const category = ref({
  name: faker.lorem.sentence({ min: 1, max: 3 }).slice(0, -1),
  about: faker.lorem.paragraph(3)
});
const loading = ref<boolean>(false);

async function handleSubmit() {
  loading.value = true;

  const result = await addCategory({
    name: category.value.name,
    about: category.value.about,
    parent: 0
  });

  await sleep(2e3);

  console.log('Result', result);
  loading.value = false;
  router.push({ name: 'space-discussions' });
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
      <h3 v-text="'New category'" />
    </div>
  </div>
  <div class="s-box max-w-[650px] px-4">
    <SIString
      v-model="category.name"
      :disabled="loading"
      :definition="{
        type: 'string',
        title: 'Name',
        examples: ['Type category name']
      }"
    />
    <div class="s-base mb-3">
      <div class="s-label" v-text="'About'" />
      <textarea
        v-model="category.about"
        :disabled="loading"
        maxlength="200"
        class="s-input mb-3 h-[130px]"
        placeholder="Type about here"
      />
    </div>
    <UiButton :loading="loading" class="button-outline" @click="handleSubmit"> Submit </UiButton>
  </div>
</template>
