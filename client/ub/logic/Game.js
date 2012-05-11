function Game(ubCanvas) {
	this.canvas = ubCanvas;	  
	this.canvas.fillStyle="white";
	this.canvas.font="bold 12px sans-serif";
	this.speed=6;
	this.pivot=8;
	this.quarter=1;
	this.ball=new Ball();
};	
//Game Utilities
Game.prototype = new Object();
Game.prototype.setCompositions = function(players){
	this.players=players;
};

Game.prototype.initQuarter = function(quarter){
	this.quarter=quarter;
	TeamSquare.init();
	this.canvas.clearRect(0, 0, 594, 392);
	for (var i=this.players.length-1; i>=0  ; i--){
		this.players[i].init();
	}
	this.ball.init();
};

Game.prototype.draw = function(){
	  // First erase everything, something like:
    this.canvas.clearRect(0, 0, 594, 392);
		
	for (var i=this.players.length-1; i>=0  ; i--){
		this.players[i].draw(this.canvas);
	}
	this.ball.draw(this.canvas);
};

	Game.prototype.isDone = function(){
		var done = this.ball.isDone();
		for (var i=this.players.length-1; i>=0  ; i--){
			done = this.players[i].isDone() && done;
		}
		return done;
};

Game.prototype.setPivot = function(pivot){
	this.pivot = pivot;
};

Game.prototype.getPlayerByJersey = function(jersey, isAway){
	var start = isAway ? this.pivot : 0;
	var end = isAway ? this.players.length : this.pivot;
	for (var i=start; i < end; i++){
		if (jersey == this.players[i].jersey){
			return this.players[i];
		}
	}
	return null;
};