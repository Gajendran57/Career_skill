import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { MdExplore } from "react-icons/md";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { GiArtificialIntelligence } from "react-icons/gi";
import { FaCode, FaShieldAlt, FaServer } from "react-icons/fa";
import { SiBlockchaindotcom } from "react-icons/si";
import { HiLightBulb, HiBookOpen } from "react-icons/hi";
import { RiRoadMapLine } from "react-icons/ri";
import axios from "axios";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [displayedSkill, setDisplayedSkill] = useState(null);
  const [predictedSkills, setPredictedSkills] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const topics = [
    { name: "AI/ML", icon: <GiArtificialIntelligence className="text-purple-500" /> },
    { name: "Web Development", icon: <FaCode className="text-blue-500" /> },
    { name: "Cybersecurity", icon: <FaShieldAlt className="text-green-500" /> },
    { name: "Blockchain", icon: <SiBlockchaindotcom className="text-yellow-500" /> },
    { name: "Cloud Computing", icon: <FaServer className="text-red-500" /> }
  ];

useEffect(() => {
  const initDashboard = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored user:", storedUser);

    if (!storedUser) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    setPredictedSkills([]);
    setSelectedTopic(null);
    setFilteredSkills([]);
    setDisplayedSkill(null);

    try {
      const skillsResponse = await fetch("http://localhost:5000/api/skill-maps");
      const allSkillsData = await skillsResponse.json();
      setAllSkills(allSkillsData);

      const predictedRes = await fetch(`http://localhost:5000/api/predicted-skill?userId=${storedUser.userId}`);
      const predictedData = await predictedRes.json();

      if (predictedRes.ok && predictedData.skill) {
        const predictedSkillNames = Array.isArray(predictedData.skill)
          ? predictedData.skill
          : [predictedData.skill];

        const matchedSkills = allSkillsData.filter(skill =>
          predictedSkillNames.some(pred => pred.toLowerCase() === skill.skillName.toLowerCase())
        );

        setPredictedSkills(matchedSkills);
        console.log("Matched predicted skills:", matchedSkills);
        setActiveTab("predicted");
      } else {
        console.log(predictedData.error || "No predicted skill found for this user.");
      }
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  initDashboard();

}, [navigate]);

useEffect(() => { 
  fetchAllSkills();
}, []);



  const fetchAllSkills = () => {
    axios.get("http://localhost:5000/api/skill-maps")
      .then((response) => {
        setAllSkills(response.data);
      })
      .catch((error) => console.error("Error fetching all skills", error))
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("predictedSkillFull");
    navigate("/login");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTopic(null);
    setFilteredSkills([]);
    setDisplayedSkill(null);
    setMobileMenuOpen(false);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setDisplayedSkill(null);
    let filtered = [];
    const t = topic.toLowerCase();

    filtered = allSkills.filter(skill =>
      (t === "ai/ml" && (skill.skillName.toLowerCase().includes("ai") || skill.skillName.toLowerCase().includes("ml") || skill.skillName.toLowerCase().includes("machine learning"))) ||
      (t === "web development" && (skill.skillName.toLowerCase().includes("web") || skill.skillName.toLowerCase().includes("frontend") || skill.skillName.toLowerCase().includes("backend"))) ||
      (t === "cybersecurity" && (skill.skillName.toLowerCase().includes("security") || skill.skillName.toLowerCase().includes("cyber") || skill.skillName.toLowerCase().includes("cryptography"))) ||
      (t === "blockchain" && (skill.skillName.toLowerCase().includes("blockchain") || skill.skillName.toLowerCase().includes("defi"))) ||
      (t === "cloud computing" && (skill.skillName.toLowerCase().includes("cloud") || skill.skillName.toLowerCase().includes("aws") || skill.skillName.toLowerCase().includes("azure") || skill.skillName.toLowerCase().includes("gcp")))
    );

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    setFilteredSkills(shuffled.slice(0, 5));
  };

  const handleSkillClick = (skill) => {
    setDisplayedSkill(skill);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <GiArtificialIntelligence className="text-blue-600 dark:text-blue-400 text-2xl mr-2" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SkillMapper
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => handleTabChange("home")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === "home"
                    ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <AiOutlineHome size={20} />
                <span>Home</span>
              </button>

              {predictedSkills.length > 0 && (
                <button
                  onClick={() => handleTabChange("predicted")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === "predicted"
                      ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                      : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <RiRoadMapLine size={20} />
                  <span>Predicted</span>
                </button>
              )}

              <button
                onClick={() => navigate("/questionnaire")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
              >
                <HiLightBulb size={20} />
                <span>Predict</span>
              </button>

              <Link
                to="/explore"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all"
              >
                <MdExplore size={20} />
                <span>Explore</span>
              </Link>

              <button
                onClick={() => navigate("/profile")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === "/profile"
                    ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <AiOutlineUser size={20} />
                <span>Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/50 transition-all"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <button
                onClick={() => handleTabChange("home")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  activeTab === "home"
                    ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <AiOutlineHome size={20} />
                <span>Home</span>
              </button>

              {predictedSkills.length > 0 && (
                <button
                  onClick={() => handleTabChange("predicted")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                    activeTab === "predicted"
                      ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                      : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <RiRoadMapLine size={20} />
                  <span>Predicted Skills</span>
                </button>
              )}

              <button
                onClick={() => navigate("/questionnaire")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              >
                <HiLightBulb size={20} />
                <span>Skill Prediction</span>
              </button>

              <Link
                to="/explore"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
              >
                <MdExplore size={20} />
                <span>Explore Skills</span>
              </Link>

              <button
                onClick={() => navigate("/profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  location.pathname === "/profile"
                    ? "bg-blue-100/70 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-medium"
                    : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
                }`}
              >
                <AiOutlineUser size={20} />
                <span>Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-100/50 dark:hover:bg-red-900/50"
              >
                <FiLogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-24 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === "predicted"
                    ? "Your personalized skill recommendations"
                    : "Discover skills to advance your career"}
                </p>
              </motion.div>
            )}

            {activeTab === "home" && (
              <>
                {/* Topic Selection */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-4 mb-12"
                >
                  {topics.map((topic, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTopicClick(topic.name)}
                      className="px-6 py-3 rounded-full font-medium bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-md hover:shadow-lg transition-all flex items-center gap-3 border border-gray-200 dark:border-gray-700"
                    >
                      {topic.icon}
                      {topic.name}
                    </motion.button>
                  ))}
                </motion.div>

                {selectedTopic && (
                  <>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3"
                    >
                      {topics.find(t => t.name === selectedTopic)?.icon}
                      {selectedTopic} Skills
                    </motion.h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                      {filteredSkills.map((skill) => (
                        <motion.div
                          key={skill._id}
                          whileHover={{ y: -5 }}
                          onClick={() => handleSkillClick(skill)}
                          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500"
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-lg mb-2">{skill.skillName}</h4>
                            <HiBookOpen className="text-gray-400 mt-1" />
                          </div>
                          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full">
                            {selectedTopic}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {displayedSkill && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                      >
                        <div className="p-6 border-b dark:border-gray-700">
                          <h4 className="text-2xl font-bold mb-2">{displayedSkill.skillName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                              {selectedTopic}
                            </span>
                          </div>
                        </div>

                        <div className="divide-y dark:divide-gray-700">
                          {displayedSkill.learningPath?.map((topic, idx) => (
                            <div key={idx} className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                                  <RiRoadMapLine className="text-blue-600 dark:text-blue-400 text-xl" />
                                </div>
                                <h5 className="text-lg font-semibold">{topic.topic}</h5>
                              </div>

                              <div className="ml-14 space-y-4">
                                {topic.subtopics.map((sub, subIdx) => (
                                  <div key={subIdx} className="pb-4 last:pb-0">
                                    <h6 className="font-bold mb-3 text-gray-700 dark:text-gray-300">{sub.name}</h6>
                                    <ul className="space-y-3">
                                      {sub.resources.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                          <a
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                          >
                                            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                                              <HiBookOpen className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                              <span className="font-medium">Resource {linkIdx + 1}</span>
                                              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new URL(link).hostname.replace('www.', '')}
                                              </span>
                                            </div>
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="text-center mt-10">
                      <Link
                        to="/explore"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MdExplore />
                        Explore all skills
                      </Link>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === "predicted" && predictedSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                      <HiLightBulb className="text-blue-600 dark:text-blue-300 text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Your Personalized Skill Recommendations</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Based on your questionnaire responses
                      </p>
                    </div>
                  </div>
                </div>

                {predictedSkills.map((skill) => (
                  <motion.div
                    whileHover={{ scale: 1.005 }}
                    key={skill._id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border-l-4 border-green-500"
                  >
                    <div className="p-6 border-b dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-1">
                            {skill.skillName}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Recommended learning path
                          </p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                          Recommended
                        </div>
                      </div>
                    </div>

                    <div className="divide-y dark:divide-gray-700">
                      {skill.learningPath?.map((topic, idx) => (
                        <div key={idx} className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                              <RiRoadMapLine className="text-green-600 dark:text-green-400 text-xl" />
                            </div>
                            <h5 className="text-lg font-semibold">{topic.topic}</h5>
                          </div>

                          <div className="ml-14 space-y-4">
                            {topic.subtopics.map((sub, subIdx) => (
                              <div key={subIdx} className="pb-4 last:pb-0">
                                <h6 className="font-bold mb-3 text-gray-700 dark:text-gray-300">{sub.name}</h6>
                                <ul className="space-y-3">
                                  {sub.resources.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                      <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                      >
                                        <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                                          <HiBookOpen className="text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                          <span className="font-medium">Resource {linkIdx + 1}</span>
                                          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {new URL(link).hostname.replace('www.', '')}
                                          </span>
                                        </div>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
