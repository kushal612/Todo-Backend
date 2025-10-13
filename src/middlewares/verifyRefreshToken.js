// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';

// dotenv.config();

// export default function verifyRefreshToken(req, res, next) {
//   const refreshToken = req.body.token;
//   const secretRefreshKey = process.env.JWT_REFRESH_KEY;
//   if (!refreshToken) {
//     return res
//       .status(401)
//       .json({ success: false, message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ success: false, message: err.message });
//   }
// }
