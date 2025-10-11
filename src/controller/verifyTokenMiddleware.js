import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export default function (req, res, next) {
  dotenv.config();
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ success: false, message: 'Token Not found' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: `Error: ${err}` });
  }
}
