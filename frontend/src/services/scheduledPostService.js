const API_URL = "http://127.0.0.1:8000";


export async function createScheduledPost(data){

    const token = localStorage.getItem("token");
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;


    const response = await fetch(
        `${API_URL}/scheduled-posts`,
        {
            method:"POST",

            headers: isFormData
                ? {
                    "Authorization":`Bearer ${token}`
                }
                : {
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },

            body:isFormData ? data : JSON.stringify(data)
        }
    );


    if(!response.ok){
        throw new Error("Failed to create scheduled post");
    }


    return await response.json();

}




export async function getScheduledPosts(filters = {}){

    const token = localStorage.getItem("token");

    const params = new URLSearchParams();

    if (filters.platform && filters.platform !== "All Platforms") {
        params.append("platform", filters.platform);
    }

    if (filters.status && filters.status !== "All Statuses") {
        params.append("status", filters.status);
    }

    const url = params.toString()
        ? `${API_URL}/scheduled-posts?${params.toString()}`
        : `${API_URL}/scheduled-posts`;

    const response = await fetch(
        url,
        {
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    );


    if(!response.ok){
        throw new Error("Failed to fetch scheduled posts");
    }


    return await response.json();

}