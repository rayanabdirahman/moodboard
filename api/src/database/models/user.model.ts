import mongoose from 'mongoose';
import { AccountRolesEnum } from '../../domain/enums/account';

export interface IUserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  googleId: string | undefined;
  name: string;
  username: string;
  email: string;
  avatar: string;
  password: string;
  role: AccountRolesEnum[];
}

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    googleId: { type: String },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    avatar: { type: String },
    password: { type: String },
    role: {
      type: [String],
      enum: [AccountRolesEnum],
      default: AccountRolesEnum.BUYER
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUserDocument>('User', UserSchema);
