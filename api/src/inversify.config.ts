import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './api/registrable.controller';
import AccountController from './api/account/account.controller';
import {
  AccountServiceImpl,
  IAccountService
} from './services/account.service';

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);

// services
container.bind<IAccountService>(TYPES.AccountService).to(AccountServiceImpl);

export default container;
