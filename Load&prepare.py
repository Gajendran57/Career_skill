import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
import joblib

# Load dataset
df = pd.read_csv("career_skill_dataset.csv")

# Encode categorical values
label_encoders = {}
for column in df.columns[:-1]:  # Exclude "Recommended Skill"
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    label_encoders[column] = le  # Store encoders for later use

# Split dataset into training and test sets
X = df.drop(columns=["Recommended Skill"])
y = df["Recommended Skill"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Decision Tree model
model = DecisionTreeClassifier()
model.fit(X_train, y_train)

# Save the model and encoders
joblib.dump(model, "career_skill_model.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")

print("Model trained and saved successfully!")
