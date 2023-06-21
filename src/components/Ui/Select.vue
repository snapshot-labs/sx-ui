<script setup lang="ts">
import { Menu, MenuButton, MenuItems } from '@headlessui/vue';

type Item = {
  key: string;
  label: string;
  indicator?: string;
};

const props = defineProps<{
  modelValue: string;
  items: Item[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const currentItem = computed(() => props.items.find(item => item.key === props.modelValue));
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton as="template" class="cursor-pointer">
      <button
        class="flex items-center gap-2 relative rounded-full leading-[100%] border button px-[20px] min-w-[80px] h-[42px] top-1 outline-0 text-skin-link bg-skin-bg"
      >
        <div class="absolute top-[-10px] bg-skin-bg px-1 left-[16px] text-[16px] text-skin-text">
          Status
        </div>
        <template v-if="currentItem">
          <div
            v-if="currentItem.indicator"
            class="w-[8px] h-[8px] rounded-full"
            :class="{
              [currentItem.indicator]: true
            }"
          />
          {{ currentItem.label }}
        </template>
      </button>
    </MenuButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="min-w-fit z-50 absolute left-0 right-0 mt-2 origin-top-left rounded-md bg-skin-bg border text-skin-link shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <UiDropdownItem v-for="item in items" :key="item.key" v-slot="{ active, disabled }">
          <button
            class="flex items-center gap-2"
            :class="{ 'opacity-80': active, 'opacity-40': disabled }"
            @click="() => emit('update:modelValue', item.key)"
          >
            <div
              v-if="item.indicator"
              class="w-[8px] h-[8px] rounded-full"
              :class="{
                [item.indicator]: true
              }"
            />
            {{ item.label }}
          </button>
        </UiDropdownItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
