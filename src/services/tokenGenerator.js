import jwt from 'jsonwebtoken';
import { LocalStorage } from 'node-localstorage';
const localStorage = new LocalStorage('./scratch');

export default class tokenGenerator {
  static generateAccess_token(userId, secreteKey, expiresIn) {
    const access_token = jwt.sign({ userId }, secreteKey, { expiresIn });
    localStorage.setItem('access_token', JSON.stringify(access_token));
    return access_token;
  }

  static generateRefresh_token(userId, secreteKey, expiresIn) {
    const refresh_token = jwt.sign({ userId }, secreteKey, {
      expiresIn,
    });
    localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
    return refresh_token;
  }
}
