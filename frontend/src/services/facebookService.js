import { buildApiUrl } from "./api";


export async function publishFacebookPost(message){


    const response = await fetch(
        buildApiUrl("/publish"),
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({
                message: message
            })
        }
    );


    if(!response.ok){

        throw new Error(
            "Facebook publish failed"
        );

    }


    return await response.json();

}