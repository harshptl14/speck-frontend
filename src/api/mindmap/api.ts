// const API_BASE_URL = `${process.env.NEXT_PUBLIC_API}/speck/v1/mindmap`; // Adjust based on your backend URL

// interface ApiResponse<T> {
//     message: string;
//     data?: T;
//     error?: string;
// }

// export const createMindmap = async (inputText: string, title: string, token: string) => {
//     const response = await fetch(`${API_BASE_URL}/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ inputText, title }),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.error || "Failed to create mindmap");
//     }
//     return data.mindmap;
// };

// export const updateMindmap = async (
//     id: string,
//     token: string,
//     markdownText?: string,
//     userPrompt?: string
// ) => {
//     const response = await fetch(`${API_BASE_URL}/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ markdownText, userPrompt }),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.error || "Failed to update mindmap");
//     }
//     return data.markdown;
// };

// export const getMindmap = async (id: string, token: string) => {
//     const response = await fetch(`${API_BASE_URL}/${id}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.error || "Failed to fetch mindmap");
//     }
//     return data.mindmap;
// };

// export const listMindmaps = async (token: string) => {
//     const response = await fetch(`${API_BASE_URL}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });

//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.error || "Failed to fetch mindmaps");
//     }
//     return data.mindmaps;
// };


const API_BASE_URL = `${process.env.NEXT_PUBLIC_API}/speck/v1/mindmap`;

interface ApiResponse<T> {
    message: string;
    data?: T;
    error?: string;
}

// export const createMindmap = async (inputText: string, title: string, token: string) => {
//     const response = await fetch(`${API_BASE_URL}/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ inputText, title }),
//     });

//     const data = await response.json();
//     if (!response.ok) {
//         throw new Error(data.error || "Failed to create mindmap");
//     }
//     return data.mindmap;
// };

export const createMindmap = async (
    inputText: string,
    title: string,
    token: string,
    modelId: string
) => {

    const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            inputText,
            providedTitle: title || undefined, // Optional
            modelId,
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        const errorMessage = data?.error || "Failed to create mindmap.";
        throw new Error(errorMessage);
    }

    return data.mindmap;
};

export const directUpdateMarkdown = async (id: string, markdownText: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}/markdown`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ markdownText }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Failed to update mindmap");
    }
    return data.markdown;
};

export const generateAISuggestion = async (id: number | string, userPrompt: string, token: string, selectedModelId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/ai-suggestion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                userPrompt,
                id,
                modelId: selectedModelId,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to generate AI suggestion");
        }

        const data = await response.json();
        return {
            message: data.message,
            originalMarkdown: data.originalMarkdown,
            suggestedMarkdown: data.suggestedMarkdown
        };
    } catch (error) {
        console.error("Error generating AI suggestion:", error);
        throw error;
    }
};

export const acceptAISuggestion = async (id: string, suggestedMarkdown: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}/accept-suggestion`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ suggestedMarkdown }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Failed to accept AI suggestion");
    }
    return data.markdown;
};

export const saveAIChatMessage = async (
    id: string,
    role: 'user' | 'assistant',
    content: string,
    token: string
) => {
    const response = await fetch(`${API_BASE_URL}/${id}/ai-chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, content }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to save AI chat message');
    }
    return data;
};

export const getAIChatMessages = async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}/ai-chat`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'FailedJuneau');
        throw new Error(data.error || 'Failed to fetch AI chat messages');
    }
    return data.messages;
};

export const getMindmap = async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch mindmap");
    }
    return data.mindmap;
};

export const listMindmaps = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch mindmaps");
    }
    return data.mindmaps;
};

