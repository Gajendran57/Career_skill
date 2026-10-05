const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

let dataset = [];

// Load the dataset synchronously before starting the server
const datasetPath = path.join(__dirname, "../data/career_skill_dataset.csv");
try {
    const fileData = fs.readFileSync(datasetPath, "utf8");
    const parsedData = Papa.parse(fileData, { header: true }).data;
    
    // Remove empty or invalid rows
    dataset = parsedData.filter(row => row["Recommended Skill"]);
    console.log("Dataset loaded successfully:", dataset.length, "records");
} catch (error) {
    console.error("Error loading dataset:", error);
}

// Predict Skill Function
const predictSkill = (req, res) => {
    try {
        const { age, education, occupation, interest, experience } = req.body;

        // Filter dataset based on user responses
        let filteredSkills = dataset.filter(row =>
            row["Age"] <= age &&
            row["Education Level"] === education &&
            row["Occupation"] === occupation &&
            row["Interest"] === interest &&
            row["Experience"] === experience
        );

        // If no exact match is found, find the closest match based on interest
        if (filteredSkills.length === 0) {
            filteredSkills = dataset.filter(row => row["Interest"] === interest);
        }

        // If still no match, return the most common skill in that interest category
        if (filteredSkills.length === 0) {
            const mostCommonSkill = dataset
                .filter(row => row["Interest"])
                .map(row => row["Recommended Skill"])
                .reduce((acc, skill) => {
                    acc[skill] = (acc[skill] || 0) + 1;
                    return acc;
                }, {});

            const recommendedSkill = Object.keys(mostCommonSkill).reduce((a, b) =>
                mostCommonSkill[a] > mostCommonSkill[b] ? a : b
            );

            return res.json({ skill: recommendedSkill });
        }

        // Pick the most relevant skill from filtered results
        const recommendedSkill = filteredSkills[0]["Recommended Skill"];
        res.json({ skill: recommendedSkill });

    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { predictSkill };
