function Match(data) {
	this.quarters = data.xmlgame.xmlquarter,
	this.stepMove = true,
	this.turns=null,
	this.stepActions=null,
	this.isSimultaneousMoves=true,
	this.initQuarter = function(isSimultaneousMoves){
		this.qtId = "QT"+game.quarter;
		initConsole(this.qtId);
		this.phase=0;
		updateQuarterLabel(game.quarter);
		updatePhaseLabel(this.qtId, 0);
		this.isSimultaneousMoves = isSimultaneousMoves
		this.turns = this.quarters[game.quarter-1].xmlturn;
		var starting = this.turns[0];
		var pos = starting.xmlplayerposition
		updateScore(starting.awayscore, true);
		updateScore(starting.homescore);
		for (var i=game.players.length-1; i>=0  ; i--){
			updatePlayerStatus(game.players[i]);
		}
		for (var i = pos.length-1; i>= 0; i--){
			var po=pos[i];
			var player = game.getPlayerByJersey(po.jersey,po.home === 'false');
			updatePlayerStatus(player, po);
			player.setSquare(po.position-1);
			if (po.ball === 'true'){
				player.receiveBall();
				game.ball.setPlayer(player)
			}
		}
	};
	
	this.changeSimultaneousMove = function(){
		this.isSimultaneousMoves= this.isSimultaneousMoves ? false : true;
	};
	
	this.doStep = function (quick){
		if (this.stepMove) {
		  if (this.phase >= this.turns.length)return;
			this.stepMove=false;
			updateScore(this.turns[this.phase].awayscore, true);
			updateScore(this.turns[this.phase].homescore);
			this.doTurn(this.turns[this.phase++],this.turns[this.phase], quick);
		}else {
			if (this.stepActions.length == 1){
				this.stepMove = true;
			}
			this.doAction(this.stepActions.shift(), quick);
		}
	};

	this.doTurn = function (turn, positionTurn, quick){
		updatePhaseLabel(this.qtId, turn.number);
		this.doPositions(positionTurn, quick);
		if (quick){
			var actions = turn.xmlaction.slice(this.turnNbPlayers);
			var actionsLength = actions.length;
			for (var i = 0; i < actionsLength; i++){
				this.doAction(actions[i], quick);
			}
		}else {
			this.stepActions = turn.xmlaction;
			if (this.isSimultaneousMoves){
				this.doMoves(this.stepActions);
				this.stepActions = this.stepActions.slice(this.turnNbPlayers);
			}
			animate();
		}
		if (quick || this.stepActions.length == 0){
			this.stepMove = true;
		}
	};

	this.doPositions = function (positionTurn, quick){
		if (positionTurn){
			var positions = positionTurn.xmlplayerposition;
			var nbPLayers = positions.length
			this.turnNbPlayers = nbPLayers;
			if (quick && positionTurn.ball){
				if (game.ball.player) {
					game.ball.player.fall();
					game.ball.drop();
				}
				game.ball.setSquare(positionTurn.ball-1);
			}
			for (var i=0; i < nbPLayers ; i++){
				var position=positions[i];
				var player = game.getPlayerByJersey(position.jersey,position.home === 'false');
				if (position.lifestatus ==="wounded"){
					this.turnNbPlayers--;
				}
				if (position.lifestatus ==="dead"){
					this.turnNbPlayers--;
				}
				if (quick){
					player.setPosition(position.position-1);
					if (position.grounded==="true"){
						player.fall();
					}else {
						player.standUp();
					}
					if (position.ball==="true"){
						player.receiveBall();
						game.ball.setPlayer(player);
					}
				}
				//TODO showInit(player, position.initiative);
				updatePlayerStatus(player, position);
			}
		}
	};
	
	this.doMoves = function (actions){
		for (var i=0; i < this.turnNbPlayers ; i++){
			var action=actions[i];
			for (var key in action){
				if (key.indexOf("xml") != -1) {
					this[key](action);
				}
			}
		}
	};

	
	this.doAction =  function (action, quick){
		for (var key in action){
			if (key.indexOf("xml") != -1) {
				this[key](action, quick);
			}
		}
		if (! quick){
			animate();
		}
	};

	
	
	//BALL ACTIONS
	this.xmldontknowball =  function (action){
		this.randomActionString("DontKnowBall",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	this.xmlpass =  function (action, quick){
		var pass = action.xmlpass;
		var player = game.getPlayerByJersey(action.actorjersey,action.actorhome === 'false');
		var actionString = "Pass";
		var actionParams = [player.name];
		player.standUp();
		if (pass.interceptorjersey) {
			if (pass.type==="player"){
				actionString+= "Player";
				player = game.getPlayerByJersey(pass.tojersey,pass.tohome==="false");
				actionParams.push(player.name);
				
			}else {
				actionString+= "Square";
				actionParams.push(pass.to);
			}
			actionString+= "Intercepted";
			player = game.getPlayerByJersey(pass.interceptorjersey,pass.interceptorhome === 'false');
			actionParams.push(player.name);
			game.ball.move(player.square);
			actionCallback = function(){
				game.ball.setPlayer(player);
				player.receiveBall();
			};
			if (quick){
				actionCallback();
			}
		}
		else if (pass.receiverjersey){
			if (pass.type==="player"){
				actionString+=pass.tojersey==pass.receiverjersey?"PlayerSuccess":"PlayerReceived";
				player = game.getPlayerByJersey(pass.tojersey,pass.tohome==="false");
				actionParams.push(player.name);
			}else {
				actionString+="SquareCatched";
				actionParams.push(pass.to);
			}
			player = game.getPlayerByJersey(pass.receiverjersey,pass.receiverhome === 'false');
			actionParams.push(player.name);
			game.ball.move(player.square);
			actionCallback = function(){
				game.ball.setPlayer(player);
				player.receiveBall();
			};
			if (quick){
				actionCallback();
			}
		}else {
			if (pass.type==="square"){
				actionString+=pass.to===pass.end?"SquareSuccess":"SquareFailure";
				actionParams.push(pass.to);
			}else {
				actionString+="PlayerFailure";
				player = game.getPlayerByJersey(pass.tojersey,pass.tohome==="false");
				actionParams.push(player.name);
			}
			actionParams.push(pass.end);
			game.ball.move(pass.end-1);
		}
		this.randomActionString(actionString,actionParams);
	};
	
	this.xmlshoot =  function (action, quick){
		var shoot = action.xmlshoot;
		var actionString = "Shoot";
		var player = game.getPlayerByJersey(action.actorjersey,action.actorhome === 'false');
		var actionParams = [player.name];
		player.standUp();
		if (shoot.success === 'true'){
			actionString+="Success";
			actionParams.push(shoot.points);
			game.ball.move((action.actorhome === 'true' ^ game.quarter%2)? 45 : 46);
			actionCallback = function(){updateScore(parseInt(shoot.points, 10), action.actorhome === 'false', true);};
			if (quick){
				actionCallback();
			}
		}else {
			if (shoot.interceptorjersey){
				player = game.getPlayerByJersey(shoot.interceptorjersey,shoot.interceptorhome === 'false');
				game.ball.move(player.square);
				actionString+="Intercepted";
				actionParams.push(player.name);
				actionCallback = function(){
					game.ball.setPlayer(player);
					player.receiveBall();
				};
				if (quick){
					actionCallback();
				}
			}else {
				actionString+="Failure";
				actionParams.push(shoot.end);
				game.ball.move(shoot.end-1);
			}
		}
		this.randomActionString(actionString,actionParams);
	};
	
	this.xmlsmash =  function (action, quick){
		var shoot = action.xmlsmash;
		var actionString = "Smash";
		var player = game.getPlayerByJersey(action.actorjersey,action.actorhome === 'false');
		var actionParams = [player.name];
		player.standUp();
		if (shoot.success === 'true'){
			actionString+="Success";
			actionParams.push(shoot.points);
			game.ball.move((action.actorhome === 'true' ^ game.quarter%2)? 45 : 46);
			actionCallback = function(){updateScore(parseInt(shoot.points, 10), action.actorhome === 'false', true);};
			if (quick){
				actionCallback();
			}
		}else {
			actionString+="Failure";
			actionParams.push(shoot.end);
			game.ball.move(shoot.end-1);
		}
		this.randomActionString(actionString,actionParams);
	};
	
	this.xmlkeepball =  function (action){
		this.randomActionString("KeepBall",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	this.xmltakeball =  function (action){
		var player = game.getPlayerByJersey(action.actorjersey,action.actorhome === 'false');
		game.ball.setPlayer(player);
		player.receiveBall();
		this.randomActionString("TakeBall",[player.name]);
	};
	
	//COMBAT ACTIONS
	this.xmlattack =  function (action){
		var atk = action.xmlattack;
		var actionString = atk.kind;
		
		var player = game.getPlayerByJersey(action.actorjersey,action.actorhome === 'false');
		var actionParams = [player.name];
		if (atk.actorposition == 'down'){
			player.fall();
		}

		player = game.getPlayerByJersey(atk.victimjersey,atk.victimhome === 'false');
		actionParams.push(player.name);
		if (atk.victimposition == 'down'){
			player.fall();
		}

		if(atk.dropsball){
			game.ball.drop();
			actionString+="Ball";
		}
		
		actionString+=atk.success=="true"?"Success":"Failure";
		this.randomActionString(actionString,actionParams);
		
		if (atk.killpoints){
			updateScore(atk.killpoints, action.actorhome === 'false', true);
		}
		if (atk.victimstatus){
			this.randomActionString("Is"+this.capitaliseFirstLetter(atk.victimstatus),[player.name]);
		}
	};
	
	this.xmllaunchgrenade =  function (action){
		var grenade = action.xmllaunchgrenade;
		var player;
		if (grenade.kind === "Stun"){
			if (grenade.victimhasball === "true"){
				game.ball.drop();
			}
			if (grenade.xmlvictim){
				if (grenade.xmlvictim.length){
					var victims = grenade.xmlvictim;
					for (var i = victims.length-1; i>=0; i--){
						var victim = victims[i];
						player = game.getPlayerByJersey(victim.jersey,victim.home === 'false');
						player.fall();
					}
					player=game.getPlayerByJersey(action.actorjersey,action.actorhome==="false");
					this.randomActionString("GrenadeStun",[player.name,grenade.to,grenade.xmlvictim.length]);
				}else if (grenade.xmlvictim){
					var victim = grenade.xmlvictim;
					player = game.getPlayerByJersey(victim.jersey,victim.home === 'false');
					player.fall();
					player=game.getPlayerByJersey(action.actorjersey,action.actorhome==="false");
					this.randomActionString("GrenadeStun",[player.name,grenade.to,1]);
				}
			}//else que des branchies too bad pas de victim
		}//TODO pas d'autres types de grenades pour le moment ?
	};
	
	this.xmlnogrenade =  function (action){
		this.randomActionString("NoGrenade",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	//MISC ACTIONS
	this.xmlbonus =  function (action){
		updateScore(1, action.actorhome === 'false', true);
		this.randomActionString("Bonus",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	this.xmlhooligans =  function (action){
		this.randomActionString("Hooligans",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	//MOVEMENT ACTIONS
	this.xmlmove =  function (action){
		var player = game.getPlayerByJersey(action.actorjersey,action.actorhome === 'false');
		var move = action.xmlmove;
		var dest = move.to;
		player.move(dest-1);
		var destination = move.destination ||"case";
		var actionParams = [player.name, dest];
		if (destination == "player") actionParams.push(game.getPlayerByJersey(move.destinationjersey,move.destinationhome === 'false').name);
		this.randomActionString("MoveTo"+this.capitaliseFirstLetter(destination), actionParams);
	};
	
	this.xmlblockedmove =  function (action){
		this.randomActionString("BlockedMove",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	this.xmldontknowmove =  function (action){
		this.randomActionString("DontKnowMove",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	this.xmlstandup =  function (action){
		var player = game.getPlayerByJersey(action.actorjersey,action.actorhome === 'false');
		player.standUp();
		this.randomActionString("StandUp",[player.name]);
	};
	
	this.xmlwait =  function (action){
		this.randomActionString("Wait",[game.getPlayerByJersey(action.actorjersey,action.actorhome==="false").name]);
	};
	
	//String Utils
	this.capitaliseFirstLetter=function(a){
		return a.charAt(0).toUpperCase()+a.substring(1);
	};
	
	this.randomActionString=function(action,params){
		updateConsole(this.qtId,this.replaceActionString(action+((new Date).getTime()%3+1),params));
	};
	
	this.replaceActionString=function(action,params){
		action = comments[action];
		for(var i=0; i<params.length; i++){
			action=action.replace("%"+(i+1),params[i]);
		}
		action+="\n";
		return convertXMLToStr(action);
	};
};