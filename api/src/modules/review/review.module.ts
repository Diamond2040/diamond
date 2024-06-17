import { forwardRef, Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MongoDBModule, MONGO_DB_PROVIDER, QueueModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { PerformerModule } from '../performer/performer.module';
import { UserModule } from '../user/user.module';
import { REVIEW_MODEL_PROVIDER } from './constants';
import { PerformerReviewController, ReviewController } from './controllers';
import { ReviewCreateSucessListenner } from './listeners';
import { schema } from './review.schema';
import { ReviewService } from './services';

@Module({
  providers: [
    ReviewService,
    {
      inject: [MONGO_DB_PROVIDER],
      provide: REVIEW_MODEL_PROVIDER,
      useFactory: (connection: Connection) => connection.model('review', schema)
    },
    ReviewCreateSucessListenner
  ],
  imports: [
    AuthModule,
    MongoDBModule,
    QueueModule.forRoot(),
    forwardRef(() => UserModule),
    forwardRef(() => PerformerModule)
  ],
  controllers: [ReviewController, PerformerReviewController],
  exports: [ReviewService]
})
export class ReviewModule {}
