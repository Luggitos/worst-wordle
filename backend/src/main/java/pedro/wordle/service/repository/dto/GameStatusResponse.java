package pedro.wordle.service.repository.dto;

import java.util.List;

public record GameStatusResponse(
    String gameId,
    Integer attempts,
    List<GuessHistory> guesses,
    Boolean gameFinished,
    Boolean won
){}