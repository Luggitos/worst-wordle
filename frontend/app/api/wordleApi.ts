export async function submitGuess(guess: string, gameId: string) {
    const response = await fetch(`/wordle/guess/${gameId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ guess })
    });
    if (!response.ok) {
        throw new Error(`Failed to submit guess: ${response.statusText}`);
    }
    return response.json();
}