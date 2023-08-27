<script setup lang="ts">
import { ref } from 'vue';
import { faker } from '@faker-js/faker';
import { editProfile } from '@/helpers/highlight';

const { web3 } = useWeb3();

const profile = ref({
  name: faker.person.firstName(),
  about: faker.lorem.paragraph(3)
});
const loading = ref<boolean>(false);

async function handleSubmit() {
  loading.value = true;
  const account = web3.value.account;

  const receipt = await editProfile({
    user: account,
    name: profile.value.name,
    about: profile.value.about
  });

  console.log('Receipt', receipt);
  loading.value = false;
}
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto flex items-center space-x-3">
      <h3 v-text="'My profile'" />
    </div>
  </div>
  <div class="s-box max-w-[650px] px-4">
    <SIString
      v-model="profile.name"
      :disabled="loading"
      :definition="{
        type: 'string',
        title: 'Name',
        examples: ['Type your name']
      }"
    />
    <div class="s-base mb-3">
      <div class="s-label" v-text="'About'" />
      <textarea
        v-model="profile.about"
        :disabled="loading"
        maxlength="200"
        class="s-input mb-3 h-[130px]"
        placeholder="Type about here"
      />
    </div>
    <UiButton :loading="loading" class="button-outline" @click="handleSubmit"> Submit </UiButton>
  </div>
</template>
