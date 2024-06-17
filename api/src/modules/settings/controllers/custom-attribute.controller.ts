import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { CustomAttributeService } from '../services/custom-attribute.service';

@Controller('attributes')
export class CustomAttributeController {
  constructor(private readonly attribubeService: CustomAttributeService) {}

  @Get('/list/all')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllAttributes() {
    const results = await this.attribubeService.findAll();
    const data = results.map((d) => ({
      key: d.key,
      value: d.value,
      group: d.group
    }));
    return DataResponse.ok(data);
  }
}
