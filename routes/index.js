var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var http = require("http");

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/admin', function(req, res){
	//Process Parameters
	if(req.query.sendPulse)
	{
		var onoff = req.query.sendPulse == "ON" ? "1" : "0";
		var command = ("gpio write 0 " + onoff);
		runShellCommand(command);
	}
	var city = req.query.city ? req.query.city : "Shanghai";
	uglyAQIFetch(city, function(aqi)
		{
			if(aqi)
				res.render('admin', {city: city, aqi: aqi});
			else
				res.render('admin', {city: city, aqi: "???"});
		});
})

router.get('/location', function(req, res) {
	//Process Parameters
	if(req.query.sendlocation)
	{
		var location = req.query.sendlocation == "location";
		var command = ("location" + location);
		runShellCommand(command);
	}
	res.render('location', {foo: "bar"});
});

var child;
//Runs an external script
var runShellCommand = function(command){
	console.log("Trying to run '"+command+"'");
	try
	{
	    child = exec(command, function(error, stdout, stderr){
	        console.log('stdout: ' + stdout);
	        console.log('stderr: ' + stderr);
	        if(error !== null)
	            console.log('exec error: ' + error);
	    })
	} catch(e){console.log("Error: " + e)}
}

var uglyAQIFetch = function(city, callback){
	if(!city) return 0;
	var options = {
		host:"aqicn.info",
		path:"/?city="+city+"&widgetscript&size=xsmall&id=530549886a3c56.13532391"
	};
	var cb = function(response){
		var str;
		response.on('data', function(chunk){
			str+=chunk;
		})
		response.on('end', function(){
			var substr = str.match(/>[0-9]+<\/div>/);
			var aqi = substr[0].match(/[0-9]+/);
			console.log(aqi[0]);
			callback(aqi[0]);
		})
	}
	var req = http.request(options, cb).end();
}

module.exports = router;
