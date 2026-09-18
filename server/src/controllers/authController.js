import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import generateToken from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

// Helper to generate Refresh Token
const generateRefreshToken = (userId) => {
  if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not configured');
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
};

const safeEqual = (provided = '', expected = '') => {
  const providedBuffer = Buffer.from(String(provided));
  const expectedBuffer = Buffer.from(String(expected));
  return providedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};

const buildLoginResponse = async (user) => {
  const accessToken = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    token: accessToken,
    refreshToken,
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Generate 6-digit email verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password,
      phone,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });

    // Send email
    await sendVerificationEmail(user.email, user.name, verificationCode);

    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful. Verification email sent.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({
      email,
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification code
// @route   POST /api/auth/resend-code
// @access  Public
export const resendVerificationCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, user.name, verificationCode);

    res.json({ success: true, message: 'New verification code sent to your email.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'This account has been blocked.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Administrators must use the secure admin login.' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: await buildLoginResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Secure administrator login (email + password + private access code)
// @route   POST /api/auth/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password, accessCode } = req.body;
    const allowedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const configuredCode = process.env.ADMIN_ACCESS_CODE;

    if (!allowedEmail || !configuredCode) {
      return res.status(503).json({ success: false, message: 'Administrator access is not configured on the server.' });
    }

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const emailAllowed = safeEqual(normalizedEmail, allowedEmail);
    const codeAllowed = safeEqual(accessCode, configuredCode);
    const user = emailAllowed ? await User.findOne({ email: normalizedEmail }) : null;

    if (!user || user.role !== 'admin' || !(await user.matchPassword(password)) || !codeAllowed) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'This administrator account is blocked.' });
    }

    res.json({
      success: true,
      message: 'Administrator login successful',
      data: await buildLoginResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required.' });
    }

    if (!process.env.JWT_REFRESH_SECRET) throw new Error('JWT_REFRESH_SECRET is not configured');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'User is blocked' });
    }

    const newAccessToken = generateToken(user._id);

    res.json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token refresh failed.', error: error.message });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not found.' });
    }

    // Create reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash and set reset fields
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    // Send email
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. Please login with your new password.' });
  } catch (error) {
    next(error);
  }
};
