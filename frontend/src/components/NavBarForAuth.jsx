import React from 'react'
import { Link } from 'react-router-dom'
function NavBarForAuth() {
  return (
    <header className="py-3 w-full bg-black">
    <nav>
      <div className="flex items-center justify-between  max-w-7xl mx-auto">
        <Link to="/">
          <img
            src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
            alt="Logo"
            width="50px"

            className="cursor-pointer rounded-full"
          />
        </Link>

       
      </div>
    </nav>
  </header>
  )
}

export default NavBarForAuth