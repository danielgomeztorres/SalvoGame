package com.dani.game.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.xml.soap.Name;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private Date dateGamePlayer;
    private Double score;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Game_id")
    private Game game;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Player_id")
    private Player player;








    //CONSTRUCTOR
    public Score() {
    }
    public Score(Double score, Game game, Player player) {
    this.score = score;
    this.game = game;
    this.player = player;
    this.dateGamePlayer = new Date();
    }

    public Date getDateGamePlayer() {
        return dateGamePlayer;
    }

    public void setDateGamePlayer(Date dateGamePlayer) {
        this.dateGamePlayer = dateGamePlayer;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Score{" +
                "id=" + id +
                ", dateGamePlayer=" + dateGamePlayer +
                ", game=" + game +
                ", player=" + player +
                ", score=" + score +
                '}';
    }
}
