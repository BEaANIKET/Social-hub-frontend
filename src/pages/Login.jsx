import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import { toast } from 'react-hot-toast';
import '../App.css';
import { Loader } from '../components/Loader';

export const Login = () => {
  const { state, dispatch } = useContext(userContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    isError: false
  });
  const navigate = useNavigate();

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      message: "",
      isError: false
    });

    if (!email || !password) {
      setError({
        message: "All fields are required",
        isError: true
      });
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("User must be logged in");
      } else if (response.status === 400) {
        setError({
          message: data.error,
          isError: true
        });
        toast.error(data.error);
      } else if (response.status === 200) {
        dispatch({ type: 'USER', payload: data.user });
        toast.success("Logged in successfully");
        navigate('/');
      } else {
        setError({
          message: "Invalid email or password",
          isError: true
        });
        toast.error("Invalid email or password");
      }
    } catch (error) {
      setError({
        message: "Failed to login. Please try again later.",
        isError: true
      });
      toast.error("Failed to login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPassword = () => {
    navigate('/forgetpassword');
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 fixed w-full top-0">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-5 text-center">Social Hub</h2>
          <form onSubmit={handleLoginFormSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter your email"
                required
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
                required
              />
            </div>
            {error.isError && (
              <div className='w-full flex justify-center items-center text-red-600'>
                <p>** {error.message} **</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
            <button
              type="button"
              className='cursor-pointer w-full flex items-center justify-center text-black text-sm mt-2'
              onClick={handleForgetPassword}
            >
              Forget Password
            </button>
            <button
              type="button"
              className='cursor-pointer w-full flex items-center justify-center text-black text-sm mt-2'
              onClick={() => navigate('/signup')}
            >
              Register New Account
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
