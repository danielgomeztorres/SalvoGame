package com.dani.game.salvo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api")
public class SalvoController {
    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private ShipRepository shipRepository;
    @Autowired
    private GamePlayerRepository gamePlayerRepository;
    @Autowired
    private SalvoRepository salvoRepository;
    @Autowired
    private ScoreRepository scoreRepository;



    @RequestMapping("/games")

    private Map<String, Object>playersDTO(Authentication authentication) {
        Map<String, Object> dto = new LinkedHashMap<>();

     if (!isGuest(authentication)){
    dto.put("player", playerDTO(playerRepository.findByEmail(authentication.getName())));
     } else { dto.put("error", "Not found");}
    dto.put("game", getAll());
     return dto;
    }

    private boolean isGuest (Authentication authentication){
        return authentication == null || authentication instanceof AnonymousAuthenticationToken;
    }
    //CREATE NEW GAME
    @RequestMapping(path = "/games", method = RequestMethod.POST)
        public ResponseEntity <Object> createGame(Authentication authentication) {
        Player playerLogin = playerRepository.findByEmail(authentication.getName());
        if(!isGuest(authentication)){
            Game newGame = gameRepository.save(new Game());
            GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(playerLogin, newGame));
            return new ResponseEntity<>(makeMap("GpId", newGamePlayer.getId()), HttpStatus.CREATED);
        }
       return new ResponseEntity<> (makeMap("Error", "Sign up first"), HttpStatus.UNAUTHORIZED);
    }
    //JOIN A GAME
   @RequestMapping(path = "/games/{id}/players", method = RequestMethod.POST)
    public ResponseEntity <Map <String, Object>> createGamePlayer(@PathVariable Long id, Authentication authentication) {
       Player playerLogin = playerRepository.findByEmail(authentication.getName());
       Game currentGame = gameRepository.getOne(id);
       if (isGuest(authentication)) {
           return new ResponseEntity<>(makeMap("Error", "Login succsefull"), HttpStatus.ACCEPTED);
       }else if(currentGame == null){
           return new ResponseEntity<>(makeMap("Error", "This game doesn´t exist"), HttpStatus.FORBIDDEN);
       }else if(currentGame.getGamePlayerset().size() > 1){
           return new ResponseEntity<>(makeMap("Error", "This game is full"), HttpStatus.FORBIDDEN);
       }else if(currentGame.getGamePlayerset().stream().anyMatch(gamePlayer -> gamePlayer.getPlayer().getid() == playerLogin.getid())){
           return new ResponseEntity<>(makeMap("Error", "You are here"), HttpStatus.FORBIDDEN);
       }else {
           GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(playerLogin, currentGame));
           return new ResponseEntity<>(makeMap("GpId", newGamePlayer.getId()), HttpStatus.CREATED);
       }
   }
    public List<Object> getAll() {
        return gameRepository.findAll()
                .stream()
                .map(game -> gameDTO(game))
                .collect(Collectors.toList());

    }
    private Map<String, Object> gameDTO(Game game) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", game.getid());
        dto.put("date", game.getdateGame());
        dto.put("gamePlayers", game.getGamePlayerset()
                .stream()
                .map(gamePlayer -> gamePlayerDTO(gamePlayer))
                .collect(Collectors.toList()));

        return dto;
    }
    private Map<String, Object> gamePlayerDTO(GamePlayer gamePlayer) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", gamePlayer.getId());
        dto.put("player", playerDTO(gamePlayer.getPlayer()));
        if(gamePlayer.getScore() == null) {
            dto.put("score", gamePlayer.getScore());
        }else{dto.put("score", gamePlayer.getScore().getScore());
        }
        return dto;
    }
    private Map<String, Object> playerDTO(Player player) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("id", player.getid());
        dto.put("userName", player.getuserName());
        dto.put("email", player.getEmail());

        return dto;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    @RequestMapping("/game_view/{id}")
    public ResponseEntity <Object> playerIdDTO(@PathVariable Long id, Authentication authentication){

        GamePlayer buscarGamePlayer = gamePlayerRepository.getOne(id);
        Game buscarGame = buscarGamePlayer.getGame();
        Player playerLogin = playerRepository.findByEmail(authentication.getName());

        if( playerLogin.getid().equals(buscarGamePlayer.getPlayer().getid())){
            Map<String, Object> dto = gameDTO(buscarGamePlayer.getGame());
            dto.put("Ships", buscarGamePlayer.getShipset().stream().map(ship -> shipDTO(ship)).collect(Collectors.toList()));
            dto.put("Salvoes", createSalvos(buscarGame.getGamePlayerset()));

            return new ResponseEntity<>(dto, HttpStatus.ACCEPTED);}
        else{ return new ResponseEntity<>("Error", HttpStatus.UNAUTHORIZED);}

    }
    private Map<Long, Object> createSalvos(Set<GamePlayer> gamePlayers){
        Map<Long, Object> dto = new LinkedHashMap<>();
        for(GamePlayer gamePlayer : gamePlayers){
            dto.put(gamePlayer.getId(), salvoDTO(gamePlayer.getSalvo()) );

        }
        return dto;
    }
    private Map<String, Object> shipDTO(Ship ship) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        dto.put("ship", ship.getShipName());
        dto.put("location", ship.getShipLocations());
        return dto;
    }
    private Map<String, Object> salvoDTO(Set<Salvo>salvos) {
        Map<String, Object> dto = new LinkedHashMap<String, Object>();
        for(Salvo salvo : salvos ) {
            dto.put(salvo.getSalvoTurn(), salvo.getSalvoLocations());

        }
        return dto;

    }
    //FUNCTION SIGN UP,CREATE NEW MAPS
    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> register(
            @RequestParam String userName, @RequestParam String password) {

        if (userName.isEmpty() || password.isEmpty()) {
            return new ResponseEntity<>(makeMap("error", "Missing data"), HttpStatus.FORBIDDEN);
        }
        else if (playerRepository.findByEmail(userName) !=  null) {
            return new ResponseEntity<>(makeMap("error", "Name already in use"), HttpStatus.UNAUTHORIZED);
        }else  {
        playerRepository.save(new Player(userName, password));
        return new ResponseEntity<>(makeMap("Successful", "usernew"), HttpStatus.CREATED);
        }
    }

    @RequestMapping(path = "/games/players/{gamePlayerId}/ships", method = RequestMethod.POST)
    public ResponseEntity <Map <String, Object>> shipsLocation
            (@PathVariable Long gamePlayerId, Authentication authentication, @RequestBody List<Ship> ships ) {
        GamePlayer currentGamePlayer = gamePlayerRepository.getOne(gamePlayerId);
        Player playerLogin = playerRepository.findByEmail(authentication.getName());

        if(isGuest(authentication)){
            return new ResponseEntity<>(makeMap("Error", "Login succsefull"), HttpStatus.ACCEPTED);
        }else if(playerLogin == null){
            return new ResponseEntity<>(makeMap("Error", "Login first"), HttpStatus.UNAUTHORIZED);
        }else if(currentGamePlayer.getPlayer() != playerLogin){
            return new ResponseEntity<>(makeMap("Error", "error"), HttpStatus.UNAUTHORIZED);
        }else if(currentGamePlayer.getShipset().size() > 0){
            return new ResponseEntity<>(makeMap("Error", "full"), HttpStatus.UNAUTHORIZED);
        }else{
            for (Ship ship : ships) {
                currentGamePlayer.addShip(ship);
                shipRepository.save(ship);
            }
            return new ResponseEntity<>(makeMap("Successful", "ok"), HttpStatus.CREATED);
        }
    }




    @Override
    public String toString() {
        return "SalvoController{" +
                "gameRepository=" + gameRepository +
                ", playerRepository=" + playerRepository +
                ", shipRepository=" + shipRepository +
                ", gamePlayerRepository=" + gamePlayerRepository +
                ", salvoRepository=" + salvoRepository +
                '}';
    }
}
