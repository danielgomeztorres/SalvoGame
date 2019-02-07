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
		picked: '',
		active: false,
		currentShip: "Horizontal",
		saveArrayVer: [],
		saveArrayHor: [],
		nameShip: null,
		father: null,
		child: null,
		idCellHor: null,
		paint: [],
		row: false,
		column: false,
		finalPosition: [{

				shipPositions: "Horizontal",
				shipName: "PatrolBoat",
				shipLocations: [],
			},
			{
				shipPositions: "Horizontal",
				shipName: "Destroyer",
				shipLocations: [],
			},
			{
				shipPositions: "Horizontal",
				shipName: "Submarine",
				shipLocations: [],
			},
			{
				shipPositions: "Horizontal",
				shipName: "Battleship",
				shipLocations: [],

			},
			{
				shipPositions: "Horizontal",
				shipName: "AircraftCarrier",
				shipLocations: [],

			},


		],






	},

	methods: {
		fetchStart: function () {
			let parsedUrl = new URL(window.location.href);

			fetch("/api/game_view/" + parsedUrl.searchParams.get("gp"), )
				.then(function (data) {

					return data.json();
				})
				.then(function (myData) {
					console.log(myData)
					if (myData.Error != undefined) {
						console.log(myData.Error);
					} else {
						app.datos = myData;
						app.salvoes = myData.Salvoes;
						app.gamePlayer = myData.gamePlayers;
						app.playerLocal(parsedUrl);
						app.addShipsAndSalvos(parsedUrl);
						console.log("salvoes", app.salvoes);
						console.log("datos", app.datos);

					}
				})
				.catch(function (error) {
					//window.location.replace("games.html")
				});

		},
		putShips: function () {
			let parsedUrl = new URL(window.location.href);
			let nn = parsedUrl.searchParams.get("gp")
			let save = this.finalPosition

			fetch("/api/games/players/" + nn + "/ships", {
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(save)

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
			return audio.pause();
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
				this.oponnent.email = ("Waiting player");
			}
		},
		addShipsAndSalvos: function (parsedUrl) {
			for (var x = 0; x < this.datos.Ships.length; x++) {
				for (var j = 0; j < this.datos.Ships[x].location.length; j++) {
					var positionShips = document.getElementById(this.datos.Ships[x].location[j]); //console.log(positionShips)
					positionShips.classList.remove("box");
					positionShips.classList.add("boxShips");
				}
			}
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
		cellColor: function (x) {
			console.log(x)
		},
		rotation: function (typeShip) {

			for (var x = 0; x < this.finalPosition.length; x++) {
				if (this.finalPosition[x].shipName == typeShip) { // si el nombre del barco es igual algun barco de los que existen

					if (this.finalPosition[x].shipPositions == "Horizontal") { // por defecto horizontal
						this.finalPosition[x].shipPositions = "Vertical"
						this.currentShip = "Vertical";
						var ship = document.getElementById(typeShip);
						ship.className = "divDragVer";

					} else if (this.finalPosition[x].shipPositions == "Vertical") {
						this.finalPosition[x].shipPositions = "Horizontal"
						this.currentShip = "Horizontal";
						var ship = document.getElementById(typeShip);
						ship.className = "divDragHor";
					}
				}
			}
			// this.dragEnter();
			// this.drop(this.father.parentNode.id);
		},
		allowDrop: function (ev) {
			ev.preventDefault();
		},
		drag: function (ev) { // GUARDAR EL BARCO CUANDO CLICKAS
			console.log("drag", ev)
			this.father = ev.target
			this.father2 = ev.target
			console.log("div padre: ", this.father)
			this.child = ev.target.childElementCount;
			console.log("numero de hijos; ", this.child)
			this.nameShip = ev.target.id;
			console.log("nombre del barco: ", this.nameShip)
		},
		dragEnter: function (ev) {
			var cell = document.getElementsByClassName("box")
			for (var l = 0; l < cell.length; l++) {
				cell[l].classList.remove("boxGreen")
				cell[l].classList.remove("boxRed")
			}
			/////////////////////////////////////////////////////VERTICAL
			if (this.currentShip == "Vertical") {
				ev.preventDefault();
				this.saveArrayVer = [];
				var firstLetter = ev.target.id.slice(0, 1) //first position
				var startLetter = (this.letters.indexOf(firstLetter))
				for (let i = 0; i < Number(this.child); i++) {
					var lastLetter = startLetter + (Number(this.child) - 1)
				}
				for (var k = startLetter; k <= lastLetter; k++) { //Loop para determinar la posicion de las letras inicial en los barcos verticales
					let idCellVer = this.letters[k] + (Number(ev.target.id.slice(1, 3)))
					let paint2 = document.getElementById(idCellVer)
					console.log(paint2)
					 if (!paint2) {
						this.column = true 
						 console.log(this.column)
						 break	 
					 } else { 
						this.column = false
						 console.log(this.column)	 	 
					 }
					}
					 for (var k = startLetter; k <= lastLetter; k++) { //Loop para determinar la posicion de las letras inicial en los barcos verticales
						let idCellVer = this.letters[k] + (Number(ev.target.id.slice(1, 3)))
						let paint2 = document.getElementById(idCellVer)
					//paint.classList.add("boxGreen")
					this.saveArrayVer.push(idCellVer);
					if (this.column) {	
						paint2.classList.add("boxRed")
						this.father = [] 
					} else if (!this.column) {
						paint2.classList.add("boxGreen")
					}
				
				}
			/////////////////////////////////////////////////////HORIZONTAL
			} else if (this.currentShip == "Horizontal") {
				ev.preventDefault();
				this.saveArrayHor = [];
				for (var i = 0; i < Number(this.child); i++) {
					let idCellHor = ev.target.id.slice(0, 1) + (Number(ev.target.id.slice(1, 3)) + i)
					let paint = document.getElementById(idCellHor)
					console.log(paint)
					if (!paint) {
						this.row = true;
						console.log(this.row)
						break;
					} else {
						this.row = false;
						console.log(this.row)
					}
				}
				for (var i = 0; i < Number(this.child); i++) {
					let idCellHor = ev.target.id.slice(0, 1) + (Number(ev.target.id.slice(1, 3)) + i)
					let paint = document.getElementById(idCellHor)
					this.saveArrayHor.push(idCellHor)
					if (this.row) {
						paint.classList.add("boxRed")
						this.father = [] 
					
					} else if (!this.row) {
						paint.classList.add("boxGreen")
					}
				}
			}
			this.father = this.father2 
			console.log("final Position", this.finalPosition);
			ev.dataTransfer.setData("el", ev.target.id);
		},
		// dragEnd: function (ev) {
		// 	ev.preventDefault();
		// 	//ev.dataTransfer.setData("el", ev.target.id);
		// },
		drop: function (ev) {
			this.father =
				ev.target.appendChild(this.father);
			for (var x = 0; x < this.finalPosition.length; x++) {
				if (this.finalPosition[x].shipName == this.nameShip) {
					//this.finalPosition[x].shipLocations = []
					if (this.saveArrayVer.length > 0) {
						console.log("vertical")

						this.finalPosition[x].shipLocations = this.saveArrayVer



					} else if (this.saveArrayHor.length > 0) {
						console.log("horizontal")
						this.finalPosition[x].shipLocations = this.saveArrayHor

					}
				}
			}
			console.log("final Position", this.finalPosition);
			this.currentShip = "Horizontal"
			this.saveArrayHor = [];
			this.saveArrayVer = [];
	
		},

	},
	created: function () {
		this.fetchStart();

	}
});



