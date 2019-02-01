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
		finalPosition: [{
				shipName: "PatrolBoat",
				shipLocations: [],
				shipPositions: "Horizontal"
			},
			{
				shipName: "Destroyer",
				shipLocations: [],
				shipPositions: "Horizontal"
			},
			{
				shipName: "Submarine",
				shipLocations: [],
				shipPositions: "Horizontal"
			},
			{
				shipName: "Battleship",
				shipLocations: [],
				shipPositions: "Horizontal"
			},
			{
				shipName: "AircraftCarrier",
				shipLocations: [],
				shipPositions: "Horizontal"
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
			let audio = document.getElementsByTagName("audio")[0];
			return audio.pause();
		},
		audioPlay: function () {
			let audio = document.getElementsByTagName("audio")[0];
			return audio.play();
		},
		playerLocal: function (parsedUrl) {
			for (let x = 0; x < this.gamePlayer.length; x++) {
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
			for (let x = 0; x < this.datos.Ships.length; x++) {
				for (let j = 0; j < this.datos.Ships[x].location.length; j++) {
					let positionShips = document.getElementById(this.datos.Ships[x].location[j]); //console.log(positionShips)
					positionShips.classList.remove("box");
					positionShips.classList.add("boxShips");
				}
			}

			for (let gamePlayer in this.salvoes) { //	console.log(gamePlayer);
				for (let key in this.salvoes[gamePlayer]) {
					let salvo = this.salvoes[gamePlayer][key]; //console.log([key])
					for (let x = 0; x < salvo.length; x++) { //console.log(salvo[x])
						if (gamePlayer == parsedUrl.searchParams.get("gp")) {
							let myShots = document.getElementById("2" + salvo[x]); //console.log(myShots)
							myShots.setAttribute("class", "boxSalvo");
							myShots.textContent = key
						} else {
							let shotsOponnent = document.getElementById(salvo[x]); //console.log(shotsOponnent)//console.log(positionShips)
							for (let z = 0; z < this.datos.Ships.length; z++) {
								// for (var s = 0; s < this.datos.Ships[z].location.length; s++){// 	var ships = this.datos.Ships[z].location[s];
								// 	if(salvo[x] == ships ) {// 	var shipsElement = document.getElementById(ships);// 	shipsElement.classList.remove("boxShips");//     shipsElement.classList.add("boxSalvoYo");// 	}// }
								if (this.datos.Ships[z].location.includes(salvo[x])) { //con el includes ahorramos el segundo for que esta comentado arriba
									let shipsElement = document.getElementById(salvo[x]);
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
		
		rotation: function (typeShip, ev) {
			for (let x = 0; x < this.finalPosition.length; x++) {
				if (this.finalPosition[x].shipName == typeShip) {
 
					if (this.finalPosition[x].shipPositions == "Horizontal") {
						this.finalPosition[x].shipPositions = "Vertical"

						let ship = document.getElementById(typeShip);
						ship.className = "divDragVer";
						return

					} else {
						this.finalPosition[x].shipPositions = "Horizontal"

						let ship = document.getElementById(typeShip);
						ship.className = "divDrag";
						return
					}
				}
			}
console.log(ev)

		},
		cellColor: function (x) {
			console.log(x)
		  },

		allowDrop: function (ev) {
			ev.preventDefault();
			console.log(ev)
		},
		drag: function (ev) {
			ev.dataTransfer.setData("text", ev.target.childElementCount);
			ev.dataTransfer.setData("el", ev.target.id);

			console.log(ev)

		},
		dragEnter: function (ev) {
			ev.preventDefault();
			ev.dataTransfer.setData("el", ev.target.id);
			let xx = document.getElementById(ev.target.id)
			for (let x = 0; x < this.finalPosition.length; x++) {
				if(this.finalPosition[x].shipPositions == xx ){
				
					console.log("holA")
			
					
				}	
				
			}
			
			console.log(xx)
			xx.classList.remove("box");
			xx.classList.add("boxDrag");

		},
		drop: function (ev) {
			for (let h = 0; h < this.finalPosition.length; h++) {
				let saveArrayHor = [];
				if (this.finalPosition[h].shipPositions == "Horizontal") {


					data1 = ev.dataTransfer.getData("text");
					data2 = ev.dataTransfer.getData("el");


					for (let i = 0; i < Number(data1); i++) {

						saveArrayHor.push(ev.target.id.slice(0, 1) + (Number(ev.target.id.slice(1, 2)) + i))
						//console.log(saveArrayHor);
					}
					ev.target.appendChild(document.getElementById(data2));
					for (let x = 0; x < this.finalPosition.length; x++) {
						if (this.finalPosition[x].shipName == data2) {
							this.finalPosition[x].shipLocations = saveArrayHor
						}
					}
					ev.preventDefault();

				} else {

					let saveArrayVer = [];

					ev.preventDefault();
					data1 = ev.dataTransfer.getData("text");
					data2 = ev.dataTransfer.getData("el");
					var firstLetter = ev.target.id.slice(0, 1) //first position
					for (let i = 0; i < Number(data1); i++) {

						let inicial = (this.letters.indexOf(firstLetter))
						let final = inicial + (Number(data1) - 1)
						let positionVer = [];


						for (let k = inicial; k <= final; k++) {
							positionVer.push(this.letters[k] + (Number(ev.target.id.slice(1, 2))))
						}
						console.log(positionVer)
						if (i < Number(data1)) {
							saveArrayVer = positionVer
						}

					}
					console.log(saveArrayVer)
					ev.target.appendChild(document.getElementById(data2));
					for (let x = 0; x < this.finalPosition.length; x++) {
						if (this.finalPosition[x].shipName == data2) {
							this.finalPosition[x].shipLocations = saveArrayVer
						}
					}

					console.log(ev.target.id.slice(0, 1));

				}
				console.log("final Position", this.finalPosition);
			}
		}
	},
	created: function () {
		this.fetchStart();

	}
});



// var app = new Vue({
// 	el: "#app",
// 	data: {
// 		datos: [],
// 		letters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
// 		numbers: [null, "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
// 		gamePlayer: [],
// 		local: {},
// 		oponnent: {},
// 		salvoes: [],
// 		logouts: true,
// 		picked: '',
// 		active: false,
// 		finalPosition: [{
// 				shipName: "PatrolBoat",
// 				shipLocations: [],
// 				shipPositions: "Horizontal"
// 			},
// 			{
// 				shipName: "Destroyer",
// 				shipLocations: [],
// 				shipPositions: "Horizontal"
// 			},
// 			{
// 				shipName: "Submarine",
// 				shipLocations: [],
// 				shipPositions: "Horizontal"
// 			},
// 			{
// 				shipName: "Battleship",
// 				shipLocations: [],
// 				shipPositions: "Horizontal"
// 			},
// 			{
// 				shipName: "AircraftCarrier",
// 				shipLocations: [],
// 				shipPositions: "Horizontal"
// 			},

// 		],




// 	},

// 	methods: {
// 		fetchStart: function () {
// 			let parsedUrl = new URL(window.location.href);

// 			fetch("/api/game_view/" + parsedUrl.searchParams.get("gp"), )
// 				.then(function (data) {

// 					return data.json();
// 				})
// 				.then(function (myData) {
// 					console.log(myData)
// 					if (myData.Error != undefined) {
// 						console.log(myData.Error);
// 					} else {
// 						app.datos = myData;
// 						app.salvoes = myData.Salvoes;
// 						app.gamePlayer = myData.gamePlayers;
// 						app.playerLocal(parsedUrl);
// 						app.addShipsAndSalvos(parsedUrl);
// 						console.log("salvoes", app.salvoes);
// 						console.log("datos", app.datos);

// 					}
// 				})
// 				.catch(function (error) {
// 					//window.location.replace("games.html")
// 				});

// 		},
// 		putShips: function () {
// 			let parsedUrl = new URL(window.location.href);
// 			let nn = parsedUrl.searchParams.get("gp")
// 			let save = this.finalPosition

// 			fetch("/api/games/players/" + nn + "/ships", {
// 				credentials: 'include',
// 				headers: {
// 					'Accept': 'application/json',
// 					'Content-Type': 'application/json'
// 				},
// 				method: 'POST',
// 				body: JSON.stringify(save)

// 			}).then(function (response) {
// 				console.log(response);
// 				if (response.status == 201) {
// 					location.reload();
// 				}
// 				return response.json();

// 			}).then(function (json) {}).catch(function (error) {
// 				console.log('Request failure: ', error);
// 			});
// 		},
// 		logout: function () {
// 			fetch("/api/logout", {
// 					credentials: 'include',
// 					headers: {
// 						'Content-Type': 'application/x-www-form-urlencoded'
// 					},
// 					method: 'POST',
// 				})
// 				.then(function (response) {
// 					console.log('Request success: ', response);

// 					if (response.status == 200) {

// 						alert("See you soon!!")
// 						window.location.replace("games.html");
// 					}
// 				})
// 				.catch(function (error) {
// 					console.log('Request failure: ', error);
// 				});

// 		},
// 		backMenu: function () {
// 			return window.location.replace("games.html")
// 		},
// 		audioPause: function () {
// 			let audio = document.getElementsByTagName("audio")[0];
// 			return audio.pause();
// 		},
// 		audioPlay: function () {
// 			let audio = document.getElementsByTagName("audio")[0];
// 			return audio.play();
// 		},
// 		playerLocal: function (parsedUrl) {
// 			for (let x = 0; x < this.gamePlayer.length; x++) {
// 				if (parsedUrl.searchParams.get("gp") == this.gamePlayer[x].id) {
// 					this.local = this.gamePlayer[x].player;
// 				} else {
// 					this.oponnent = this.gamePlayer[x].player;
// 				}
// 			}
// 			if (this.gamePlayer.length == 1) {
// 				this.oponnent.email = ("Waiting player");
// 			}
// 		},
// 		addShipsAndSalvos: function (parsedUrl) {
// 			for (let x = 0; x < this.datos.Ships.length; x++) {
// 				for (let j = 0; j < this.datos.Ships[x].location.length; j++) {
// 					let positionShips = document.getElementById(this.datos.Ships[x].location[j]); //console.log(positionShips)
// 					positionShips.classList.remove("box");
// 					positionShips.classList.add("boxShips");
// 				}
// 			}

// 			for (let gamePlayer in this.salvoes) { //	console.log(gamePlayer);
// 				for (let key in this.salvoes[gamePlayer]) {
// 					let salvo = this.salvoes[gamePlayer][key]; //console.log([key])
// 					for (let x = 0; x < salvo.length; x++) { //console.log(salvo[x])
// 						if (gamePlayer == parsedUrl.searchParams.get("gp")) {
// 							let myShots = document.getElementById("2" + salvo[x]); //console.log(myShots)
// 							myShots.setAttribute("class", "boxSalvo");
// 							myShots.textContent = key
// 						} else {
// 							let shotsOponnent = document.getElementById(salvo[x]); //console.log(shotsOponnent)//console.log(positionShips)
// 							for (let z = 0; z < this.datos.Ships.length; z++) {
// 								// for (var s = 0; s < this.datos.Ships[z].location.length; s++){// 	var ships = this.datos.Ships[z].location[s];
// 								// 	if(salvo[x] == ships ) {// 	var shipsElement = document.getElementById(ships);// 	shipsElement.classList.remove("boxShips");//     shipsElement.classList.add("boxSalvoYo");// 	}// }
// 								if (this.datos.Ships[z].location.includes(salvo[x])) { //con el includes ahorramos el segundo for que esta comentado arriba
// 									let shipsElement = document.getElementById(salvo[x]);
// 									shipsElement.classList.remove("boxShips");
// 									shipsElement.classList.add("boxSalvoYo");
// 									shipsElement.textContent = key
// 								}
// 							}
// 						}
// 					}
// 				}
// 			}
// 		},
// 		rotation: function (typeShip) {
// 			for (let x = 0; x < this.finalPosition.length; x++) {
// 				if (this.finalPosition[x].shipName == typeShip) {

// 					if (this.finalPosition[x].shipPositions == "Horizontal") {
// 						this.finalPosition[x].shipPositions = "Vertical"

// 						let ship = document.getElementById(typeShip);
// 						ship.className = "divDragVer";
// 						return 

// 					} else {
// 						this.finalPosition[x].shipPositions = "Horizontal"

// 						let ship = document.getElementById(typeShip);
// 						ship.className = "divDrag";
// 						return 
// 					}
// 				}
// 			}


// 		},

// 		allowDrop: function (ev) {
// 			ev.preventDefault();
// 		},
// 		drag: function (ev) {
// 			ev.dataTransfer.setData("text", ev.target.childElementCount);
// 			ev.dataTransfer.setData("el", ev.target.id);
// 			console.log(ev)

// 		},
// 		dragEnter: function (ev) {
// 			ev.preventDefault();
// 			//ev.dataTransfer.setData("el", ev.target.id);
// 			//let cellTd = [];
// 			console.log(ev.target)
// 			//
// 			//

// 		},
// 		drop: function (ev) {
// 			for (let h = 0; h < this.finalPosition.length; h++) {
// 				let saveArrayHor = [];
// 				if (this.finalPosition[h].shipPositions == "Horizontal") {


// 					data1 = ev.dataTransfer.getData("text");
// 					data2 = ev.dataTransfer.getData("el");


// 					for (let i = 0; i < Number(data1); i++) {

// 						saveArrayHor.push(ev.target.id.slice(0, 1) + (Number(ev.target.id.slice(1, 2)) + i))
// 						//console.log(saveArrayHor);
// 					}
// 					ev.target.appendChild(document.getElementById(data2));
// 					for (let x = 0; x < this.finalPosition.length; x++) {
// 						if (this.finalPosition[x].shipName == data2) {
// 							this.finalPosition[x].shipLocations = saveArrayHor
// 						}
// 					}
// 					ev.preventDefault();

// 				} else {

// 					let saveArrayVer = [];

// 					ev.preventDefault();
// 					data1 = ev.dataTransfer.getData("text");
// 					data2 = ev.dataTransfer.getData("el");
// 					var firstLetter = ev.target.id.slice(0, 1) //first position
// 					for (let i = 0; i < Number(data1); i++) {

// 						let inicial = (this.letters.indexOf(firstLetter))
// 						let final = inicial + (Number(data1) - 1)
// 						let positionVer = [];


// 						for (let k = inicial; k <= final; k++) {
// 							positionVer.push(this.letters[k] + (Number(ev.target.id.slice(1, 2))))
// 						}
// 						console.log(positionVer)
// 						if (i < Number(data1)) {
// 							saveArrayVer = positionVer
// 						}

// 					}
// 					console.log(saveArrayVer)
// 					ev.target.appendChild(document.getElementById(data2));
// 					for (let x = 0; x < this.finalPosition.length; x++) {
// 						if (this.finalPosition[x].shipName == data2) {
// 							this.finalPosition[x].shipLocations = saveArrayVer
// 						}
// 					}

// 					console.log(ev.target.id.slice(0, 1));

// 				}
// 				console.log("Drop", this.finalPosition);
// 			}
// 		}
// 	},
// 	created: function () {
// 		this.fetchStart();

// 	}
// });