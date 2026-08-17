import * as React from "react";

import type { Route } from "./+types/home";

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;
const STORAGE_KEY = "worst-wordle-game";

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

type TileState = "empty" | "filled" | "correct" | "present" | "absent";

type SubmittedGuess = {
  word: string;
  states: TileState[];
};

type GuessResponse = {
  attemptNumber: number;
  correctPosition: boolean[];
  existsInWord: string[];
  gameFinished: boolean;
  won: boolean | null;
};

type SavedGame = {
  gameId: string;
  guesses: SubmittedGuess[];
  gameOver: boolean;
  won: boolean | null;
  keyboard: Record<string, TileState>;
};

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Worst Wordle" },
    {
      name: "description",
      content: "Um jogo de palavras simples inspirado no term.ooo.",
    },
  ];
}

export default function Home() {
  const [gameId, setGameId] = React.useState<string | null>(null);
  const [guesses, setGuesses] = React.useState<SubmittedGuess[]>([]);
  const [currentGuess, setCurrentGuess] = React.useState("");
  const [keyboard, setKeyboard] = React.useState<Record<string, TileState>>({});
  const [gameOver, setGameOver] = React.useState(false);
  const [won, setWon] = React.useState<boolean | null>(null);
  const [message, setMessage] = React.useState("Preparando jogo...");
  const [messageTone, setMessageTone] = React.useState<"info" | "success" | "error">(
    "info",
  );
  const [loading, setLoading] = React.useState(false);

  async function startGame() {
    setLoading(true);
    setMessageTone("info");
    setMessage("Criando uma partida nova...");

    try {
      const response = await fetch("/wordle", { method: "POST" });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const data = (await response.json()) as { id: string };

      setGameId(data.id);
      setGuesses([]);
      setCurrentGuess("");
      setKeyboard({});
      setGameOver(false);
      setWon(null);
      setMessage("Jogo pronto. Digite uma palavra de 5 letras.");
      setMessageTone("info");
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      setMessageTone("error");
      setMessage(
        `Nao consegui iniciar o jogo. Confira se o backend esta rodando na porta 8086. ${formatError(error)}`,
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitGuess() {
    if (loading || gameOver) {
      return;
    }

    if (currentGuess.length !== WORD_LENGTH) {
      setMessageTone("error");
      setMessage("A palavra precisa ter 5 letras.");
      return;
    }

    const activeGameId = gameId;

    if (!activeGameId) {
      await startGame();
      setMessageTone("error");
      setMessage("Tente enviar a palavra novamente.");
      return;
    }

    setLoading(true);
    setMessageTone("info");
    setMessage("Conferindo palavra...");

    try {
      const response = await fetch(`/wordle/guess/${activeGameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: currentGuess }),
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      const result = (await response.json()) as GuessResponse;
      const states = getTileStates(currentGuess, result);
      const nextGuesses = [...guesses, { word: currentGuess, states }];
      const nextKeyboard = updateKeyboard(keyboard, currentGuess, states);

      setGuesses(nextGuesses);
      setKeyboard(nextKeyboard);
      setCurrentGuess("");
      setGameOver(result.gameFinished);
      setWon(result.won);

      if (result.gameFinished && result.won) {
        setMessageTone("success");
        setMessage("Boa. Palavra certa!");
      } else if (result.gameFinished) {
        setMessageTone("error");
        setMessage("Fim de jogo. Tente uma nova partida.");
      } else {
        setMessageTone("info");
        setMessage(`${MAX_ATTEMPTS - result.attemptNumber} tentativas restantes.`);
      }

      saveGame({
        gameId: activeGameId,
        guesses: nextGuesses,
        gameOver: result.gameFinished,
        won: result.won,
        keyboard: nextKeyboard,
      });
    } catch (error) {
      setMessageTone("error");
      setMessage(formatGuessError(error));
    } finally {
      setLoading(false);
    }
  }

  function handleKey(key: string) {
    if (loading || gameOver) {
      return;
    }

    if (key === "ENTER") {
      void submitGuess();
      return;
    }

    if (key === "BACKSPACE") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      return;
    }

    const normalizedKey = normalizeLetter(key);

    if (!normalizedKey || currentGuess.length >= WORD_LENGTH) {
      return;
    }

    setCurrentGuess((guess) => `${guess}${normalizedKey}`);
  }

  React.useEffect(() => {
    const savedGame = loadSavedGame();

    if (savedGame) {
      setGameId(savedGame.gameId);
      setGuesses(savedGame.guesses);
      setKeyboard(savedGame.keyboard);
      setGameOver(savedGame.gameOver);
      setWon(savedGame.won);
      setMessageTone(savedGame.gameOver && savedGame.won ? "success" : "info");
      setMessage(
        savedGame.gameOver
          ? savedGame.won
            ? "Partida restaurada: voce venceu."
            : "Partida restaurada: fim de jogo."
          : "Partida restaurada. Continue tentando.",
      );
      return;
    }

    void startGame();
  }, []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handleKey("ENTER");
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        handleKey("BACKSPACE");
        return;
      }

      if (event.key.length === 1) {
        const normalizedKey = normalizeLetter(event.key);

        if (normalizedKey) {
          event.preventDefault();
          handleKey(normalizedKey);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentGuess, gameOver, loading, keyboard, guesses, gameId]);

  const boardRows = buildBoardRows(guesses, currentGuess, gameOver);

  return (
    <main className="game-shell">
      <section className="hero-panel" aria-labelledby="game-title">
        <div className="hero-copy">
          <p className="eyebrow">Worst Wordle</p>
          <h1 id="game-title">Descubra a palavra do dia.</h1>
          <p>
            Seis tentativas, cinco letras e um visual calmo inspirado no
            term.ooo. Verde marca a letra certa no lugar certo; amarelo indica
            que a letra existe na palavra.
          </p>
        </div>

        <div className="stats-card" aria-label="Resumo da partida">
          <span>Tentativas</span>
          <strong>
            {guesses.length}/{MAX_ATTEMPTS}
          </strong>
          <small>{gameOver ? (won ? "Vitoria" : "Encerrado") : "Em andamento"}</small>
        </div>
      </section>

      <section className="game-card" aria-label="Area do jogo">
        <div className="game-toolbar">
          <div>
            <span className="label">Partida</span>
            <strong>{gameId ? gameId.slice(0, 8) : "aguardando"}</strong>
          </div>
          <button className="new-game-button" type="button" onClick={() => void startGame()}>
            Novo jogo
          </button>
        </div>

        <p className={`game-message ${messageTone}`} aria-live="polite">
          {loading ? "Carregando..." : message}
        </p>

        <div className="board" aria-label="Tabuleiro de tentativas">
          {boardRows.map((row, rowIndex) => (
            <div className="board-row" key={`row-${rowIndex}`}>
              {row.map((tile, tileIndex) => (
                <span
                  className={`tile ${tile.state}`}
                  key={`tile-${rowIndex}-${tileIndex}`}
                  aria-label={tile.letter || "vazio"}
                >
                  {tile.letter}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="keyboard" aria-label="Teclado virtual">
          {KEY_ROWS.map((row, rowIndex) => (
            <div className="keyboard-row" key={row}>
              {rowIndex === 2 && (
                <button
                  className="key wide"
                  type="button"
                  onClick={() => handleKey("ENTER")}
                  disabled={loading || gameOver}
                >
                  Enviar
                </button>
              )}
              {row.split("").map((letter) => (
                <button
                  className={`key ${keyboard[letter] ?? ""}`}
                  type="button"
                  onClick={() => handleKey(letter)}
                  disabled={loading || gameOver}
                  key={letter}
                >
                  {letter}
                </button>
              ))}
              {rowIndex === 2 && (
                <button
                  className="key wide"
                  type="button"
                  onClick={() => handleKey("BACKSPACE")}
                  disabled={loading || gameOver}
                  aria-label="Apagar letra"
                >
                  Apagar
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function buildBoardRows(
  guesses: SubmittedGuess[],
  currentGuess: string,
  gameOver: boolean,
) {
  return Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
    const submittedGuess = guesses[rowIndex];

    if (submittedGuess) {
      return Array.from({ length: WORD_LENGTH }, (_, tileIndex) => ({
        letter: submittedGuess.word[tileIndex] ?? "",
        state: submittedGuess.states[tileIndex] ?? "absent",
      }));
    }

    if (!gameOver && rowIndex === guesses.length) {
      return Array.from({ length: WORD_LENGTH }, (_, tileIndex) => {
        const letter = currentGuess[tileIndex] ?? "";

        return {
          letter,
          state: letter ? "filled" : "empty",
        };
      });
    }

    return Array.from({ length: WORD_LENGTH }, () => ({
      letter: "",
      state: "empty",
    }));
  });
}

function getTileStates(guess: string, result: GuessResponse): TileState[] {
  const existingLetters = new Set(result.existsInWord.map((letter) => letter.toUpperCase()));

  return guess.split("").map((letter, index) => {
    if (result.correctPosition[index]) {
      return "correct";
    }

    if (existingLetters.has(letter)) {
      return "present";
    }

    return "absent";
  });
}

function updateKeyboard(
  currentKeyboard: Record<string, TileState>,
  guess: string,
  states: TileState[],
) {
  const nextKeyboard = { ...currentKeyboard };

  guess.split("").forEach((letter, index) => {
    const nextState = states[index];
    const currentState = nextKeyboard[letter];

    if (!currentState || stateRank(nextState) > stateRank(currentState)) {
      nextKeyboard[letter] = nextState;
    }
  });

  return nextKeyboard;
}

function stateRank(state: TileState) {
  if (state === "correct") {
    return 3;
  }

  if (state === "present") {
    return 2;
  }

  if (state === "absent") {
    return 1;
  }

  return 0;
}

function normalizeLetter(key: string) {
  const normalized = key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

  return /^[A-Z]$/.test(normalized) ? normalized : "";
}

function saveGame(game: SavedGame) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
}

function loadSavedGame(): SavedGame | null {
  const rawGame = localStorage.getItem(STORAGE_KEY);

  if (!rawGame) {
    return null;
  }

  try {
    return JSON.parse(rawGame) as SavedGame;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

async function readApiError(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const data = (await response.json()) as { message?: string; error?: string };
    return data.message ?? data.error ?? "Erro inesperado da API.";
  }

  const text = await response.text();
  return text || "Erro inesperado da API.";
}

function formatGuessError(error: unknown) {
  const message = formatError(error);

  if (message.toLowerCase().includes("invalid word")) {
    return "Essa palavra nao esta na lista do jogo.";
  }

  if (message.toLowerCase().includes("already finished")) {
    return "Essa partida ja foi encerrada. Comece um novo jogo.";
  }

  return `Nao consegui enviar a palavra. ${message}`;
}

function formatError(error: unknown) {
  return error instanceof Error ? error.message : "Tente novamente.";
}
