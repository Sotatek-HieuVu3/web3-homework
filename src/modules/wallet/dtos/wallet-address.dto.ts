import { IsEthereumAddress } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletAddressDto {
  @ApiProperty({
    required: true,
    example: '0xFb19ffd1Ff9316b7f5Bba076eF4b78E4bBeDf4E1',
  })
  @IsEthereumAddress()
  walletAddress: string;
}
