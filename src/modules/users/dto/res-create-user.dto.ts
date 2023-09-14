import { ApiProperty } from '@nestjs/swagger';

export class ResCreateUserDto {
  @ApiProperty({
    example: 'Usuario creado con éxito!',
    description: 'Respuesta de caso exitoso',
  })
  message: string;
}
