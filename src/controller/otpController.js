import otpGenerator from 'otp-generator';
import OTP from '../model/otpModel.js';
import User from '../model/userModel.js';
import { sendVerificationEmail } from '../services/sendVerificationMail.js';

export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await sendVerificationEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and OTP are required.' });
  }

  try {
    const userOTPEntry = await OTP.findOne({ email });

    if (!userOTPEntry || userOTPEntry.otps.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No OTP found for this email.' });
    }

    const latestOTP = userOTPEntry.otps[userOTPEntry.otps.length - 1];

    if (latestOTP.otp !== otp) {
      return res.status(401).json({ success: false, message: 'Invalid OTP.' });
    }

    if (new Date() > new Date(latestOTP.expiryOTP)) {
      return res
        .status(410)
        .json({ success: false, message: 'OTP has expired.' });
    }

    await User.findOneAndUpdate({ email }, { verified: true }, { new: true });

    return res.status(200).json({ success: true, message: 'OTP is valid.' });
  } catch (error) {
    next(error);
  }
};
