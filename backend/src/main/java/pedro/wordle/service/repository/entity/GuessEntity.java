package pedro.wordle.service.repository.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "guesses")
public class GuessEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Integer attemptNumber;

    private String guess;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private GameEntity game;

    @JsonFormat(pattern = "MM-dd-yyyy")
    private LocalDateTime createdAt;
}