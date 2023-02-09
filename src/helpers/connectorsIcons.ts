import ethereumIcon from '@/assets/connectors/ethereum.png';
import metamaskIcon from '@/assets/connectors/metamask.png';
import walletconnectIcon from '@/assets/connectors/walletconnect.png';
import coinbaseIcon from '@/assets/connectors/coinbase.png';
import portisIcon from '@/assets/connectors/portis.png';
import gnosisIcon from '@/assets/connectors/gnosis.png';
import argentxIcon from '@/assets/connectors/argentx.png';
import { getUrl } from '@/helpers/utils';

const aliases = {
  'ipfs://QmXUov1JMszHkizCf3HvmcKWKm9PrG2KHpd5bDnE5YbZN8': ethereumIcon,
  'ipfs://QmTE7VPXMhriKAobMWEiC5S3oG22p4G6AXGyGdNWQTQ3Fv': metamaskIcon,
  'ipfs://QmZRVqHpgRemw13aoovP2EaQdVtjzXRaQGQZsCLXWaNn9x': walletconnectIcon,
  'ipfs://QmbJKEaeMz6qR3DmJSTxtYtrZeQPptVfnnYK72QBsvAw5q': coinbaseIcon,
  'ipfs://QmNuLXa47xSrDNKRfpPNhoFTuoztvtWCcwGnPpT5MXJWMb': portisIcon,
  'ipfs://QmfJUHZLtRvadM7fvEJUWWxhS869KXXCMxPCr7TUqkwvUc': gnosisIcon,
  'ipfs://QmYfjt7VZzb4LfudhFH5YDdKSaJQ1xMGRriDHPwceKQs2U': argentxIcon
};

export function getLocalUrl(url) {
  return aliases[url] || getUrl(url);
}
