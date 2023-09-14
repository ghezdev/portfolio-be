import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService, User } from '@modules/users';
import { ErrorsService } from '@modules/errors';
import { ReqRegisterDto, ReqLoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private errorsService: ErrorsService,
  ) {}

  async login({ username, password }: ReqLoginDto) {
    let userFound: User;
    try {
      userFound = await this.usersService.findOne(username);
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST)
        throw new UnauthorizedException(this.errorsService.userNotAuthorized);
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      throw new UnauthorizedException(this.errorsService.userNotAuthorized);

    const payload = { username, sub: userFound.id };
    return this.jwtService.sign(payload);
  }

  async register(user: ReqRegisterDto) {
    const userCreated = await this.usersService.create(user);
    return userCreated;
  }
}
