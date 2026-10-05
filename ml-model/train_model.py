import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# 🔹 Get the absolute path of the CSV file
current_dir = os.path.dirname(os.path.abspath(__file__))
csv_file_path = os.path.join(current_dir, "career_skill_dataset.csv")

# 🔹 Load dataset
df = pd.read_csv(csv_file_path)
print("✅ Successfully loaded dataset!")

# 🔹 Define Recommended Skills based on Education Level & Occupation
skill_mapping = {
    "High School": {
        "Student": {
            "AI/ML": "Python Basics",
            "Full Stack Development": "HTML, CSS, JavaScript Basics",
            "Blockchain": "Blockchain Basics",
            "Cloud Computing": "AWS/Azure Fundamentals",
            "Networking": "TCP/IP Basics"
        },
        "Job Seeker": {
            "AI/ML": "Basic Data Science, AI Ethics",
            "Full Stack Development": "React Basics, REST APIs",
            "Blockchain": "Ethereum Basics, Smart Contracts",
            "Cloud Computing": "Cloud Security Basics",
            "Networking": "Routing & Switching, Firewalls"
        },
        "Working Professional": {
            "AI/ML": "AI in Business, Basic ML",
            "Full Stack Development": "Web Portfolio Development",
            "Blockchain": "Blockchain Use Cases",
            "Cloud Computing": "AWS Solutions Architect Prep",
            "Networking": "Network Troubleshooting, CCNA"
        }
    },
    "Bachelor's": {
        "Student": {
            "AI/ML": "Intermediate AI/ML, TensorFlow",
            "Full Stack Development": "MERN Stack, Backend Development",
            "Blockchain": "DApp Development, Web3.js",
            "Cloud Computing": "Serverless Computing, Kubernetes",
            "Networking": "Advanced Routing, Network Security"
        },
        "Job Seeker": {
            "AI/ML": "NLP, Computer Vision, AI Deployment",
            "Full Stack Development": "DevOps, CI/CD",
            "Blockchain": "Blockchain Security, Zero-Knowledge Proofs",
            "Cloud Computing": "Hybrid Cloud, IAM",
            "Networking": "Network Automation, Load Balancing"
        },
        "Working Professional": {
            "AI/ML": "AI for Business, Model Optimization",
            "Full Stack Development": "Microservices, API Security",
            "Blockchain": "DeFi & NFTs, Blockchain in Finance",
            "Cloud Computing": "Multi-Cloud Strategies, Cost Optimization",
            "Networking": "Enterprise Network Management"
        }
    },
    "Master's": {
        "Student": {
            "AI/ML": "Deep Learning, Reinforcement Learning",
            "Full Stack Development": "GraphQL, Kubernetes",
            "Blockchain": "Blockchain Scalability, Privacy Protocols",
            "Cloud Computing": "Cloud Architecture, Serverless Computing",
            "Networking": "SDN, Ethical Hacking"
        },
        "Job Seeker": {
            "AI/ML": "AI Research, Generative AI",
            "Full Stack Development": "System Design, CI/CD Automation",
            "Blockchain": "Enterprise Blockchain, Consensus Mechanisms",
            "Cloud Computing": "Cloud Security & Compliance",
            "Networking": "Penetration Testing, Zero Trust Security"
        },
        "Working Professional": {
            "AI/ML": "MLOps, AI Strategy",
            "Full Stack Development": "Scalable Architecture",
            "Blockchain": "Blockchain Integration in Business",
            "Cloud Computing": "DevOps in Cloud, High Availability",
            "Networking": "AI-Driven Network Security"
        }
    },
    "PhD": {
        "Student": {
            "AI/ML": "AI/ML Research, Explainable AI",
            "Full Stack Development": "Full Stack Research",
            "Blockchain": "Blockchain Research, Cryptographic Protocols",
            "Cloud Computing": "Cloud Research, Distributed Systems",
            "Networking": "Quantum Networking"
        },
        "Job Seeker": {
            "AI/ML": "Deep Learning Research, Generative AI",
            "Full Stack Development": "Scalable Web Architectures",
            "Blockchain": "Zero-Knowledge Proofs, Decentralized Finance",
            "Cloud Computing": "Edge Computing, Quantum Cloud",
            "Networking": "Advanced Cybersecurity Research"
        },
        "Working Professional": {
            "AI/ML": "AI Policy & Ethics, AI Leadership",
            "Full Stack Development": "Enterprise Full Stack Architecture",
            "Blockchain": "Advanced Cryptography, Secure DeFi",
            "Cloud Computing": "AI-Powered Cloud Solutions",
            "Networking": "Next-Gen Network Security"
        }
    }
}

# 🔹 Update "Recommended Skill" based on Education Level, Occupation & Interest
def map_recommended_skill(row):
    education = row["Education Level"]
    occupation = row["Occupation"]
    interest = row["Interest"]
    
    if education in skill_mapping and occupation in skill_mapping[education] and interest in skill_mapping[education][occupation]:
        return skill_mapping[education][occupation][interest]
    
    return "General Skill"

df["Recommended Skill"] = df.apply(map_recommended_skill, axis=1)
print("✅ Updated 'Recommended Skill' column based on Education, Occupation & Interest!")

# 🔹 Save the enhanced dataset
df.to_csv("enhanced_career_skill_dataset.csv", index=False)
print("✅ Enhanced dataset saved as enhanced_career_skill_dataset.csv")

# 🔹 Encode categorical variables
df_encoded = pd.get_dummies(df.drop(columns=["Recommended Skill"]))

# 🔹 Convert `Recommended Skill` into numerical labels
label_encoder = LabelEncoder()
df_encoded["Recommended Skill"] = label_encoder.fit_transform(df["Recommended Skill"])

# 🔹 Save label encoder for decoding predictions later
joblib.dump(label_encoder, "label_encoder.pkl")

# 🔹 Separate features and target variable
X = df_encoded.drop(columns=["Recommended Skill"])
y = df_encoded["Recommended Skill"]

# 🔹 Ensure feature column order remains fixed
feature_columns = X.columns.tolist()

# 🔹 Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 🔹 Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 🔹 Save model and feature columns
joblib.dump(model, "career_skill_predictor.pkl")
joblib.dump(feature_columns, "feature_columns.pkl")  # ✅ Save correct feature order

print("✅ Model trained and saved successfully!")
