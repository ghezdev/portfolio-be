import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import dayjs from '@config/dayjs';
import { Expose } from 'class-transformer';

@Schema({ timestamps: true })
export class User {
  @Expose({ name: '_id' })
  readonly id: string;

  @Expose()
  @Prop({ type: String, required: true, unique: true })
  readonly username: string;

  @Expose()
  @Prop({ type: String, required: true, unique: true })
  readonly email: string;

  @Expose()
  @Prop({ type: String })
  readonly password: string;

  @Expose()
  @Prop({ type: String, required: true })
  readonly name: string;

  @Expose()
  @Prop({
    type: Date,
    required: true,
    max: dayjs().subtract(18, 'year').startOf('day').toDate(),
  })
  readonly birthdate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
