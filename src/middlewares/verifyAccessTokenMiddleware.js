import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import { refreshTokens } from '../controller/authControler.js';
import tokenGenerator from '../services/tokenGenerator.js';

dotenv.config();

// export default function verifyAccessToken(req, res, next) {
//   const secretKey = process.env.JWT_SECRET_KEY;

//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   //const authRefHeader = req.headers('Authorization');
//   const refreshToken = authHeader && authHeader.split('')[2];

//   console.log(token, refreshToken);

//   if (!token) {
//     res.status(401).json({ success: false, message: 'Token Not found' });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);

//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ success: false, message: err.message });
//   }
// }

export default async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = authHeader && authHeader.split(' ')[2];

    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
      console.log(decoded);
      req.user = decoded;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError' && refreshToken) {
        try {
          const refreshPayload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_KEY
          );

          const newAccessToken = tokenGenerator.generateAccessToken(
            { userId: refreshPayload.userId },
            process.env.JWT_SECRET_KEY,
            process.env.JWT_EXPIRATION
          );
          console.log(newAccessToken);

          res.setHeader(
            'authorization',
            'Bearer ' + newAccessToken + ' ' + refreshToken
          );

          // Set user from refresh token payload
          req.user = refreshPayload;
          return next();
        } catch (refreshError) {
          // Refresh token is also invalid or expired
          return res.status(401).json({
            message: 'Session expired. Please login again.',
            refreshError: refreshError.message,
          });
        }
      }

      return res.status(403).json({
        message: 'Invalid access token',
      });
    }
  } catch (error) {
    next(error);
  }
}
