import express from "express";
import Task from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

function isEmptyText(text) {
  return typeof text !== "string" || text.trim().length === 0;
}

function userFilter(req) {
  return {
    _id: req.params.id,
    user: req.user.id,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { text } = req.body;

    if (isEmptyText(text)) {
      return res.status(400).json({
        error: "Task text cannot be empty",
      });
    }

    const task = await Task.create({
      text: text.trim(),
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { text, completed } = req.body;
    const updates = {};

    if (text !== undefined) {
      if (isEmptyText(text)) {
        return res.status(400).json({
          error: "Task text cannot be empty",
        });
      }
      updates.text = text.trim();
    }

    if (completed !== undefined) {
      updates.completed = Boolean(completed);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No valid fields to update",
      });
    }

    const task = await Task.findOneAndUpdate(userFilter(req), updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete(userFilter(req));

    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
