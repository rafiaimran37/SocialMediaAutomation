const API_URL = "http://127.0.0.1:8000";

export async function getClients() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/clients`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch clients");
    }

    return await response.json();
}


export async function createClient(clientName) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/clients`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clientName
            })
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create client");
    }

    return await response.json();
}