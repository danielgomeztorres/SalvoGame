package com.dani.game.salvo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;


import javax.persistence.*;
import java.util.Set;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String userName;
    private String email;
    private String password;
    //MAPPED
    @OneToMany(mappedBy="player", fetch = FetchType.EAGER)
    private Set<GamePlayer> playerset;
    @OneToMany(mappedBy="player", fetch = FetchType.EAGER)
    private Set<Score> scoreSet;

//

    //CONSTRUCTOR
    public Player() {
    }
    public Player(String email, String password) {

        this.email = email;
        this.password = password;
    }

    //GET SET

    public String getuserName() {
        return userName;

    }
    public void setuserName(String firstName) {
        this.userName = firstName;
    }

    public String getEmail() {
        return email;

    }
    public void setEmail(String email) {
        this.email = email;
    }

    public Set<GamePlayer> getPlayerset() {
        return playerset;

    }

    public Object getid() {
        return id;
    }
    public void setid(long id) {
        this.id = id;
    }

    public Set<Score> getScoreSet() {
        return scoreSet;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    //OTROS METODOS


    public Score getScore(Game game) {
        return scoreSet.stream()
                       .filter(score -> score.getGame().equals(game)).findFirst().orElse(null);
    }

    public void setScoreSet(Set<Score> scoreSet) {
        this.scoreSet = scoreSet;
    }

    @Override
    public String toString() {
        return "Player{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", playerset=" + playerset +
                ", scoreSet=" + scoreSet +
                '}';
    }
}


