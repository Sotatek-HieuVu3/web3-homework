import { Injectable } from '@nestjs/common';
import {
  ETHEREUM_USDC_CONTRACT_ADDRESS,
  ETHEREUM_USDC_DECIMALS,
} from 'src/shared/constants/common.constant';
import { DEFAULT_ERC20_ABI } from 'src/shared/constants/ERC20-abi.constant';
import { Web3Helper } from 'src/shared/helpers/web3.helper';

const INFURA_WEBSOCKET_PROVIDER = process.env.INFURA_WEBSOCKET_PROVIDER;
@Injectable()
export class IndexerService {
  public web3Instance;

  constructor() {
    this.web3Instance = Web3Helper.web3Provider(INFURA_WEBSOCKET_PROVIDER);
  }
  async onModuleInit() {
    await this.listenToUsdcTransfers();
  }

  async listenToUsdcTransfers() {
    const usdcContract = new this.web3Instance.eth.Contract(
      DEFAULT_ERC20_ABI,
      ETHEREUM_USDC_CONTRACT_ADDRESS,
    );

    usdcContract.events
      .Transfer({ fromBlock: 'latest' })
      .on('data', (event) => {
        console.log(
          `Transfer: from ${event.returnValues.from} to ${event.returnValues.to} for ${this.web3Instance.utils.fromWei(event.returnValues.value, ETHEREUM_USDC_DECIMALS)} USDC`,
        );
      });

    console.log('Listening for USDC transfer events...');
  }
}
