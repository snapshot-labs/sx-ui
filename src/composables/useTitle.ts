const DEFAULT_TITLE = 'Snapshot X';

export function useTitle() {
  const setTitle = (newTitle: string) => {
    document.title = newTitle;
  };

  onBeforeUnmount(() => {
    document.title = DEFAULT_TITLE;
  });

  return {
    setTitle
  };
}
