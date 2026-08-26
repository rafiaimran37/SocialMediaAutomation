const API_URL = "http://127.0.0.1:8000";


export async function getSocialAccounts() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/social/accounts`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch social accounts");
    }

    return await response.json();
}


/*
 * Get social accounts belonging to a specific client
 */
export async function getClientAccounts(clientId) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/social/clients/${clientId}/accounts`,
        {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch client social accounts");
    }

    return await response.json();
}


export async function deleteSocialAccount(accountId) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/social/accounts/${accountId}`,
        {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete social account");
    }

    return await response.json();
}