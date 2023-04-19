<script setup lang="ts">
const emit = defineEmits(['image-uploaded', 'image-remove']);

const { upload, isUploadingImage } = useImageUpload();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadSuccess = ref(false);
const previewFile = ref<File | undefined>(undefined);
const previewUrl = ref<string | undefined>(undefined);

function openFilePicker() {
  if (isUploadingImage.value) return;
  fileInput.value?.click();
}

function handleFileChange(e: Event) {
  uploadSuccess.value = false;
  if ((e.target as HTMLInputElement).files?.[0]) {
    previewFile.value = (e.target as HTMLInputElement).files?.[0];
    previewUrl.value = URL.createObjectURL(previewFile.value as File);
  }
}

function uploadFile() {
  return new Promise<void>(resolve => {
    upload(previewFile.value, image => {
      uploadSuccess.value = true;
      console.log('image.url', image.url);
      emit('image-uploaded', image.url);
      resolve();
    });
  });
}

defineExpose({
  previewFile,
  previewUrl,
  uploadFile
});

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
      :preview-file="previewFile"
      :preview-url="previewUrl"
    />
  </div>
  <input
    ref="fileInput"
    type="file"
    accept="image/jpg, image/jpeg, image/png"
    class="hidden"
    @change="handleFileChange"
  />
</template>
