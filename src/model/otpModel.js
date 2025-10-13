import mongoose from 'mongoose';
import { sendVerificationEmail } from '../services/sendVerificationMail.js';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
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
