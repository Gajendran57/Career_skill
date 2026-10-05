import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp, FiExternalLink, FiBookOpen, FiYoutube, FiBookmark } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SkillDetail = () => {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid skill ID");
      setLoading(false);
      return;
    }
    
    const fetchSkillDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/skill-maps/${id}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data = await res.json();
        setSkill(data);
        
        // Expand first topic by default
        if (data?.learningPath?.length > 0) {
          setExpandedTopics({ 0: true });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load skill details");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillDetails();
  }, [id]);

  const toggleTopic = (index) => {
    setExpandedTopics(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Skill</h2>
          <p className="mb-4">{error}</p>
          <Link 
            to="/explore" 
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Skill Not Found</h2>
          <p className="mb-4">The requested skill could not be found.</p>
          <Link 
            to="/explore" 
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Explore Skills
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {skill.skillName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Master this skill with our structured learning path
          </p>
        </motion.div>

        {/* Learning Path */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiBookOpen className="text-blue-600" />
            Learning Path
          </h2>
          
          <div className="space-y-3">
            {skill.learningPath?.map((topic, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleTopic(index)}
                  className={`w-full flex justify-between items-center p-4 text-left ${
                    expandedTopics[index] 
                      ? "bg-blue-50 dark:bg-blue-900/20" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  } transition-colors`}
                >
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {topic.topic}
                  </h3>
                  {expandedTopics[index] ? (
                    <FiChevronUp className="text-gray-500" />
                  ) : (
                    <FiChevronDown className="text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedTopics[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 space-y-4">
                        {topic.subtopics?.map((sub, subIndex) => (
                          <div 
                            key={subIndex} 
                            className="pl-4 border-l-2 border-blue-500"
                          >
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                              {sub.name}
                            </h4>
                            {sub.resources?.length > 0 && (
                              <ul className="space-y-2">
                                {sub.resources.map((res, resIndex) => (
                                  <li key={resIndex}>
                                    <a
                                      href={res}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      <FiExternalLink size={14} />
                                      <span className="truncate">{res}</span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiBookmark className="text-blue-600" />
            Additional Resources
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Courses */}
            {skill.courseLinks?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <FiBookOpen className="text-blue-600" />
                  Recommended Courses
                </h3>
                <ul className="space-y-2">
                  {skill.courseLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <FiExternalLink size={14} />
                        <span className="truncate">Course {index + 1}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* YouTube Videos */}
            {skill.youtubeLinks?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <FiYoutube className="text-red-600" />
                  Video Tutorials
                </h3>
                <ul className="space-y-2">
                  {skill.youtubeLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:underline"
                      >
                        <FiExternalLink size={14} />
                        <span className="truncate">Video {index + 1}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Back to All Skills
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;