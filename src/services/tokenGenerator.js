import jwt from 'jsonwebtoken';

export default class tokenGenerator {
  static generateaccess_token(userId, secreteKey, expiresIn) {
    return jwt.sign({ userId }, secreteKey, { expiresIn });
  }

  static generaterefresh_token(userId, secreteKey, expiresIn) {
    return jwt.sign({ userId }, secreteKey, {
      expiresIn,
    });
  }
}
