import { URL } from "../utils/constant";

export async function gameInfo(gameId: string): Promise<GameStatusResponse> {
    const response = await fetch(`${URL}/${gameId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if(!response.ok){
        throw new Error(`Failed to get info:${response.statusText}`);
    }

    return response.json();
}
