import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { ReactionController } from './controllers/reaction.controller';
import { ReactionService } from './services/reaction.service';
import { reactionProviders } from './providers/reaction.provider';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { AssetsModule } from '../assets/assets.module';
import { FileModule } from '../file/file.module';
import { DeleteAssetsListener } from './listeners/handle-delete-assets.listener';

@Module({
  imports: [
    QueueModule.forRoot(),
    MongoDBModule,
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => PerformerModule),
    forwardRef(() => AssetsModule),
    forwardRef(() => FileModule)
  ],
  providers: [...reactionProviders, ReactionService, DeleteAssetsListener],
  controllers: [ReactionController],
  exports: [ReactionService]
})
export class ReactionModule {}
