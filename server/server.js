//NEWS
var http = require("http"), xml2json = require("./xml2json");
var DateFormat = require('dateformatjs').DateFormat;
var express = require('express');
var ZIP = require("zip");
var fs = require('fs');

var port = process.env.PORT || 3000;

//var appHostName="http://localhost:"+port;
var appHostName="http://pronos2012.herokuapp.com";

var app = express.createServer();
app.use(express.bodyParser());

var histos = {};

app.all("/match", function(req, res) {
	try {
		var data = fs.readFileSync(req.files.matchLoader.path);
		var reader = ZIP.Reader(data);
		reader.toObject('utf-8');
		reader.forEach(function (entry) {
			if (entry._header.file_name == "game.xml"){
				var jsonData = xml2json.xml2json.parser(entry._stream.toString('utf-8'), '');
				histos[req.body.dateFile]=jsonData;
				res.send("<textarea id='ta'>"+JSON.stringify(jsonData)+"</textarea>");
			}
		});
	}catch (e){
		res.send(e);
	}
});

app.get("/getMatch", function(req, res) {
	try {
		var i = 0;
		for (var key in histos){i++;}
		var ret = "returnedValue="+JSON.stringify(histos[req.query.id]);
		if (i>=30){
			histos = {};
		}
		res.send(ret);
	}catch (e){
		res.send(e);
	}
});

app.get('/*', function(req, res){
    res.send('It Works');
});

app.listen(port, function() {
  console.log("Listening on " + port);
});

