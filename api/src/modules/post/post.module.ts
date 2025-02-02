import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { postProviders } from './providers';
import { PostService, PostSearchService } from './services';
import {
  PostController,
  AdminPostController
} from './controllers';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    // inject user module because we request guard from auth, need to check and fix dependencies if not needed later
    UserModule,
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule)
  ],
  providers: [
    ...postProviders,
    PostService,
    PostSearchService
  ],
  controllers: [
    PostController,
    AdminPostController
  ],
  exports: [PostService, PostSearchService]
})
export class PostModule {}
