import { IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ReqCreateUserDto } from '@modules/users/dto';

export class ReqLoginDto extends PickType(ReqCreateUserDto, [
  'username',
] as const) {
  @IsString()
  @ApiProperty({ example: '!P4ssw0rd', description: 'Contraseña' })
  readonly password: string;
}
