var TeamSquare  = {//STATIC
	homeSquares : {},//{0-4 : player
	awaySquares : {},//{0-4 : player

	pushPlayer  : function(player, square){
		var squares = player.isAway ? this.awaySquares : this.homeSquares;
		if (squares[square]){
			if (! squares[square][0]){
				squares[square][0] = player;
				return 0;
			}
			if (! squares[square][1]){
				squares[square][1] = player;
				return 1;
			}
			if (! squares[square][2]){
				squares[square][2] = player;
				return 2;
			}
			if (! squares[square][3]){
				squares[square][3] = player;
				return 3;
			}
			if (! squares[square][4]){
				squares[square][4] = player;
				return 4;
			}
		}else {
			squares[square] = { 0 : player};
			return 0;
		}
	},
	
	popPlayer  : function(player){
		var square = player.square;
		var squares = player.isAway ? this.awaySquares : this.homeSquares;
		if (squares[square]){
			for (var key in squares[square]){
				if (player == squares[square][key]){
					delete squares[square][key];
				}
			}
			for (var key in squares[square]){
				return;
			}
			delete squares[square];
		}
	},

	init : function(){
		this.awaySquares = {};
		this.homeSquares = {};
	}
}