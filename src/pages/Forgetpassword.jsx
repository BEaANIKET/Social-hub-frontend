import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../App.css';

export const Forgetpassword = () => {
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSend, setOtpSend] = useState(false);
    const [email, setEmail] = useState('');
    const [resend, setResend] = useState(false);
    const [time, setTime] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        show: true,
        message: ''
    });
    const Navigate = useNavigate();

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/resetpassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    otp: otp,
                    password: password,
                    email: email
                }),
                credentials: 'include',
            });
            const data = await response.json();
            if (response.status < 500) {
                if (response.status === 200) {
                    toast.success('Password updated successfully');
                    Navigate('/login');
                }
                else {
                    toast.error(data.error);
                }
            }
        } catch (error) {
            console.log("password verify error ", error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSend = async (e) => {
        e.preventDefault();
        resendBtn();
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
            });
            const data = await response.json();
            if (response.status < 500) {
                if (response.status === 200) {
                    toast.success('OTP sent to your email');
                    setOtpSend(true);
                    setError({
                        message: "",
                        isError: false
                    });
                }
                else {
                    toast.error(data.error);
                    setOtpSend(false);
                    setResend(false);
                    toast.error(data.error);
                }
            }
        } catch (error) {
            toast.error('An error occurred. Please try again later.');
            console.log(error);
        }
    };

    let flag = true;
    const resendBtn = () => {
        if (flag) {
            setResend(true);
            flag = false;
            setTime(30);
            timer();
        }

        setTimeout(() => {
            flag = true;
            setResend(false);
        }, 30000);
    };

    const timer = () => {
        const intervalId = setInterval(() => {
            setTime(prevTime => {
                if (prevTime === 1) {
                    clearInterval(intervalId);
                    setTime(30);
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
                            disabled={resend || isLoading}
                            onClick={handleOtpSend}
                            className={`mt-[10px] w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {resend ? 'Resend in ' : 'Send Otp'} {resend ? time : ''}
                        </button>

                    </div>
                    {
                        otpSend &&
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
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
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
                                    disabled={isLoading}
                                    className={`w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Loading...' : 'Reset Password'}
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
    );
};
