import { Router } from 'express';
import { sendOTP, verifyOTP } from '../controller/otpController.js';
import AuthenticationController from '../controller/authControler.js';

const authentication = new AuthenticationController();
const otpRouter = Router();

otpRouter.post('/send-otp', sendOTP);
otpRouter.post('/verifyOTP', verifyOTP);

otpRouter.post('/forgot-password/sendOTP', sendOTP);
otpRouter.post('/forgot-password/verifyOTP', verifyOTP);

otpRouter.post('/forgot-password/reset', authentication.setNewPasswordAfterOTP);
otpRouter.post('/reset-password', authentication.resetPassword);

export default otpRouter;
