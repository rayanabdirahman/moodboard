import mongoose from 'mongoose';
import { AccountRolesEnum } from '../../domain/enums/account';
import BycryptHelper from '../../utilities/bcryptHelper';

export interface IUserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  googleId: string | undefined;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  gender: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  verified: boolean;
  search: string[];
  role: AccountRolesEnum[];
  stripe_account_id: string;
  stripe_seller: any;
  stripe_session: any;
}

const UserSchema: mongoose.Schema = new mongoose.Schema(
  {
    googleId: { type: String },
    first_name: { type: String, required: true, trim: true, text: true },
    last_name: { type: String, required: true, trim: true, text: true },
    username: {
      type: String,
      required: true,
      trim: true,
      text: true,
      unique: true
    },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    gender: { type: String },
    birth_year: { type: Number },
    birth_month: { type: Number },
    birth_day: { type: Number },
    verified: { type: Boolean, default: false },
    search: [{ user: { type: mongoose.Types.ObjectId, ref: 'User' } }],
    role: {
      type: [String],
      enum: [AccountRolesEnum],
      default: AccountRolesEnum.BUYER
    },
    stripe_account_id: { type: String, default: null },
    stripe_seller: {},
    stripe_session: {}
  },
  { timestamps: true }
);

// Encrypt user password before saving
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    // hash user password
    const password = await BycryptHelper.encryptPassword(this.get('password'));
    this.set({ password });
  }
});

export default mongoose.model<IUserDocument>('User', UserSchema);
