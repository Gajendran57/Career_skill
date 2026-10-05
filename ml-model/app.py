from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load trained model, feature columns, and label encoder
model = joblib.load("career_skill_predictor.pkl")
feature_columns = joblib.load("feature_columns.pkl")  # Load correct feature order
label_encoder = joblib.load("label_encoder.pkl")  # Load label encoder

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Received Data:", data)  # Debugging log

        # Convert input to DataFrame
        df = pd.DataFrame([data])

        # One-hot encode categorical fields
        df_encoded = pd.get_dummies(df, columns=["Education", "Occupation", "Interest", "Experience", "LearningStyle", "TimeCommitment", "PreferredResources"])

        # Ensure DataFrame has all required columns
        for col in feature_columns:
            if col not in df_encoded.columns:
                df_encoded[col] = 0

        # Reorder columns to match the model
        df_encoded = df_encoded[feature_columns]

        print("Final DataFrame for Prediction:", df_encoded)  # Debugging log

        # Make prediction
        prediction_num = model.predict(df_encoded)[0]

        # Convert numerical prediction back to skill name
        prediction_label = label_encoder.inverse_transform([prediction_num])[0]

        return jsonify({"skill": prediction_label})

    except Exception as e:
        print("Error Occurred:", str(e))  # Debugging log
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
