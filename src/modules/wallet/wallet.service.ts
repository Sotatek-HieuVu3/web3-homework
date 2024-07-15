import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  ContractCallContext,
  ContractCallResults,
  Multicall,
} from 'ethereum-multicall';
import { WalletAddressDto } from 'src/modules/wallet/dtos/wallet-address.dto';
import {
  ETHEREUM_CHAIN_ID,
  ETHEREUM_MULTICALL_ADDRESS,
} from 'src/shared/constants/common.constant';
import { DEFAULT_ERC20_ABI } from 'src/shared/constants/ERC20-abi.constant';
import { UNISWAP_TOKEN_MAP } from 'src/shared/constants/uniswap-token-list.constant';
import { Web3Helper } from 'src/shared/helpers/web3.helper';

const INFURA_HTTPS_PROVIDER = process.env.INFURA_HTTPS_PROVIDER;
@Injectable()
export class WalletService {
  private web3Instance;
  private multicall: Multicall;

  constructor() {
    this.web3Instance = Web3Helper.web3Provider(INFURA_HTTPS_PROVIDER);
    this.multicall = new Multicall({
      web3Instance: this.web3Instance,
      tryAggregate: true,
      multicallCustomContractAddress: ETHEREUM_MULTICALL_ADDRESS,
    });
  }

  async getTokensForAddress(walletAddressDto: WalletAddressDto) {
    // const ethereumTokenList = UNISWAP_TOKEN_LIST.filter(
    //   (ele) => ele.chainId == ETHEREUM_CHAIN_ID,
    // );

    const ethereumTokenList = UNISWAP_TOKEN_MAP.get(ETHEREUM_CHAIN_ID);
    const tokens = [];

    const contractCallContext: ContractCallContext[] = ethereumTokenList.map(
      (token) => ({
        reference: token.symbol,
        contractAddress: token.address,
        abi: DEFAULT_ERC20_ABI,
        calls: [
          {
            reference: 'balance',
            methodName: 'balanceOf',
            methodParameters: [walletAddressDto.walletAddress],
          },
          {
            reference: 'symbol',
            methodName: 'symbol',
            methodParameters: [],
          },
          {
            reference: 'decimals',
            methodName: 'decimals',
            methodParameters: [],
          },
          {
            reference: 'name',
            methodName: 'name',
            methodParameters: [],
          },
        ],
      }),
    );

    let results: ContractCallResults;
    try {
      results = await this.multicall.call(contractCallContext);
    } catch (error) {
      throw new HttpException(
        'Cannot interact with the current chain',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    for (const token of ethereumTokenList) {
      const tokenBalance =
        results.results[token.symbol].callsReturnContext[0].returnValues[0].hex;

      if (tokenBalance != '0x00') {
        tokens.push({
          symbol: token.symbol,
          name: token.name,
          balance: this.web3Instance.utils.fromWei(
            this.web3Instance.utils.hexToNumberString(tokenBalance),
            token.decimals,
          ),
        });
      }
    }

    return tokens;
  }
}
