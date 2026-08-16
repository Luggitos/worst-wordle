package pedro.wordle.exceptions;

public class GameAlreadyExistsException extends RuntimeException{
    
    public GameAlreadyExistsException(String message){
        super(message);
    }
}