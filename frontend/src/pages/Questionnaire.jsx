import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSun, FiMoon, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const QuestionnairePage = ({ onComplete }) => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [formData, setFormData] = useState({
        Age: "",
        Education: "",
        Occupation: "",
        Interest: "",
        Experience: "",
        LearningStyle: "",
        TimeCommitment: "",
        PreferredResources: ""
    });

    const [prediction, setPrediction] = useState("");
    const [isFinalized, setIsFinalized] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.Age) newErrors.Age = "Age is required";
        if (formData.Age && (formData.Age < 18 || formData.Age > 40)) newErrors.Age = "Age must be 18-40";
        if (!formData.Education) newErrors.Education = "Education level is required";
        if (!formData.Occupation) newErrors.Occupation = "Occupation is required";
        if (!formData.Interest) newErrors.Interest = "Field of interest is required";
        if (!formData.Experience) newErrors.Experience = "Experience level is required";
        if (!formData.LearningStyle) newErrors.LearningStyle = "Learning style is required";
        if (!formData.TimeCommitment) newErrors.TimeCommitment = "Time commitment is required";
        if (!formData.PreferredResources) newErrors.PreferredResources = "Preferred resources are required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
      
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? user.userId : null;
      
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      
            if (response.data.skill) {
                setPrediction(response.data.skill);
                await axios.post("http://localhost:5000/api/save-prediction", {
                    userId,
                    skill: response.data.skill,
                });
            } else {
                console.error("No skill returned from API", response.data);
                setPrediction("No skill prediction available");
            }
        } catch (error) {
            console.error("Prediction failed:", error);
            setPrediction("Error: Could not get prediction");
        } finally {
            setIsSubmitting(false);
        }
    };

const handleFinalize = async () => {
        navigate("/dashboard");
};

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            {/* Dark Mode Toggle */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`fixed top-4 right-4 p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"}`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-md rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                    <h2 className="text-xl font-bold text-center text-white py-2">
                        Skill Prediction Questionnaire
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Age */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Age <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="Age"
                            value={formData.Age}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.Age ? "border-red-500" : ""}`}
                            placeholder="Enter your age"
                            min="18"
                            max="40"
                        />
                        {errors.Age && <p className="mt-1 text-sm text-red-500">{errors.Age}</p>}
                    </div>

                    {/* Education Level */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Education Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="Education"
                            value={formData.Education}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.Education ? "border-red-500" : ""}`}
                        >
                            <option value="">Select your education level</option>
                            <option value="High School">High School</option>
                            <option value="Bachelor's">Bachelor's</option>
                            {formData.Age >= 22 && <option value="Master's">Master's</option>}
                            {formData.Age >= 25 && <option value="PhD">PhD</option>}
                        </select>
                        {errors.Education && <p className="mt-1 text-sm text-red-500">{errors.Education}</p>}
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Occupation <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="Occupation"
                            value={formData.Occupation}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.Occupation ? "border-red-500" : ""}`}
                        >
                            <option value="">Select your occupation</option>
                            <option value="Student">Student</option>
                            <option value="Job Seeker">Job Seeker</option>
                            <option value="Working Professional">Working Professional</option>
                        </select>
                        {errors.Occupation && <p className="mt-1 text-sm text-red-500">{errors.Occupation}</p>}
                    </div>

                    {/* Field of Interest */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Field of Interest <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="Interest"
                            value={formData.Interest}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.Interest ? "border-red-500" : ""}`}
                        >
                            <option value="">Select your field of interest</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Full Stack Development">Full Stack Development</option>
                            <option value="Networking">Networking</option>
                        </select>
                        {errors.Interest && <p className="mt-1 text-sm text-red-500">{errors.Interest}</p>}
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Experience Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="Experience"
                            value={formData.Experience}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.Experience ? "border-red-500" : ""}`}
                        >
                            <option value="">Select your experience level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        {errors.Experience && <p className="mt-1 text-sm text-red-500">{errors.Experience}</p>}
                    </div>

                    {/* Learning Style */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Learning Style <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="LearningStyle"
                            value={formData.LearningStyle}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.LearningStyle ? "border-red-500" : ""}`}
                        >
                            <option value="">Select your learning style</option>
                            <option value="Visual">Visual</option>
                            <option value="Auditory">Auditory</option>
                            <option value="Reading/Writing">Reading/Writing</option>
                            <option value="Kinesthetic">Kinesthetic</option>
                        </select>
                        {errors.LearningStyle && <p className="mt-1 text-sm text-red-500">{errors.LearningStyle}</p>}
                    </div>

                    {/* Time Commitment */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Time Commitment <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="TimeCommitment"
                            value={formData.TimeCommitment}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.TimeCommitment ? "border-red-500" : ""}`}
                        >
                            <option value="">Select your time commitment</option>
                            <option value="<5 hrs/week">Less than 5 hours/week</option>
                            <option value="5-10 hrs/week">5-10 hours/week</option>
                            <option value=">10 hrs/week">More than 10 hours/week</option>
                        </select>
                        {errors.TimeCommitment && <p className="mt-1 text-sm text-red-500">{errors.TimeCommitment}</p>}
                    </div>

                    {/* Preferred Resources */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Preferred Resources <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="PreferredResources"
                            value={formData.PreferredResources}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} ${errors.PreferredResources ? "border-red-500" : ""}`}
                        >
                            <option value="">Select your preferred resources</option>
                            <option value="Free">Free resources</option>
                            <option value="Paid">Paid resources</option>
                            <option value="Free & Paid">Both free and paid</option>
                        </select>
                        {errors.PreferredResources && <p className="mt-1 text-sm text-red-500">{errors.PreferredResources}</p>}
                    </div>

                    {/* Prediction Result */}
                    {prediction && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg ${darkMode ? "bg-green-900/30 border border-green-800" : "bg-green-100 border border-green-200"}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${darkMode ? "bg-green-800/50" : "bg-green-200"}`}>
                                    <FiArrowRight className={`${darkMode ? "text-green-300" : "text-green-600"}`} />
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${darkMode ? "text-green-300" : "text-green-800"}`}>Recommended Skill:</h3>
                                    <p className={`${darkMode ? "text-green-100" : "text-green-700"}`}>{prediction}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-4">
                        {prediction && !isFinalized ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleFinalize}
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"} text-white transition-colors`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiArrowRight />
                                        Continue to Dashboard
                                    </>
                                )}
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg font-medium ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
                            >
                                {isSubmitting ? "Predicting..." : "Predict My Skill"}
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default QuestionnairePage;