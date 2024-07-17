import React, { useContext, useState, useEffect } from 'react';
import { userContext } from '../App';
import profileLogo from '../assets/profileUser.jpg';
import Swal from 'sweetalert2';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useGetUserProfile } from '../hooks/useGetuserProfile';
import { useAppContext } from '../context/Appcontext';

export const Profile = () => {
    const navigate = useNavigate();
    const { state } = useContext(userContext);
    const { loading, error } = useGetUserProfile();
    const { userProfile, setUserProfile } = useAppContext()

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [changeProfilePic, setChangeProfilePic] = useState(null);
    const [username, setUsername] = useState(state?.name);
    const [bio, setBio] = useState('');
    const [link, setLink] = useState('');
    const [updateError, setUpdateError] = useState({ show: false, m: "" });
    const { allPosts, setAllPosts } = useAppContext()

    useEffect(() => {
        if (userProfile) {
            setProfilePic(userProfile.user.image);
            setChangeProfilePic(userProfile.user.image);
            setBio(userProfile.user.bio);
            setLink(userProfile.user.link);
        }
    }, [userProfile]);
    
    window.scrollTo(0,0)
    
    const openPopup = (post) => {
        setSelectedPost(post);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setSelectedPost(null);
        setIsPopupOpen(false);
    };

    const openEditProfilePopup = () => {
        setEditProfile(true);
    };

    const closeEditProfilePopup = () => {
        setEditProfile(false);
    };

    const handleProfilePicChange = (e) => {
        setProfilePic(e.target.files[0]);
        setChangeProfilePic(URL.createObjectURL(e.target.files[0]));
    };

    const handleSubmitUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('file', profilePic);
            formData.append('upload_preset', 'instagram_clone');
            formData.append('cloud_name', 'dowylsrxx');

            const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dowylsrxx/image/upload', {
                method: 'POST',
                body: formData,
            });

            const cloudinaryData = await cloudinaryResponse.json();
            if (!cloudinaryResponse.ok) {
                setUpdateError({ show: true, m: "Image not uploaded successfully. Please try again." });
                setProfilePic(userProfile?.user?.image);
                setChangeProfilePic(userProfile?.user?.image);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_URL}/api/updateprofile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: cloudinaryData.url, name: username, bio, link }),
                credentials: 'include',
            });

            const data = await response.json();
            if (response.status === 401) {
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
                return
            }

            
            if (response.ok) {
                Swal.fire({ position: 'top', title: "Profile updated successfully", icon: 'success', width: '300px', customClass: { popup: 'custom-swal-background2' }, timer: 3000 });
                setProfilePic(data.image);
                setEditProfile(false);
                setUserProfile((prev) => ({
                    ...prev, 
                    user: data
                }))

            } else {
                setUpdateError({ show: true, m: "Profile update failed. Please try again." });
            }
        } catch (error) {
            setUpdateError({ show: true, m: "An error occurred while updating profile. Please try again later." });
        }
    };

    const handleDeletePost = async () => {
        try {
            setDeleteLoading(true);
            const response = await fetch(`${import.meta.env.VITE_URL}/api/deletepost/${selectedPost._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.status === 401) {
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
                return
            }
            if (response.ok) {
                setUserProfile((prev) => ({
                    ...prev,
                    userPosts: prev.userPosts.filter((post) => post._id !== selectedPost._id)
                }));
                setAllPosts(allPosts?.filter((post) => post._id !== selectedPost._id))

                closePopup();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className='w-full h-screen text-black flex text-2xl items-center justify-center'>Go to login screen</div>;

    return (
        <div className='flex flex-col ml-auto mr-auto md:max-w-[1200px] gap-[50px] min-h-screen w-full'>
            <div className='sm:pl-[30px] pl-0 sm:mt-[20px] mt-2 mr-auto flex flex-col sm:flex-row items-center sm:gap-[30px] md:gap-[100px] w-full justify-center'>
                <div className='h-[200px] w-[200px] rounded-full overflow-hidden'>
                    <img className='h-full w-full' src={profilePic || profileLogo} alt='' />
                </div>
                <div className='flex flex-col gap-5 w-fit mt-3 sm:mt-0'>
                    <div className='flex gap-3 justify-between'>
                        <p className='text-xl opacity-[.9]'>{userProfile?.user?.name || 'Loading..'}</p>
                        <div onClick={openEditProfilePopup} className='cursor-pointer rounded-sm border-2 border-black flex items-center justify-center w-fit h-fit pl-2 pr-2'>Edit Profile</div>
                        <div className='text-3xl'><ion-icon name='aperture-outline'></ion-icon></div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='flex gap-2'>
                            <p className='text-sm font-bold opacity-[.9]'>{userProfile?.userPosts.length}</p>
                            <p className='text-sm opacity-[.9]'>Posts</p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'>{userProfile?.user?.followers.length}</p>
                            <p className='text-sm opacity-[.9]'>Followers</p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'>{userProfile?.user?.following.length}</p>
                            <p className='text-sm opacity-[.9]'>Following</p>
                        </div>
                    </div>
                    <div className='gap-3'>
                        <div className='flex gap-1'><p>{userProfile?.user?.email}</p></div>
                        <div className='bio'><p className='text-sm opacity-[.9]'>{userProfile?.user?.bio}</p></div>
                        <a target='_blank' className='text-blue-600' href={link}>{userProfile?.user?.link}</a>
                    </div>
                </div>
            </div>
            <hr className='w-full' />
            <div className='post mt-[20px] w-full grid grid-cols-3 sm:grid-cols-4 pl-[10px] pr-[10px] gap-[10px]'>
                {userProfile?.userPosts.length !== 0 ? (
                    userProfile.userPosts.map((post, index) => (
                        <div key={index} onClick={() => openPopup(post)} className='cursor-pointer'>
                            <img
                                className='h-[200px] w-full object-cover'
                                src={post.image}
                                alt=''
                            />
                        </div>
                    ))
                ) : (
                    <div className='whitespace-nowrap w-screen absolute right-0 text-black text-2xl'>
                        <p className='w-fit mr-auto ml-auto'>No posts found</p>
                    </div>
                )}
            </div>

            {isPopupOpen && selectedPost && (
                <div className='fixed top-0 left-0 w-screen h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white w-fit rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-2'>
                            <h2 className='text-xl font-semibold'>{selectedPost.title}</h2>
                            <button onClick={closePopup} className='text-gray-500 hover:text-gray-700'>
                                <ion-icon name='close-outline'></ion-icon>
                            </button>
                        </div>
                        <img className='w-auto h-auto max-h-[70vh] md:w-auto ' src={selectedPost.image} alt='' />
                        <p className='text-gray-700 mt-2'>{selectedPost.body}</p>
                        <div className='flex justify-between mt-4'>
                            <div><p>❤️ {selectedPost.likes.length}</p></div>
                            {deleteLoading ? (
                                <button className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>Loading...</button>
                            ) : (
                                <button onClick={handleDeletePost} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'>Delete</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {editProfile && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white relative w-full max-w-md mx-auto rounded-lg shadow-lg p-6">
                        <button className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-800" onClick={closeEditProfilePopup}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
                        <form onSubmit={handleSubmitUpdateProfile}>
                            <div className="mb-4">
                                <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 border-2 overflow-hidden border-black ml-auto mr-auto h-24 w-24 rounded-full cursor-pointer">
                                    <div className="h-full w-full flex items-center justify-center relative opacity-[0.7]">
                                        <img src={changeProfilePic || profilePic} alt="Profile" className="h-full w-full object-cover rounded-full" />
                                        <span className='absolute h-full w-full'><p className='w-full h-full flex items-center justify-center text-white text-3xl'>+</p></span>
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
                                <button type="button" className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:border-blue-500 focus:ring-blue-500" onClick={closeEditProfilePopup}>Cancel</button>
                                {updateError.show && <p className='text-red-500'>{updateError.m}</p>}
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
