package pedro.wordle.service.repository.dto;

import java.util.List;

public record GuessResponse(
    Integer attemptNumber,
    List<Boolean> correctPosition,
    List<Boolean> existsInWord,
    Boolean gameFinished,
    Boolean won
){}