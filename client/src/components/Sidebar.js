import React, { useState,useContext  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { AiFillPieChart } from 'react-icons/ai';
import { SiFuturelearn } from 'react-icons/si';
import { CgProfile } from 'react-icons/cg';
import { FaUserShield } from 'react-icons/fa';
import { IoMdArrowDropright } from 'react-icons/io'; 
import { ThemeContext } from "./ThemeContext";
import logo from "../../src/assets/images/FLL.png";
import HamburgerButton from './HamburgerMenuButton/HamburgerButton';
import { BsFillJournalBookmarkFill } from 'react-icons/bs';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const location = useLocation();
  const {theme} = useContext(ThemeContext)

  const Menus = [
    { title: 'Dashboard', path: '/dashboard', src: <AiFillPieChart /> },
    { title: 'Strand', path: '/strand', src: <BsFillJournalBookmarkFill/> },
    { title: 'Courses', path: '/courses', src: <SiFuturelearn />},
    { title: 'Users', path: '/users', src: <CgProfile /> },
    { title: 'Admin', path: '/admin', src: <FaUserShield /> },
  ];

  const toggleCoursesDropdown = () => {
    setShowCoursesDropdown(!showCoursesDropdown);
  };

  return (
    <>
      <div
        className={`${
          open ? 'w-60' : 'w-fit'
        } hidden sm:block relative h-screen m-3 duration-300 bg-[#14b8a6] dark:bg-[#042f2e] rounded-xl p-5 border-x-2 border-y-4 border-black dark:border-white `}
        style={{
          position: 'sticky',
          top: 0,
        }}
        
      >
        <BsArrowLeftCircle
          className={`${
            !open && 'rotate-180'
          } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}
        />
         <div className=" lg:flex justify-center items-center gap-3">
        <img src={logo} alt="logo" className={`hidden sm:block md:block lg:block w-auto h-[30px] ${theme === 'dark' ? 'dark-mode-image' : ''}`} />
      </div>
        <Link to='/'>
          <div className={`flex ${open && 'gap-x-4'} items-center`}>
            <img src={""} alt='' className='pl-2' />
            {open && (
              <span className='text-xl font-medium whitespace-nowrap dark:text-white'>
              </span>
            )}
          </div>
        </Link>

        <ul className="pt-6">
          {Menus.map((menu, index) => (
            <li
              key={index}
              className={`relative ${
                showCoursesDropdown && menu.title === 'Courses'
                  ? 'z-10'
                  : ''
              }`}
            >
              {menu.dropdown ? (
                <>
                  <div
                    onClick={toggleCoursesDropdown}
                    className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-orange-400 dark:hover:bg-orange-400 ${
                      location.pathname === menu.path &&
                      'bg-orange-400 dark:bg-orange-400'
                    }`}
                  >
                    <span className="text-2xl">{menu.src}</span>
                    <span className={`${!open && 'hidden'} origin-left duration-300 hover:block`}>
                      {menu.title}
                    </span>
                    <IoMdArrowDropright className={`ml-2 text-xl ${showCoursesDropdown ? 'transform rotate-90' : ''}`} /> {/* Greater-than icon */}
                  </div>
                  {showCoursesDropdown && (
                    <ul className="pl-10">
                      {menu.dropdown.map((dropdownItem, i) => (
                        <Link to={dropdownItem.path} key={i}>
                          <li
                            className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-orange-400 dark:hover:bg-orange-400 ${
                              location.pathname === dropdownItem.path && 'bg-orange-400 dark:bg-orange-400'
                            }`}
                          >
                            <span className={`${!open && 'hidden'} origin-left duration-300 hover:block`}>
                              {dropdownItem.title}
                            </span>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={menu.path}>
                  <div
                    className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-orange-400 dark:hover:bg-orange-400 ${
                      location.pathname === menu.path && 'bg-orange-400 dark:bg-orange-400'
                    }`}
                  >
                    <span className="text-2xl">{menu.src}</span>
                    <span className={`${!open && 'hidden'} origin-left duration-300 hover:block`}>
                      {menu.title}
                    </span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* Mobile Menu */}
      <div className="pt-3">
        <HamburgerButton
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
        />
      </div>
      <div className="sm:hidden">
        <div
          className={`${
            mobileMenu ? 'flex' : 'hidden'
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-gray-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          {Menus.map((menu, index) => (
            <Link
              to={menu.path}
              key={index}
              onClick={() => setMobileMenu(false)}
            >
              <span
                className={` ${
                  location.pathname === menu.path &&
                  'bg-orange-400 dark:bg-gray-700'
                } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-orange-400`}
              >
                {menu.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
