import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;


export const fetchProgress = async (jobId: string, token: string) => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/speck/v1/roadmap/subtopicGenerationProgress/${jobId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

export const generateSubtopicContent = async (
    subtopicId: string,
    roadmapId: string,
    jobId: string,
    token: string
) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_API}/speck/v1/roadmap/generateSubtopicContent`,
        {
            subtopicId,
            roadmapId,
            jobId,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// import axios from 'axios';

const api = axios.create({
    baseURL: API_BASE_URL,
    // withCredentials: true,
});

export const getRoadmapOutline = async (id: string, token: string | undefined) => {
    console.log("id", id);
    console.log("token", token);
    try {
        const response = await api.get(`/speck/v1/roadmap/getTopicsById/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting roadmap:", error);
        throw error;
    }
};

export const updateSubtopicCompletion = async (roadmapId: number, topicId: number, subtopicId: number, newStatus: string, token: string | undefined) => {
    console.log("topicId", topicId);
    console.log("subtopicId", subtopicId);
    console.log("completed", newStatus);

    try {
        const response = await api.post('/speck/v1/roadmap/updateSubtopicCompletion', {
            roadmapId,
            topicId,
            subtopicId,
            newStatus
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating subtopic completion:", error);
        throw error;
    }
};