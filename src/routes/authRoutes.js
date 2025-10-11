import { Router } from 'express';
import AuthenticationController from '../controller/authControler.js';

const authRouter = Router();
const authentication = new AuthenticationController();

authRouter.use((req, res, next) => {
  console.log(`Route middleware: ${req.method} ${req.url}`);
  next();
});

authRouter.post('/sign-up', authentication.registerUser);
authRouter.post('/sign-in', authentication.loginUser);

export default authRouter;
