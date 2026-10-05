import { useNavigate } from "react-router-dom";
import { FiUser, FiSettings, FiHelpCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const Profile = () => {
    const navigate = useNavigate();

    // Mock user data - replace with actual user data from your auth system
    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "John Doe",
        email: "john@example.com",
        joinDate: "January 2023"
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">
            <div className="max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                >
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold">My Profile</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{user.name}</span>
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <FiUser />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* User Info Section */}
                        <div className="md:col-span-1">
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                    <FiUser className="text-blue-600 dark:text-blue-400 text-4xl" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Member since {user.joinDate}</p>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Account Settings */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiSettings className="text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Account Settings</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300">Email Address</h4>
                                            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                                            Change
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300">Password</h4>
                                            <p className="text-gray-500 dark:text-gray-400">••••••••</p>
                                        </div>
                                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiHelpCircle className="text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Help & Support</h3>
                                </div>
                                <div className="space-y-3">
                                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                                        Contact Support
                                    </button>
                                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                                        FAQs
                                    </button>
                                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                                        Terms & Privacy
                                    </button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="border border-red-200 dark:border-red-800 rounded-lg p-5 bg-red-50 dark:bg-red-900/20">
                                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4">Danger Zone</h3>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="font-medium text-red-700 dark:text-red-300">Delete Account</h4>
                                        <p className="text-red-500 dark:text-red-400 text-sm">Permanently remove your account and all data</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                                    >
                                        Delete Account
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;