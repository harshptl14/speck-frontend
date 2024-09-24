import { decodeJWT, User } from '@/services/get_user_info';
import { cookies } from 'next/headers';

export interface RoadmapResponseData {
    totalRoadmapIds: { id: number }[];
    completedRoadmapIds: { roadmapId: number }[];
    favoriteRoadmapIds: { roadmapId: number }[];
    courses: Course[];
}

interface Course {
    id: number;
    name: string;
    progress: number;
}

async function getMyRoadmapsInfo(id: string, jwt: string): Promise<RoadmapResponseData> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_API}/speck/v1/roadmap/getRoadmapsInfoByUserId/${id}`,
        {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
    );
    if (!response.ok) {
        throw new Error('Failed to fetch roadmap data');
    }
    const data = await response.json();
    return data.data;
}

export async function fetchDataFromServer(): Promise<{ userInfo: User | null; roadmapData: RoadmapResponseData }> {
    const userInfo = decodeJWT(); // Assume this is a synchronous function returning user info
    const jwt = cookies().get("jwtToken")?.value;

    if (!userInfo || !userInfo.id || !jwt) {
        return { userInfo: null, roadmapData: { totalRoadmapIds: [], completedRoadmapIds: [], favoriteRoadmapIds: [], courses: [] } };
    }

    const roadmapData = await getMyRoadmapsInfo(userInfo.id.toString(), jwt);
    return { userInfo, roadmapData };
}