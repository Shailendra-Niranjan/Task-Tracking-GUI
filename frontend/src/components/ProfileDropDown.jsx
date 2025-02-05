import { Link } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { User, LogOut, Bell } from "lucide-react"

const ProfileDropDown = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    toast.success("Logged Out Successfully..")
    setTimeout(() => {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
      navigate("/login")
    }, 1000)
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <>
      <motion.div
        className="absolute right-0  w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
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
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100 transition-colors duration-150 ease-in-out"
            >
              <LogOut size={18} className="mr-3 text-red-400" />
              Logout
            </button>
          </motion.div>
        </div>
      </motion.div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}

export default ProfileDropDown

