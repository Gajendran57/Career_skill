const mongoose = require("mongoose");

const predictedSkillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This should match the model name of your User schema
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
});

const PredictedSkill = mongoose.model("PredictedSkill", predictedSkillSchema);

module.exports = PredictedSkill;