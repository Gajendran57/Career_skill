import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(current_dir, "career_skill_dataset.csv")

# ---------------------------------------------------------------------------
# Column schema — this is the SINGLE SOURCE OF TRUTH shared by train + serve.
# If you change it here, change it in app.py too (or import from a shared file).
# ---------------------------------------------------------------------------
CATEGORICAL_COLS = [
    "Education",
    "Occupation",
    "Interest",
    "Experience",
    "LearningStyle",
    "TimeCommitment",
    "PreferredResources",
]
TARGET_COL = "Recommended Skill"

# ---------------------------------------------------------------------------
# Load dataset
# ---------------------------------------------------------------------------
df = pd.read_csv(csv_file_path)
print(f"✅ Loaded dataset: {df.shape[0]} rows, {df.shape[1]} cols")

# Normalise column names in case the CSV uses verbose versions.
rename_map = {
    "Education Level": "Education",
    "Learning Style": "LearningStyle",
    "Time Commitment": "TimeCommitment",
    "Preferred Resources": "PreferredResources",
}
df = df.rename(columns=rename_map)

missing = [c for c in CATEGORICAL_COLS if c not in df.columns]
if missing:
    raise ValueError(f"CSV is missing required columns: {missing}")

# ---------------------------------------------------------------------------
# Rule-based label generation (unchanged logic, just uses normalised names)
# ---------------------------------------------------------------------------
skill_mapping = {
    "High School": {
        "Student": {
            "AI/ML": "Python Basics",
            "Full Stack Development": "HTML, CSS, JavaScript Basics",
            "Blockchain": "Blockchain Basics",
            "Cloud Computing": "AWS/Azure Fundamentals",
            "Networking": "TCP/IP Basics",
        },
        "Job Seeker": {
            "AI/ML": "Basic Data Science, AI Ethics",
            "Full Stack Development": "React Basics, REST APIs",
            "Blockchain": "Ethereum Basics, Smart Contracts",
            "Cloud Computing": "Cloud Security Basics",
            "Networking": "Routing & Switching, Firewalls",
        },
        "Working Professional": {
            "AI/ML": "AI in Business, Basic ML",
            "Full Stack Development": "Web Portfolio Development",
            "Blockchain": "Blockchain Use Cases",
            "Cloud Computing": "AWS Solutions Architect Prep",
            "Networking": "Network Troubleshooting, CCNA",
        },
    },
    "Bachelor's": {
        "Student": {
            "AI/ML": "Intermediate AI/ML, TensorFlow",
            "Full Stack Development": "MERN Stack, Backend Development",
            "Blockchain": "DApp Development, Web3.js",
            "Cloud Computing": "Serverless Computing, Kubernetes",
            "Networking": "Advanced Routing, Network Security",
        },
        "Job Seeker": {
            "AI/ML": "NLP, Computer Vision, AI Deployment",
            "Full Stack Development": "DevOps, CI/CD",
            "Blockchain": "Blockchain Security, Zero-Knowledge Proofs",
            "Cloud Computing": "Hybrid Cloud, IAM",
            "Networking": "Network Automation, Load Balancing",
        },
        "Working Professional": {
            "AI/ML": "AI for Business, Model Optimization",
            "Full Stack Development": "Microservices, API Security",
            "Blockchain": "DeFi & NFTs, Blockchain in Finance",
            "Cloud Computing": "Multi-Cloud Strategies, Cost Optimization",
            "Networking": "Enterprise Network Management",
        },
    },
    "Master's": {
        "Student": {
            "AI/ML": "Deep Learning, Reinforcement Learning",
            "Full Stack Development": "GraphQL, Kubernetes",
            "Blockchain": "Blockchain Scalability, Privacy Protocols",
            "Cloud Computing": "Cloud Architecture, Serverless Computing",
            "Networking": "SDN, Ethical Hacking",
        },
        "Job Seeker": {
            "AI/ML": "AI Research, Generative AI",
            "Full Stack Development": "System Design, CI/CD Automation",
            "Blockchain": "Enterprise Blockchain, Consensus Mechanisms",
            "Cloud Computing": "Cloud Security & Compliance",
            "Networking": "Penetration Testing, Zero Trust Security",
        },
        "Working Professional": {
            "AI/ML": "MLOps, AI Strategy",
            "Full Stack Development": "Scalable Architecture",
            "Blockchain": "Blockchain Integration in Business",
            "Cloud Computing": "DevOps in Cloud, High Availability",
            "Networking": "AI-Driven Network Security",
        },
    },
    "PhD": {
        "Student": {
            "AI/ML": "AI/ML Research, Explainable AI",
            "Full Stack Development": "Full Stack Research",
            "Blockchain": "Blockchain Research, Cryptographic Protocols",
            "Cloud Computing": "Cloud Research, Distributed Systems",
            "Networking": "Quantum Networking",
        },
        "Job Seeker": {
            "AI/ML": "Deep Learning Research, Generative AI",
            "Full Stack Development": "Scalable Web Architectures",
            "Blockchain": "Zero-Knowledge Proofs, Decentralized Finance",
            "Cloud Computing": "Edge Computing, Quantum Cloud",
            "Networking": "Advanced Cybersecurity Research",
        },
        "Working Professional": {
            "AI/ML": "AI Policy & Ethics, AI Leadership",
            "Full Stack Development": "Enterprise Full Stack Architecture",
            "Blockchain": "Advanced Cryptography, Secure DeFi",
            "Cloud Computing": "AI-Powered Cloud Solutions",
            "Networking": "Next-Gen Network Security",
        },
    },
}


def map_recommended_skill(row):
    edu = row["Education"]
    occ = row["Occupation"]
    interest = row["Interest"]
    try:
        return skill_mapping[edu][occ][interest]
    except KeyError:
        return "General Skill"


df[TARGET_COL] = df.apply(map_recommended_skill, axis=1)
print("✅ Generated 'Recommended Skill' labels")

# Save enhanced dataset for reference
df.to_csv(os.path.join(current_dir, "enhanced_career_skill_dataset.csv"), index=False)

# ---------------------------------------------------------------------------
# Features / target
# ---------------------------------------------------------------------------
X = df[CATEGORICAL_COLS].copy()
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(df[TARGET_COL])

# ---------------------------------------------------------------------------
# Build pipeline: one-hot encode -> RandomForest
# ---------------------------------------------------------------------------
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_COLS),
    ],
    remainder="drop",
)

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)),
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

pipeline.fit(X_train, y_train)
acc = pipeline.score(X_test, y_test)
print(f"✅ Model trained — test accuracy: {acc:.4f}")

# ---------------------------------------------------------------------------
# Persist pipeline + label encoder (only two files needed now)
# ---------------------------------------------------------------------------
joblib.dump(pipeline, os.path.join(current_dir, "career_skill_predictor.pkl"))
joblib.dump(label_encoder, os.path.join(current_dir, "label_encoder.pkl"))
print("✅ Saved career_skill_predictor.pkl and label_encoder.pkl")

# NOTE: feature_columns.pkl is no longer needed — the OneHotEncoder inside
# the pipeline remembers the exact feature order it was fit on.