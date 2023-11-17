import { Connector } from 'use-wagmi';
import type { ConnectOptions, StarknetWindowObject } from '@argent/get-starknet';
import { createWalletClient, custom } from 'viem';
import sn from 'get-starknet-core';

export class ArgentXWalletConnector extends Connector<StarknetWindowObject, ConnectOptions> {
  readonly id = 'argentx';
  readonly name = 'Starknet';
  readonly ready = true;

  #provider?: StarknetWindowObject;

  constructor(config: { options: ConnectOptions; chains?: any[] }) {
    super(config);
  }

  async connect() {
    const { connect } = await import('@argent/get-starknet');
    const provider = await connect(this.options);
    if (!provider) {
      throw Error('User rejected wallet selection or silent connect found nothing');
    }

    this.#provider = provider;

    provider.on('accountsChanged', this.onAccountsChanged);
    provider.on('networkChanged', this.onChainChanged);

    this.emit('message', { type: 'connecting' });

    await provider.enable({ starknetVersion: 'v4' });
    if (!provider.isConnected) throw Error('Failed to connect to wallet');

    const account = provider.selectedAddress as `0x${string}`;
    const id = await this.getChainId();

    return { account, chain: { id, unsupported: false } };
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
      const wallet = await sn.getLastConnectedWallet();
      if (!wallet) throw Error('No wallet found');

      this.#clearPreviousLocalStorage();

      await wallet.enable({ starknetVersion: 'v4' });
      if (!wallet?.isConnected) throw Error('Failed to connect to wallet');

      this.#provider = wallet;
    }
    return this.#provider;
  }

  async getWalletClient(): Promise<any> {
    const [provider, account] = await Promise.all([this.getProvider(), this.getAccount()]);
    if (!provider) throw new Error('Provider is required.');
    return createWalletClient({
      account,
      transport: custom(provider)
    });
  }

  async getAccount() {
    const { selectedAddress } = await this.getProvider();

    return selectedAddress as `0x${string}`;
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }

  #clearPreviousLocalStorage() {
    // When reloading the page, the previous wallet was still in localStorage
    // this would prevent disconnecting from the wallet
    Object.keys(localStorage)
      .filter(sk => sk.startsWith('gsw-last'))
      .forEach(sk => {
        localStorage.removeItem(sk);
      });
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect');
    else this.emit('change', { account: accounts[0] as `0x${string}` });
  };

  protected onChainChanged = (chainId: string | any) => {
    this.emit('change', { chain: { id: chainId, unsupported: false } });
  };

  protected onDisconnect = async () => {
    this.emit('disconnect');
    const { disconnect } = await import('@argent/get-starknet');

    disconnect({ clearLastWallet: true });
  };
}
