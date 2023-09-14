import { registerDecorator, ValidationOptions } from 'class-validator';
import dayjs from '@config/dayjs';

export function MaxDateString(
  property: Date,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxDateString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: `${propertyName} should be less than ${dayjs(property).format(
          'YYYY-MM-DD',
        )}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const valueInDayjs = dayjs(value);

          return (
            typeof value === 'string' &&
            valueInDayjs.isValid() &&
            valueInDayjs.isBefore(property)
          );
        },
      },
    });
  };
}
