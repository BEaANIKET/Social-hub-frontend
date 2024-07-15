import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import Swal from 'sweetalert2'
import '../App.css'
import { Loader } from '../components/Loader';

// const Swal = require('sweetalert2')

export const Login = () => {

  const { state, dispatch } = useContext(userContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState({
    message: "",
    isError: false
  });



  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError({
      message: "",
      isError: false
    })

    if (email == "" || password == "") {
      setError({
        message: "All fields are required",
        isError: true
      });
      setLoading(false)
      return;
    }


    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
        credentials: 'include',
      })

      if(response.status === 401){
        Swal.fire({
          position: "top-end",
          title: "user must be logedin",
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'custom-swal-background'
          }
        });
      }

      if(response.status === 400){
        const data = await response.json();
        setError({
          message: data.error,
          isError: true
        });
        return;
      }
      if (response.status === 200) {
        setLoading(false)
        const data = await response.json();
        document.cookie = `token=${data.token}; path=/; max-age=${30*24*60*60}; secure; samesite=none`;
        setError({
          message: "",
          isError: false
        })
        dispatch({ type: 'USER', payload: data.user })
        Swal.fire({
          position: "top-end",
          title: "LogedIn success",
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'custom-swal-background'
          }
        });
        Navigate('/')
      }
      else {
        setError({
          message: "Invalid email or password",
          isError: true
        });
        return;
      }
    } catch (error) {
      setError({
        message: "Failed to login. Please try again later.",
        isError: true
      })
    } finally{
      setLoading(false)
    }

  };

  const handleForgetPassword = () => {
    Navigate('/forgetpassword')
  }


  return (
    <>
      {
        loading && (
          <Loader />
        )
      }
      <div className="min-h-screen flex items-center justify-center bg-gray-100 fixed w-full top-0">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-5 text-center">Social Hub</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>
            {
              error.isError &&
              <div className='w-full flex justify-center items-center text-red-600'>
                <p>** {error.message} **</p>
              </div>
            }
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-300"
              onClick={handleLoginFormSubmit}
            >
              Login
            </button>

            <button
              className=' cursor-pointer w-full flex items-center justify-center text-black text-sm mt-2'
              onClick={handleForgetPassword}
            >
              forget password
            </button>
            <button
              className=' cursor-pointer w-full flex items-center justify-center text-black text-sm mt-2'
              onClick={() => Navigate('/signup')}
            >
              Resister new account
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
