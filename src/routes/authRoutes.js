import { Router } from 'express';
import { sendOTP, verifyOTP } from '../controller/otpController.js';
import AuthenticationController from '../controller/authControler.js';
import { validateUserSchema } from '../validation/userValidate.js';

const authRouter = Router();
const authentication = new AuthenticationController();

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

authRouter.post('/sign-up', validateUserSchema, authentication.registerUser);
authRouter.post('/sign-in', validateUserSchema, authentication.loginUser);

authRouter.post('/forgot-password/sendOTP', sendOTP);
authRouter.post('/forgot-password/verifyOTP', verifyOTP);

authRouter.post(
  '/forgot-password/reset',
  authentication.setNewPasswordAfterOTP
);
authRouter.post('/reset-password', authentication.resetPassword);

authRouter.post('/refresh-token', authentication.refreshAccessToken);

export default authRouter;
