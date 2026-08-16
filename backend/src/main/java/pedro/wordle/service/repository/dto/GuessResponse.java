package pedro.wordle.service.repository.dto;

import java.util.List;

public record GuessResponse(
    Integer attemptNumber,
    List<Boolean> correctPosition,
    List<Character> existsInWord,
    Boolean gameFinished,
    Boolean won
){}