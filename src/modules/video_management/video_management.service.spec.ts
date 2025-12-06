import { Test, TestingModule } from '@nestjs/testing';
import { VideoManagementService } from './video_management.service';

describe('VideoManagementService', () => {
  let service: VideoManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoManagementService],
    }).compile();

    service = module.get<VideoManagementService>(VideoManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
