import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthInterceptor } from '@interceptors/auth.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReqRegisterDto, ReqLoginDto } from './dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(AuthInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() reqLoginDto: ReqLoginDto) {
    return this.authService.login(reqLoginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() reqRegisterDto: ReqRegisterDto) {
    await this.authService.register(reqRegisterDto);

    return { message: 'Registrado exitosamente!' };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');

    return { message: 'Deslogueado exitosamente!' };
  }
}
