var app = new Vue({
	el: "#app",
	data: {
		datos: [],
		letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
		numbers: [null, "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
		gamePlayer: [],
		local: {},
		oponnent: {},
		salvoes: [],
		logouts: true,
		

	},

	methods: {
		fetchStart: function () {
			var parsedUrl = new URL(window.location.href);

			fetch("/api/game_view/" + parsedUrl.searchParams.get("gp"), )
				.then(function (data) {
					
					return data.json();
				})
				.then(function (myData) {
					console.log(myData)
					if (myData.Error!=undefined) {
						console.log(myData.Error);
					} else {
					
						app.datos = myData;
						app.salvoes = myData.Salvoes;
					
						app.gamePlayer = myData.gamePlayers;
						app.playerLocal(parsedUrl);
					
						app.addShipsAndSalvos(parsedUrl);
					
						console.log("salvoes", app.salvoes);
						console.log("gameplayer", app.gamePlayer);
						console.log("local", app.local);
						console.log("datos", app.datos);
				
					}
				})
				.catch(function (error) {
					//window.location.replace("games.html")
				});

		},
		putShips: function () { 
			for (var x = 0; x < this.gamePlayer.length; x++) {
		var nn = this.gamePlayer[x].id}
			fetch("/api/games/players/" + nn + "/ships", {
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify([
					{
					shipName: "Destroyer",
					shipLocations: ["A1","A2","A3"]},
					{
				    shipName: "PatrolBoat",
					shipLocations: ["C5","C6"]}
				])
			}).then(function (response) {
				console.log(response);
				if (response.status == 201) {
					location.reload();	
				}
				return response.json();
				
			}).then(function (json) {}).catch(function (error) {
				console.log('Request failure: ', error);
			});
		},

		logout: function () {
			fetch("/api/logout", {
					credentials: 'include',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: 'POST',
				})
				.then(function (response) {
					console.log('Request success: ', response);

					if (response.status == 200) {

						alert("See you soon!!")
						window.location.replace("games.html");
					}
				})
				.catch(function (error) {
					console.log('Request failure: ', error);
				});

		},
		backMenu: function () {
			return window.location.replace("games.html")
		},
		audioPause: function () {
			var audio = document.getElementsByTagName("audio")[0];
			return audio.pause();
		},
		audioPlay: function () {
			var audio = document.getElementsByTagName("audio")[0];
			return audio.play();
		},
		playerLocal: function (parsedUrl) {
			for (var x = 0; x < this.gamePlayer.length; x++) {
				if (parsedUrl.searchParams.get("gp") == this.gamePlayer[x].id) {
					this.local = this.gamePlayer[x].player;
				} else {
					this.oponnent = this.gamePlayer[x].player;
				}
			}
			if (this.gamePlayer.length == 1) {
				this.oponnent.userName = ("Waiting player");
			}
		},
		addShipsAndSalvos: function (parsedUrl) {
			console.log("adeu1")
			for (var x = 0; x < this.datos.Ships.length; x++) {
				for (var j = 0; j < this.datos.Ships[x].location.length; j++) {
					var positionShips = document.getElementById(this.datos.Ships[x].location[j]); //console.log(positionShips)
					positionShips.classList.remove("box");
					positionShips.classList.add("boxShips");
				}
			}
			console.log("adeu2")
			for (var gamePlayer in this.salvoes) { //	console.log(gamePlayer);
				for (var key in this.salvoes[gamePlayer]) {
					var salvo = this.salvoes[gamePlayer][key]; //console.log([key])
					for (var x = 0; x < salvo.length; x++) { //console.log(salvo[x])
						if (gamePlayer == parsedUrl.searchParams.get("gp")) {
							var myShots = document.getElementById("2" + salvo[x]); //console.log(myShots)
							myShots.setAttribute("class", "boxSalvo");
							myShots.textContent = key
						} else {
							var shotsOponnent = document.getElementById(salvo[x]); //console.log(shotsOponnent)//console.log(positionShips)
							for (var z = 0; z < this.datos.Ships.length; z++) {
								// for (var s = 0; s < this.datos.Ships[z].location.length; s++){// 	var ships = this.datos.Ships[z].location[s];
								// 	if(salvo[x] == ships ) {// 	var shipsElement = document.getElementById(ships);// 	shipsElement.classList.remove("boxShips");//     shipsElement.classList.add("boxSalvoYo");// 	}// }
								if (this.datos.Ships[z].location.includes(salvo[x])) { //con el includes ahorramos el segundo for que esta comentado arriba
									var shipsElement = document.getElementById(salvo[x]);
									shipsElement.classList.remove("boxShips");
									shipsElement.classList.add("boxSalvoYo");
									shipsElement.textContent = key
								}
							}
						}
					}
				}
			}
		},
	},
	created: function () {
		this.fetchStart();

	}
});



function allowDrop(ev) {
    ev.preventDefault();
  }
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.childElementCount);
    ev.dataTransfer.setData("el", ev.target.id);
	console.log(ev)
	console.log(ev.target.id)
  }
  
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var data2 = ev.dataTransfer.getData("el");

    let array = [];

    for(let i = 0; i < Number(data); i++){
		console.log( Number(data));
        array.push(ev.target.id.slice(0,1) + (Number(ev.target.id.slice(1,2))  +i))
    }

    console.log(array);
    ev.target.appendChild(document.getElementById(data2));
  }


  function dropVer(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var data2 = ev.dataTransfer.getData("el");
console.log(data)
    let array = [];

    for(let i = 0; i < Number(data); i++){
        array.push(ev.target.id.slice(0,1) + (Number(ev.target.id.slice(1,2))  +i))
    }

    console.log(array);
    ev.target.appendChild(document.getElementById(data2));
  }

