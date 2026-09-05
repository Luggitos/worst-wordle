import { useEffect, useState } from "react";
import { startGame } from "../api/startGame";
import { useWordleStore } from "../Stores/wordleStore";
import WordleBoard from "../components/WordleBoard";
import WordleFooter from "../components/WordleFooter";
import WordleHeader from "../components/WordleHeader";

export default function WordlePage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    startGame()
      .then((response) => {
        if (isMounted) {
          setGameId(response.id);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setStartError(error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const { storedGuess } = useWordleStore(gameId);

  return (
    <main className="flex min-h-screen flex-col px-4 pb-4 pt-0">
      <div className="flex min-h-0 flex-1 flex-col items-center">
        <WordleHeader />
        {startError ? (
          <p className="pt-10 text-red-400">{startError}</p>
        ) : gameId ? (
          <WordleBoard
            guesses={storedGuess.guesses}
            letters={storedGuess.letters}
          />
        ) : (
          <p className="pt-10 text-neutral-400">Iniciando jogo...</p>
        )}
        <WordleFooter />
      </div>
    </main>
  );
}
