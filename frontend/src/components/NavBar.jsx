import React from "react";
import { Link } from "react-router-dom";

function NavBar() {

  const token = sessionStorage.getItem("token");

  const navItems = [
    {
      name: "Home",
      slug: "/",
    },
    {
      name: "Login",
      slug: "/login",
    },
    {
      name: "SignUp",
      slug: "/signup",
    },
    // {
    //   name: "Teams",
    //   slug: "/teams",
    // },{
    //   name: "Tasks",
    //   slug: "/tasks",
    // },
  ];

  return (
    <header className="py-3 w-full bg-black">
      <nav>
        <div className="flex items-center justify-between  max-w-7xl mx-auto">
          
          <div className="flex justify-center items-center gap-2">

          <Link to="/">
            <img
              src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
              alt="Logo"
              width="50px"
              
              className="cursor-pointer rounded-full"
              />
          </Link>
              <Link  to="/teams" 
                className="text-white font-bold hover:bg-white hover:text-black px-4 py-2 rounded-md transition-all duration-200"

              >
                Teams</Link>
              <Link  to="/tasks" 
                 className="text-white font-bold hover:bg-white hover:text-black px-4 py-2 rounded-md transition-all duration-200"
             >Tasks</Link>
            </div>

         { token ? <div className="text-white bg-red-400 rounded-full border-2 border-white p-6"></div>  : <ul className="flex space-x-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.slug}
                  className="text-white font-bold hover:bg-white hover:text-black px-4 py-2 rounded-md transition-all duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>


          }

          
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
