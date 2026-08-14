package pedro.wordle.service;

import org.springframework.stereotype.Service;

import pedro.wordle.service.repository.entity.GameEntity;
import pedro.wordle.service.repository.jpa.GameRepository;

import static pedro.wordle.utils.WordGenerator.getRandomWord;
import static pedro.wordle.utils.Words.WORDS;

import java.util.ArrayList;
import java.util.List;


@Service
public class WordleService {

    private final String dailyWord = getRandomWord();
    private final GameRepository gameRepository;

    public WordleService(GameRepository gameRepository){
        this.gameRepository = gameRepository;
    };

    public GameEntity startGame(){

        GameEntity game = new GameEntity();

        game.setAttempts(0);
        game.setDailyword(dailyWord);
        game.setFinished(false);

        return gameRepository.save(game);
    }

    //TODO implement this method
    // public GuessResponse guess(String id, GuessRequest guess);

    private List<Boolean> isLettersInWord(String word){
        
        isValidWord(word);
        char[] typedCharArray = word.toCharArray();
        List<Boolean> positions = new ArrayList<>(); 

        for(int i=0; i < dailyWord.length(); ++i){
            if(dailyWord.contains(String.valueOf(typedCharArray[i]))){
                positions.add(true);
            } else{
                positions.add(false);
            }
        }
        
        return positions;
    }

    private List<Boolean> isLettersInRightPosition(String word){

        isSameWord(word);
        char[] typedCharArray = word.toCharArray();
        char[] dailyCharArray = dailyWord.toCharArray();
        List<Boolean> positions = new ArrayList<>(); 

        for(int i=0; i < dailyWord.length(); ++i){
            if(dailyCharArray[i] == (typedCharArray[i])){
                positions.add(true);
            } else{
                positions.add(false);
            }
        }
        
        return positions;
    }
    
   private Boolean isSameWord(String word){
       // Check if the word typed is the same as the daily word
       isValidWord(word);
       return word.equals(dailyWord);
    }

    private Boolean isValidWord(String word){
        // Check if its a real word
        if(WORDS.contains(word)){
            return true;
        }
        System.out.println("INVALID WORLD");
        return false;
    }
}