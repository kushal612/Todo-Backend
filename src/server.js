import express from 'express';
import dotenv from 'dotenv';
import router from './routes/route.js';
import cors from 'cors';
import connectDB from './db/mongo.js';
import authRouter from './routes/authRoutes.js';
import protectedRoute from './routes/authProtectedRouter.js';
import authMiddleware from './middlewares/authMiddleware.js';

dotenv.config();
const port = process.env.PORT;

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use(authMiddleware);
app.use(router);
app.use('/auth', authRouter);
app.use('/protected', protectedRoute);
app.use('/api', router);

// eslint-disable-next-line
app.use((err, res, req, next) => {
  try {
    const status = err.status || 500;

    res.status(status).join({
      error: err.message || 'Server Error',
    });
  } catch (e) {
    res.status(400).json('error: ', e);
  }
});

app.listen(port, () => {
  console.log(`"message": "server is up and running"`);
});
