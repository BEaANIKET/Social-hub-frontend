import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../App';
import { Post } from '../components/Post';

export const FollowingPost = () => {

    const [mypost, setMypost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_URL}/api/getsubpost`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })

                const data = await response.json();
                // console.log("follow post -> ", data);

                if(response.ok ){
                    setMypost(data.posts);
                    setLoading(false);
                    setError(false);
                }
            } catch (error) {
                console.log("follow Erro post -> ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData()

    }, [])

    return (
        <div className=' mt-[50px] '>
            {
                mypost.length !== 0 ? ( mypost.map(( post, index ) => {
                    return (
                       <Post key={index} postData={post} />
                    )
                }) ) : (
                    <div className=' w-full h-screen text-black flex items-center justify-center text-2xl'>No Post Found</div>
                )
            }
        </div>
    )
}
