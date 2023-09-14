import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@modules/auth';
import { UsersModule } from '@modules/users';
import { UtilsModule } from '@modules/utils';
import { ErrorsModule } from '@modules/errors';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        const dbUrl = configService.get<string>('DB_URL');
        const dbPort = configService.get<number>('DB_PORT');
        const dbName = configService.get<string>('DB_NAME');
        const dbUser = configService.get<string>('DB_USER');
        const dbPass = configService.get<string>('DB_PASS');

        return {
          uri:
            nodeEnv === 'local'
              ? `mongodb://${dbUrl}:${dbPort}/${dbName}`
              : `mongodb://${dbUser}:${dbPass}@${dbUrl}:${dbPort}/${dbName}`,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ envFilePath: '.env', validate }),
    AuthModule,
    UsersModule,
    UtilsModule,
    ErrorsModule,
  ],
})
export class AppModule {}
