import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './modules/wallet/wallet.module';
import { IndexerModule } from './modules/indexer/indexer.module';

@Module({
  imports: [WalletModule, IndexerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
