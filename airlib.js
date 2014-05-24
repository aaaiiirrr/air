var setFilterActive = function(isActive)
{
    //TODO: replace with actual bash script
    var command = "foo params"
    //Set filter command parameter
    var param = isActive ? " -active 1" : " -active 0";

    runShellCommand(command + param);
}

//Runs an external script
var runShellCommand = function(command){
    var child = exec(command, function(error, stdout, stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if(error !== null)
            console.log('exec error: ' + error);
    })
}

var sendPulse = function(){
    console.log("FOOFOOFOOFOO");
}