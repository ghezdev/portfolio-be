import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UtilsService } from '@modules/utils';
import { ErrorsService } from '@modules/errors';
import { User } from './user.schema';
import { ReqCreateUserDto } from './dto/req-create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private utilsService: UtilsService,
    private errorsService: ErrorsService,
  ) {}

  async create(createUserDto: ReqCreateUserDto): Promise<User> {
    const userFound = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (userFound)
      throw new BadRequestException(this.errorsService.userIsAlreadyRegistered);

    const saltOrRounds = 10;
    const passwordHashed = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, saltOrRounds)
      : undefined;

    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: passwordHashed,
    });

    return this.utilsService.mapper(User, createdUser);
  }

  async findAll(): Promise<User[]> {
    const usersFound = await this.userModel.find();

    return this.utilsService.mapper(User, usersFound);
  }

  async findOne(username: string): Promise<User> {
    const userFound = await this.userModel.findOne({ username });

    if (!userFound) {
      throw new BadRequestException(this.errorsService.userNotFound);
    }

    return this.utilsService.mapper(User, userFound);
  }
}
