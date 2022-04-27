import * as bycrypt from 'bcryptjs';

export enum BcryptEnum {
  SALT_ROUND = 10,
  API_SALT_WORK_FACTOR = 12
}

interface BycryptHelper {
  encryptPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}

const BycryptHelper: BycryptHelper = {
  async encryptPassword(password: string): Promise<string> {
    const salt = await bycrypt.genSalt(BcryptEnum.SALT_ROUND);
    return bycrypt.hash(password, salt);
  },

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bycrypt.compare(password, hashedPassword);
  }
};

export default BycryptHelper;
