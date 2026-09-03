package pedro.wordle.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ch.qos.logback.core.recovery.ResilientOutputStreamBase;
import pedro.wordle.exceptions.GameExpiredException;
import pedro.wordle.exceptions.GameIsAlreadyFinishedException;
import pedro.wordle.exceptions.InvalidWordTypedException;
import pedro.wordle.service.repository.dto.GameStatusResponse;
import pedro.wordle.service.repository.dto.GuessHistory;
import pedro.wordle.service.repository.dto.GameStartResponse;
import pedro.wordle.service.repository.dto.GuessResponse;
import pedro.wordle.service.repository.dto.LetterResults;
import pedro.wordle.service.repository.dto.Status;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    /**
     * Starts a new game and returns the game id
     * @return {@link GameStartResponse} the id of new game
     */
    public GameStartResponse startGame(){

        GameEntity game = new GameEntity();

        game.setAttempts(0);
        game.setFinished(false);
        game.setWon(false);
        game.setGameDate(LocalDate.now());
        game.setDailyword(dailyWord);

        GameEntity savedGame = gameRepository.save(game);
        
        return new GameStartResponse(
            savedGame.getId()
        );
    }

    /**
     * Return status if player have staterd the game
     * @param gameId string with the game id
     * @return {@link GameStatusResponse} with the game status
     */
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
            game.getFinished(),
            game.getWon()
        );
    }
    
    /**
     * Method to make a guess
     * @param gameId String containing id of the game
     * @param guess String with the guess of the player
     * @return {@link GuessResponse} Status of the response
     */
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
        List<LetterResults> positions = checkLetterResults(guess);

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
            positions,
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
     * Function to verify the letters that correct in the game
     * @param guess String containing the guess
     * @return {@link List<LetterResults>} List containing the letters 
     * and its correspondencies positions
     */
    private List<LetterResults> checkLetterResults(String guess){
        char[] guessChar = guess.toCharArray();
        char[] dailyChar = dailyWord.toCharArray();

        List<LetterResults> results = new ArrayList<>();

        Map<Character, Integer> letters = new HashMap<>();

        for(char c : dailyChar){
            letters.merge(c, 1, Integer::sum);
        }

        for(int i=0; i < guessChar.length; i++){
            if(guessChar[i] == dailyChar[i]){
                results.add(new LetterResults(
                        guessChar[i],
                        Status.CORRECT
                ));

                letters.put(
                        guessChar[i],
                        letters.get(guessChar[i]) -1
                );
            } else {
                results.add(null);
            }
        }

        for(int i=0; i < guessChar.length; ++i){

            if(results.get(i) != null){
                continue;
            }

            char letter = guessChar[i];

            int available = letters.getOrDefault(letter, 0);

            if(available > 0){
                results.set(i, new LetterResults(
                    letter,
                    Status.PRESENT
                ));

                letters.put(letter, available - 1);
            } else {
                results.set(i, new LetterResults(
                    letter,
                    Status.ABSENT
                ));
            }
        }
        return results;
    }
}