import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UtilsService } from '@modules/utils';
import { ErrorsService } from '@modules/errors';
import dayjs from '@config/dayjs';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { ReqCreateUserDto } from './dto';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let utilsService: UtilsService;
  let errorsService: ErrorsService;
  let userModel: Model<User>;
  const mockRepository = {
    create: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UtilsService,
        ErrorsService,
        {
          provide: getModelToken(User.name),
          useValue: mockRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    utilsService = module.get<UtilsService>(UtilsService);
    errorsService = module.get<ErrorsService>(ErrorsService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersService.create).toBeDefined();
    expect(usersService.findAll).toBeDefined();
    expect(usersService.findOne).toBeDefined();
    expect(utilsService).toBeDefined();
    expect(errorsService).toBeDefined();
    expect(userModel).toBeDefined();
  });

  describe('create user', () => {
    const createUserDto: ReqCreateUserDto = {
      username: 'ghezdev',
      name: 'Guillermo Hernandez',
      birthdate: dayjs('2000-07-05').toDate(),
      email: 'hernandez17.guillermo@gmail.com',
      password: 'Gu1ll3.17',
    };
    const hashedPassword =
      '$2b$10$FdaDpNGSYqDJzNgvaLwZCOCIfzYdimmAdXAIEMkk1RM4rNvQNUB9u';
    const userCreated: User = {
      id: '64e4cdde1ff6811a5e027a26',
      username: 'ghezdev',
      name: 'Guillermo Hernandez',
      birthdate: dayjs('2000-07-05').toDate(),
      email: 'hernandez17.guillermo@gmail.com',
      password: hashedPassword,
    };

    it('should create a new user', async () => {
      const bcryptHashMock = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => hashedPassword);
      const mapperSpy = jest
        .spyOn(utilsService, 'mapper')
        .mockImplementation(() => userCreated);

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(userCreated);

      const result = await usersService.create(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(bcryptHashMock).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mapperSpy).toHaveBeenCalledWith(User, userCreated);
      expect(result).toEqual(userCreated);

      bcryptHashMock.mockRestore();
    });

    it('should throw user is already registered', async () => {
      mockRepository.findOne.mockResolvedValue(userCreated);

      try {
        await usersService.create(createUserDto);
      } catch (error) {
        expect(mockRepository.findOne).toHaveBeenCalled();
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toMatch(errorsService.userIsAlreadyRegistered);
      }
    });
  });

  describe('find all users', () => {
    const usersFound: User[] = [
      {
        id: '64e4cdde1ff6811a5e027a26',
        username: 'ghezdev',
        name: 'Guillermo Hernandez',
        birthdate: dayjs('2000-07-05').toDate(),
        email: 'hernandez17.guillermo@gmail.com',
        password:
          '$2b$10$FdaDpNGSYqDJzNgvaLwZCOCIfzYdimmAdXAIEMkk1RM4rNvQNUB9u',
      },
    ];

    it('should returns all users', async () => {
      mockRepository.find.mockResolvedValue(usersFound);
      const mapperSpy = jest
        .spyOn(utilsService, 'mapper')
        .mockImplementation(() => usersFound);

      const result = await usersService.findAll();

      expect(userModel.find).toBeCalled();
      expect(mapperSpy).toHaveBeenCalledWith(User, usersFound);
      expect(result).toEqual(usersFound);
    });

    it('not should found users and returns an empty array', async () => {
      mockRepository.find.mockResolvedValue([]);
      const mapperSpy = jest
        .spyOn(utilsService, 'mapper')
        .mockImplementation(() => []);

      const result = await usersService.findAll();

      expect(userModel.find).toBeCalled();
      expect(mapperSpy).toHaveBeenCalledWith(User, []);
      expect(result).toEqual([]);
    });
  });

  describe('find one user', () => {
    const username: string = 'ghezdev';
    const userFound: User = {
      id: '64e4cdde1ff6811a5e027a26',
      username: 'ghezdev',
      name: 'Guillermo Hernandez',
      birthdate: dayjs('2000-07-05').toDate(),
      email: 'hernandez17.guillermo@gmail.com',
      password: '$2b$10$FdaDpNGSYqDJzNgvaLwZCOCIfzYdimmAdXAIEMkk1RM4rNvQNUB9u',
    };

    it('should return user found', async () => {
      mockRepository.findOne.mockResolvedValue(userFound);
      const mapperSpy = jest
        .spyOn(utilsService, 'mapper')
        .mockImplementation(() => userFound);

      const result = await usersService.findOne(username);

      expect(userModel.findOne).toBeCalled();
      expect(mapperSpy).toHaveBeenCalledWith(User, userFound);
      expect(result).toEqual(userFound);
    });

    it('should throw user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      try {
        await usersService.findAll();
      } catch (error) {
        expect(userModel.findOne).toBeCalled();
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toMatch(errorsService.userNotFound);
      }
    });
  });
});
