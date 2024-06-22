import React, { useContext, useEffect, useState } from 'react';
import { userContext } from '../App';
import profileLogo from '../assets/profileUser.jpg';
import Swal from 'sweetalert2'
import '../App.css'
import { useNavigate } from 'react-router-dom';


export const Profile = () => {


    const Navigate = useNavigate()
    const { state } = useContext(userContext);
    const [mypost, setMypost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const [editprofile, setEditProfile] = useState(false)
    const [profilePic, setProfilePic] = useState(mypost?.user?.image)
    const [username, setUsername] = useState(state?.name)
    const [bio, setBio] = useState(state?.bio)
    const [link, setLink] = useState(state?.link)
    const [url, setUrl] = useState('')
    const [updateError, setUpDateError] = useState({
        show: false,
        m: ""
    })

    const fetchData = async () => {

        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/userprofile/${state.id}`, {
                method: 'GET',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (response.ok) {
                setMypost(data);
                setLoading(false);
                setError(false);
            } else {
                // setError(true);
            }
        } catch (error) {
            console.log("my post error -> ", error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state) {
            fetchData();
        }
    }, [state]);

    const openPopup = (post) => {
        setSelectedPost(post);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setSelectedPost(null);
        setIsPopupOpen(false);
    };

    const openEditprofilePopup = () => {
        setEditProfile(true)
    }

    const handleSubmitUpdateProfile = async (e) => {

        e.preventDefault()
        try {
            // Step 1: Upload profile picture to Cloudinary
            const formData = new FormData();
            formData.append('file', profilePic); // Assuming profilePic is a File object
            formData.append('upload_preset', 'instagram_clone');
            formData.append('cloud_name', 'dowylsrxx');

            const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dowylsrxx/image/upload', {
                method: 'POST',
                body: formData
            });

            const cloudinaryData = await cloudinaryResponse.json();

            if (!cloudinaryResponse.ok) {
                setUpDateError({
                    show: true,
                    m: "Image not uploaded successfully. Please try again."
                });
                return;
            } else {
                setUrl(cloudinaryData.url)
                setUpDateError({
                    show: false,
                    m: ""
                });
            }



            const response = await fetch(`${import.meta.env.VITE_URL}/api/updateprofile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: cloudinaryData.url,
                    name: username,
                    bio: bio,
                    link: link
                }),
                credentials: 'include',
            });

            const data = await response.json();
            // console.log("response = ", response);
            // console.log("data ", data);
            if (response.ok) {
                console.log("mypost ", mypost);
                console.log("Updated data:", data);
                setMypost( prev => (
                    {
                        ...prev,
                        user: data,
                    }
                ))
                setEditProfile(false)
                // Navigate('/profile')
            } else {
                setUpDateError({
                    show: true,
                    m: "Profile update failed. Please try again."
                });
            }

        } catch (error) {
            console.error("Error updating profile:", error);
            setUpDateError({
                show: true,
                m: "An error occurred while updating profile. Please try again later."
            });
        }
    };
    const closeEditprofilePopup = () => {
        setEditProfile(false)
    }

    const handleProfilePicChange = (e) => {
        setProfilePic(e.target.files[0])
    }

    // console.log(mypost);
    const handleDeletePost = async () => {
        try {
            setDeleteLoading(true)
            const response = await fetch(`${import.meta.env.VITE_URL}/api/deletepost/${selectedPost._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setMypost((prev) => ({
                    ...prev,
                    userPosts: prev.userPosts.filter(post => post._id !== selectedPost._id)
                }));
                closePopup();
                setDeleteLoading(false)
                // console.log('Post deleted successfully:', data);
            } else {
                console.log('Failed to delete post:', data.error);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setDeleteLoading(false)
        }
    };


    if (loading) {
        return (
            <div className='w-full h-screen text-black flex text-2xl items-center justify-center'>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className='w-full h-screen text-black flex text-2xl items-center justify-center'>
                Go To login screen
            </div>
        );
    }

    return (
        <div className='flex flex-col ml-auto mr-auto md:max-w-[1200px] gap-[50px] min-h-screen fixed w-full top-0'>

            {/* User top sections */}
            <div className='sm:pl-[30px] pl-2 sm:mt-[20px] mt-2 mr-auto flex flex-col sm:flex-row items-center sm:gap-[30px] md:gap-[100px] w-full justify-center'>

                {/* User logo */}
                <div>
                    <div className='h-[200px] w-[200px] rounded-full overflow-hidden'>
                        <img className='h-full w-full' src={mypost?.user?.image || profileLogo} alt='' />
                    </div>
                </div>

                {/* User details */}
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-3 justify-between'>
                        <p className='text-xl opacity-[.9]'> {mypost?.user?.name || 'Loading..'} </p>
                        <div onClick={openEditprofilePopup} className=' cursor-pointer rounded-sm border-2 border-black flex items-center justify-center w-fit h-fit pl-2 pr-2'>
                            Edit Profile
                        </div>
                        <div className='text-3xl'>
                            <ion-icon name='aperture-outline'></ion-icon>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='flex gap-2'>
                            <p className='text-sm font-bold opacity-[.9]'> {mypost?.userPosts.length} </p>
                            <p className='text-sm opacity-[.9]'> Posts </p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'> {mypost?.user?.followers.length} </p>
                            <p className='text-sm opacity-[.9]'> Followers </p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'> {mypost?.user?.following.length} </p>
                            <p className='text-sm opacity-[.9]'> Following </p>
                        </div>
                    </div>
                    <div className='gap-3'>
                        <div className='flex gap-1'>
                            <p> {mypost?.user?.email} </p>
                        </div>
                        <div className='bio'>
                            <p className='text-sm opacity-[.9]'>
                                {
                                    mypost?.user?.bio
                                }
                            </p>
                        </div>
                        <a target='_blank' className='text-blue-600' href={link}>
                            {mypost?.user?.bio}
                        </a>
                    </div>
                </div>
            </div>

            {/* User post sections */}
            <hr className='w-full' />
            <div className='post mt-[20px] w-full grid grid-cols-3 sm:grid-cols-4 pl-[10px] pr-[10px] gap-[10px] '>
                {mypost?.userPosts.length !== 0 ? (
                    mypost.userPosts.map((post, index) => (
                        <div key={index} onClick={() => openPopup(post)} className='cursor-pointer'>
                            <img className='h-full w-full' src={post.image} alt='' />
                        </div>
                    ))) : (
                    <div className=' w-screen h-full text-black flex text-2xl items-center justify-center '>
                        <p> No posts found </p>
                    </div>
                )}
            </div>

            {/* Popup for displaying selected post */}
            {isPopupOpen && selectedPost && (
                <div className='fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-2'>
                            <h2 className='text-xl font-semibold'>{selectedPost.title}</h2>
                            <button onClick={closePopup} className='text-gray-500 hover:text-gray-700'>
                                <ion-icon name='close-outline'></ion-icon>
                            </button>
                        </div>
                        <img className='max-w-[700px] w-full' src={selectedPost.image} alt='' />
                        <p className='text-gray-700 mt-2'>{selectedPost.body}</p>
                        <div className='flex justify-end mt-4'>
                            {
                                deleteLoading == true ? (
                                    <button className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>
                                        Loading...
                                    </button>
                                ) : (

                                    <button onClick={handleDeletePost} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>
                                        Delete
                                    </button>
                                )
                            }


                        </div>
                    </div>
                </div>
            )}

            {
                editprofile && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
                            <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800" onClick={closeEditprofilePopup}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
                            <form >

                                <div className="mb-4">
                                    <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 border-2 overflow-hidden border-black ml-auto mr-auto h-24 w-24 rounded-full cursor-pointer">
                                        <div className="h-full w-full flex items-center justify-center relative opacity-[0.7] ">
                                            {profilePic ? (
                                                <img src={URL.createObjectURL(profilePic)} alt="Profile" className="h-full w-full object-cover rounded-full" />
                                            ) : (
                                                <img src={profileLogo} alt="Profile" className="h-full w-full object-cover rounded-full" />
                                            )}
                                            <span className=' absolute h-full w-full'> <p className=' w-full h-full flex items-center justify-center text-white text-3xl'> + </p> </span>
                                        </div>
                                    </label>
                                    <input type="file" id="profilePic" onChange={handleProfilePicChange} accept="image/*" className="hidden" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
                                    <input type="text" id="name" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                                </div>



                                <div className="mb-4">
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio:</label>
                                    <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                                </div>

                                <div className="flex justify-end">
                                    <button type="button" className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:border-blue-500 focus:ring-blue-500" onClick={closeEditprofilePopup}>Cancel</button>
                                    {
                                        updateError.show && (
                                            <p className='text-red-500'>{updateError.m}</p>
                                        )
                                    }
                                    <button onClick={handleSubmitUpdateProfile} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
};
