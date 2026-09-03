import { URL } from "../utils/constant";

export async function startGame(): Promise<GameStartResponse> {
    const response = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if(!response.ok){
        throw new Error(`Failed to start new game: ${response.statusText}`)
    }

    return response.json();
}