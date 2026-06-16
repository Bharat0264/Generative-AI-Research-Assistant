import User from '../models/User.js';
import { AppError, asyncHandler } from '../utils/errors.js';
import { signToken } from '../utils/token.js';

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email });

  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const user = await User.create(req.body);
  const token = signToken(user._id);

  res.status(201).json({ token, user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id);

  res.json({ token, user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
