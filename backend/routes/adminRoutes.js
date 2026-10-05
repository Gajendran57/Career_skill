const express = require("express");
const router = express.Router();
const Skill = require("../models/SkillModel");

router.post("/upload-skill", async (req, res) => {
    const { name, description, resource, email, password } = req.body;

    if (email !== "admin@gmail.com" || password !== "admin@123") {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const newSkill = new Skill({ name, description, resource });
    await newSkill.save();

    res.json({ message: "Skill uploaded successfully!" });
});

module.exports = router;
