import { Module, forwardRef } from '@nestjs/common';
import {
  SearchService
} from './services/search.service';
import {
  SearchController
} from './controllers/search.controller';
import { AssetsModule } from '../assets/assets.module';
import { PerformerModule } from '../performer/performer.module';

@Module({
  imports: [
    forwardRef(() => PerformerModule),
    forwardRef(() => AssetsModule)
  ],
  providers: [SearchService],
  controllers: [SearchController]
})
export class SearchModule {}
