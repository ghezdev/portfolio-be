import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsModule, UtilsService } from '../utils';
import { ErrorsModule } from '../errors';
import { UsersService } from './users.service';
import { User, UserSchema } from './user.schema';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let utilsService: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UtilsModule,
        ErrorsModule,
      ],
      providers: [UsersService],
      exports: [UsersService],
      controllers: [UsersController],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    utilsService = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersController.create).toBeDefined();
    expect(usersController.findAll).toBeDefined();
    expect(usersController.findOne).toBeDefined();
    expect(usersService).toBeDefined();
    expect(utilsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(users, 'findAll').mockImplementation(() => result);

      expect(await catsController.findAll()).toBe(result);
    });
  });
});
