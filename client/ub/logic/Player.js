function Player(player) {
    DrawObj.call(this, player.square);
    this.isAway= player.isAway ? true : false;
	this.jersey=player.jersey;
	this.jerseyNumber=isNaN(parseInt(player.jerseynumber, 10)) ? player.jersey : player.jerseynumber;
	this.status=player.status ? player.status : CONST.player.standing;
    this.position=0;//position on its square
	this.code=player.code;//id du joueur
	this.name=player.name;
    //Squares.pushPlayer(player.square, player.isAway);
};

Player.prototype = new DrawObj();//Heritage
Player.prototype.object=CONST.player.object;
Player.prototype.speedMult=1;

Player.prototype.init = function(){
	this.status=CONST.player.standing;
	this.position=0;
	DrawObj.prototype.init.call(this);
}

Player.prototype.draw = function(canvas){
	if (this.square == null) return;
	this.x+=this.pasX*this.speedMult;
	this.y+=this.pasY*this.speedMult;
	var img;
	switch (this.status) {
		case CONST.player.withBall:
		img = CONST.player.withBall;
		break;
		case CONST.player.fallen:
		img = CONST.player.fallen;
		break;
		default:
		img = CONST.player.standing;
		break;
	}

	if (this.isAway) {
		img+='Away';
	}
	img = window[img];
	var posModif= this.isAway ? game.quarter%2 : (1+game.quarter)%2;
	var playerX = Math.round(this.x)+CONST.coords.modif[posModif][this.position].x;
	var playerY = Math.round(this.y)+CONST.coords.modif[posModif][this.position].y;
	
	canvas.drawImage(img, playerY,playerX);//this player is the positionth player of the destSquare
	canvas.fillText(this.jerseyNumber, playerY+15, playerX+15);
};

Player.prototype.move = function(square){
	TeamSquare.popPlayer(this);
	this.position=TeamSquare.pushPlayer(this, square);
	this.setDest(square);
}

Player.prototype.fall = function(){
	this.status = CONST.player.fallen;
};

Player.prototype.standUp = function(){
	this.status = CONST.player.standing;
};

Player.prototype.receiveBall = function(){
	this.status = CONST.player.withBall;
};

Player.prototype.setSquare = function(square){
	if (! isNaN(square)){
		this.position=TeamSquare.pushPlayer(this, square);
		DrawObj.prototype.setSquare.apply(this, [square]);
	}
};

Player.prototype.setPosition = function(square){
	TeamSquare.popPlayer(this);
	this.setSquare(square);
};