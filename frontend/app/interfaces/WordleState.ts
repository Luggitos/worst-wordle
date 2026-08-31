interface WordleState {
  guesses: string[],
  currentGuess: number;
  won: boolean;
  gameFinished: boolean;
  letters: LetterResult[][];
}