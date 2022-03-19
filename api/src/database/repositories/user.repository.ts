import { injectable } from 'inversify';
import {
  IGoogleSignUpModel,
  SignUpModel
} from '../../domain/interfaces/account';
import User, { UserDocument } from '../models/user.model';

export interface IUserRepository {
  createOne(model: SignUpModel | IGoogleSignUpModel): Promise<UserDocument>;
}

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  async createOne(
    model: SignUpModel | IGoogleSignUpModel
  ): Promise<UserDocument> {
    const user = new User(model);
    return await user.save();
  }
}
