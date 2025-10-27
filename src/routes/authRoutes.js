import { Router } from 'express';
import { sendOTP } from '../controller/otpController.js';
import AuthenticationController from '../controller/AuthenticationControler.js';
import { validateUserSchema } from '../validation/userValidate.js';
import multer from 'multer';

const authRouter = Router();
const authentication = new AuthenticationController();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

authRouter.post('/sign-up', validateUserSchema, authentication.registerUser);
authRouter.post('/sign-in', validateUserSchema, authentication.loginUser);
authRouter.post('/forgot-password/sendOTP', sendOTP);
authRouter.post(
  '/forgot-password/reset',
  authentication.setNewPasswordAfterOTP
);
authRouter.post('/reset-password', authentication.resetPassword);
authRouter.get('/user', authentication.getUser);
authRouter.put(
  '/user',
  upload.single('profile_image'),
  authentication.updateUser
);

export default authRouter;
