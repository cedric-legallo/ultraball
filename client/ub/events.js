var field = new Image();
var standing = new Image();
var standball = new Image();
var fallen = new Image();
var standingAway = new Image();
var standballAway = new Image();
var fallenAway = new Image();
var ball = new Image();
var xCoord=[0];
var yCoord=[0];
var pause=true;
var actionCallback=null;
lang = null;
commments=null;
 
function drawMe(drawObj, image){
	game.drawObject(drawObj, image);
};

function setGameDatas(data){
	if (! data.xmlgame){
		data = xml2json.parser(data, '');
	}
	match = new Match(data);
	//construction de Game
	var dataGame = data.xmlgame;
	
	
	document.querySelector("#date").innerHTML = dataGame.competitioncode+" : "+dataGame.season+"-"+dataGame.competitionturn;
	document.querySelector("#stadiumName").innerHTML = dataGame.stadium;
	document.querySelector("#audience").innerHTML = dataGame.audience+lang.stadium.spectators;
	document.querySelector("#interest").innerHTML = lang.stadium.iterest+dataGame.interest;
	if (dataGame.challengeamnt > 0){
		document.querySelector("#challenge").innerHTML = dataGame.challengeamnt+" €";
	}
	
	//composition des équipes
	var comps = dataGame.xmlcomposition;
	
	document.querySelector("#home .name").innerHTML = comps[0].fullname;
	document.querySelector("#home").style.backgroundColor = "#"+comps[0].color;
	document.querySelector("#home").style.color = "#" + ((parseInt(comps[0].color,16) + 0x888888)%0xFFFFFF).toString(16);
	document.getElementById("logoHome").src="http://ultraball.ludimail.net/images/logos/"+comps[0].code+".jpg";
	document.getElementById("field").src="http://ultraball.ludimail.net/images/fields/"+comps[0].code+".jpg";;
	document.querySelector("#away .name").innerHTML = comps[1].fullname;
	document.querySelector("#away").style.backgroundColor = "#"+comps[1].color;
	document.querySelector("#away").style.color = "#" + ((parseInt(comps[1].color,16) + 0x888888)%0xFFFFFF).toString(16);
	document.getElementById("logoAway").src="http://ultraball.ludimail.net/images/logos/"+comps[1].code+".jpg";;
	var players = [];
	var length = Math.max(comps[0].xmlgameplayer.length, comps[1].xmlgameplayer.length);
	game.setPivot(comps[0].xmlgameplayer.length);//longueur equipe home
	for (var i=0; i < length; i++){
		var player1 = comps[0].xmlgameplayer[i];
		var player2 = comps[1].xmlgameplayer[i];
		if (player1){
			players.unshift(new Player(player1));
			
			document.querySelector("#homeTeam").appendChild(createPlayerDiv(player1));
		}
		if (player2){
			player2.isAway=true;
			players.push(new Player(player2));
			document.querySelector("#awayTeam").appendChild(createPlayerDiv(player2));
		}
	}
	game.setCompositions(players);
	//images des joueurs : http://ultraball.ludimail.net/en/graphics/gameplayerIcon?color=FFFF00&standing=1&ball=0
	
	standing.src = ["http://ultraball.ludimail.net/en/graphics/gameplayerIcon?color=",comps[0].color,"&standing=1&ball=0"].join('');
	standball.src = ["http://ultraball.ludimail.net/en/graphics/gameplayerIcon?color=",comps[0].color,"&standing=1&ball=1"].join('');
	fallen.src = ["http://ultraball.ludimail.net/en/graphics/gameplayerIcon?color=",comps[0].color,"&standing=0&ball=0"].join('');
	standingAway.src = ["http://ultraball.ludimail.net/en/graphics/gameplayerIcon?color=",comps[1].color,"&standing=1&ball=0"].join('');
	standballAway.src = ["http://ultraball.ludimail.net/en/graphics/gameplayerIcon?color=",comps[1].color,"&standing=1&ball=1"].join('');
	fallenAway.src = ["http://ultraball.ludimail.net/en/graphics/gameplayerIcon?color=",comps[1].color,"&standing=0&ball=0"].join('');
};

