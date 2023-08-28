<script setup lang="ts">
import { ref } from 'vue';
import { Space } from '@/types';

defineProps<{ space: Space }>();

const roles = ref<any[]>([
  {
    id: 1,
    name: 'Admin',
    count: 3,
    members: [
      '0xeF8305E140ac520225DAf050e2f71d5fBcC543e7',
      '0x4C7909d6F029b3a5798143C843F4f8e5341a3473',
      '0xdD36Aa96D9BD4b49DA6E6734fF18Cc69F90F9435'
    ]
  },
  {
    id: 2,
    name: 'Moderator',
    count: 2,
    members: [
      '0x47D5592606622D807F3B37E5e5C8268355E30925',
      '0xae25aD6cba120fc1497feA5B516C8E80a6B69726'
    ]
  },
  {
    id: 3,
    name: 'Delegate',
    count: 45,
    members: [
      '0x6e0d9c6dd8a08509bb625caa35dc61a991406f62',
      '0x839395e20bbb182fa440d08f850e6c7a8f6f0780',
      '0x54becc7560a7be76d72ed76a1f5fee6c5a2a7ab6',
      '0x8b3347fd0b8c3a619d1f1fdc90caf4f335c03742',
      '0xb8c2c29ee19d8307cb7255e1cd9cbde883a267d5'
    ]
  },
  {
    id: 4,
    name: 'Council',
    count: 6,
    members: [
      '0xb0ca2e19356f763721110b2e0b318883df844cbc',
      '0x815fd2ba302de5fa849469b1511e34e9d8fbb51d',
      '0x29a82e07b96c405ac99a8023f767d2971546de70',
      '0xaa7a9d80971e58641442774c373c94aafee87d66',
      '0x98198144498f4be0903babb6920eaa5797231e63'
    ]
  }
]);
</script>

<template>
  <div class="p-4 space-x-2 flex">
    <div class="flex-auto" />
    <div>
      <UiTooltip title="Add a role">
        <UiButton class="!px-0 w-[46px]">
          <IH-plus-sm class="inline-block" />
        </UiButton>
      </UiTooltip>
    </div>
  </div>
  <div>
    <Label label="Roles" sticky />
    <div
      v-for="role in roles"
      :key="role.id"
      class="flex justify-between items-center mx-4 py-3 border-b text-skin-text"
    >
      <div class="flex-1 leading-[22px]">
        <h3 class="text-skin-link" v-text="role.name" />
      </div>
      <div class="text-sm">
        <Stamp
          v-for="(member, i) in role.members"
          :id="member"
          :key="i"
          :size="35"
          class="-mr-2 border-skin-bg border-[3px]"
        />
      </div>
      <div class="text-sm w-[120px] text-right" v-text="`${role.count} members`" />
    </div>
  </div>
</template>
