import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ErrorsModule } from '@modules/errors';
import { UsersModule } from '@modules/users';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    ErrorsModule,
    PassportModule,
    JwtModule.register({
      // global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
