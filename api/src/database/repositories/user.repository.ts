import { injectable } from 'inversify';
import {
  IGoogleSignUpModel,
  SignUpModel
} from '../../domain/interfaces/account';
import User, { IUserDocument } from '../models/user.model';

export interface IUserRepository {
  createOne(model: SignUpModel | IGoogleSignUpModel): Promise<IUserDocument>;
  findOneByGoogleId(
    googleId: string,
    safeguard?: boolean
  ): Promise<IUserDocument | null>;
}

@injectable()
export class UserRepositoryImpl implements IUserRepository {
  async createOne(
    model: SignUpModel | IGoogleSignUpModel
  ): Promise<IUserDocument> {
    const user = new User(model);
    return await user.save();
  }

  async findOneByGoogleId(
    googleId: string,
    safeguard = true
  ): Promise<IUserDocument | null> {
    // check if password should be returned with user document
    return safeguard
      ? await User.findOne({ googleId }).select('-password -__v')
      : await User.findOne({ googleId });
  }
}
