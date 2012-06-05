var zipFs = new zip.fs.FS();

function onerror(message) {
	console.error(message);
}

function unzipBlob(blob, callback) {
	zipFs.importBlob(blob, function() {
		var directory = zipFs.root.getChildByName("import");
		var firstEntry, logo1, logo2, field;
		for (var i=directory.children.length-1; i>= 0 ; i--){
			if (directory.children[i].name=="game.xml"){
				firstEntry = directory.children[i];
			}
			if (directory.children[i].name=="logo1.jpg"){
				logo1 = directory.children[i];
			}
			if (directory.children[i].name=="logo2.jpg"){
				logo2 = directory.children[i];
			}
			if (directory.children[i].name=="field.jpg"){
				field = directory.children[i];
			}
		}
		firstEntry.getText(function(text){
			logText(text);
		});
	}, null, onerror);
}

function logText(text) {
	setGameDatas(text);
	onFinished();
}
zip.workerScriptsPath = "zip/";

function loadMatch(evt){
	showLoader();
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		
		// Great success! All the File APIs are supported.
		var file = document.getElementById('matchLoader').files[0]; // FileList object
		var directory = zipFs.root.addDirectory("import");
		//var callback = function(zippedBlob){alert(zippedBlob)};
		var callback = function(zippedBlob){
			unzipBlob(zippedBlob, function(unzippedText) {
				logText(unzippedText);
			});
		};
		directory.importBlob(file, function() {
			zipFs.exportBlob(callback, null, onerror);
		});
	} else {
	  //console.warn('The File APIs are not fully supported in this browser.');
	  var d = new Date();
	  var form = document.forms.fileForm;
	  form.dateFile.value=d.getTime();
	  form.submit();
	}
}

returnedValue=null;

function onIframeLoad(){
	var d = document.forms.fileForm.dateFile.value;
	if (d){
		var scr = document.getElementById("scr");
		scr.src = "http://ultraball.nodester.com/getMatch?id="+d;
		var interval = setInterval(function(){
			if (returnedValue){
				clearInterval(interval);
				setGameDatas(returnedValue);
				onFinished()
			}
		}, 300);
	}
}

function onFinished(){
	document.getElementById('loadButton').className="hidden";
	document.getElementById('buttons').className="";
	hideLoader();
}