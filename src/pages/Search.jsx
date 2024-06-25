import React, { useState } from 'react';
import profilepic from '../assets/profileUser.jpg'
import { useNavigate } from 'react-router-dom';

export const Search = () => {
    const [searchVal, setSearchVal] = useState('');
    const [userData, setUserData] = useState([]);
    const [Error, setError] = useState({
        show: false,
        message: ""
    });
    const Navigate = useNavigate()


    const handleSearch = async (e) => {

        e.preventDefault()

        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: searchVal
                }),
                credentials: 'include'
            })
            const data = await response.json();
            if (response.ok) {
                setUserData(data.user)
                console.log(data.user);
            }
            else if (response.status === 404) {
                setError({
                    show: true,
                    message: data.error
                })
            }
        } catch (error) {
            console.log(error);
            setError({
                show: true,
                message: "Something went wrong"
            })
        }
    };


    return (
        <div className='w-full min-h-screen flex flex-col items-center p-4'>
            <div className=' bg-black p-4 w-full max-w-md'>
                <div className='flex'>
                    <input
                        type="text"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        placeholder="Search..."
                        className='h-10 w-full p-2 rounded-l'
                    />
                    <button onClick={handleSearch} className='bg-white p-2 rounded-r'>
                        🔍
                    </button>
                </div>
            </div>
            <div className='w-full max-w-md mt-4'>
                {userData.map(user => (
                    <div onClick={ () => Navigate(`/profile/${user._id}`)} key={user.id} className='bg-white p-4 mb-2 shadow-md rounded flex items-center cursor-pointer '>
                        <img src={user.image || profilepic} className='w-12 h-12 rounded-full mr-4' />
                        <div>
                            <div className='font-bold'>{user.name}</div>
                            <div className='text-gray-600'>{user.email}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

