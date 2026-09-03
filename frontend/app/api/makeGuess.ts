import { URL } from "../utils/constant";

export async function makeGuess(gameId: string, guess: string): Promise<GuessResponse> {
    const response = await fetch(`${URL}/guess/${gameId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ guess }),
    });

    if(!response.ok) {
        throw new Error(`Failed to make guess: ${response.statusText}`);
    }

    return response.json();
}
