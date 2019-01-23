package com.dani.game.salvo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class GamePlayer {
        @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private Date dateGamePlayer;
    //MAPPED
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Player_id")
    private Player player;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Game_id")
    private Game game;

    @OneToMany(mappedBy= "gamePlayer", fetch = FetchType.EAGER)
    private Set<Ship> shipset = new HashSet<>();
    @OneToMany(mappedBy= "gamePlayer", fetch = FetchType.EAGER)
    private Set<Salvo> salvoset = new HashSet<>();

    //CONSTRUCTOR
    public GamePlayer(){

    }
    public GamePlayer(Player player, Game game) {
        this.player = player;
        this.game = game;
        this.dateGamePlayer = new Date();
    }

    //METHODS

    public Game getGame() {
        return this.game;

    }
    public void setGame(Game game) {
        this.game = game;
    }

    public Player getPlayer() {
        return this.player;

    }
    public void setPlayer(Player player) {
        this.player = player;
    }

    public Date getDateGamePlayer() {
        return dateGamePlayer;
    }

    public void setDateGamePlayer(Date dateGamePlayer) {
        this.dateGamePlayer = dateGamePlayer;
    }

    public Set<Ship> getShipset() {
        return shipset;
    }
    public void setShipset(Set<Ship> shipset) {
        this.shipset = shipset;
    }
     public Set<Salvo> getSalvo() {
        return salvoset;
    }
     public void setSalvoset(Set<Salvo> salvoset){
        this.salvoset = salvoset;
}
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Score getScore(){
      return this.getPlayer().getScore(this.game);

    }
    //OTROS METODOS
    public void addShip(Ship ship) {
        ship.setGamePlayer(this);
        shipset.add(ship);
}
    public void addSalvo(Salvo salvo) {
        salvo.setGamePlayer(this);
        salvoset.add(salvo);
    }

    @Override
    public String toString() {
        return "GamePlayer{" +
                "id=" + id +
                ", dateGamePlayer=" + dateGamePlayer +
                ", player=" + player +
                ", game=" + game +
                ", shipset=" + shipset +
                ", salvoset=" + salvoset +
                '}';
    }
}
