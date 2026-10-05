const express = require("express");
const Skill = require("../models/Skill");

const router = express.Router();

// Add New Skill
router.post("/", async (req, res) => {
  try {
    const { skillName, description } = req.body;
    const newSkill = new Skill({ skillName, description });
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    console.error("❌ Error adding skill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    console.error("❌ Error fetching skills:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Skill
router.delete("/:id", async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Skill deleted" });
  } catch (error) {
    console.error("❌ Error deleting skill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
