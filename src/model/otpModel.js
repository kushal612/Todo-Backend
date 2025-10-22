import mongoose from 'mongoose';
import { sendVerificationEmail } from '../services/sendVerificationMail.js';

const otpSubSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiryOTP: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otps: [otpSubSchema],
});

otpSchema.pre('save', async function (next) {
  console.log('New document saved to the database');
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
