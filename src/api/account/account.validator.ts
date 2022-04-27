import * as Joi from 'joi';
import { ISignInModel, ISignUpModel } from '../../domain/interfaces/account';

export default class AccountValidator {
  static signUpSchema: Joi.ObjectSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required(),
    avatar: Joi.string().required(),
    role: Joi.boolean()
  });

  static signInSchema: Joi.ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).required()
  });

  static updateOneSchema: Joi.ObjectSchema = Joi.object({
    name: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    avatar: Joi.string(),
    password: Joi.string().min(8).max(15),
    isAdmin: Joi.boolean()
  });

  static signUp(model: ISignUpModel): Joi.ValidationResult {
    return this.signUpSchema.validate(model);
  }

  static signIn(model: ISignInModel): Joi.ValidationResult {
    return this.signInSchema.validate(model);
  }

  static updateOne(model: ISignUpModel): Joi.ValidationResult {
    return this.updateOneSchema.validate(model);
  }
}
