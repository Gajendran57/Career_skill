const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const PredictedSkill = require("./models/PredictedSkill"); // Import the model

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const authRoutes = require("./routes/authRoute");
const mlRoutes = require("./routes/mlRoutes");
const skillRoutes = require("./routes/skillRoutes");
const skillMapRoutes = require("./routes/skillMapRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/skill-maps", skillMapRoutes);

// Endpoint to save the predicted skill
app.post("/api/save-prediction", async (req, res) => {
  const { userId, skill } = req.body;
  if (!userId || !skill) {
    return res.status(400).json({ error: "User ID and skill are required" });
  }

  try {
    await PredictedSkill.findOneAndUpdate(
      { userId },
      { skill },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Prediction saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save prediction" });
  }
});


// Endpoint to fetch the predicted skill
app.get("/api/predicted-skill", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const prediction = await PredictedSkill.findOne({ userId }).populate("userId");
    if (prediction) {
      res.status(200).json({ skill: prediction.skill });
    } else {
      res.status(404).json({ error: "No predicted skill found for this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch predicted skill" });
  }
});

// Error Handling Middleware (Handles 404 errors)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
