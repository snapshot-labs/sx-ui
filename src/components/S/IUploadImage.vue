<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useImageUpload } from '@/composables/useImageUpload';

const emit = defineEmits(['image-uploaded', 'image-remove']);

const fileInput = ref<HTMLInputElement | null>(null);

function openFilePicker() {
  fileInput.value?.click();
}

const uploadSuccess = ref(false);
const previewFile = ref<File | undefined>(undefined);
const previewUrl = ref<string | undefined>(undefined);

const { upload, isUploadingImage } = useImageUpload();

function handleFileChange(e: Event) {
  uploadSuccess.value = false;
  if ((e.target as HTMLInputElement).files?.[0]) {
    previewFile.value = (e.target as HTMLInputElement).files?.[0];
    previewUrl.value = URL.createObjectURL(previewFile.value as File);
  }

  upload(previewFile.value, image => {
    uploadSuccess.value = true;
    console.log('image.url', image.url);
    emit('image-uploaded', image.url);
  });
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <div v-bind="$attrs" @click="openFilePicker()">
    <slot
      name="avatar"
      :uploading="isUploadingImage"
      :preview-file="uploadSuccess ? previewFile : undefined"
      :preview-url="previewUrl"
    />
  </div>
  <input
    ref="fileInput"
    type="file"
    accept="image/jpg, image/jpeg, image/png"
    style="display: none"
    @change="handleFileChange"
  />
</template>
