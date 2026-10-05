const express = require("express");
const mongoose = require("mongoose");
const SkillMap = require("../models/SkillMap");

const router = express.Router();

// ✅ Get a specific skill map by ID (Fixed)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🛑 Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Skill Map ID format" });
    }

    const skillMap = await SkillMap.findById(id);
    if (!skillMap) {
      return res.status(404).json({ message: "Skill map not found" });
    }

    res.json(skillMap);
  } catch (err) {
    res.status(500).json({ message: "Error fetching skill map", error: err.message });
  }
});

// ✅ Get all skill maps
router.get("/", async (req, res) => {
  try {
    const skillMaps = await SkillMap.find();
    res.json(skillMaps);
  } catch (err) {
    res.status(500).json({ message: "Error fetching skill maps", error: err.message });
  }
});

// ✅ Create a new skill map
router.post("/", async (req, res) => {
  try {
    const { skillName, learningPath, courseLinks, youtubeLinks } = req.body;

    if (!skillName || !learningPath) {
      return res.status(400).json({ message: "Skill Name and Learning Path are required" });
    }

    const newSkillMap = new SkillMap({
      skillName,
      learningPath,
      courseLinks,
      youtubeLinks,
    });

    await newSkillMap.save();
    res.status(201).json(newSkillMap);
  } catch (err) {
    res.status(500).json({ message: "Error saving skill map", error: err.message });
  }
});

// ✅ Update an existing skill map
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Skill Map ID format" });
    }

    const updatedSkillMap = await SkillMap.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSkillMap) {
      return res.status(404).json({ message: "Skill map not found" });
    }
    res.json(updatedSkillMap);
  } catch (err) {
    res.status(500).json({ message: "Error updating skill map", error: err.message });
  }
});

// ✅ Delete a skill map
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Skill Map ID format" });
    }

    const deletedSkillMap = await SkillMap.findByIdAndDelete(id);
    if (!deletedSkillMap) {
      return res.status(404).json({ message: "Skill map not found" });
    }

    res.json({ message: "Skill map deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting skill map", error: err.message });
  }
});

module.exports = router;
