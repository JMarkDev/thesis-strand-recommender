import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Toggle from "./ThemeToggle";
import HamburgerButton from "./HamburgerMenuButton/HamburgerButton";
import logo from "../../src/assets/images/FLL.png";
import userLogo from "../../src/assets/images/user.png";
import sm_logo from "../../src/assets/images/FLL.png";
import '.././index.css'
import { ThemeContext } from "./ThemeContext";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const {theme} = useContext(ThemeContext)
  const userId = localStorage.getItem("userId");

  const showProfile = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/Log-in");
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  const handleMobileLinkClick = () => {
    closeMobileMenu(); // Close the mobile menu when a link is clicked
  };

  useEffect(() => {
    const getName = async () => {
      try {
        const res = await axios.get(`http://backend.api.senior-high-school-strand-recommender.pro/students/${userId}`);
        const fullName = res.data[0].name;
        const userName = fullName.split(" ")[0];
        setName(userName);
      } catch (err) {
        console.error(err);
      }
    };
    getName();
  }, [userId]);

  return (
    <header className=" w-full py-5 bg-gradient-to-r from-red-500 to-transparent bg-gray-400 dark:bg-gray-800 dark:shadow-lg">
      <div className="container flex  flex-col sm:flex-row justify-between items-end sm:items-center md:items-center lg:items-center m-auto mx-auto">
      <div className=" lg:flex justify-center items-center gap-3">
        <img src={logo} alt="logo" className={`hidden sm:block md:block lg:block w-full h-[30px] ${theme === 'dark' ? 'dark-mode-image' : ''}`} />
      </div>
        <div className="hidden sm:block">
          <ul className="flex justify-center items-center gap-10">
            
          <li>
          <Link
            to="/home"
            className={`flex items-center text-base font-semibold cursor-pointer text-black  ${
              location.pathname.includes("/home")
                ? "border-b-2 border-[#27374D] dark:border-white dark:text-white"
                : "border-b-2 border-transparent dark:text-white  dark:hover:text-white dark:hover:border-white dark:hover:border-b-2 hover:border-b-2 hover:border-[#243e63]"
            }`}
          >
          Home
        </Link>
        </li>
          
            <li>
              <Link
                to="/strands"
                className={`flex items-center text-base font-semibold cursor-pointer text-black hover:bottom-2 border:[#243e63] ${
                  location.pathname.includes("/strands") 
                  ? "border-b-2 border-[#27374D] dark:border-white dark:text-white"
                : "border-b-2 border-transparent dark:text-white  dark:hover:text-white dark:hover:border-white dark:hover:border-b-2 hover:border-b-2 hover:border-[#243e63]"
            }`}
              >
                Strands
              </Link>
            </li>
            <li>
              <Link
                to="/course"
                className={`flex items-center text-base font-semibold text-black cursor-pointer ${
                  location.pathname === "/course" 
                  ? "border-b-2 border-[#27374D] dark:border-white dark:text-white"
                : "border-b-2 border-transparent dark:text-white  dark:hover:text-white dark:hover:border-white dark:hover:border-b-2 hover:border-b-2 hover:border-[#243e63]"
            }`}
              >
                Courses
              </Link>
            </li>

          </ul>
        </div>

        <div className="flex items-center gap-3">
          <div className="hover:opacity-50">
            <Toggle />
          </div>
          <div className="flex items-center gap-[15px] relative" onClick={showProfile}>
            <p className="hidden lg:block dark:text-white text-black  font-medium">{name}</p>
            <div className="gap-10 h-[10px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40 hover:opacity-50 mr-5">
              <img
                className={`w-7 h-7 rounded-full object-cover ${theme === 'dark' ? 'dark-mode-image' : ''}`}
                src={userLogo}
                alt=""
              />
            </div>
            {open && (
              <div className="bg-white dark:bg-[#075985] rounded-sm border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] space-y-[10px]">
              <ul className="w-full">
                <li>
                  <Link
                  to={`/profile/${userId}`}
                  className="block dark:text-white dark:hover:text-[#075985] p-2  font-semibold cursor-pointer hover-bg-sky-100 dark:hover-bg-gray-200
                  hover:bg-[#aed3ec] border-b-2 border-transparent dark:hover:bg-gray-20 "
                >
                  Profile
                </Link>
                </li>
                <li>
                  <button
                  onClick={handleLogout}
                  className="w-full text-left block dark:text-white dark:hover:text-[#075985] p-2 font-semibold cursor-pointer hover-bg-sky-100 dark:hover-bg-gray-200
                  hover:bg-[#aed3ec] border-b-2 border-transparent dark:hover:bg-gray-20 "
                > 
                  Log out
                </button>
                </li>
              </ul>  
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-2">
        <HamburgerButton setMobileMenu={setMobileMenu} mobileMenu={mobileMenu} />
        <img src={sm_logo} alt="logo" className={`block mt-4 ml-20 sm:hidden md:hidden lg:hidden h-[30px] ${theme === 'dark' ? 'dark-mode-image' : ''}`} />
      </div>
      <div className="sm:hidden">
        <div className="ml-6">
          <div
            className={`${mobileMenu ? "flex" : "hidden"} w-[90%] text-center absolute z-50 flex-col self-end py-8 mt-16 bg-gray-50 dark:bg-slate-800 drop-shadow rounded-xl`}
          >
            <ul>
              <li>
                <Link
                  onClick={handleMobileLinkClick}
                  to="/home"
                  className={`w-auto block dark:text-white dark:hover:text-[#075985] p-2 text-xl font-semibold cursor-pointer hover-bg-sky-100 dark:hover:bg-gray-200
                  ${
                    location.pathname.includes("/home")
                      ? "bg-[#aed3ec] dark:text-[#243e63]"
                      : "border-b-2 border-transparent dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200 dark:hover:text-[#243e63] "
                  }
                  `}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleMobileLinkClick}
                  to="/strands"
                  className={`block dark:text-white dark:hover:text-[#075985] p-2 text-xl font-semibold cursor-pointer hover-bg-sky-100 dark:hover-bg-gray-200
                  ${
                    location.pathname.includes("/strands")
                      ? "bg-[#aed3ec] dark:text-white"
                      : "border-b-2 border-transparent dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200 dark:hover:text-[#243e63] "
                  }
                  `}
                >
                  Strands
                </Link>
              </li>
              <li>
                <Link
                  onClick={handleMobileLinkClick}
                  to="/course"
                  className={`block dark:text-white dark:hover:text-[#075985] p-2 text-xl font-semibold cursor-pointer hover-bg-sky-100 dark:hover-bg-gray-200
                  ${
                    location.pathname.includes("/course")
                      ? "bg-[#aed3ec] dark:text-white"
                      : "border-b-2 border-transparent dark:text-white hover:bg-sky-100 dark:hover:bg-gray-200 "
                  }
                  `}
                >
                  Course
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;