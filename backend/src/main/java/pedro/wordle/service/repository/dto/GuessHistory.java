package pedro.wordle.service.repository.dto;

import java.util.List;

public record GuessHistory(
    Integer attempt,
    String guess,
    List<Status> positions
){}