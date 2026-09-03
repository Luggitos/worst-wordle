import { useWordleStore } from "../Stores/wordleStore";
import WordleBoard from "../components/WordleBoard";
import WordleFooter from "../components/WordleFooter";
import WordleHeader from "../components/WordleHeader";

export default function WordlePage() {
  const { storedGuess } = useWordleStore("bbe18ebe-8a2a-431e-a500-8b91f952bcfb");

  return (
    <main className="flex min-h-screen flex-col px-4 pb-4 pt-0">
      <div className="flex min-h-0 flex-1 flex-col items-center">
        <WordleHeader />
        <WordleBoard
          guesses={storedGuess.guesses}
          currentGuess={storedGuess.currentGuess}
          letters={storedGuess.letters}
        />
        <WordleFooter />
      </div>
    </main>
  );
}
