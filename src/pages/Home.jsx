import React, { useEffect } from 'react'
import { Post } from '../components/Post';
import { useState } from 'react';
import { data } from 'autoprefixer';
import { useNavigate } from 'react-router-dom';

export const Home = () => {

    const [posts, setPosts] = useState([]);
    const navigate = useNavigate()
    const [error, setError] = useState({
        message: "",
        show: false
    })

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/allpost')
                const data = await response.json()
                if (response.status === 200) {
                    setPosts(data.post)
                    setLoading(false)
                    // console.log(data);
                }
            } catch (error) {
                console.log('allpost Error -> ', error);
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
        
    }, [])


    if (loading) {
        return <div className=' w-full h-screen text-black flex items-center justify-center text-2xl'>Loading...</div>
    }

    return (
        <>
            {/* <div>Home</div> */}
            {
                posts.length !== 0 && posts.map((post, index) => {
                    return (
                        <Post key={index} postData={post} />
                    )
                })
            }
        </>

    )
}
