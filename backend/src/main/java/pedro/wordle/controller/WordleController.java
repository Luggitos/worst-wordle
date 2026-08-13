package pedro.wordle.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pedro.wordle.service.WordleService;

import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import pedro.wordle.service.repository.entity.GameEntity;
import pedro.wordle.service.repository.jpa.GameRepository;


@RestController
@RequestMapping("/wordle")
public class WordleController {
    
    private final GameRepository gameRepository;
    private final WordleService wordleService;

    public WordleController(WordleService wordleService, GameRepository gameRepository) {
        this.wordleService = wordleService;
        this.gameRepository = gameRepository;
    }

    @PostMapping
    public GameEntity dailyWorld(){
        return wordleService.startGame();
    }

    @GetMapping("/{id}")
    public Optional<GameEntity> gameStatus(@PathVariable String id){
        return gameRepository.findById(id);
    }
}