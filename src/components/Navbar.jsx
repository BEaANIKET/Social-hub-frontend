import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userContext } from '../App'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import '../App.css'

export const Navbar = () => {

  const { state, dispatch } = useContext(userContext)
  const Navigate = useNavigate()
  const [open, setOpen] = useState(true)

  const handleLogoutBtn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      const data = await response.json();
      console.log(response);

      if (data.error) {
        console.log(data.error);
      }
      else {
        dispatch({ type: 'USER', payload: false })
        Swal.fire({
          position: "top-end",
          title: "Logout Succesfully",
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'custom-swal-background'
          }
        });
        Navigate('/')
      }

    } catch (error) {
      console.log("logout error ", error);
    }
  }

  const handelSetOpen = () => {
    setOpen(true)
  }

  useEffect(() => {
  }, [Navigate])

  const handleThreeDot = () => {
    setOpen(!open)
  }

  const renderList = () => {
    if (state) {
      return [
        <Link onClick={handelSetOpen} className='  w-full sm:w-fit flex items-center rounded-lg justify-center bg-gray-800  ' key={'profile'} to={'/profile'}><button className=" px-3 py-2 "> Profile  </button></Link>,
        <Link onClick={ handelSetOpen } className=' w-full sm:w-fit flex items-center justify-center bg-gray-800  rounded-lg ' key={'createPost'} to={'/createpost'}><button className="px-3 py-2 "> CreatePost  </button></Link>,
        <Link onClick={ handelSetOpen } className=' w-full sm:w-fit whitespace-nowrap flex items-center justify-center rounded-lg bg-gray-800  ' key={'followingPost'} to={'/followingpost'}><button className=" px-3 py-2 "> Following Post  </button></Link>,
        <button  key={'logout'} onClick={handleLogoutBtn} className=" px-3 py-2 rounded-lg w-full sm:w-fit flex items-center justify-center bg-gray-800 ">Logout</button>
      ]
    }
    else {
      return [
        <Link onClick={ handelSetOpen } className=' w-full sm:w-fit flex items-center justify-center bg-gray-800 rounded-lg   ' key={'signup'} to={'/signup'}><button className=" px-3 py-2 "> Signup </button> </Link>,
        <Link onClick={ handelSetOpen } className=' w-full sm:w-fit flex items-center justify-center m-0 bg-gray-800 rounded-lg ' key={'login'} to={'/login'}><button className=" px-3 py-2 "> Login </button></Link>
      ]
    }
  }

  return (
    <nav className="bg-black text-white z-10 w-full p-4 flex justify-between flex-col sm:flex-row sticky top-0 items-center">
      <div className=' w-full flex justify-between '>
        <div className="flex items-center">
          {/* <img
          src=""
          alt="Logo"
          className="h-10 w-10"
        /> */}
          <Link to={state ? '/' : null} className="text-2xl font-bold">Social Hub</Link>
        </div>
        <div onClick={handleThreeDot} className=' sm:hidden w-fit h-fit'>
          <ion-icon size="large" name="ellipsis-vertical-outline" ></ion-icon>
        </div>
      </div>
      {/* Logo */}

      {/* Profile and Logout Buttons */}
      <div className={`sm:flex items-center sm:relative w-full sm:w-fit flex-col sm:flex-row justify-center gap-3 top-0 left-0 right-0 ${open ? 'hidden' : 'flex'} transition-all duration-75 `}>
        {
          renderList()
        }
      </div>


    </nav>

  )
}
