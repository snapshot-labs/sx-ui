import { createPinia } from 'pinia';
import { UseWagmiPlugin } from 'use-wagmi';
import wagmiConfig from '@/helpers/wagmiConfig';
import App from '@/App.vue';
import router from '@/router';
import '@/style.scss';

const knownHosts = ['app.safe.global', 'pilot.gnosisguild.org'];
const parentUrl =
  window.location != window.parent.location
    ? document.referrer ||
      document.location.ancestorOrigins[document.location.ancestorOrigins.length - 1]
    : document.location.href;
const parentHost = new URL(parentUrl).host;
if (window !== window.parent && !knownHosts.includes(parentHost)) {
  document.documentElement.style.display = 'none';
  throw new Error(`Unknown host: ${parentHost}`);
}

const pinia = createPinia();
const app = createApp({ render: () => h(App) })
  .use(router)
  .use(pinia)
  .use(UseWagmiPlugin, wagmiConfig);

app.mount('#app');

export default app;
