import { useState, useEffect } from "react";
import { submitGuess } from "~/api/wordleApi";

export function useWordleStore(gameId: string) {
  const [storedGuess, setStoredGuess] = useState<WordleState>({
    guesses: new Array(6).fill(""),
    currentGuess: 0,
    won: false,
    gameFinished: false,
    letters: [],
  });
  const handleKeyDown = (e: KeyboardEvent) => {
    if (/^[a-zA-Z]$/.test(e.key)) {
      setStoredGuess((prev) => ({
        ...prev,
        guesses: prev.guesses.map((guess, i) =>
          i === prev.currentGuess
            ? (guess.length < 5 ? guess + e.key : guess)
            : guess
        ),
      }));
    } else if (e.key === "Backspace") {
      setStoredGuess((prev) => ({
        ...prev,
        guesses: prev.guesses.map((guess, i) =>
          i === prev.currentGuess ? guess.slice(0, -1) : guess
        ),
      }));
    } else if (e.key === "Enter") {
      const currentGuess = storedGuess.guesses[storedGuess.currentGuess];

      // se tiver menos que 5 ele não executa o bahcmaod pro backend
      if (currentGuess.length !== 5){
        return;
      } 

      setStoredGuess({ ...storedGuess, currentGuess: storedGuess.currentGuess + 1})

      /**
       * Then é para quando der ok, ou seja funcionar
       * o Catch é para quando der erro
       */
      submitGuess(currentGuess, gameId).then((response) => {
        console.log("Guess submitted successfully:", response);
        setStoredGuess((previousGuesses) => ({
          ...previousGuesses,
          won: response.won,
          gameFinished: response.gameFinished,
          letters: [...previousGuesses.letters, response.letters],
        }));
      }).catch((error) => console.error("erro ao enviar um guess:", error)); 
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storedGuess, gameId]);

  return { storedGuess };
};
