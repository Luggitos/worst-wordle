package pedro.wordle.service.repository.dto;

import java.util.List;

public record GuessResponse(
    Integer attemptNumber,
    List<LetterResults> letters,
    Boolean gameFinished,
    Boolean won
){}