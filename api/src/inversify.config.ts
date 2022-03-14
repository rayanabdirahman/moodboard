import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './api/registrable.controller';
import AccountController from './api/account/account.controller';

const container = new Container();

// controllers
container.bind<RegistrableController>(TYPES.Controller).to(AccountController);

export default container;
