import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletAddressDto } from 'src/modules/wallet/dtos/wallet-address.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async getTokens(@Body() walletAddressDto: WalletAddressDto) {
    return this.walletService.getTokensForAddress(walletAddressDto);
  }
}
