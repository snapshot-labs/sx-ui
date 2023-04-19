import { ref } from 'vue';
import { upload as pin } from '@snapshot-labs/pineapple';

export function useImageUpload() {
  const isUploadingImage = ref(false);
  const imageUploadError = ref('');
  const imageUrl = ref('');
  const imageName = ref('');

  const reset = () => {
    isUploadingImage.value = false;
    imageUploadError.value = '';
    imageUrl.value = '';
    imageName.value = '';
  };

  const upload = async (file: File | undefined) => {
    reset();
    if (!file) return;
    isUploadingImage.value = true;

    // TODO: Additional Validations - File Size, File Type, Empty File, Hidden File
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      imageUploadError.value = 'Unsupported file type';
      isUploadingImage.value = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    try {
      const receipt = await pin(formData);
      imageUrl.value = `ipfs://${receipt.cid}`;
      imageName.value = file.name;
      return { name: file.name, url: imageUrl.value };
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
