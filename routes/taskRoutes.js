const express = require("express");

const Task = require("../models/Task");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMIddleware");

const router = express.Router();

router.use(authMiddleware);

// CREATE TASK FOR PROJECT
router.post("/projects/:projectId/tasks", async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check project ownership
    if (project.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You do not own this project",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      project: project._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET ALL TASKS FOR PROJECT
router.get("/projects/:projectId/tasks", async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check project ownership
    if (project.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You do not own this project",
      });
    }

    const tasks = await Task.find({
      project: project._id,
    });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// UPDATE TASK
router.put("/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Find parent project
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Parent project not found",
      });
    }

    // Check parent project ownership
    if (project.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You do not own this task's project",
      });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// DELETE TASK
router.delete("/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Find parent project
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        message: "Parent project not found",
      });
    }

    // Check parent project ownership
    if (project.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You do not own this task's project",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;