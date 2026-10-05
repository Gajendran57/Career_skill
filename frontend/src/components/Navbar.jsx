import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-gray-800 dark:text-white">
          SkillMap
        </Link>
        <div className="space-x-6">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-500 dark:text-gray-200">
            Home
          </Link>
          <Link to="/explore" className="text-gray-700 hover:text-blue-500 dark:text-gray-200">
            Explore
          </Link>
          <Link to="/questionnaire" className="text-gray-700 hover:text-blue-500 dark:text-gray-200">
            Skill Assessment
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-500 dark:text-gray-200">
            Profile
          </Link>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
