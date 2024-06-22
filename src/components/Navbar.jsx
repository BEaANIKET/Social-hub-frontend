import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { userContext } from '../App'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import '../App.css'

export const Navbar = () => {

  const { state, dispatch } = useContext(userContext)
  const Navigate = useNavigate()

  const handleLogoutBtn = async () => {
     try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials:'include'
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

  const renderList = () => {
    if (state) {
      return [
        <Link key={'profile'} to={'/profile'}><button className="bg-gray-800 px-3 py-2 rounded-lg"> Profile  </button></Link>,
        <Link key={'createPost'} to={'/createpost'}><button className="bg-gray-800 px-3 py-2 rounded-lg"> CreatePost  </button></Link>,
        <Link key={'followingPost'} to={'/followingpost'}><button className="bg-gray-800 px-3 py-2 rounded-lg"> Following Post  </button></Link>,
        <button key={'logout'} onClick={handleLogoutBtn} className="bg-gray-800 px-3 py-2 rounded-lg">Logout</button>
      ]
    }
    else{
      return [
        <Link key={'signup'} to={'/signup'}><button className="bg-gray-800 px-3 py-2 rounded-lg"> Signup </button> </Link>,
        <Link key={'login'} to={'/login'}><button className="bg-gray-800 px-3 py-2 rounded-lg"> Login </button></Link>
      ]
    }
  }
  
  return (
    <nav className="bg-black text-white p-4 flex justify-between sticky top-0 items-center">
      {/* Logo */}
      <div className="flex items-center">
        {/* <img
          src=""
          alt="Logo"
          className="h-10 w-10"
        /> */}
        <Link to={ state ? '/' : null} className="text-2xl font-bold">Social Hub</Link>
      </div>
      {/* Profile and Logout Buttons */}
      <div className="flex items-center space-x-4">
        {
          renderList()
        }
      </div>
    </nav>
  )
}
