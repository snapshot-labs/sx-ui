<script setup lang="ts">
import { ref } from 'vue';

const tab = ref('controlled');
const tabs = [
  { id: 'controlled', name: 'Controlled' },
  { id: 'voted', name: 'Voted' },
  { id: 'proposed', name: 'Proposed' }
];
</script>

<template>
  <div>
    <!-- TODO refactor to tabs -->
    <div class="flex flex-row w-full justify-start border-b sticky top-[72px] bg-skin-bg">
      <h4
        v-for="t in tabs"
        :key="t.id"
        class="eyebrow py-2 px-4 cursor-pointer"
        :class="{ 'text-skin-text': t.id !== tab }"
        @click="tab = t.id"
        v-text="t.name"
      />
    </div>
    <template v-if="tab === 'controlled'">
      <div v-for="i in 12" :key="i" class="w-full border-b p-4">{{ i }} space i control</div>
    </template>
    <template v-if="tab === 'voted'">
      <div v-for="i in 10" :key="i" class="w-full border-b p-4">{{ i }} space where i voted</div>
    </template>
    <template v-if="tab === 'proposed'">
      <div v-for="i in 5" :key="i" class="w-full border-b p-4">
        {{ i }} space where i created a proposal
      </div>
    </template>
  </div>
</template>
