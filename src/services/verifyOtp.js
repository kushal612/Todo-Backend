import User from '../model/userModel.js';
import Otp from '../model/otpModel.js';

export default async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const validUser = await User.findOne({ email: email });
    if (validUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const validOtp = await Otp.findOne({ email: email, otp: otp });
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await Otp.deleteOne({ email: email, otp: otp }); // Remove used OTP

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
