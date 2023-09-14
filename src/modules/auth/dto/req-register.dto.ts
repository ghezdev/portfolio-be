import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaxDateString } from '@decorators/validators.decorator';
import dayjs from '@config/dayjs';

export class ReqRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'example@email.com',
    description: 'Correo electrónico',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'usernameExample', description: 'Usuario' })
  readonly username: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({ example: '!P4ssw0rd', description: 'Contraseña' })
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'full name example', description: 'Nombre completo' })
  readonly name: string;

  @IsDateString()
  @IsNotEmpty()
  @MaxDateString(dayjs().subtract(18, 'year').startOf('day').toDate())
  @ApiProperty({ description: 'Fecha de nacimiento' })
  readonly birthdate: Date;
}
