import React, { useState, useEffect, useContext } from 'react';
import profileLogo from '../assets/profileUser.jpg';
import { useParams } from 'react-router-dom';
import { userContext } from '../App';
import { Loader } from '../components/Loader';
import toast from 'react-hot-toast';
import '../App.css';
import { useSocketContext } from '../context/SocketContext';
import { useAppContext } from '../context/Appcontext';

export const Userprofile = () => {
    const { state } = useContext(userContext);
    const { id } = useParams();
    const [mypost, setMypost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [followBtnShow, setFollowBtnShow] = useState(true);
    const [following, setFollowing] = useState(0);
    const [follower, setFollower] = useState(0);
    const { userProfile, setUserProfile } = useAppContext()
    const { socket } = useSocketContext();

    useEffect(() => {
        setFollowing(mypost?.user?.following.length);
        setFollower(mypost?.user?.followers.length);
    }, [mypost]);

    window.scrollTo(0, 0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/userprofile/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();

                if (response.ok) {
                    const { user, userPosts } = data;
                    setMypost({ user, userPosts });
                    const isFollowing = user.followers.includes(state?.id);
                    setFollowBtnShow(!isFollowing);
                } else {
                    toast.error(data.error);
                    setError(true);
                }
            } catch (error) {
                console.log("userData error -> ", error);
                toast.error("An error occurred while fetching user data.");
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, state?.id]);

    // socket Lishner
    useEffect(() => {
        // Socket event listeners for follow and unfollow events
        socket?.on('newFollow', (data) => {
            if (userProfile) {
                setUserProfile((prev) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        following: [...prev.user.following, id]
                    }
                }));
            }

            if (data.following === id) {
                setFollower((prev) => prev + 1)
            }

            if( userProfile && data.following === userProfile.user._id){
                setUserProfile((prev) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        followers: [...prev.user.followers, id]
                    }
                }));
            }

        });


        socket?.on('unfollow', (data) => {
            if (userProfile) {
                setUserProfile((prev) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        following: prev.user.following.filter(FId => FId !== id)
                    }
                }));
            }

            if (data.following === id) {
                setFollower((prev) => prev - 1)
            }
            if( userProfile && userProfile.user_id === data.following){
                setUserProfile()
            }
        });

        // Cleanup listeners on component unmount
        return () => {
            socket?.off('newFollow');
            socket?.off('unfollow');
        };
    }, [id, socket]);

    const handleFollowBtn = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/follow`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ followId: id }),
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setFollowBtnShow(false);
                // setFollower(prev => prev + 1);
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.log("follow error ", error);
            toast.error("An error occurred while following.");
        }
    };

    const handleUnFollowBtn = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/unfollow`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ followId: id }),
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setFollowBtnShow(true);
                // setFollower(prev => (prev > 0 ? prev - 1 : 0));
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.log("unfollow error ", error);
            toast.error("An error occurred while unfollowing.");
        }
    };

    const openPopup = (post) => {
        setSelectedPost(post);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setSelectedPost(null);
        setIsPopupOpen(false);
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className='w-full h-screen text-black flex text-2xl items-center justify-center'>Go To login screen</div>;
    }

    return (
        <div className='flex flex-col ml-auto mr-auto md:max-w-[1200px] gap-[50px] min-h-screen'>
            {/* User top sections */}
            <div className='sm:pl-[30px] pl-2 sm:mt-[20px] mt-2 mr-auto flex flex-col sm:flex-row sm:gap-[30px] md:gap-[100px] w-full justify-center items-center'>
                {/* User logo */}
                <div>
                    <div className='h-[200px] w-[200px] rounded-full overflow-hidden'>
                        <img className='h-full w-full' src={mypost.user?.image || profileLogo} alt='' />
                    </div>
                </div>
                {/* User details */}
                <div className='flex flex-col gap-5 mt-[20px]'>
                    <div className='flex gap-3 justify-between'>
                        <p className='text-xl opacity-[.9]'>{mypost.user?.name || 'Loading..'}</p>
                    </div>
                    <div className='flex gap-3'>
                        <div className='flex gap-2'>
                            <p className='text-sm font-bold opacity-[.9]'>{mypost.userPosts.length}</p>
                            <p className='text-sm opacity-[.9]'>Posts</p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'>{follower}</p>
                            <p className='text-sm opacity-[.9]'>Followers</p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'>{following}</p>
                            <p className='text-sm opacity-[.9]'>Following</p>
                        </div>
                    </div>
                    <div className='gap-3'>
                        <div className='bio'>
                            <p className='text-sm opacity-[.9]'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, quas.
                            </p>
                        </div>
                        <a target='_blank' className='text-blue-600' href='www.google.com'>
                            www.google.com
                        </a>
                    </div>
                </div>
                {/* Follow button */}
                <button
                    onClick={followBtnShow ? handleFollowBtn : handleUnFollowBtn}
                    className='bg-blue-500 h-fit text-white font-semibold py-[10px] px-[20px] rounded-full active:sc'
                >
                    {followBtnShow ? 'Follow' : 'Unfollow'}
                </button>
            </div>
            {/* User post sections */}
            <hr className='w-full' />
            <div className='post mt-[20px] w-full grid grid-cols-3 sm:grid-cols-4 pl-[10px] pr-[10px] gap-[10px]'>
                {mypost?.userPosts.length !== 0 ? (
                    mypost.userPosts.map((post, index) => (
                        <div key={index} onClick={() => openPopup(post)} className='cursor-pointer'>
                            <img className='h-[200px] w-full object-cover' src={post.image} alt='' />
                        </div>
                    ))
                ) : (
                    <div className='whitespace-nowrap w-screen absolute right-0 text-black text-2xl'>
                        <p className='w-fit mr-auto ml-auto'>No posts found</p>
                    </div>
                )}
            </div>
            {/* Popup for displaying selected post */}
            {isPopupOpen && selectedPost && (
                <div className='fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50'>
                    <div className='bg-white w-fit rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-2'>
                            <h2 className='text-xl font-semibold'>{selectedPost.title}</h2>
                            <button onClick={closePopup} className='text-gray-500 hover:text-gray-700'>
                                <ion-icon name='close-outline'></ion-icon>
                            </button>
                        </div>
                        <img className='w-auto h-auto max-h-[70vh] md:w-auto' src={selectedPost.image} alt='' />
                        <p className='text-gray-700 mt-2'>{selectedPost.body}</p>
                        <div>
                            <p> ❤️ {selectedPost.likes.length} </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
