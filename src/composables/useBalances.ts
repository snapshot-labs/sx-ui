import { formatUnits } from '@ethersproject/units';
import { getBalances, GetBalancesResponse } from '@/helpers/alchemy';
import { METADATA } from '@/networks/evm';
import {
  ETH_CONTRACT,
  COINGECKO_ASSET_PLATFORMS,
  COINGECKO_BASE_ASSETS
} from '@/helpers/constants';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple';
const COINGECKO_PARAMS = '&vs_currencies=usd&include_24hr_change=true';

export const METADATA_BY_CHAIN_ID = new Map(
  Object.entries(METADATA).map(([, metadata]) => [metadata.chainId, metadata])
);

export function useBalances() {
  const assets: Ref<GetBalancesResponse> = ref([]);
  const loading = ref(true);
  const loaded = ref(false);

  async function callCoinGecko(apiUrl: string) {
    const res = await fetch(apiUrl);
    return res.json();
  }

  async function getCoins(assetPlatform: string, baseToken: string, contractAddresses: string[]) {
    const [baseTokenData, tokenData] = await Promise.all([
      callCoinGecko(`${COINGECKO_API_URL}/price?ids=${baseToken}${COINGECKO_PARAMS}`),
      callCoinGecko(
        `${COINGECKO_API_URL}/token_price/${assetPlatform}?contract_addresses=${contractAddresses.join(
          ','
        )}${COINGECKO_PARAMS}`
      )
    ]);

    return {
      [ETH_CONTRACT]: baseTokenData[baseToken],
      ...tokenData
    };
  }

  async function loadBalances(address: string, networkId: number) {
    const metadata = METADATA_BY_CHAIN_ID.get(networkId);
    const baseToken = metadata?.ticker
      ? { name: metadata.name, symbol: metadata.ticker }
      : { name: 'Ethereum', symbol: 'ETH' };

    const data = await getBalances(address, networkId, baseToken);
    const tokensWithBalance = data.filter(
      asset => formatUnits(asset.tokenBalance, asset.decimals) !== '0.0'
    );

    const coingeckoAssetPlatform = COINGECKO_ASSET_PLATFORMS[networkId];
    const coingeckoBaseAsset = COINGECKO_BASE_ASSETS[networkId];

    const coins =
      coingeckoBaseAsset && coingeckoAssetPlatform
        ? await getCoins(
            coingeckoAssetPlatform,
            coingeckoBaseAsset,
            tokensWithBalance
              .filter(asset => asset.contractAddress !== ETH_CONTRACT)
              .map(token => token.contractAddress)
          )
        : [];

    assets.value = tokensWithBalance.map(asset => {
      if (!coins[asset.contractAddress]) return asset;

      const price = coins[asset.contractAddress]?.usd || 0;
      const change = coins[asset.contractAddress]?.usd_24h_change || 0;
      const value = parseFloat(formatUnits(asset.tokenBalance, asset.decimals)) * price;

      return {
        ...asset,
        price,
        change,
        value
      };
    });

    loading.value = false;
    loaded.value = true;
  }

  const assetsMap = computed(
    () => new Map(assets.value.map(asset => [asset.contractAddress, asset]))
  );

  return { loading, loaded, assets, assetsMap, loadBalances };
}
