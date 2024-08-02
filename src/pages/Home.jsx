import React, { useEffect } from 'react';
import { Post } from '../components/Post';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { useAppContext } from '../context/Appcontext';
import { useSocketContext } from '../context/SocketContext';
import Swal from 'sweetalert2';
import { PostSkeleton } from '../components/PostSkeleton';

export const Home = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { allPosts, setAllPosts } = useAppContext();
    const { socket } = useSocketContext();

    // Handle initial fetching of posts and socket events
    useEffect(() => {
        const fetchPosts = async () => {
            if (allPosts) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/allpost`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setAllPosts(data.post);
                } else {
                    throw new Error('Failed to fetch posts');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
                Swal.fire('Error', 'An error occurred while fetching posts.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [socket, allPosts, setAllPosts]);

    if (loading) {
        return (
            <div className="mt-0 bg-[#EFF4ED] p-4">
                {[...Array(5)].map((_, index) => (
                    <PostSkeleton key={index} />
                ))}
            </div>
        );
    }

    return (
        <>
        <div className=' mt-0 bg-[#EFF4ED] flex flex-col gap-3 '>
            {allPosts &&
                allPosts.map((post, index) => <Post key={index} postData={post} />)}
        </div>
            
        </>
    );
};
