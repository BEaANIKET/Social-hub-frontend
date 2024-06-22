import React, { useState, useEffect, useContext } from 'react';
import profileLogo from '../assets/profileUser.jpg';
import { useParams } from 'react-router-dom';
import { userContext } from '../App';

export const Userprofile = () => {
    const { state, dispatch } = useContext(userContext);
    const { id } = useParams();
    const [mypost, setMypost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [followBtnShow, setFollowBtnShow] = useState(true);

    const [following, setfollowing] = useState(0);
    const [follower, setfollower] = useState(0);

    useEffect(() => {
        setfollowing(mypost?.user?.following.length)
        setfollower(mypost?.user?.followers.length)
    }, [mypost])

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
                    const isFollowing = user.followers.includes(state.id);
                    setFollowBtnShow(!isFollowing); 
                } else {
                    setError(true);
                }
            } catch (error) {
                console.log("userData error -> ", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        
        fetchData();
    }, []);


    const handleFollowBtn = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/follow`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    followId: id,
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setFollowBtnShow(false);
                setfollower( follower + 1 ) // Update UI state after successful follow
            }
        } catch (error) {
            console.log("follow error ", error);
        }
    };

    const handleUnFollowBtn = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL}/api/unfollow`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    followId: id,
                }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setFollowBtnShow(true); // Update UI state after successful unfollow
                setfollower( follower==0 ? 0 : follower - 1 )
            }
        } catch (error) {
            console.log("unfollow error ", error);
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
        return <div className='w-full h-screen text-black flex text-2xl items-center justify-center'>Loading...</div>;
    }

    if (error) {
        return <div className='w-full h-screen text-black flex text-2xl items-center justify-center'>Go To login screen</div>;
    }

    return (
        <div className='flex flex-col ml-auto mr-auto md:max-w-[1200px] gap-[50px] min-h-screen'>
            {/* User top sections */}
            <div className='sm:pl-[30px] pl-2 sm:mt-[20px] mt-2 mr-auto flex flex-col sm:flex-row  sm:gap-[30px] md:gap-[100px] w-full justify-center'>
                {/* User logo */}
                <div>
                    <div className='h-[200px] w-[200px] rounded-full overflow-hidden'>
                        <img className='h-full w-full' src={mypost.user?.image || profileLogo} alt='' />
                    </div>
                </div>
                {/* User details */}
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-3 justify-between'>
                        <p className='text-xl opacity-[.9]'> {mypost.user?.name || 'Loading..'} </p>
                    </div>
                    <div className='flex gap-3'>
                        <div className='flex gap-2'>
                            <p className='text-sm font-bold opacity-[.9]'> {mypost.userPosts.length} </p>
                            <p className='text-sm opacity-[.9]'> Posts </p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'> {follower} </p>
                            <p className='text-sm opacity-[.9]'> Followers </p>
                        </div>
                        <div className='flex gap-3'>
                            <p className='text-sm font-bold opacity-[.9]'> {following} </p>
                            <p className='text-sm opacity-[.9]'> Following </p>
                        </div>
                    </div>
                    <div className='gap-3'>
                        <div className='flex gap-1'>
                            <div className='rounded-full border-black border-2 font-semibold text-[10px] h-[15px] w-[15px] flex items-center justify-center overflow-hidden'>
                                <p>A</p>
                            </div>
                            <div className='rounded-full border-black border-2 font-semibold text-[10px] h-[15px] w-[15px] flex items-center justify-center overflow-hidden'>
                                <p>N</p>
                            </div>
                            <div className='rounded-full border-black border-2 font-semibold text-[10px] h-[15px] w-[15px] flex items-center justify-center overflow-hidden'>
                                <p>I</p>
                            </div>
                            <div className='rounded-full border-black border-2 font-semibold text-[10px] h-[15px] w-[15px] flex items-center justify-center overflow-hidden'>
                                <p>K</p>
                            </div>
                            <div className='rounded-full border-black border-2 font-semibold text-[10px] h-[15px] w-[15px] flex items-center justify-center overflow-hidden'>
                                <p>E</p>
                            </div>
                            <div className='rounded-full border-black border-2 font-semibold text-[10px] h-[15px] w-[15px] flex items-center justify-center overflow-hidden'>
                                <p>T</p>
                            </div>
                        </div>
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
                {!followBtnShow ? (
                    <button onClick={handleUnFollowBtn} className='bg-blue-500 h-fit text-white font-semibold py-[10px] px-[20px] rounded-full'>
                        Unfollow
                    </button>
                ) : (
                    <button onClick={handleFollowBtn} className='bg-blue-500 h-fit text-white font-semibold py-[10px] px-[20px] rounded-full'>
                        Follow
                    </button>
                )}
            </div>
            {/* User post sections */}
            <hr className='w-full' />
            <div className='post mt-[20px] w-full grid grid-cols-3 sm:grid-cols-4 pl-[10px] pr-[10px] gap-[10px] '>
                {mypost.userPosts.length !== 0 ? (
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
                    </div>
                </div>
            )}

        </div>
    );
};
