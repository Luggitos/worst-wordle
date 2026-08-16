package pedro.wordle.exceptions;

/**
 * GameExpiredException
 */
public class GameExpiredException extends RuntimeException {
    
    public GameExpiredException(String message){
        super(message);
    }
}
