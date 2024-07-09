import { useState, useEffect, useContext } from 'react';
import { userContext } from '../App';
import { useAppContext } from '../context/Appcontext';

export const useGetUserProfile = () => {
    const { state } = useContext(userContext);
    const {userProfile, setUserProfile} = useAppContext()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!state) return;
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
                    setUserProfile(data);
                    setError(false);
                } else {
                    setError(true);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [state]);

    return { userProfile, loading, error, setUserProfile };
};
