import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, User, Home, Users, CheckSquare } from "lucide-react"
import NotificationPopup from "./NotificationPopup"
import ProfileDropDown from "./ProfileDropDown"
import imgLogo from '../assets/logo.svg'

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [userData, setUserData] = useState(null)
  const token = sessionStorage.getItem("token")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const user = sessionStorage.getItem("user")
    if (user) {
      const parsedData = JSON.parse(user)
      setUserData(parsedData.name.charAt(0).toUpperCase())
    }
  }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
  }

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/teams", label: "Teams", icon: Users },
    { to: "/tasks", label: "Tasks", icon: CheckSquare },
  ]

  return (
    <header className="py-4 w-full bg-gradient-to-r from-black to-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/">
              <motion.img
                src={imgLogo}
                alt="Logo"
                width="50"
                className="cursor-pointer rounded-full border-2 border-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </Link>

            {token && (
              <div className="hidden md:flex gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                      location.pathname === item.to ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {token && (
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  className="text-white bg-yellow-300 rounded-full p-2 hover:bg-yellow-100 hover:bg-opacity-10 transition-colors duration-300"
                  onClick={toggleNotification}
                >
                  <Bell size={20} />
                </button>
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NotificationPopup />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {!token ? (
              <div className="flex gap-4">
                {["Login", "SignUp"].map((item) => (
                  <motion.button
                    key={item}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white font-semibold bg-blue-500 px-4 py-2 rounded-full transition-colors duration-300 hover:bg-blue-600"
                    onClick={() => navigate(`/${item.toLowerCase()}`)}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <motion.button
                  className="flex items-center justify-center w-10 h-10 rounded-sm bg-white text-blue-600 font-bold text-lg shadow-md"
                  onClick={toggleDropdown}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {userData || <User size={24} />}
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1  ring-1 ring-black ring-opacity-5"
                    >
                      <ProfileDropDown />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default NavBar

