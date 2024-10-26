import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API || 'http://localhost:4000';

export const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

export const getUser = async (token: string) => {
    const response = await api.get('/speck/v1/user/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

export const deleteUserAccount = async (token: string) => {
    await api.delete('/speck/v1/user/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
    });
}

export const logout = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API}/speck/v1/auth/logout`);
}