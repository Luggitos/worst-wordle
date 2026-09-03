export type WordleState = {
  guesses: string[];
  currentGuess: number;
  won: boolean;
  gameFinished: boolean;
  letters: LetterResult[][];
};

export const createInitialWordleState = (): WordleState => ({
  guesses: new Array(6).fill(""),
  currentGuess: 0,
  won: false,
  gameFinished: false,
  letters: [],
});

export function addLetter(
  state: WordleState,
  letter: string,
): WordleState {
  return {
    ...state,
    guesses: state.guesses.map((guess, index) =>
      index === state.currentGuess && guess.length < 5
        ? guess + letter
        : guess,
    ),
  };
}

export function removeLetter(state: WordleState): WordleState {
  return {
    ...state,
    guesses: state.guesses.map((guess, index) =>
      index === state.currentGuess ? guess.slice(0, -1) : guess,
    ),
  };
}
