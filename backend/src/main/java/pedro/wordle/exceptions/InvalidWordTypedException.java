package pedro.wordle.exceptions;

/**
 * InvalidWordTypedException
 */
public class InvalidWordTypedException extends RuntimeException {

    public InvalidWordTypedException(String message){
        super(message);
    }
}
