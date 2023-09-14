import { Injectable } from '@nestjs/common';
import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

@Injectable()
export class UtilsService {
  private readonly optionsPlainToInstance: ClassTransformOptions = {
    excludeExtraneousValues: true,
    enableImplicitConversion: true,
  };

  mapper<T, V>(cls: ClassConstructor<T>, plain: V[]): T[];
  mapper<T, V>(cls: ClassConstructor<T>, plain: V): T;
  mapper<T, V>(cls: ClassConstructor<T>, plain: V): T {
    return plainToInstance(cls, plain, this.optionsPlainToInstance);
  }
}
