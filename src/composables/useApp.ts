const initializedApp = ref(false);

export function useApp() {
  async function init() {
    initializedApp.value = true;
  }

  return {
    init,
    initializedApp: computed(() => initializedApp.value)
  };
}
