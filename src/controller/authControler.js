//import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import tokenGenerator from '../services/tokenGenerator.js';
//import OTP from '../model/otpModel.js';

dotenv.config();

export const refreshTokens = [];

export default class AuthenticationController {
  registerUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const hashedPass = await bcrypt.hash(password, 10);
      //   console.log(username, password, hashedPass)

      const user = new User({ email, password: hashedPass });
      await user.save();

      res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
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

      const access_Token = tokenGenerator.generateaccess_token(
        user._id,
        accessKey,
        process.env.JWT_EXPIRATION
      );

      const refresh_Token = tokenGenerator.generaterefresh_token(
        user._id,
        refreshKey,
        process.env.JWT_REFRESH_EXPIRATION
      );
      refreshTokens.push(refresh_Token);

      delete user._doc.password;

      res
        .status(200)
        .json({ success: true, access_Token, refresh_Token, user });
    } catch (err) {
      res.status(500).json({ error: `Login failed: ${err}` });
      next(err);
    }
  };

  setNewPasswordAfterOTP = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP and new password are required.',
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the password.',
      });
    }
  };

  resetPassword = async (req, res) => {
    //const { userId } = req.user;
    const { email, currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.',
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'Current password is incorrect.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully.',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while resetting the password.',
      });
    }
  };
}
