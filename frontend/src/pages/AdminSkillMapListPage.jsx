import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiEdit, FiPlus, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AdminSkillListPage = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this skill?");
        if (!confirmDelete) return;

        setDeleteLoading(id);
        try {
            await axios.delete(`http://localhost:5000/api/skill-maps/${id}`);
            setSkills(skills.filter(skill => skill._id !== id));
        } catch (error) {
            console.error("Error deleting skill", error);
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredSkills = skills.filter(skill =>
        skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Skills</h2>
                    <p className="text-gray-600">
                        {skills.length} skill{skills.length !== 1 ? 's' : ''} available
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search skills..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <Link
                        to="/admin/skill-map/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <FiPlus />
                        <span className="hidden md:inline">Add Skill</span>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredSkills.length > 0 ? (
                            filteredSkills.map((skill) => (
                                <motion.div
                                    key={skill._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative group"
                                >
                                    <Link to={`/admin/skill-map/${skill._id}`}>
                                        <div className="h-full p-5 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {skill.skillName}
                                            </h3>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {skill.learningPath?.slice(0, 3).map((topic, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                    >
                                                        {topic.topic}
                                                    </span>
                                                ))}
                                                {skill.learningPath?.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                                        +{skill.learningPath.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(skill._id)}
                                        disabled={deleteLoading === skill._id}
                                        className="absolute top-3 right-3 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full shadow-sm transition-colors"
                                        title="Delete skill"
                                    >
                                        {deleteLoading === skill._id ? (
                                            <svg className="animate-spin h-4 w-4 text-red-600" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <FiTrash2 size={16} />
                                        )}
                                    </motion.button>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center">
                                <div className="text-gray-500 mb-4">
                                    {searchTerm ? (
                                        <>
                                            <p className="text-lg">No skills found for "{searchTerm}"</p>
                                            <p className="text-sm">Try a different search term</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg">No skills available</p>
                                            <p className="text-sm">Create your first skill map</p>
                                        </>
                                    )}
                                </div>
                                <Link
                                    to="/admin/skill-map/new"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <FiPlus />
                                    Add New Skill
                                </Link>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default AdminSkillListPage;