import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorsService {
  public readonly userNotFound = 'User not found';
  public readonly userNotAuthorized = 'User not authorized';
  public readonly userIsLoggedIn = 'User is logged in';
  public readonly userIsAlreadyRegistered = 'User is already registered';
}
