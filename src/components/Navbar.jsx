import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { userContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../App.css';
import search from '../assets/search.jpg';
import applogo from '../assets/socialhubLogo.jpg';
import { FaPlus, FaUserFriends, FaSignOutAlt, FaUser, FaSearch } from 'react-icons/fa';

export const Navbar = () => {
  const { state, dispatch } = useContext(userContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    document.onclick = (event) => {
      if (
        navRef.current && !navRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setOpen(true);
        setProfileOpen(false);
      }
    };

    return () => {
      document.onclick = null;
      setProfileOpen(false)
    };
  }, []);

  const handleLogoutBtn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.error) {
        console.log(data.error);
      } else {
        dispatch({ type: 'USER', payload: false });
        Swal.fire({
          position: 'top-end',
          title: 'Logout Successfully',
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'custom-swal-background',
          },
        });
        navigate('/');
      }
    } catch (error) {
      console.log('logout error', error);
    }
  };
  

  const handelSetOpen = () => {
    setOpen(true);
    setProfileOpen(false);

  };

  const handleThreeDot = () => {
    setOpen(!open);
  };

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
  };

  const renderList = () => {
    if (state) {
      return [
        // Home Button
        <Link
          onClick={handelSetOpen}
          className='relative hover:bg-black w-full sm:w-fit flex items-center justify-center bg-gray-800 rounded-lg group'
          key={'createPost'}
          to={'/createpost'}
        >
          <FaPlus className="text-2xl sm:block" />
          <button className=" sm:hidden block px-3 py-2">Create Post</button>
          <span className="absolute z-50 top-[20px] ml-2 whitespace-nowrap sm:block text-green-500 hidden sm:group-hover:block">Create Post</span>
        </Link>,
        // Following Button
        <Link
          onClick={handelSetOpen}
          className='relative hover:bg-black w-full sm:w-fit flex items-center justify-center bg-gray-800 rounded-lg group'
          key={'followingPost'}
          to={'/followingpost'}
        >
          <FaUserFriends className="text-2xl" />
          <button className=" sm:hidden block px-3 py-2">Following Post</button>

          <span className="absolute z-50 top-[20px] ml-2 whitespace-nowrap text-green-500 hidden sm:group-hover:block">Following Post</span>
        </Link>,

        // Profile and Logout Buttons

      ];
    } else {
      return [
        // Signup and Login Buttons
        <Link
          onClick={handelSetOpen}
          className='hover:bg-black w-full sm:w-fit flex items-center justify-center bg-gray-800 rounded-lg'
          key={'signup'}
          to={'/signup'}
        >
          <button className="px-3 py-2">Signup</button>
        </Link>,

        <Link
          onClick={handelSetOpen}
          className='hover:bg-black w-full sm:w-fit flex items-center justify-center bg-gray-800 rounded-lg'
          key={'login'}
          to={'/login'}
        >
          <button className="px-3 py-2">Login</button>
        </Link>,

      ];
    }
  };

  return (
    <nav ref={navRef} className="bg-black text-white z-10 w-full p-4 flex justify-between sm:flex-row sticky top-0 items-center">
      <div className="w-full flex justify-between">
        <div className="flex items-center">
          <Link to={'/'} className="h-[40px] text-2xl font-bold">
            <img className="h-full w-auto" src={applogo} alt="App Logo" />
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <div onClick={() => navigate('/search')} className=" group relative mr-[6px] h-[30px] w-[30px]">
            <img src={search} alt="Search" />
            <span className="absolute z-50 top-[20px] right-[-8px] ml-2 whitespace-nowrap hidden text-green-500 group-hover:block">Search</span>
          </div>
        </div>

      </div>

      <div className={`sm:flex items-center absolute bg-black sm:relative w-full sm:w-fit flex-col sm:flex-row justify-center gap-[15px] top-[70px] sm:top-0 left-0 right-0 ${open ? 'hidden' : 'flex'} transition-all duration-75`}>
        {renderList()}
      </div>



      {/* profile btn  */}
      <div className={`relative ml-[10px] ${state ? 'block' : 'hidden' } `} ref={profileRef} key="profile-menu">
        <img
          src={state?.image}
          alt="Profile"
          onClick={handleProfileClick}
          className="cursor-pointer h-[40px] w-[50px] rounded-full"
        />
        {profileOpen && (
          <div className="absolute right-0 mt-2  bg-gray-800 rounded-lg shadow-lg z-10">
            <Link
              to="/profile"
              className=" text-white hover:bg-black px-3 py-2 rounded-lg flex items-center"
              onClick={handelSetOpen}
            >
              <FaUser className="mr-2" /> Profile
            </Link>
            <button
              onClick={handleLogoutBtn}
              className=" text-white hover:bg-black px-3 py-2 rounded-lg flex items-center w-full"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>

      {/* three dot */}
      <div onClick={handleThreeDot} className="sm:hidden w-fit h-fit">
        <ion-icon size="large" name="ellipsis-vertical-outline"></ion-icon>
      </div>

    </nav>
  );
};
