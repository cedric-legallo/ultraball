function DrawObj(square) {
  if (! isNaN(square)){
      this.square= square;
	  this.x=CONST.coords.squares[this.square].x;
	  this.y=CONST.coords.squares[this.square].y;
	  this.destSquare=square;
	  this.destX=this.x;
	  this.destY=this.y;
	  this.pasX=0;
	  this.pasY=0;
	}
};
DrawObj.prototype = new Object();

DrawObj.prototype.setSquare  = function(square){
	if (! isNaN(square)){
      this.square= square;
	  this.x=CONST.coords.squares[this.square].x;
	  this.y=CONST.coords.squares[this.square].y;
	  this.destSquare=this.square;
	  this.destX=this.x;
	  this.destY=this.y;
	  this.pasX=0;
	  this.pasY=0;
	}
};

DrawObj.prototype.init  = function(){
	this.square= null;
	this.x=null;
	this.y=null;
	this.destSquare=this.square;
	this.destX=this.x;
	this.destY=this.y;
	this.pasX=0;
	this.pasY=0;
};

DrawObj.prototype.setDest = function(square){
	this.destSquare = square;
	this.destX = CONST.coords.squares[square].x;
	this.destY = CONST.coords.squares[square].y;
	this.origX = CONST.coords.squares[this.square].x;
	this.origY = CONST.coords.squares[this.square].y;
		
  	var dirX = this.destX - this.x;
  	var dirY = this.destY - this.y;
	var diffX = Math.abs(dirX);
  	var diffY = Math.abs(dirY);
  	var end = Math.max(diffX, diffY);
	  this.pasX = dirX / end;
	  this.pasY = dirY / end;
};

DrawObj.prototype.isDone = function(){
	if (this.square == null) {
		return true;
	}
	//if ((this.destX == Math.round(this.x)) && (this.destY == Math.round(this.y))){
	if ((this.destX == this.x && this.destY == this.y)
	|| ((Math.abs(Math.round(this.x) - this.origX) >= Math.abs(this.destX - this.origX))
	&& (Math.abs(Math.round(this.y) - this.origY) >= Math.abs(this.destY - this.origY)))){
		this.square = this.destSquare;
		this.x=Math.round(this.x);
		this.y=Math.round(this.y);
		this.pasX=0;
		this.pasY=0;
		return true;
	}else {
		return false;
	}
};
