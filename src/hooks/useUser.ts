import { useState, useEffect } from 'react';
import { getUser } from '../api/user/api';
import { getClientSideCookie } from '../lib/utils';

export interface User {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const jwtToken = getClientSideCookie('jwtToken');
            if (!jwtToken) {
                setError('No authentication token found. Please log in again.');
                setLoading(false);
                return;
            }

            try {
                const userData = await getUser(jwtToken);
                setUser(userData);
            } catch (err) {
                setError('Failed to fetch user data. Please try again later.');
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, error };
};
