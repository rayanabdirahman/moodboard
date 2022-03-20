import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './api/registrable.controller';
import AccountController from './api/account/account.controller';
import {
  AccountServiceImpl,
  IAccountService
} from './services/account.service';
import {
  IUserRepository,
  UserRepositoryImpl
} from './database/repositories/user.repository';
import UserController from './api/user/user.controller';

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);
container.bind<RegistrableController>(TYPES.Controller).to(UserController);

// services
container.bind<IAccountService>(TYPES.AccountService).to(AccountServiceImpl);

// repository
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

export default container;
