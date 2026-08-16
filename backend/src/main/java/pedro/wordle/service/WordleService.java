package pedro.wordle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pedro.wordle.exceptions.GameExpiredException;
import pedro.wordle.exceptions.GameIsAlreadyFinishedException;
import pedro.wordle.exceptions.InvalidWordTypedException;
import pedro.wordle.service.repository.dto.GameStatusResponse;
import pedro.wordle.service.repository.dto.GuessHistory;
import pedro.wordle.service.repository.dto.GameStartResponse;
import pedro.wordle.service.repository.dto.GuessResponse;
import pedro.wordle.service.repository.entity.GameEntity;
import pedro.wordle.service.repository.entity.GuessEntity;
import pedro.wordle.service.repository.jpa.GameRepository;

import pedro.wordle.service.repository.jpa.GuessRepository;
import static pedro.wordle.utils.WordGenerator.getRandomWord;
import static pedro.wordle.utils.Words.MAX_ATTEMPTS;
import static pedro.wordle.utils.Words.WORDS;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class WordleService {

    private final String dailyWord = getRandomWord();

    @Autowired
    private GameRepository gameRepository;
    
    @Autowired
    private GuessRepository guessRepository;

    public WordleService(GameRepository gameRepository, GuessRepository guessRepository){
        this.gameRepository = gameRepository;
        this.guessRepository = guessRepository;
    };

    public GameStartResponse startGame(){

        GameEntity game = new GameEntity();

        game.setAttempts(0);
        game.setFinished(false);
        game.setGameDate(LocalDate.now());
        game.setDailyword(dailyWord);

        GameEntity savedGame = gameRepository.save(game);
        
        return new GameStartResponse(
            savedGame.getId()
        );
    }

    public GameStatusResponse getGameInfo(String gameId){
        GameEntity game = gameRepository.findById(gameId)
            .orElseThrow();

        if(!game.getGameDate().equals(LocalDate.now())){
            throw new GameExpiredException("Game expired");
        }

        List<GuessHistory> guesses = game.getGuesses()
            .stream()
            .map(guess -> new GuessHistory(
                guess.getAttemptNumber(),
                guess.getGuess()
            ))
            .toList();

        return new GameStatusResponse(
            game.getId(),
            game.getAttempts(),
            guesses,
            game.getWon()
        );
    }

    public GuessResponse makeAGuess(String gameId, String guess){

        GameEntity game = gameRepository.findById(gameId)
            .orElseThrow();

        if(game.getFinished()){
            throw new GameIsAlreadyFinishedException("Game already finished");
        }

        if(!isAValidWord(guess)){
            throw new InvalidWordTypedException("Invalid word");
        }

        return processGuess(game, guess);
    }

    private GuessResponse processGuess(GameEntity game, String guess){

        int currentAttempt = game.getAttempts() + 1;

        GuessEntity guessEntity = new GuessEntity();
        guessEntity.setGame(game);
        guessEntity.setGuess(guess);
        guessEntity.setAttemptNumber(currentAttempt);
        guessEntity.setCreatedAt(LocalDateTime.now());

        guessRepository.save(guessEntity);

        game.setAttempts(currentAttempt);
 
        if(isTheWord(guess)){
            game.setWon(true);
            game.setFinished(true);
        }else if(currentAttempt >= MAX_ATTEMPTS){
            game.setWon(false);
            game.setFinished(true);
        }

        gameRepository.save(game);

        return new GuessResponse(
            currentAttempt,
            checkIfPositionsIsEqual(guess),
            checkIfLetterExistInGuess(guess),
            game.getFinished(),
            game.getWon()
        );
    }

    private Boolean isAValidWord(String guess){
        return WORDS.contains(guess);
    }

    private Boolean isTheWord(String guess){
        return dailyWord.equals(guess);
    }

    /**
     * Verifies if the letters in the guess are in,
     *  the same position as the daily word
     * @param guess
     * @return list of boolean indicating if the letters are in the same position as the daily word
     */
    private List<Boolean> checkIfPositionsIsEqual(String guess){
        char[] guessLetters = guess.toCharArray();
        char[] dailyWordChars = dailyWord.toCharArray();
        
        List<Boolean> existingLetters = new ArrayList<>();
    
        for(int i=0; i < dailyWord.length(); ++i){
            existingLetters.add(dailyWordChars[i] == guessLetters[i]);
        }

        return existingLetters;
    }

    /**
     * Checks which letters from the guess exist in the daily word,
     * but are not in the same position.
     *
     * @param guess guessed word from the player
     * @return list of letters that exist in the daily word in different positions
     */
    private List<Character> checkIfLetterExistInGuess(String guess){
        char[] guessLetters = guess.toCharArray();
        
        List<Character> existingLetters = new ArrayList<>();
    
        for(char letter : guessLetters){
            if(dailyWord.indexOf(letter) != -1){
                existingLetters.add(letter);
            }
        }          

        return existingLetters;
    }
}