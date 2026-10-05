const mongoose = require("mongoose");

const subtopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  resources: [{ type: String }], // Multiple resource links
});

const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  subtopics: [subtopicSchema], // Each topic has multiple subtopics
  order: { type: Number, required: true },
});

const skillMapSchema = new mongoose.Schema({
  skillName: { type: String, required: true, unique: true },
  learningPath: [topicSchema], // Array of topics with subtopics
  courseLinks: [{ type: String }], // General course links
  youtubeLinks: [{ type: String }], // General YouTube links
});

const SkillMap = mongoose.model("SkillMap", skillMapSchema);
module.exports = SkillMap;
