import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import dayjs from '@config/dayjs';

export class ResFindUserDto {
  @Expose()
  @ApiProperty()
  readonly id: string;

  @Expose()
  @ApiProperty()
  readonly username: string;

  @Expose()
  @ApiProperty()
  readonly name: string;

  @Expose()
  @Transform(({ value }: { value: Date | string }) =>
    dayjs(value).format('YYYY-MM-DD'),
  )
  @ApiProperty()
  readonly birthdate: string;
}
