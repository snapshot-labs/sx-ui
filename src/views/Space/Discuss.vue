<script setup lang="ts">
import { ref } from 'vue';
import { discuss } from '@/helpers/highlight';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import { useRoute } from 'vue-router';

const route = useRoute();
const { web3 } = useWeb3();
const auth = getInstance();

const id = route.params.id;

const discussion = ref({
  category: 1,
  title: '',
  content: ''
});

async function handleSubmit() {
  const account = web3.value.account;
  const message = {
    author: account,
    space: id,
    category: discussion.value.category,
    title: discussion.value.title,
    content: discussion.value.content,
    created: (Date.now() / 1e3).toFixed()
  };
  const result = await discuss(auth.web3.getSigner(), message);
  console.log('OK!', result);
}
</script>

<template>
  <div class="s-box max-w-[650px] px-4 pt-5">
    <h3 class="mb-3" v-text="'New discussion'" />
    <SIString
      v-model="discussion.title"
      :definition="{
        type: 'string',
        title: 'Title',
        examples: ['Type title']
      }"
    />
    <div class="s-base mb-3">
      <div class="s-label" v-text="'Category'" />
      <select
        v-model="discussion.category"
        class="w-full bg-skin-border px-[12px] rounded-lg pt-[20px] text-skin-link"
      >
        <option value="1">Consensus check</option>
        <option value="2">Delegation pitch</option>
        <option value="3">Site feedback</option>
        <option value="4">Uncategorized</option>
      </select>
    </div>
    <div class="s-base mb-3">
      <div class="s-label" v-text="'Content'" />
      <textarea
        v-model="discussion.content"
        maxlength="9600"
        class="s-input mb-3 h-[240px]"
        placeholder="Type content here"
      />
    </div>
    <UiButton class="button-outline" @click="handleSubmit"> Submit </UiButton>
  </div>
</template>
