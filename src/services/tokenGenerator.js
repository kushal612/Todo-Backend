import jwt from 'jsonwebtoken';

export default class tokenGenerator {
  static generateAccess_token(userId, secreteKey, expiresIn) {
    return jwt.sign({ userId }, secreteKey, { expiresIn });
  }

  static generateRefresh_token(userId, secreteKey, expiresIn) {
    return jwt.sign({ userId }, secreteKey, {
      expiresIn,
    });
  }
}
