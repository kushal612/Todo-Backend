import Router from 'express';
import verifyAccessToken from '../middlewares/verifyAccessTokenMiddleware.js';
//import verifyRefreshToken from '../middlewares/verifyRefreshToken.js';
import AuthenticationController from '../controller/authControler.js';

const authController = new AuthenticationController();
const protectedRoute = new Router();

protectedRoute.get('/', verifyAccessToken, (req, res) => {
  res.status(200).json({ message: 'Protected route accessed' });
});

protectedRoute.post('/refresh-token', authController.refreshAccessToken);
export default protectedRoute;
