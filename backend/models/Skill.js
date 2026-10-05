const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Skill", skillSchema);
