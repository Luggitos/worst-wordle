package pedro.wordle.service.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pedro.wordle.service.repository.entity.GameEntity;

@Repository
public interface GameRepository extends JpaRepository<GameEntity, String>{
    
}