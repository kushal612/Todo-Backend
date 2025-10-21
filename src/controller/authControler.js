import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../model/userModel.js';
import tokenGenerator from '../services/tokenGenerator.js';

dotenv.config();

export default class AuthenticationController {
  registerUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User already exists',
        });
      }

      const hashedPass = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPass });

      await user.save();

      res.status(201).json({
        success: true,
        user,
        message: 'User registered successfully.',
      });
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
        return res.status(404).json({ error: 'User no Found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Password is Wrong' });
      }

      if (!user.verified) {
        return res.status(401).json({ error: 'User not verified' });
      }

      const access_token = tokenGenerator.generateAccess_token(
        user._id,
        accessKey,
        process.env.JWT_EXPIRATION
      );
      const refresh_token = tokenGenerator.generateRefresh_token(
        user._id,
        refreshKey,
        process.env.JWT_REFRESH_EXPIRATION
      );

      delete user._doc.password;

      res
        .status(200)
        .json({ success: true, access_token, refresh_token, user });
    } catch (err) {
      next(err);
    }
  };

  setNewPasswordAfterOTP = async (req, res, next) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
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
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
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

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: 'old password is incorrect.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully.',
      });
    } catch (error) {
      next(error);
    }
  };

  refreshAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const refresh_token = authHeader && authHeader.split(' ')[1];
    console.log('Refresh Token:', refresh_token);

    if (!refresh_token) {
      return res.status(401).json({ message: 'Refresh Token is required' });
    }
    try {
      const refreshPayload = jwt.verify(
        refresh_token,
        process.env.JWT_REFRESH_KEY
      );
      const newAccessToken = tokenGenerator.generateAccess_token(
        refreshPayload.userId,
        process.env.JWT_SECRET_KEY,
        process.env.JWT_EXPIRATION
      );
      const newRefreshToken = tokenGenerator.generateRefresh_token(
        refreshPayload.userId,
        process.env.JWT_REFRESH_KEY,
        process.env.JWT_REFRESH_EXPIRATION
      );
      console.log(newAccessToken, newRefreshToken);

      return res.status(200).send({
        success: true,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        message: 'New Access and Refresh Tokens generated successfully',
      });
    } catch (error) {
      res.status(401);
      next(error);
    }
  };
}
