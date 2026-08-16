package pedro.wordle.exceptions;

/**
 * GameIsAlreadyFinishedException
 */
public class GameIsAlreadyFinishedException extends RuntimeException {

    public GameIsAlreadyFinishedException(String message){
        super(message);
    }
}
