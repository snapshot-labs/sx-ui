<script setup lang="ts">
const props = defineProps<{
  modelValue?: number;
  error?: string;
  definition: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number);
}>();

const DAYS = new Array(31 + 1).fill(0).map((_, i) => i);
const HOURS = new Array(24).fill(0).map((_, i) => i);
const MINUTES = new Array(60).fill(0).map((_, i) => i);

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);

watch([days, hours, minutes], () => {
  const value = (days.value * 24 * 60 + hours.value * 60 + minutes.value) * 60;
  emit('update:modelValue', value);
});

watch(
  () => props.modelValue,
  value => {
    if (!value) return;

    days.value = Math.floor(value / (24 * 60 * 60));
    hours.value = Math.floor((value % (24 * 60 * 60)) / (60 * 60));
    minutes.value = Math.floor((value % (60 * 60)) / 60);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-text="definition.title" />
    <div class="flex gap-3">
      <SBase :definition="{ title: 'Days' }" class="flex-1">
        <select v-model="days" class="s-input">
          <option v-for="day in DAYS" :key="day" :value="day">
            {{ day }}
          </option>
        </select>
      </SBase>
      <SBase :definition="{ title: 'Hours' }" class="flex-1">
        <select v-model="hours" class="s-input">
          <option v-for="hour in HOURS" :key="hour" :value="hour">
            {{ hour }}
          </option>
        </select>
      </SBase>
      <SBase :definition="{ title: 'Minutes' }" class="flex-1">
        <select v-model="minutes" class="s-input">
          <option v-for="minute in MINUTES" :key="minute" :value="minute">
            {{ minute }}
          </option>
        </select>
      </SBase>
    </div>
  </div>
</template>
