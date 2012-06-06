function Ball() {
	DrawObj.call(this, 18);
	this.player = null;
	this.speedMult = 1;
};

Ball.prototype = new DrawObj();//Heritage
Ball.prototype.object=CONST.ball.object;

Ball.prototype.draw = function(canvas){
	if (this.square == null) return;
	if (this.player){
		//drawn  with player
	}else {
		this.x+=this.pasX ? this.pasX*this.speedMult  : 0;
		this.y+=this.pasY ? this.pasY*this.speedMult  : 0;
		var ballX = Math.round(this.x);
		var ballY = Math.round(this.y);
		var img = window["ball"];

		canvas.drawImage(img, ballY+20, ballX+20);//ball is 20px so it is -10,-10 from square center
	}
};
Ball.prototype.isDone = function(){
	if (this.player){
		return true;
	}else {
		return DrawObj.prototype.isDone.call(this, null);
	}
};
Ball.prototype.setPlayer = function(player){
	this.player = player;
};
Ball.prototype.drop = function(){
	this.setSquare(this.player.square);
	this.player = false;
};

Ball.prototype.move = function(square){
	this.setSquare(this.player.square);
	this.player = false;
	this.setDest(square);
};