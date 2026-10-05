import { useState } from "react";
import AdminSkillMapPage from "./AdminSkillMapPage";
import AdminSkillMapListPage from "./AdminSkillMapListPage";
import { FiPlus, FiList, FiHome, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("AdminSkillMap");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case "AdminSkillMap":
        return <AdminSkillMapPage />;
      case "AdminSkillMapList":
        return <AdminSkillMapListPage />;
      default:
        return (
          <div className="p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-600">
                Select a section from the sidebar
              </h3>
              <p className="text-gray-500 mt-2">
                Manage your skill maps and content
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: sidebarOpen ? "20%" : "5rem" }}
        animate={{ width: sidebarOpen ? "20%" : "5rem" }}
        transition={{ duration: 0.3 }}
        className={`bg-white shadow-md ${sidebarOpen ? "min-w-[250px]" : "min-w-[80px]"} relative`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6">
            {sidebarOpen && (
              <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            >
              {sidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-1">
              <motion.li whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => setActivePage("AdminSkillMap")}
                  className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                    activePage === "AdminSkillMap"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiPlus className="text-lg" />
                  {sidebarOpen && "Create Skill Map"}
                </button>
              </motion.li>
              <motion.li whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => setActivePage("AdminSkillMapList")}
                  className={`w-full flex items-center gap-3 p-3 rounded-md transition-colors ${
                    activePage === "AdminSkillMapList"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiList className="text-lg" />
                  {sidebarOpen && "View Skill Maps"}
                </button>
              </motion.li>
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <ul className="space-y-1">
              <motion.li whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 p-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FiHome className="text-lg" />
                  {sidebarOpen && "Back to Home"}
                </button>
              </motion.li>
              <motion.li whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 p-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="text-lg" />
                  {sidebarOpen && "Logout"}
                </button>
              </motion.li>
            </ul>
          </div>
        </div>
      </motion.aside>

      {/* Content Area */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {activePage === "AdminSkillMap" && "Create Skill Map"}
              {activePage === "AdminSkillMapList" && "View Skill Maps"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <motion.div
          key={activePage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {renderPage()}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;