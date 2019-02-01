var app = new Vue({
	el: "#app",
	data: {
		dateGame: [],
		playerGame: null,
		gamePlayers: [],
		obj: [],
		gPlayers: [],
		username: "",
		password: "",
		newPlayer: []
	},

	methods: {
		fetchStart: function () {

			fetch("/api/games/", )
				.then(function (data) {
					return data.json();
				})
				.then(function (myData) {

					console.log(myData);
					app.dateGame = myData.game;
					console.log(app.dateGame);
					app.playerGame = myData.player;
					console.log(app.playerGame);
					app.gamePlayers = app.getGamePlayer();
					app.getPlayers();
					app.addScores();
					app.sortTable();
					app.audioPlay();

				})
		},

		login: function () {

			fetch("/api/login", {
					credentials: 'include',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: 'POST',
					body: 'userName=' + this.username + '&password=' + this.password,
				})
				.then(function (response) {
					console.log('Request success: ', response);
					if (response.status == 200) {
						location.reload();
					
					}
					if (response.status == 401) {
						alert("Your name or password is incorrect")
					}
				})
				.catch(function (error) {
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
						location.reload();
						app.logins = true;
						app.signups = true;
						app.logouts = false;
						alert("See you soon!!")
					}
				})
				.catch(function (error) {
					console.log('Request failure: ', error);
				});

		},
		signup: function () {
			fetch("/api/players", {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
				body: 'userName=' + this.username + '&password=' + this.password,
			}).then(function (response) {
				if (response.status == 201) {
					alert("Signup Successfull")
					app.login();
				}
				if (response.status == 401) {
					alert("This name is registered")
				}
				if (response.status == 403) {
					alert("Add name and password")
				}

				console.log('Request success: ', response);


			}).then(function () {}).catch(function (error) {
				console.log('Request failure: ', error);
			});

		},
		getGamePlayer: function () { //GET-ALL-GAMEPLAYERS
			var gPlayers = [];
			for (var key in this.dateGame) {
				for (var x = 0; x < this.dateGame[key].gamePlayers.length; x++) {
					gPlayers.push(this.dateGame[key].gamePlayers[x]);
				}
			}
			return gPlayers;
		},
		getTotalPoints: function () {
			var totalPoints = 0
			for (var z in this.gamePlayers) {

				if (this.gamePlayers[z].player.userName === this.gamePlayers[z].player.userName) {
					totalPoints += this.gamePlayers[z].score
				}
			}
			return totalPoints;
		},
		getPlayers: function () {
			let idPlayers = [];
			for (let i = 0; i < this.dateGame.length; i++) {

				for (let j = 0; j < this.dateGame[i].gamePlayers.length; j++) {

					if (!idPlayers.includes(this.dateGame[i].gamePlayers[j].player.id)) {
						idPlayers.push(this.dateGame[i].gamePlayers[j].player.id);
						let objectPlayers = {
							id: this.dateGame[i].gamePlayers[j].player.id,
							name: this.dateGame[i].gamePlayers[j].player.userName,
							email: this.dateGame[i].gamePlayers[j].player.email,
							totalPoints: 0,
							won: 0,
							lost: 0,
							tied: 0,
							totalGames: 0,
							wonRate: 0
						};
						this.obj.push(objectPlayers);
					}
				}
			}
		},
		addScores: function () {
			for (var i = 0; i < this.gamePlayers.length; i++) {

				for (var k = 0; k < this.obj.length; k++) {

					if (this.obj[k].id == this.gamePlayers[i].player.id) {
						this.obj[k].totalPoints += this.gamePlayers[i].score
					}
					if (this.gamePlayers[i].score == 1 && this.obj[k].id == this.gamePlayers[i].player.id) {
						this.obj[k].won += this.gamePlayers[i].score
						this.obj[k].totalGames += this.gamePlayers[i].score
					}
					if (this.gamePlayers[i].score == 0.5 && this.obj[k].id == this.gamePlayers[i].player.id) {
						this.obj[k].tied += this.gamePlayers[i].score + 0.5
						this.obj[k].totalGames += this.gamePlayers[i].score + 0.5
					}
					if (this.gamePlayers[i].score == 0 && this.obj[k].id == this.gamePlayers[i].player.id) {
						this.obj[k].lost += this.gamePlayers[i].score + 1
						this.obj[k].totalGames += this.gamePlayers[i].score + 1
					}
				}

			}

		},
		sortTable: function () {
			var winRate = [];
			for (var i = 0; i < this.obj.length; i++) {
				winRate.push(this.obj[i].won / this.obj[i].totalGames * 100);
				var round = this.obj[i].won / this.obj[i].totalGames * 100;
				if (this.obj[i].wonRate == "NaN") {
					this.obj[i].wonRate = 0
				} else {
					winRate.push(this.obj[i].wonRate = round);
				}
			}

			this.obj.sort(function (a, b) {
				if (a.wonRate < b.wonRate) {
					return 1
				}
				if (a.wonRate > b.wonRate) {
					return -1
				}
				return 0;
			})
			console.log(this.obj)
		},
		returnGame: function (dato) {
			if (this.playerGame != null) {
				for (var i = 0; i < dato.gamePlayers.length; i++) {
					if (this.playerGame.id == dato.gamePlayers[i].player.id) {
						console.log(this.playerGame.id);
						return true
					}
				}
			}
		},
		enterTheGame: function (dato) {
			if (this.player == null)
				var nn;
			for (var i = 0; i < dato.gamePlayers.length; i++) {
				if (this.playerGame.id == dato.gamePlayers[i].player.id) {

					nn = dato.gamePlayers[i].id
				}
			}

			return window.location.replace("game.html?gp=" + nn)

		},
		createGame: function () {

			fetch("/api/games", {
					credentials: 'include',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					method: 'POST',
				})
				.then(function (response) {
					return response.json();
				}).then(function (data) {
					console.log(data);
					app.newPlayer = data.GpId
					window.location = 'game.html?gp=' + app.newPlayer;
				})
				.catch(function (error) {});
		},
		joinGame: function (dato) {
		console.log(dato.id);
		
			fetch("/api/games/" + dato.id + "/players", {
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
			}).then(function (response) {
				return response.json();
			}).then(function (data) {
				if(data.GpId){
				app.newPlayer = data.GpId
				window.location = 'game.html?gp=' + app.newPlayer;
				}
				console.log(data);
			}).catch(function (error) {});
		},
		buttonJoin: function (dato) {
			if (this.playerGame != null) {
				for (var x = 0; x < dato.gamePlayers.length; x++)
				if (dato.gamePlayers.length !== 2 && this.playerGame.id !== dato.gamePlayers[x].player.id) {
					return true
				}
			}
	    },
		audioPause: function () {
			var audio = document.getElementsByTagName("audio")[0];	
			return audio.pause();
		},
		audioPlay: function () {
			var audio = document.getElementsByTagName("audio")[0];	
			return audio.play();
		},
	},
	created: function () {
		this.fetchStart();
	}
});

var audio = document.getElementsByTagName("audio")[0];
audio.play();





