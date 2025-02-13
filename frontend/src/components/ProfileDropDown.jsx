import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut, Bell, Key } from "lucide-react";
import { useState } from "react";

const ProfileDropDown = () => {
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    toast.success("Logged Out Successfully..");
    setTimeout(() => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/login");
    }, 1000);
  };

  const handleChangePassword = () => {
    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
      toast.error("Fields cannot be empty");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password Changed Successfully");
    setShowChangePassword(false);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.div
        className="absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
        variants={dropdownVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="py-1">
          <motion.div variants={itemVariants}>
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
            >
              <User size={18} className="mr-3 text-gray-400" />
              Profile
            </Link>
          </motion.div>
          <hr className="mx-5" />
          <motion.div variants={itemVariants}>
            <Link
              to="/notifications"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 transition-colors duration-150 ease-in-out"
            >
              <Bell size={18} className="mr-3 text-gray-400" />
              Team Requests
            </Link>
          </motion.div>
          <hr className="mx-5" />
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setShowChangePassword(true)}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-100 transition-colors duration-150 ease-in-out"
            >
              <Key size={18} className="mr-3 text-gray-400" />
              Change Password
            </button>
          </motion.div>
          <hr className="mx-5" />
          <motion.div variants={itemVariants}>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 transition-colors duration-150 ease-in-out"
            >
              <LogOut size={18} className="mr-3 text-red-400" />
              Logout
            </button>
          </motion.div>
        </div>
      </motion.div>

      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded-md mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded-md mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={handleChangePassword}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default ProfileDropDown;
