interface GameStatusResponse {
    gameId: string;
    attempts: number;
    guesses: GuessHistory[],
    gameFinished: boolean,
    won: boolean;
}