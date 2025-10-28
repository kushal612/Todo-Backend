import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controller/otpController.js';
import isVerified from '../middlewares/isVerifiedCheck.js';

const otpRouter = Router();

otpRouter.post('/send-otp', isVerified, sendOtp);
otpRouter.post('/verifyOtp', verifyOtp);

export default otpRouter;