function createPlayerDiv(player){
	var playerDiv = document.createElement("div");
	playerDiv.className="player";
	playerDiv.id = "p"+player.code+"_"+player.jersey;//JERSEY IS FOR CLONE
	
	var nameDiv = document.createElement("div");
	nameDiv.innerHTML = player.name;
	var numberDiv = document.createElement("div");
	numberDiv.className="number";
	numberDiv.innerHTML = isNaN(parseInt(player.jerseynumber, 10)) ? player.jersey : player.jerseynumber;
	
	var barsDiv = document.createElement("div");
	barsDiv.className="bars";
	var lifeDiv = document.createElement("div");
	lifeDiv.className="bar life";
	var formDiv = document.createElement("div");
	formDiv.className="bar form";
	var lifeFillerDiv = document.createElement("div");
	lifeFillerDiv.className="lifeFiller";
	var formFillerDiv = document.createElement("div");
	formFillerDiv.className="formFiller";
	
	lifeDiv.appendChild(lifeFillerDiv);
	formDiv.appendChild(formFillerDiv);
	barsDiv.appendChild(lifeDiv);
	barsDiv.appendChild(formDiv);

	//Greffes : 
	if (player.xmlplayertransplant){
		var transplants = [convertXMLToStr(player.name),
				lang.players.transplants];
		var trans = player.xmlplayertransplant;
		if (trans.code){
			transplants.push(lang.players[trans.code]);
		}else {//Array
			for (var i=trans.length;i>0;i--){
				transplants.push(lang.players[trans[i-1].code],(i>1) ? ", " : "");
			}
		}
		transplants.push("\n");			
		updateConsole('compPhrases', transplants.join(''));
	}else {
		updateConsole('compPhrases', [convertXMLToStr(player.name),
				lang.players.notransplants,
				"\n"].join(''));
	}
	
	playerDiv.appendChild(nameDiv);
	var statusDiv = document.createElement("div");
	if (player.control !== 'normal'){
		updateConsole('compPhrases', [convertXMLToStr(player.name),
				lang.players.exclusion,
				player.control,
				"\n"].join(''));
		statusDiv.className = "redCard";
	}else {
		statusDiv.className = "initiative";
	}
	playerDiv.appendChild(statusDiv);
	playerDiv.appendChild(barsDiv);
	playerDiv.appendChild(numberDiv);
	return playerDiv;
};

function convertXMLToStr(str){
	return str.replace(/&quot;/g,'"').replace(/&apos;/g,"'");
}

function displayGrid(target){
	if (target.checked){
		document.getElementById("numgrid").className="";
	}else {
		document.getElementById("numgrid").className="hidden";
	}
};

function updateIsSimultaneousMoves(){
	match.changeSimultaneousMove();
};

function init(){
	lang = location.pathname.split('/')[1];
	comments=window["comments_"+lang]||window.comments_en;
	lang = langs[lang] || langs.en;
    Transparency.render(document.getElementsByTagName("body")[0] ,lang);
	var loader = document.getElementById('matchLoader');
	if (!loader.addEventListener) {
		loader.attachEvent("onchange", loadMatch);
	}
	else {
		loader.addEventListener('change', loadMatch, false);
	}

	field.src = 'img/field.jpg';
	ball.src = 'img/ball.png';
	try {
		
		game = new Game(document.getElementById('ub').getContext('2d'));	
		updateSpeed(0);
	} catch(e){
		console.error(e.msg);
		return;
	}
};

function play(){
	if (!pause){
		setTimeout(function(){match.doStep()}, 1500 - 200*game.speed);
	}
};

function playPause(){
	pause = ! pause;
	document.getElementById("playpause").value = pause ? lang.buttons.play : lang.buttons.pause;
	play(); 
};

function fonctionAuHasard(data){
	console.log(data);
}

function initPlayPause(){
	pause = true;
	document.getElementById("playpause").value = lang.buttons.play;
};

function updateQuarter(diff){
	initPlayPause();
	game.initQuarter(game.quarter+diff);
	if (diff){
		if (game.quarter==1){
			document.getElementById('previousQuarter').setAttribute("disabled",true);
		}else {
			document.getElementById('previousQuarter').removeAttribute("disabled");
		}
		if (game.quarter==4){
			document.getElementById('nextQuarter').setAttribute("disabled",true);
		}else {
			document.getElementById('nextQuarter').removeAttribute("disabled");
		}
	}
	match.initQuarter(document.getElementById("isSimultaneousMoves").checked);
	
	game.draw();
};

