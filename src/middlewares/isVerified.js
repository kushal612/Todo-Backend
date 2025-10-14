import User from '../model/userModel.js';

export default async function isVerified(req, res, next) {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists.verified) {
      res.status(400).json({ message: 'User already verified and registered' });
    }
    next();
  } catch (err) {
    next(err);
  }
}
