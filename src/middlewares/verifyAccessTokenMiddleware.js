import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//import { refresh_tokens } from '../controller/authControler.js';
import tokenGenerator from '../services/tokenGenerator.js';

dotenv.config();

// export default function verify access_token(req, res, next) {
//   const secretKey = process.env.JWT_SECRET_KEY;

//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   //const authRefHeader = req.headers('Authorization');
//   const refresh_token = authHeader && authHeader.split('')[2];

//   console.log(token, refresh_token);

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
    const access_token = authHeader && authHeader.split(' ')[1];
    const refresh_token = authHeader && authHeader.split(' ')[2];

    if (!access_token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.',
      });
    }

    try {
      const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
      console.log(decoded);
      req.user = decoded;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError' && refresh_token) {
        try {
          const refreshPayload = jwt.verify(
            refresh_token,
            process.env.JWT_REFRESH_KEY
          );

          const newaccess_token = tokenGenerator.generateAccess_token(
            { userId: refreshPayload.userId },
            process.env.JWT_SECRET_KEY,
            process.env.JWT_EXPIRATION
          );
          console.log(newaccess_token);

          res.setHeader(
            'authorization',
            'Bearer ' + newaccess_token + ' ' + refresh_token
          );

          req.user = refreshPayload;
          return next();
        } catch (refreshError) {
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
