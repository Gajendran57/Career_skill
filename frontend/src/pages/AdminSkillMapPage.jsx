import { useState } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiLink, FiBookOpen, FiSave } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AdminSkillMapPage = () => {
  const [skillName, setSkillName] = useState("");
  const [topics, setTopics] = useState([{ topic: "", subtopics: [{ name: "", resources: [""] }] }]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTopic = () => {
    setTopics([...topics, { topic: "", subtopics: [{ name: "", resources: [""] }] }]);
  };

  const handleRemoveTopic = (topicIndex) => {
    if (topics.length <= 1) return;
    const updatedTopics = [...topics];
    updatedTopics.splice(topicIndex, 1);
    setTopics(updatedTopics);
  };

  const handleAddSubtopic = (topicIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics.push({ name: "", resources: [""] });
    setTopics(updatedTopics);
  };

  const handleRemoveSubtopic = (topicIndex, subIndex) => {
    const updatedTopics = [...topics];
    if (updatedTopics[topicIndex].subtopics.length <= 1) return;
    updatedTopics[topicIndex].subtopics.splice(subIndex, 1);
    setTopics(updatedTopics);
  };

  const handleAddResource = (topicIndex, subIndex) => {
    const updatedTopics = [...topics];
    updatedTopics[topicIndex].subtopics[subIndex].resources.push("");
    setTopics(updatedTopics);
  };

  const handleRemoveResource = (topicIndex, subIndex, resIndex) => {
    const updatedTopics = [...topics];
    if (updatedTopics[topicIndex].subtopics[subIndex].resources.length <= 1) return;
    updatedTopics[topicIndex].subtopics[subIndex].resources.splice(resIndex, 1);
    setTopics(updatedTopics);
  };

  const handleChange = (topicIndex, subIndex, field, value, resourceIndex = null) => {
    const updatedTopics = [...topics];
    if (field === "topic") {
      updatedTopics[topicIndex].topic = value;
    } else if (field === "subtopic") {
      updatedTopics[topicIndex].subtopics[subIndex].name = value;
    } else if (field === "resource") {
      updatedTopics[topicIndex].subtopics[subIndex].resources[resourceIndex] = value;
    }
    setTopics(updatedTopics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      skillName,
      learningPath: topics.map((t, index) => ({
        topic: t.topic,
        order: index + 1,
        subtopics: t.subtopics
      })),
    };

    try {
      await axios.post("http://localhost:5000/api/skill-maps", payload);
      setMessage({ text: "Skill Map created successfully!", type: "success" });
      setSkillName("");
      setTopics([{ topic: "", subtopics: [{ name: "", resources: [""] }] }]);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to create skill map", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Skill Map</h2>
      <p className="text-gray-600 mb-6">Build a structured learning path for a new skill</p>

      {message.text && (
        <div className={`p-3 mb-6 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
          <input
            type="text"
            placeholder="e.g. React.js, Machine Learning, Cybersecurity"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {topics.map((topic, topicIndex) => (
              <motion.div
                key={topicIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">Topic {topicIndex + 1}</h3>
                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topicIndex)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove topic"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Fundamentals, Advanced Concepts, Projects"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={topic.topic}
                    onChange={(e) => handleChange(topicIndex, null, "topic", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4 ml-2 pl-4 border-l-2 border-gray-100">
                  {topic.subtopics.map((sub, subIndex) => (
                    <div key={subIndex} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">Subtopic {subIndex + 1}</h4>
                        {topic.subtopics.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtopic(topicIndex, subIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove subtopic"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtopic Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. State Management, Hooks, Components"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={sub.name}
                          onChange={(e) => handleChange(topicIndex, subIndex, "subtopic", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Resources</label>
                        {sub.resources.map((res, resIndex) => (
                          <div key={resIndex} className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2">
                              <FiLink className="text-gray-400" />
                              <input
                                type="text"
                                placeholder="https://example.com/resource"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={res}
                                onChange={(e) => handleChange(topicIndex, subIndex, "resource", e.target.value, resIndex)}
                                required
                              />
                            </div>
                            {sub.resources.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveResource(topicIndex, subIndex, resIndex)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove resource"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddResource(topicIndex, subIndex)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1"
                        >
                          <FiPlus size={14} />
                          Add Resource
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddSubtopic(topicIndex)}
                    className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg"
                  >
                    <FiPlus size={14} />
                    Add Subtopic
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleAddTopic}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FiPlus size={18} />
            <span>Add Another Topic</span>
          </button>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-medium text-white ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} transition-colors`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Create Skill Map
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSkillMapPage;