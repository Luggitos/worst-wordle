import Grid from "../pages/grid";

type WordleBoardProps = {
  guesses: string[];
  currentGuess: number;
  letters: LetterResult[][];
};

export default function WordleBoard({
  guesses,
  currentGuess,
  letters,
}: WordleBoardProps) {
  return (
    <section className="flex flex-col gap-1 pt-10" aria-label="Wordle board">
      {guesses.map((guess, index) => (
        <Grid
          key={index}
          guess={guess}
          statuses={letters[index]}
        />
      ))}
    </section>
  );
}
