import bcrypt from "bcrypt";

export class PasswordUtility {
  /**
   * returns a hash for a given password
   * @param {string} password the password to be hashed
   */
  async hash(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  /**
   * returns a hash for a given password
   * @param {string} plainPassword the plain text password to compare
   * @param {string} hashedPassword the already hashed password to compare with
   */
  async compare(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

const passwordUtility = new PasswordUtility();
export default passwordUtility;
