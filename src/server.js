import express from 'express';
import dotenv from 'dotenv';
import router from './routes/route.js';
import cors from 'cors';
import connectDB from './db/mongo.js';
import authRouter from './routes/authRoutes.js';
import protectedRoute from './routes/authProtectedRouter.js';
import loggerMiddleware from './middlewares/logger.js';
import otpRouter from './routes/otpRoute.js';
import verifyToken from './middlewares/verifyAccessTokenMiddleware.js';
//import authRoutes from './routes/authRoutes.js';

dotenv.config();
const port = process.env.PORT;

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use(loggerMiddleware);
app.use(router);
app.use('/api/auth', authRouter, otpRouter);
app.use('/api/auth/protected', protectedRoute);
app.use('/api/todos', verifyToken, router);

// eslint-disable-next-line
app.use((err, req, res, next) => {
  try {
    const status = err.status || 500;

    res.status(status).json({
      error: err.message || 'Server Error',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`"message": "server is up and running"`);
});
