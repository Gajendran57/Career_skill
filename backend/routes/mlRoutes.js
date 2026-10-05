const express = require("express");
const { predictSkill } = require("../controllers/mlController");

const router = express.Router();

router.post("/predict", predictSkill);

module.exports = router;
