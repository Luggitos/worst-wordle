package pedro.wordle.service.repository.dto;

public record GuessHistory(
    Integer attempt,
    String guess
){}