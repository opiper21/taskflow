import express, { Response } from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const tasks = await Task.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      owner: req.userId,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
  { _id: new mongoose.Types.ObjectId(req.params.id as string), owner: req.userId },
  { title, description, status, dueDate },
  { new: true }
);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
  try {
    const task = await Task.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.params.id as string),
      owner: req.userId,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;