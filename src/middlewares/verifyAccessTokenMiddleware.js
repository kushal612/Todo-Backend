import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const access_token = authHeader && authHeader.split(' ')[1];

    if (!access_token) {
      return res.status(401).json({
        message: 'Access denied. Invalid authorization header.',
      });
    }

    console.log(access_token);

    const decoded = jwt.verify(access_token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    return next();
  } catch (error) {
    res.status(401);
    next(error);
  }
}
