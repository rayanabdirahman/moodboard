import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './api/registrable.controller';

const container = new Container();

export default container;
