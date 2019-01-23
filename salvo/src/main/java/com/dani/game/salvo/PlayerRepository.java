package com.dani.game.salvo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface PlayerRepository extends JpaRepository<Player, Long> {
    Player findByEmail(@Param("email") String email);
}

  