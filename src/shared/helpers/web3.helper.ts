import Web3 from 'web3';

export class Web3Helper {
  public static web3Provider(providerUrl?: string): Web3 {
    const web3 = new Web3();
    const provider = providerUrl?.startsWith('wss')
      ? new Web3.providers.WebsocketProvider(providerUrl)
      : new Web3.providers.HttpProvider(providerUrl);

    web3.setProvider(provider);
    return web3;
  }
}
