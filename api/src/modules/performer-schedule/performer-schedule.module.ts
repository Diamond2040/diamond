import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, QueueModule } from 'src/kernel';
import { AuthModule } from '../auth/auth.module';
import { ScheduleService } from './services';
import { ScheduleController, AdminPerformerScheduleController } from './controllers';
import { scheduleProvider } from './providers';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongoDBModule,
    QueueModule.forRoot(),
    UserModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule)
  ],
  providers: [...scheduleProvider, ScheduleService],
  controllers: [ScheduleController, AdminPerformerScheduleController],
  exports: [ScheduleService]
})
export class PerformerScheduleModule {}
