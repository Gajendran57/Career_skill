import sys
import json
import joblib
import pandas as pd

# Load the trained model and encoders
model = joblib.load("career_skill_model.pkl")
label_encoders = joblib.load("label_encoders.pkl")

# Get user input from Node.js
user_input = json.loads(sys.argv[1])

# Convert user input into encoded format
input_data = []
for key in label_encoders.keys():
    input_data.append(label_encoders[key].transform([user_input[key]])[0])

# Predict skill recommendation
prediction = model.predict([input_data])[0]

print(prediction)  # Send result back to Node.js
