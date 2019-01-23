
package com.dani.game.salvo;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
@Entity
public class Ship {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "GamePlayer_id")
    private GamePlayer gamePlayer;

    @ElementCollection
    @Column(name = "location")
    private List<String> shipLocations  = new ArrayList<>();
    private String shipName;

    //CONSTRUCTOR
    public Ship() {
    }
    public Ship(String name, List<String> shipLocations) {

        this.shipName = name;
        this.shipLocations = shipLocations;
    }
    //GET SET
    public void setShipLocations(List<String> shipLocations) {
        this.shipLocations = shipLocations;
    }

    public void setShipName(String shipName) {
        this.shipName = shipName;
    }

    public List<String> getShipLocations() {
        return shipLocations;
    }

    public String getShipName() {
        return this.shipName;
    }

    public GamePlayer getGamePlayer() {
        return this.gamePlayer;
    }
    public void setGamePlayer(GamePlayer gamePlayer) {
        this.gamePlayer = gamePlayer;
    }

    public Long getid() {
        return id;
    }
    @Override
    public String toString() {
        return "Ship{" +
                "id=" + id +
                ", shipLocations=" + shipLocations +
                ", gamePlayer=" + gamePlayer +
                ", shipName='" + shipName + '\'' +
                '}';
    }
}


