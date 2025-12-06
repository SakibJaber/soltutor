import { Test, TestingModule } from '@nestjs/testing';
import { VideoManagementController } from './video_management.controller';
import { VideoManagementService } from './video_management.service';

describe('VideoManagementController', () => {
  let controller: VideoManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoManagementController],
      providers: [VideoManagementService],
    }).compile();

    controller = module.get<VideoManagementController>(VideoManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
