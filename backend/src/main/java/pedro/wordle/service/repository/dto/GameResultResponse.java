package pedro.wordle.service.repository.dto;

import java.util.List;

public record GameResultResponse(
    String gameId,
    Integer attempts,
    List<String> guesses,
    Boolean won,
    String correctWord
){}