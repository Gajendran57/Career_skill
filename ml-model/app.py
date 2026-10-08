from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Load the full pipeline (preprocessing + model) and the label encoder.
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    pipeline = joblib.load(os.path.join(BASE_DIR, "career_skill_predictor.pkl"))
    label_encoder = joblib.load(os.path.join(BASE_DIR, "label_encoder.pkl"))
    print("✅ Loaded ML pipeline and label encoder")
except Exception as e:
    print(f"❌ Failed to load ML artifacts: {e}")
    raise

# Must match CATEGORICAL_COLS in train_model.py
CATEGORICAL_COLS = [
    "Education",
    "Occupation",
    "Interest",
    "Experience",
    "LearningStyle",
    "TimeCommitment",
    "PreferredResources",
]


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Request body must be JSON"}), 400

        # Validate required fields up-front so we fail fast with a clear message.
        missing = [c for c in CATEGORICAL_COLS if c not in data or data[c] in (None, "")]
        if missing:
            return jsonify({"error": f"Missing required fields: {missing}"}), 400

        # Build a single-row DataFrame with the exact columns the pipeline expects.
        row = {c: str(data[c]) for c in CATEGORICAL_COLS}
        df = pd.DataFrame([row])

        print(f"🔎 Predicting for: {row}")

        # Pipeline handles encoding internally; unknown categories -> all-zero
        # vector thanks to handle_unknown="ignore".
        pred_num = pipeline.predict(df)[0]
        pred_label = label_encoder.inverse_transform([pred_num])[0]

        return jsonify({"skill": pred_label}), 200

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # For local dev only. In production, run with:
    #   gunicorn app:app --bind 0.0.0.0:3000
    app.run(host="0.0.0.0", port=3000, debug=True)