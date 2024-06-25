import React, { useEffect } from 'react'
import { Post } from '../components/Post';
import { useState } from 'react';
import { data } from 'autoprefixer';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../components/Loader';

export const Home = () => {

    const [posts, setPosts] = useState([]);
    const navigate = useNavigate()
    const [error, setError] = useState({
        message: "",
        show: false
    })

    const [loading, setLoading] = useState(true);

    // console.log(import.meta.env.VITE_URL+"/api/allpost");
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/allpost`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const data = await response.json()
                if (response.ok) {
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
        return (
            <Loader />
        )
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
