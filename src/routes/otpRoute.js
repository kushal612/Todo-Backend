import { Router } from 'express';
import { sendOTP, verifyOtp } from '../controller/otpController.js';
import isVerified from '../middlewares/isVerifiedCheck.js';

const otpRouter = Router();

otpRouter.post('/send-otp', isVerified, sendOTP);
otpRouter.post('/verifyOtp', verifyOtp);

export default otpRouter;
