import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import { refreshTokens } from '../controller/authControler.js';
dotenv.config();

export default function verifyAccessToken(req, res, next) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const secretRefreshKey = process.env.JWT_REFRESH_KEY;

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  //const authRefHeader = req.header('Authorization');
  const refreshToken = authHeader && authHeader.split('')[2];

  console.log(token);
  console.log(refreshToken);
  if (!token) {
    res.status(401).json({ success: false, message: 'Token Not found' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
}
