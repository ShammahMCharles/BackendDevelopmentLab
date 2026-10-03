const express = require("express");

const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMIddleware");

const router = express.Router();

// Protect every project route
router.use(authMiddleware);

// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      user: req.user,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET ALL USER PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET ONE PROJECT
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // OWNERSHIP CHECK
    if (project.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You do not have permission to access this project",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// UPDATE PROJECT
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // OWNERSHIP CHECK
    if (project.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You do not have permission to update this project",
      });
    }

    const { name, description } = req.body;

    if (name !== undefined) {
      project.name = name;
    }

    if (description !== undefined) {
      project.description = description;
    }

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// DELETE PROJECT
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // OWNERSHIP CHECK
    if (project.user.toString() !== req.user.toString()) {
      return res.status(403).json({
        message: "You do not have permission to delete this project",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;