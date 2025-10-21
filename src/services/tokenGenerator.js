import jwt from 'jsonwebtoken';

export default class tokenGenerator {
  static generateAccess_token(userId, secreteKey, expiresIn) {
    const access_token = jwt.sign({ userId }, secreteKey, { expiresIn });
    return access_token;
  }

  static generateRefresh_token(userId, secreteKey, expiresIn) {
    const refresh_token = jwt.sign({ userId }, secreteKey, { expiresIn });
    return refresh_token;
  }
}
