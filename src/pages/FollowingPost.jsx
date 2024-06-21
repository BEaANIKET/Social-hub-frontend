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
                const response = await fetch('/api/getsubpost', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
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
        <div>
            {
                mypost.length !== 0 && mypost.map(( post ) => {
                    return (
                       <Post postData={post} />
                    )
                })
            }
        </div>
    )
}
