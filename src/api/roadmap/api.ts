import axios from "axios";

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