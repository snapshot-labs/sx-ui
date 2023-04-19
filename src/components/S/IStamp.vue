<script setup lang="ts">
import { getUrl } from '@/helpers/utils';

const props = defineProps<{
  modelValue?: string;
  error?: string;
  definition: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string);
}>();

const { upload, isUploadingImage } = useImageUpload();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadSuccess = ref(false);

const imgUrl = computed(() => {
  if (!props.modelValue) return undefined;
  if (props.modelValue.startsWith('ipfs://')) return getUrl(props.modelValue);
  return props.modelValue;
});

function openFilePicker() {
  if (isUploadingImage.value) return;
  fileInput.value?.click();
}

function handleFileChange(e: Event) {
  uploadSuccess.value = false;
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    upload(file, image => {
      uploadSuccess.value = true;
      emit('update:modelValue', image.url);
    });
  }
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="relative h-[80px] group max-w-max cursor-pointer mb-3"
    @click="openFilePicker()"
  >
    <img
      v-if="imgUrl"
      :src="imgUrl"
      class="w-full min-w-[80px] h-full !rounded-lg"
      :class="{
        'opacity-80': isUploadingImage
      }"
    />
    <Stamp
      v-else
      :id="definition.default"
      :size="80"
      class="pointer-events-none border-[4px] border-skin-bg !bg-skin-bg !rounded-lg group-hover:opacity-80"
      type="space-sx"
      :class="{
        'opacity-80': isUploadingImage
      }"
    />
    <div
      class="pointer-events-none absolute group-hover:visible inset-0 z-10 flex flex-row w-full h-full items-center content-center justify-center"
    >
      <UiLoading v-if="isUploadingImage" class="block z-5" />
      <IH-pencil v-else class="invisible text-skin-link group-hover:visible" />
    </div>
  </div>
  <input
    ref="fileInput"
    type="file"
    accept="image/jpg, image/jpeg, image/png"
    class="hidden"
    @change="handleFileChange"
  />
</template>
