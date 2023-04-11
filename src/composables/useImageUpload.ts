import { ref } from 'vue';
import { upload as pin } from '@snapshot-labs/pineapple';

const isUploadingImage = ref(false);

export function useImageUpload() {
  const imageUploadError = ref('');
  const imageUrl = ref('');
  const imageName = ref('');

  const reset = () => {
    isUploadingImage.value = false;
    imageUploadError.value = '';
    imageUrl.value = '';
    imageName.value = '';
  };

  const upload = async (
    file: File | undefined,
    onSuccess: (image: { name: string; url: string }) => void
  ) => {
    reset();
    if (!file) return;
    isUploadingImage.value = true;
    const formData = new FormData();

    // TODO: Additional Validations - File Size, File Type, Empty File, Hidden File

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      // TODO: add i18n for errors
      imageUploadError.value = 'Unsupported file type';
      isUploadingImage.value = false;
      return;
    }
    formData.append('file', file);
    try {
      const receipt = await pin(formData);
      imageUrl.value = `ipfs://${receipt.cid}`;
      imageName.value = file.name;
      onSuccess({ name: file.name, url: imageUrl.value });
    } catch (err) {
      // TODO: add notify
      imageUploadError.value = (err as Error).message;
    } finally {
      isUploadingImage.value = false;
    }
  };

  return {
    isUploadingImage,
    imageUploadError,
    image: {
      url: imageUrl,
      name: imageName
    },
    upload
  };
}
