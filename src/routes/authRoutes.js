import { Router } from 'express';
import AuthenticationController from '../controller/authControler';

const authRouter = Router();
const authentication = new AuthenticationController();

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

authRouter.use('/sign-up', authentication.registerUser);
authRouter.use('/sign-in', authentication.loginUser);

export default authRouter;
