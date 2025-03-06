import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, LogOut, Bell, Key, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ProfileDropDown = () => {
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    toast.success("Logged Out Successfully..");
    setTimeout(() => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("response");
      navigate("/login");
    }, 1000);
    setIsOpen(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.trim() === "" || confirmPassword.trim() === "") {
      toast.error("Fields cannot be empty");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setPasswordMatch(false);
      return;
    }
    setPasswordMatch(true);

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("password", newPassword);

      const response = await fetch("api/user/changes/password", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 200) {
        toast.success("Password Changed Successfully");
        setShowChangePassword(false);
        setIsOpen(false);
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          className="absolute right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50 dropdown-menu"
        >
          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User size={18} className="mr-3 text-gray-400" />
              Profile
            </Link>
            <hr className="mx-5" />
            <Link
              to="/notifications"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100"
              onClick={() => setIsOpen(false)}
            >
              <Bell size={18} className="mr-3 text-gray-400" />
              Team Requests
            </Link>
            <hr className="mx-5" />
            <button
              onClick={() => {
                setShowChangePassword(true);
                setIsOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-100"
            >
              <Key size={18} className="mr-3 text-gray-400" />
              Change Password
            </button>
            <hr className="mx-5" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100"
            >
              <LogOut size={18} className="mr-3 text-red-400" />
              Logout
            </button>
          </div>
        </motion.div>
      )}

      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Change Your Password
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordMatch(e.target.value === newPassword);
                  }}
                />
                {passwordMatch !== null &&
                  (passwordMatch ? (
                    <CheckCircle
                      className="absolute right-3 top-4 text-green-500"
                      size={20}
                    />
                  ) : (
                    <XCircle
                      className="absolute right-3 top-4 text-red-500"
                      size={20}
                    />
                  ))}
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
