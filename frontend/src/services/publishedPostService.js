import { buildApiUrl } from "./api";


export async function getPublishedPosts(){

    const response = await fetch(
        buildApiUrl("/published-posts")
    );


    if(!response.ok){
        throw new Error(
            "Failed to fetch published posts"
        );
    }


    return await response.json();

}