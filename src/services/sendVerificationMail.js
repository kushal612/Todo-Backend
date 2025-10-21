import OTP from '../model/otpModel.js';
import mailSender from '../utils/mailSender.js';

export async function sendVerificationEmail(email, otpValue) {
  try {
    await mailSender(
      email,
      'Your OTP Code',
      `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333; text-align: center;">Verification Code</h2>
    <p style="font-size: 16px; color: #555;">
      Hello,
    </p>
    <p style="font-size: 16px; color: #555;">
      You requested a verification code. Please use the following OTP to complete your action:
    </p>
    <p style="font-size: 24px; font-weight: bold; text-align: center; color: #1a73e8; margin: 20px 0;">
      ${otpValue}
    </p>
    <p style="font-size: 14px; color: #777;">
      This OTP is valid for a limited time only. Do not share it with anyone.
    </p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
    <p style="font-size: 12px; color: #999; text-align: center;">
      If you did not request this code, please ignore this email.
    </p>
  </div>
  `
    );

    await OTP.findOneAndUpdate(
      { email },
      {
        $push: {
          otps: {
            otp: otpValue,
            createdAt: new Date(),
          },
        },
      },
      { upsert: true, new: true }
    );

    console.log(`OTP saved and email sent to ${email}`);
  } catch (error) {
    console.log('Error occurred while sending email: ', error);
    throw error;
  }
}
