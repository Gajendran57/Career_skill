import pandas as pd
import random

# Define possible values
ages = list(range(18, 40))
education_levels = ["High School", "Bachelor's", "Master's", "PhD"]
occupations = ["Student", "Job Seeker", "Working Professional"]
interests = ["AI/ML", "Full Stack Development", "Blockchain", "Cloud Computing", "Networking"]
experience_levels = ["Beginner", "Intermediate", "Advanced"]
learning_styles = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"]
time_commitments = ["<5 hrs/week", "5-10 hrs/week", ">10 hrs/week"]
resources = ["Free", "Paid", "Free & Paid"]
skills = {
    "AI/ML": ["Python, TensorFlow, PyTorch"],
    "Full Stack Development": ["React, Node.js, MongoDB"],
    "Blockchain": ["Solidity, Web3.js, Hyperledger"],
    "Cloud Computing": ["AWS, Azure, Google Cloud"],
    "Networking": ["CCNA, Wireshark, Linux Networking"]
}

# Generate dataset
data = []
for _ in range(1000):  # Create 1000 rows
    age = random.choice(ages)
    edu = random.choice(education_levels)
    occ = random.choice(occupations)
    interest = random.choice(interests)
    exp = random.choice(experience_levels)
    learn_style = random.choice(learning_styles)
    time = random.choice(time_commitments)
    resource = random.choice(resources)
    skill = skills[interest]

    data.append([age, edu, occ, interest, exp, learn_style, time, resource, skill])

# Convert to DataFrame
df = pd.DataFrame(data, columns=["Age", "Education Level", "Occupation", "Interest", "Experience", "Learning Style", "Time Commitment", "Preferred Resources", "Recommended Skill"])

# Save to CSV
df.to_csv("career_skill_dataset.csv", index=False)

print("Dataset Created Successfully!")
