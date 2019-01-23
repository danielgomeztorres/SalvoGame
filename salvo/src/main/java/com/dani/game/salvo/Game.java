package com.dani.game.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

import java.util.Date;


import java.util.Set;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private Date dateGame;
    //MAPPED
    @OneToMany(mappedBy="game", fetch = FetchType.EAGER)
    private Set<GamePlayer> gamePlayerset;
    @OneToMany(mappedBy="game", fetch = FetchType.EAGER)
    private Set<Score> scoreSet;

    //CONSTRUCTOR

    public Game() {
        this.dateGame = new Date();
    }
    //GET SET

    public Date getdateGame() {
        return dateGame;
    }

    public void setdateName(Date dateGame) {
        this.dateGame = dateGame;
    }

    public Set<GamePlayer> getGamePlayerset() {
        return gamePlayerset;
    }
    @JsonIgnore
    public Object getid() {
        return id;
    }

    public void setid(Long id) {
        this.id = id;
    }
////


    @Override
    public String toString() {
        return "Game{" +
                "id=" + id +
                ", dateGame=" + dateGame +
                ", gamePlayerset=" + gamePlayerset +
                '}';
    }
}
