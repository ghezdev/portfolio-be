import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { UtilsService } from '@modules/utils';
import { UsersService } from './users.service';
import { ReqCreateUserDto, ResCreateUserDto, ResFindUserDto } from './dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private utilsService: UtilsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Usuario creado', type: ResCreateUserDto })
  async create(
    @Body() createUserDto: ReqCreateUserDto,
  ): Promise<ResCreateUserDto> {
    await this.usersService.create(createUserDto);
    return { message: 'Usuario creado con éxito! ' };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResFindUserDto[]> {
    const users = await this.usersService.findAll();
    return this.utilsService.mapper(ResFindUserDto, users);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:username')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('username') username: string): Promise<ResFindUserDto> {
    const user = await this.usersService.findOne(username);
    return this.utilsService.mapper(ResFindUserDto, user);
  }
}
