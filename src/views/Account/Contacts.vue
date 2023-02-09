<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useContactsStore } from '@/stores/contacts';

const contactsStore = useContactsStore();

const modalState: Ref<{
  editContact?: any;
}> = ref({});

const modalOpen = ref({
  editContact: false
});
const contactOver = ref();

function openModal(type: 'editContact') {
  modalOpen.value[type] = true;
  modalState.value[type] = null;
}

function onContactClick(contact) {
  modalState.value.editContact = contact;
  modalOpen.value.editContact = true;
}
</script>

<template>
  <div>
    <div class="flex">
      <div class="flex-auto" />
      <div class="pt-4 px-4 space-x-2">
        <a>
          <UiButton class="!px-0 w-[46px]" @click="openModal('editContact')">
            <IH-plus class="inline-block" />
          </UiButton>
        </a>
      </div>
    </div>
    <Label label="Contacts" />
    <div
      v-for="contact in contactsStore.contacts"
      :key="contact.address"
      class="px-4 py-3 border-b flex"
      @mouseover="contactOver = contact.address"
      @mouseleave="contactOver = null"
    >
      <div class="flex-auto flex items-center min-w-0" @click="onContactClick(contact)">
        <Stamp :id="contact.address" type="token" :size="32" />
        <div class="flex flex-col ml-3 leading-[22px] min-w-0 pr-2 md:pr-0">
          <h4 class="text-skin-link" v-text="contact.name" />
          <div class="text-sm truncate" v-text="contact.address" />
        </div>
      </div>
      <div class="flex-col items-end text-right leading-[22px] min-h-[46px] w-auto md:w-[180px]">
        <UiButton
          v-show="contactOver === contact.address"
          class="!px-0 w-[46px]"
          @click="contactsStore.deleteContact(contact.address)"
        >
          <IH-trash class="inline-block" />
        </UiButton>
      </div>
    </div>
  </div>
  <teleport to="#modal">
    <ModalContactEditor
      :open="modalOpen.editContact"
      :initial-state="modalState.editContact"
      @close="modalOpen.editContact = false"
    />
  </teleport>
</template>
