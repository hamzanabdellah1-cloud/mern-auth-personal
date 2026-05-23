const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev_only_change_this_jwt_secret';
}

function normalizeEmail(email = '') {
  return email.trim().toLowerCase();
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    getJwtSecret(),
    { expiresIn: '7d' },
  );
}

function toSafeUser(user) {
  return user.toSafeUser();
}

function validateCredentials({ name, email, password }, requireName = false) {
  if (requireName && (!name || name.trim().length < 2)) {
    return 'Name must contain at least 2 characters.';
  }

  if (!email || !email.includes('@')) {
    return 'A valid email is required.';
  }

  if (!password || password.length < 6) {
    return 'Password must contain at least 6 characters.';
  }

  return null;
}

function validateProfile({ name, email, avatarUrl }) {
  if (!name || name.trim().length < 2) {
    return 'Name must contain at least 2 characters.';
  }

  if (!email || !email.includes('@')) {
    return 'A valid email is required.';
  }

  if (
    avatarUrl &&
    !avatarUrl.startsWith('data:image/') &&
    !avatarUrl.startsWith('http://') &&
    !avatarUrl.startsWith('https://')
  ) {
    return 'Avatar must be an image URL.';
  }

  if (avatarUrl && avatarUrl.length > 1_500_000) {
    return 'Avatar image is too large.';
  }

  return null;
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);
    const validationError = validateCredentials(
      { name, email, password },
      true,
    );

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'This email is already used.' });
    }

    const user = await User.create({
      name: name.trim(),
      email,
      password,
    });
    const safeUser = toSafeUser(user);

    return res.status(201).json({
      message: 'Account created successfully.',
      token: createToken(safeUser),
      user: safeUser,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);
    const validationError = validateCredentials({ email, password });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const safeUser = toSafeUser(user);

    return res.json({
      message: 'Logged in successfully.',
      token: createToken(safeUser),
      user: safeUser,
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({ user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.put('/me', authMiddleware, async (req, res, next) => {
  try {
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const avatarUrl =
      typeof req.body.avatarUrl === 'string' ? req.body.avatarUrl.trim() : '';
    const validationError = validateProfile({ name, email, avatarUrl });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: user._id },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'This email is already used.' });
    }

    user.name = name;
    user.email = email;
    user.avatarUrl = avatarUrl;

    await user.save();

    return res.json({
      message: 'Profile updated successfully.',
      user: toSafeUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
