//import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import tokenGenerator from '../services/tokenGenerator.js';
import OTP from '../model/otpModel.js';

dotenv.config();

export const refreshTokens = [];

export default class AuthenticationController {
  registerUser = async (req, res, next) => {
    try {
      const { email, password, otp } = req.body;

      const response = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);
      if (response.length === 0 || otp !== response[0].otp) {
        return res.status(400).json({
          success: false,
          message: 'The OTP is not valid',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      console.log(email, password, hashedPassword, otp);
      const user = new User({ email, password: hashedPassword }); //verified due

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
      const accessKey = process.env.JWT_SECRET_KEY;
      const refreshKey = process.env.JWT_REFRESH_KEY;
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ error: 'User no Found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password is Wrong' });
      }

      const accessToken = tokenGenerator.generateAccessToken(
        user._id,
        accessKey,
        process.env.JWT_EXPIRATION
      );

      const refreshToken = tokenGenerator.generateAccessToken(
        user._id,
        refreshKey,
        process.env.JWT_REFRESH_EXPIRATION
      );
      refreshTokens.push(refreshToken);

      delete user._doc.password;

      res.status(200).json({ success: true, accessToken, refreshToken, user });
    } catch (err) {
      res.status(500).json({ error: `Login failed: ${err}` });
      next(err);
    }
  };
}
