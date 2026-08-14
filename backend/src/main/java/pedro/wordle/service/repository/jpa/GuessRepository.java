package pedro.wordle.service.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pedro.wordle.service.repository.entity.GuessEntity;


@Repository
public interface GuessRepository extends JpaRepository<GuessEntity, String> {
    
}