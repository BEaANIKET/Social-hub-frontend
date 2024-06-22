import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import '../App.css'

export const Signup = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const Navigate = useNavigate(useState)

    const [error, setError] = useState({
        message: "",
        show: false
    })

    const validEmail = (email) => {
        if(email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
            return true;
        }
        return false
    }

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if ([name, email, password, confirmPassword].some((field) => field === "")) {
            setError({
                message: "All fields are required",
                show: true,
            });
            return;
        }

        if(!validEmail(email)){
            setError({
                message: "Invalid email",
                show: true,
            });
            return;
        }
        
        console.log(name, email, password, confirmPassword);
        // Check if passwords match
        if (password !== confirmPassword) {
            setError({
                message: "Passwords do not match",
                show: true,
            });
            return;
        }

        setError({ message: '', show: false });

        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });
            //   console.log(response);
            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    position: 'top',
                    icon: "success",
                    title: "User Logged in Successfully",
                    showConfirmButton: false,
                    timer: 1500,
                  });

                  setEmail('')
                  setConfirmPassword('')
                  setPassword('')
                  setName('')
                  Navigate('/login')
            } else {
                setError({
                    message: data.error,
                    show: true,
                });
            }
        } catch (error) {
            console.log("signup error -> ", error);
            setError({
                message: "Failed to signup. Please try again later.",
                show: true,
            });
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-5 text-center">Social Hub</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="Enter your name"
                        />
                    </div>
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
                    <div className="mb-4">
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
                    <div className="mb-6">
                        <label htmlFor="confirm-password" className="block text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="Confirm your password"
                        />
                    </div>
                    {
                        error.show &&
                        <div className=' w-full flex justify-center items-center text-red-600'>
                            <p>** {error.message} **</p>
                        </div>
                    }
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition duration-300"
                        onClick={handleSignupSubmit}
                    >
                        Sign Up
                    </button>
                    <button
                        className=' cursor-pointer w-full flex items-center justify-center text-black text-sm mt-2'
                        onClick={() => Navigate('/login')}
                    >
                        Already signup
                    </button>
                </form>
            </div>
        </div>
    )
}
