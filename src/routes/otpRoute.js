import { Router } from 'express';
import { sendOTP, verifyOTP } from '../controller/otpController.js';
import isVerified from '../middlewares/isVerifiedCheck.js';

const otpRouter = Router();

otpRouter.post('/send-otp', isVerified, sendOTP);
otpRouter.post('/verifyOTP', verifyOTP);

export default otpRouter;
