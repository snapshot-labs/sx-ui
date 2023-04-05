import scrollMonitor from 'scrollmonitor';

export function useScrollMonitor(fn) {
  let elementWatcher;

  const endElement = ref(null);

  onMounted(() => {
    // @ts-ignore
    elementWatcher = scrollMonitor.create(endElement.value);
    elementWatcher.enterViewport(() => {
      fn();
    });
  });

  onBeforeUnmount(() => elementWatcher.destroy());

  return { endElement };
}
