import express from "express";
import User from "../models/User.js";
import { requireAuth, signToken } from "../middleware/auth.js";

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(email, password) {
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    return "A valid email is required";
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validationError = validateCredentials(email, password);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail,
    });

    if (existing) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const user = await User.create({
      email: normalizedEmail,
      password,
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validationError = validateCredentials(email, password);

    if (validationError) {
      return res.status(400).json({
        error: validationError,
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

export default router;
