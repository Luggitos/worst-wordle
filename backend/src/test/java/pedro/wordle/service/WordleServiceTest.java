package pedro.wordle.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import pedro.wordle.exceptions.GameExpiredException;
import pedro.wordle.exceptions.GameIsAlreadyFinishedException;
import pedro.wordle.exceptions.InvalidWordTypedException;
import pedro.wordle.service.repository.dto.GameStartResponse;
import pedro.wordle.service.repository.dto.GameStatusResponse;
import pedro.wordle.service.repository.dto.GuessResponse;
import pedro.wordle.service.repository.entity.GameEntity;
import pedro.wordle.service.repository.entity.GuessEntity;
import pedro.wordle.service.repository.jpa.GameRepository;
import pedro.wordle.service.repository.jpa.GuessRepository;

@ExtendWith(MockitoExtension.class)
public class WordleServiceTest {
    
    private static final String TEST = "TEST";

    private static final String TEST_ID = "testId";

    @Autowired
    @InjectMocks
    private WordleService wordleService;

    @Mock
    private GameRepository gameRepository;

    @Mock
    private GuessRepository guessRepository;

    @Test
    void shouldStartGameAndReturnGameId(){
        GameEntity gameSaved = new GameEntity();
        gameSaved.setId(TEST);

        when(gameRepository.save(any(GameEntity.class)))
            .thenReturn(gameSaved);

        GameStartResponse response = wordleService.startGame();
        assertEquals(TEST, response.id());
    }

    @Test
    void shouldReturnGameInfo(){
        GameEntity game = new GameEntity();
        game.setId(TEST_ID);
        game.setDailyword("buzzword");
        game.setAttempts(0);
        game.setFinished(false);
        game.setWon(false);
        game.setGuesses(List.of());
        game.setGameDate(LocalDate.now());

        when(gameRepository.findById(TEST_ID))
            .thenReturn(Optional.of(game));

        GameStatusResponse response = wordleService.getGameInfo(TEST_ID);
    
        assertEquals(TEST_ID, response.gameId());
    }

    @Test
    void shouldThrowGameExpiredException(){
        GameEntity game = new GameEntity();
        game.setId(TEST_ID);
        game.setGameDate(LocalDate.now().minusDays(1));

        when(gameRepository.findById(TEST_ID))
            .thenReturn(Optional.of(game));

        assertThrows(
            GameExpiredException.class,
            () -> wordleService.getGameInfo(TEST_ID)
        );
    }

    @Test
    void shouldThrowGameNotFoundException(){
        when(gameRepository.findById(TEST_ID))
            .thenReturn(Optional.empty());

        assertThrows(
            RuntimeException.class,
            () -> wordleService.getGameInfo(TEST_ID)
        );
    }

    @Test
    void shouldMakeAGuessAndReturnGuessResponse(){
        GameEntity game = new GameEntity(
            TEST_ID,
            "WORDL",
            2,
            false,
            true,
            null,
            LocalDate.now()
        );

        when(gameRepository.findById(TEST_ID))
            .thenReturn(Optional.of(game));

        GuessResponse response = wordleService.makeAGuess(TEST_ID, "LIMPO");

        assertNotNull(response);
        assertEquals(3, response.attemptNumber());

        verify(guessRepository).save(any(GuessEntity.class));
        verify(gameRepository).save(any(GameEntity.class));
    }

    @Test
    void shouldThrowWhenWordIsInvalid(){
        GameEntity game = new GameEntity();
        game.setId(TEST_ID);
        game.setFinished(false);

        when(gameRepository.findById(TEST_ID))
            .thenReturn(Optional.of(game));

        assertThrows(
            InvalidWordTypedException.class,
            () -> wordleService.makeAGuess(TEST_ID, "XXXXX")
        );
    }

    @Test
    void shouldThrowWhenGameIsFinished(){
        GameEntity game = new GameEntity();
        game.setId(TEST_ID);
        game.setFinished(true);

        when(gameRepository.findById(TEST_ID))
            .thenReturn(Optional.of(game));

        assertThrows(
            GameIsAlreadyFinishedException.class,
            () -> wordleService.makeAGuess(TEST_ID, "HOUSE")
        );
    }
}