import Grid from "./grid";
import { useWordleStore } from "../Stores/wordleStore";

export default function WordlePage() {
  const { storedGuess } = useWordleStore("3a559293-9500-416b-89a3-213aeaa739bf");

  return (
    <main className="flex flex-col min-h-screen pt-0 pb-4">
      <div className="flex-1 flex flex-col items-center min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="items-center grid grid-cols-3 w-screen p-4 border-b border-neutral-700">
            <h1 className="col-start-2 font-bold text-3xl text-center text-neutral-200">
              WORST WORDLE
            </h1>
            <h3 className="col-start-3 text-right text-neutral-400">
              Todays date: <br />
              11.09.2001
            </h3>
          </div>
        </header>
        <div className="flex flex-col gap-1 pt-10">
          {new Array(6).fill(0).map((_, i) => (
            <Grid
              key={i}
              isGuessed={i < storedGuess.currentGuess}
              guess={storedGuess.guesses[i]}
            />
          ))}
        </div>
        <footer className="mt-auto w-screen">
          <nav className="text-neutral-400 text-right text-sm px-4">
            Made with ❤️ by <a href="https://github.com/Luggitos">Luggitos</a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
