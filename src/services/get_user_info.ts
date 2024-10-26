import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from "next/headers";

export interface User {
    id: number;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

interface CustomJwtPayload extends JwtPayload {
    user: User;
}

export const decodeJWT = (): User | null => {
    try {
        const verifiedToken = cookies().get("jwtToken")?.value;
        if (verifiedToken) {
            const decoded = jwt.decode(verifiedToken) as CustomJwtPayload | null;
            return decoded?.user || null;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error decoding JWT token:", error);
        return null;
    }
};
