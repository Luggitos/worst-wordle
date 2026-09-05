interface GuessResponse {
  attemptNumber: number;
  letters: LetterResult[];
  gameFinished: boolean;
  won: boolean;
}