const axios = require("axios");

// Flask ML service URL (override via env in production)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:3000";

// Must match CATEGORICAL_COLS in ml-model/app.py and train_model.py
const REQUIRED_FIELDS = [
  "Education",
  "Occupation",
  "Interest",
  "Experience",
  "LearningStyle",
  "TimeCommitment",
  "PreferredResources",
];

const predictSkill = async (req, res) => {
  try {
    // Basic validation before hitting the ML service
    const missing = REQUIRED_FIELDS.filter(
      (f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === ""
    );
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    }

    // Forward only the expected fields (defensive)
    const payload = {};
    for (const f of REQUIRED_FIELDS) payload[f] = req.body[f];

    const response = await axios.post(`${ML_SERVICE_URL}/predict`, payload, {
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });

    return res.status(200).json({ skill: response.data.skill });
  } catch (error) {
    console.error("❌ Prediction error:", error.message);

    if (error.response) {
      // Forward the ML service's status + body
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(503).json({ error: "ML service unavailable" });
  }
};

module.exports = { predictSkill };