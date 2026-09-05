import { useEffect, useRef, useState } from "react";
import { makeGuess } from "~/api/makeGuess";
import {
  addLetter,
  createInitialWordleState,
  removeLetter,
  type WordleState,
} from "./wordleState";

export function useWordleStore(gameId: string | null) {
  const [storedGuess, setStoredGuess] = useState<WordleState>(
    createInitialWordleState,
  );
  const isSubmitting = useRef(false);

  const submitCurrentGuess = async () => {
    const currentGuess = storedGuess.guesses[storedGuess.currentGuess];

    if (
      currentGuess.length !== 5 ||
      !gameId ||
      storedGuess.gameFinished ||
      isSubmitting.current
    ) {
      return;
    }

    isSubmitting.current = true;

    try {
      const response = await makeGuess(gameId, currentGuess);

      setStoredGuess((previousState) => ({
        ...previousState,
        currentGuess: previousState.currentGuess + 1,
        won: response.won,
        gameFinished: response.gameFinished,
        letters: [...previousState.letters, response.letters],
      }));
    } catch (error) {
      console.error("Erro ao enviar uma tentativa:", error);
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (storedGuess.gameFinished) {
      return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      setStoredGuess((previousState) =>
        addLetter(previousState, event.key.toUpperCase()),
      );
      return;
    }

    if (event.key === "Backspace") {
      setStoredGuess(removeLetter);
      return;
    }

    if (event.key === "Enter") {
      void submitCurrentGuess();
    }
  };

  useEffect(() => {
    if (!gameId) {
      return;
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [storedGuess, gameId]);

  return { storedGuess };
}
