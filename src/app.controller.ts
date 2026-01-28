import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getStatus() {
    return {
      success: true,
      message: 'SOL Tutor API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
