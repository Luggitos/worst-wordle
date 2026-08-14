package pedro.wordle.service.repository.entity;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@NoArgsConstructor
@Entity
@Table(name = "game")
public class GameEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String dailyword;

    private Integer attempts;

    private Boolean finished;

    @OneToMany(mappedBy = "game")
    private List<GuessEntity> guesses;
}