package pedro.wordle.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pedro.wordle.service.WordleService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import pedro.wordle.service.repository.dto.GameStatusResponse;
import pedro.wordle.service.repository.dto.GameStartResponse;
import pedro.wordle.service.repository.dto.GuessRequest;
import pedro.wordle.service.repository.dto.GuessResponse;


@RestController
@RequestMapping("/wordle")
public class WordleController {
    
    @Autowired
    private WordleService wordleService;

    public WordleController(WordleService wordleService) {
        this.wordleService = wordleService;
    }

    @PostMapping
    public GameStartResponse dailyWorld(){

        return wordleService.startGame();
    }
    
    @GetMapping("/{gameId}")
    public GameStatusResponse gameStatus(@PathVariable String gameId){

        return wordleService.getGameInfo(gameId);
    }

    @PostMapping("wordle/guess/{gameId}")
    public GuessResponse makeGuess(@PathVariable String gameId, @RequestBody GuessRequest request){

        return wordleService.makeAGuess(gameId, request.guess().toUpperCase());
    }
}