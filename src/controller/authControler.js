import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../model/userModel.js';

dotenv.config();

export default class AuthenticationController {
  registerUser = async (req, res, next) => {
    try {
      res.cookie('title', 'Kushal Singha');
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      res.status(200).json({
        success: 'Success true',
        message: 'User registered successfully',
        user: user,
      });
    } catch (err) {
      next(err);
    }
  };

  loginUser = async (req, res, next) => {
    try {
      const secreteKey = process.env.JWT_SECRET_KEY;
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'User no Found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password is Wrong' });
      }
      const token = jwt.sign({ userId: user._id }, secreteKey, {
        expiresIn: '1h',
      });

      delete user._doc.password;

      res.status(200).json({ token, user });
    } catch (err) {
      next(err);
    }
  };
}
