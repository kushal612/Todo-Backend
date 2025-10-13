import jwt from 'jsonwebtoken';

export default class tokenGenerator {
  static generateAccessToken(userId, secreteKey, expiresIn) {
    return jwt.sign({ userId }, secreteKey, { expiresIn });
  }

  static generateRefreshToken(userId, secreteKey, expiresIn) {
    return jwt.sign({ userId }, secreteKey, {
      expiresIn,
    });
  }
}
