import { Router } from 'express';
import { sendOtp } from '../controller/otpController.js';
import AuthenticationController from '../controller/AuthenticationControler.js';
import { validateUserSchema } from '../validation/userValidate.js';
import multer from 'multer';
import verifyToken from '../middlewares/verifyAccessTokenMiddleware.js';

const authRouter = Router();
const authentication = new AuthenticationController();
const storage = multer.diskStorage({
  destination: 'database/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '_' + uniqueSuffix);
  },
});
const upload = multer({ storage, limits: { fileSize: 500000 } });

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

authRouter.post('/sign-up', validateUserSchema, authentication.registerUser);
authRouter.post('/sign-in', validateUserSchema, authentication.loginUser);
authRouter.post('/forgot-password/sendOtp', sendOtp);
authRouter.post(
  '/forgot-password/reset',
  authentication.setNewPasswordAfterOtp
);
authRouter.post('/reset-password', authentication.resetPassword);
authRouter.get('/user', verifyToken, authentication.getUser);
authRouter.put(
  '/user',
  verifyToken,
  upload.single('profile_image'),
  authentication.updateUser
);

export default authRouter;
