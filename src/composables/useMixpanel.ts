import mixpanel from 'mixpanel-browser';

export function useMixpanel() {
  mixpanel.init('47b43858cf6fe9376f8deddda52cbaaf');

  return { mixpanel };
}
