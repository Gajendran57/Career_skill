import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiBookOpen, FiExternalLink } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Explore = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/skill-maps");
                setSkills(response.data);
            } catch (error) {
                console.error("Error fetching skills", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    // Extract unique categories from skills
    const categories = ["All", ...new Set(
        skills.flatMap(skill => 
            skill.learningPath?.map(topic => topic.topic) || []
        )
    )].filter(Boolean);

    const filteredSkills = skills.filter(skill => {
        const matchesSearch = skill.skillName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || 
            skill.learningPath?.some(topic => topic.topic === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-gray-800 mb-2"
                    >
                        Explore Learning Paths
                    </motion.h2>
                    <p className="text-gray-600">
                        Discover and master new skills with structured learning paths
                    </p>
                </div>

                {/* Search and Filter */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search skills..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {filteredSkills.length} of {skills.length} skills
                    </div>
                </motion.div>

                {/* Skills Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredSkills.length > 0 ? (
                            filteredSkills.map((skill) => (
                                <motion.div
                                    key={skill._id}
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative"
                                >
                                    <Link to={`/skill/${skill._id}`}>
                                        <div className="h-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                                            <div className="p-5">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                                        <FiBookOpen size={20} />
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {skill.skillName}
                                                    </h3>
                                                </div>
                                                
                                                {skill.learningPath?.length > 0 && (
                                                    <div className="mb-4">
                                                        <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">
                                                            Topics Covered
                                                        </h4>
                                                        <div className="flex flex-wrap gap-1">
                                                            {skill.learningPath.slice(0, 3).map((topic, index) => (
                                                                <span 
                                                                    key={index} 
                                                                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                                                >
                                                                    {topic.topic}
                                                                </span>
                                                            ))}
                                                            {skill.learningPath.length > 3 && (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                                                    +{skill.learningPath.length - 3} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                                                <span className="text-sm text-blue-600 font-medium">
                                                    View Path
                                                </span>
                                                <FiExternalLink className="text-gray-400" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <div className="text-gray-500 mb-4">
                                    {searchTerm ? (
                                        <>
                                            <p className="text-lg">No skills found for "{searchTerm}"</p>
                                            <p className="text-sm">Try a different search term or category</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg">No skills available</p>
                                            <p className="text-sm">Check back later for new learning paths</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;