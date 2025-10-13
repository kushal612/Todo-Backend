import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export default function verifyAccessToken(req, res, next) {
  dotenv.config();

  const secretKey = process.env.JWT_SECRET_KEY;
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split('')[1];

  console.log(token);
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
