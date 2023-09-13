<script setup lang="ts">
import { ref } from 'vue';
import { faker } from '@faker-js/faker';
import { client } from '@/helpers/client';

const props = defineProps<{ reply: any }>();

const { web3 } = useWeb3();

const content = ref(faker.lorem.lines(1));
const loading = ref(false);

async function handleSubmit() {
  loading.value = true;
  const account = web3.value.account;

  const result = await client.discussions.addTopic({
    author: account,
    category: props.reply.category.id,
    title: '',
    content: content.value,
    parent: parseInt(props.reply.id)
  });

  content.value = '';
  loading.value = false;
  console.log('Result', result);
}
</script>

<template>
  <div class="pt-3 flex">
    <div class="w-[40px] mr-3" />
    <div class="s-base items-center flex-1 s-box max-w-[650px]">
      <textarea
        v-model="content"
        :disabled="loading"
        class="s-input !py-[12px] h-[108px]"
        placeholder="Type content here"
      />
      <UiButton :loading="loading" @click="handleSubmit">Submit</UiButton>
    </div>
  </div>
</template>