function updatePhase(diff){
	match.phase+=diff;
	match.doStep(true);
	
	game.draw();
};

function updateSpeed(diff){
	game.speed += diff;
	document.getElementById('speed').innerHTML = game.speed+"/7";
	if (game.speed==0){
		document.getElementById('slower').setAttribute("disabled",true);
	}else {
		document.getElementById('slower').removeAttribute("disabled");
	}
	if (game.speed==7){
		document.getElementById('faster').setAttribute("disabled",true);
	}else {
		document.getElementById('faster').removeAttribute("disabled");
	}
};

function updateScore(point,away, diff){
	var node;
	if (away){
		node = document.querySelector("#away .score");
	}else {
		node = document.querySelector("#home .score");
	}
	if (diff){
		point+=parseInt(node.innerHTML,10);
	}
	node.innerHTML = point;
};

function updatePlayerStatus(player, position){
	var statusDiv = document.querySelector("#p"+player.code+"_"+player.jersey+" .initiative");
	if (position){
		var status=position.lifestatus;
		if (statusDiv){
			if (status === "wounded" || status === "dead"){
				document.createElement("div");
				statusDiv.className = status;
				statusDiv.innerHTML="";
				document.getElementById("p"+player.code+"_"+player.jersey).appendChild(statusDiv);
			}else {
				statusDiv.innerHTML=position.initiative;
			}
		}
		document.querySelector("#p"+player.code+"_"+player.jersey+" .lifeFiller").style.width=position.lifepercent+"px";
		document.querySelector("#p"+player.code+"_"+player.jersey+" .formFiller").style.width=position.shapepercent+"px";
		document.getElementById("p"+player.code+"_"+player.jersey).className="player";
	}else {
		if (statusDiv){
			statusDiv.innerHTML="";
		}
		document.getElementById("p"+player.code+"_"+player.jersey).className="player substitute";
	}
};

function updateQuarterLabel(q){
	document.getElementById("quarter").innerHTML=q;
};

function updatePhaseLabel(id, p){
	if (match.phase<=1){
		document.getElementById('previousPhase').setAttribute("disabled",true);
	}else {
		document.getElementById('previousPhase').removeAttribute("disabled");
	}
	document.getElementById("phase").innerHTML=p;
	if (p){
		updateConsole(id, ["____________________________________\nPhase ", p, "\n\n"].join(''));
	}
};

function updateConsole(id, msg){
	var phrases = document.getElementById(id);
	phrases.value += msg;
	phrases.scrollTop = phrases.scrollHeight;
};

function initConsole(id){
	var phrases = document.getElementById(id);
	if (! phrases){
		var linkDiv = document.createElement("div");
		linkDiv.innerHTML=id;
		linkDiv.onclick=function(){
			selectConsole(id);
		}
		phrases = document.createElement("textarea");
		phrases.disabled="disabled";
		phrases.rows=20;
		phrases.cols=100;
		phrases.id=id;
		
		document.getElementById('phrasesLinks').appendChild(linkDiv);
		document.getElementById('phrasesLinks').appendChild(document.createElement("br"));
		document.getElementById('phrases').appendChild(phrases);
	}
	selectConsole(id);
	phrases.value = '';
	phrases.scrollTop = 0;
};

function selectConsole(id){
	var areas = document.querySelectorAll("#phrases textarea");
	for (var i = areas.length-1;i>=0;i--){
		areas[i].style.display="none";
	}
	document.getElementById(id).style.display="";
};

function animate(){
	if (! game.isDone()){
		game.draw();
		requestAnimFrame(animate, game.canvas);
	}else {
		game.draw();
		if (actionCallback) {
			actionCallback.apply();
			actionCallback = null;
		}
		play();
	}
};

function showLoader(){
	document.getElementById("loader").style.display="block";
};

function hideLoader(){
	document.getElementById("loader").style.display="none";
	updateQuarter(0);
};

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
