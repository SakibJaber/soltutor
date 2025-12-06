import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { UsersService } from '../users/users.service';
import { Role } from '../../common/enum/user.role.enum';
import { CreateAdminDto } from './dto/create-admin.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an admin user', async () => {
      const createAdminDto: CreateAdminDto = {
        name: 'John Doe',
        email: 'admin@example.com',
        password: 'password123',
      };

      const expectedResult = {
        _id: 'someId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'admin@example.com',
        role: Role.ADMIN,
      };

      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createAdminDto);

      expect(usersService.create).toHaveBeenCalledWith(
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'admin@example.com',
          role: Role.ADMIN,
          password: 'password123',
        },
        {
          sendCredentialsEmail: true,
          plainPassword: 'password123',
        },
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of admins', async () => {
      const result = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };
      mockUsersService.findAll.mockResolvedValue(result);

      expect(await controller.findAll({ page: 1, limit: 10 })).toBe(result);
      expect(usersService.findAll).toHaveBeenCalledWith(1, 10, Role.ADMIN);
    });
  });
});
