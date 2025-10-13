import Router from 'express';
import verifyAccessToken from '../middlewares/verifyAccessTokenMiddleware.js';
import verifyRefreshToken from '../middlewares/verifyRefreshToken.js';

const protectedRoute = new Router();

protectedRoute.get('/', verifyAccessToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' });
});

protectedRoute.post('/', verifyRefreshToken, (req, res) => {
  res.status(200).json({ message: 'Refresh token generate' });
});
export default protectedRoute;
