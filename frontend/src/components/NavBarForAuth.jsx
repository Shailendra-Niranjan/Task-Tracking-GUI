import React from 'react'
import { Link } from 'react-router-dom'
import imgLogo from '../assets/logo.svg';

function NavBarForAuth() {
  return (
    <header className="py-3 w-full bg-black shadow-lg">
    <nav>
      <div className="flex items-center justify-between  max-w-7xl mx-auto ">
        <Link to="/">
          <img
            src={imgLogo}
            alt="Logo"
            width="50px"
            className="cursor-pointer rounded-full border-2 border-blue-400"
          />
        </Link>
        <p className='text-2xl text-white text-center'>Task Tracker</p>
      </div>
    </nav>


       
  </header>
  )
}

export default NavBarForAuth