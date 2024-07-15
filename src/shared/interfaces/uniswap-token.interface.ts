export interface IUniswapToken {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  extensions?: Extensions;
}

interface BridgeInfo {
  [chainId: string]: {
    tokenAddress: string;
  };
}

interface Extensions {
  bridgeInfo: BridgeInfo;
}
