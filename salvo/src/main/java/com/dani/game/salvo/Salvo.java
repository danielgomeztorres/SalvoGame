package com.dani.game.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import javax.xml.soap.Name;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Salvo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "GamePlayer_id")
    private GamePlayer gamePlayer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Player_id")
    private Player player;

    @ElementCollection
    @Column(name = "location")
    private List<String> salvoLocations  = new ArrayList<>();
    private String salvoTurn;

    //CONSTRUCTOR
    public Salvo() {
    }
    public Salvo(String turn, List<String> salvoLocations) {

        this.salvoTurn = turn;
        this.salvoLocations = salvoLocations;
    }
    public void setSalvoLocations(List<String> salvoLocations) {
        this.salvoLocations = salvoLocations;
    }
    public List<String> getSalvoLocations() {
           return salvoLocations;
    }

    public String getSalvoTurn() {
          return this.salvoTurn;
    }
    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;

    }
    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Salvo{" +
                "id=" + id +
                ", gamePlayer=" + gamePlayer +
                ", salvoLocations=" + salvoLocations +
                ", salvoTurn='" + salvoTurn + '\'' +
                '}';
    }
}
