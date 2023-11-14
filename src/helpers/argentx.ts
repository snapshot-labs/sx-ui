import { Connector } from 'use-wagmi';
import argentx, { ConnectOptions, StarknetWindowObject } from '@argent/get-starknet';
import { createWalletClient, custom } from 'viem';

export class ArgentXWalletConnector extends Connector<StarknetWindowObject, ConnectOptions> {
  readonly id = 'argentx';
  readonly name = 'argentx';
  readonly ready = true;

  #provider?: StarknetWindowObject;

  constructor(config: { chains?: []; options: ConnectOptions }) {
    super(config);
  }

  async connect() {
    try {
      const provider = await this.getProvider();
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('networkChanged', this.onChainChanged);

      this.emit('message', { type: 'connecting' });

      await provider.enable({ starknetVersion: 'v4' });

      if (!provider.isConnected) {
        throw new Error('Connector was not connected');
      }

      const account = provider.selectedAddress as `0x${string}`;
      const id = await this.getChainId();

      return { account, chain: { id, unsupported: false } };
    } catch (error) {
      throw error;
    }
  }

  async disconnect() {
    if (!this.#provider) return;

    this.onDisconnect();
  }

  async getChainId() {
    const provider = await this.getProvider();
    const chainId = provider.provider.getChainId();
    return chainId;
  }

  async getProvider() {
    if (!this.#provider) {
      const provider = await argentx.connect(this.options);

      if (!provider) {
        throw Error('User rejected wallet selection or silent connect found nothing');
      }

      this.#provider = provider ?? undefined;
    }
    return this.#provider;
  }

  async getWalletClient(): Promise<any> {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
    if (!provider) throw new Error('provider is required.');
    return createWalletClient({
      account,
      chain: { id: 'starknet', name: 'starknet' } as any,
      transport: custom(provider)
    });
  }

  async getAccount() {
    const provider = await this.getProvider();

    return provider.selectedAddress as `0x${string}`;
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect');
    else this.emit('change', { account: accounts[0] as `0x${string}` });
  };

  protected onChainChanged = (chainId: string | any) => {
    this.emit('change', { chain: { id: chainId, unsupported: false } });
  };

  protected onDisconnect = () => {
    this.emit('disconnect');
  };
}
