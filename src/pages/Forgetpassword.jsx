import React, { useRef, useState } from 'react'
import Swal from 'sweetalert2'
import '../App.css'
import { useNavigate } from 'react-router-dom'

export const Forgetpassword = () => {

    const [password, setPassword] = useState()
    const [otp, setOtp] = useState()
    const [optSend, setOtpSend] = useState(false)
    const [email, setEmail] = useState('')
    const [resend, setResend] = useState(false)
    const [time, setTime] = useState(10)
    const [error, setError] = useState({
        show: true,
        message: ''
    })
    const Navigate = useNavigate()



    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    otp: otp,
                    password: password
                }),
                credentials: 'include',
            })
            const data = await response.json()
            if (response.status === 200) {
                Swal.fire({
                    position: 'top',
                    title: "passwords updated successfully",
                    icon: 'success',
                    width: '300px',
                    customClass: {
                        popup: 'custom-swal-background2'
                    },
                    timer: 3000,
                })
                Navigate('/login')
            }
            else if(response.status === 404){
                Swal.fire({
                    position: 'top',
                    title: data.error,
                    icon: 'error',
                    width: '300px',
                    customClass: {
                        popup: 'custom-swal-background2'
                    },
                    timer: 3000,
                })
            }
        } catch (error) {
            console.log("passsword verify error ", error);
        }

    }

    const handleOtpSend = async (e) => {
        e.preventDefault()
        console.log("nsakjbafasf");
        resendBtn()
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/otpgenerate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                }),
                credentials: 'include'
            })
            const data = await response.json()
            console.log(data)
            if (response.status === 200) {
                Swal.fire({
                    position: 'top',
                    title: "otp send to your email",
                    icon: 'success',
                    width: '300px',
                    customClass: {
                        popup: 'custom-swal-background2'
                    },
                    timer: 3000,
                })
                setOtpSend(true)
                setError({
                    message: "",
                    isError: false
                })
            }
            else if( response.status === 404 ){
                Swal.fire({
                    position: 'top',
                    title: data.error,
                    icon: 'error',
                    width: '300px',
                    customClass: {
                        popup: 'custom-swal-background2'
                    },
                    timer: 3000,
                })
                setOtpSend(false)
                setResend(false)
            }
        } catch (error) {
            setError({
                message: "An error occurred. Please try again later.",
                show: true
            })
            console.log(error);
        }
    }


    let flag = true
    const resendBtn = () => {
        if (flag) {
            setResend(true); // Presumably disables a resend button
            flag = false;
            setTime(30)
            timer()
        }

        setTimeout(() => {
            flag = true; 
            setResend(false)
        }, 30000);
    };

    const timer = () => {
        const intervalId = setInterval(() => {
            setTime(prevTime => {
                if (prevTime === 1) {
                    clearInterval(intervalId);
                    setTime(30); // Reset time after it reaches 0
                    return 30;
                }
                return prevTime - 1;
            });
        }, 1000);
    };




    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />

                        <button
                            type="submit"
                            disabled={resend}
                            onClick={handleOtpSend}
                            className=" mt-[10px] w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {resend ? 'Resend in ' : 'Send Otp'} {resend ? time : ''}
                        </button>

                    </div>
                    {
                        optSend &&
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="number" className="block text-sm font-medium text-gray-700">Otp</label>
                                <input
                                    type="number"
                                    id="number"
                                    name="number"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700"> new password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    onClick={handlePasswordResetSubmit}
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    }
                    {
                        error.show &&
                        <p className='text-red-500'>{error.message}</p>
                    }
                </form>
            </div>
        </div>
    )
}
