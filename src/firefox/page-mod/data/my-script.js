
//var preferences = require("sdk/simple-prefs").prefs;
//var idleTime = preferences.idleTime * 1000;
//console.log(idleTime);




var inactivityTime = function () {
    var t;
    var timeoutVariable;
    //var idleTime = 6000; 
    //instantiate global variables
    idleTime = 30000;
    idleUnit = 1000;

    self.port.on("getIdleTime", function(time){
        console.log("getIdleTime: " + time);
        idleTime = time;
        //idlingTime = time * 1000;
        console.log("idleTime: " + idleTime);
        //document.onload = setTimer(idleTime);
    })

    self.port.on("getIdleUnit", function(unit){
        console.log("getIdleUnit: " + unit);
        idleTime = idleTime * (unit * 1000); //convert seconds to milliseconds
        console.log("idleUnit: " + unit);
        document.onload = setTimer(idleTime);
    })
    
    //console.log("idlingTime: " + idlingTime);

    
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // catches touchscreen presses
    window.onclick = resetTimer;     // catches touchpad clicks
    window.onscroll = resetTimer;    // catches scrolling with arrow keys
    window.onkeypress = resetTimer;

    function logout(modifier) {
        //alert("You are now logged out.")

        //location.href = 'https://accounts.google.com/logout';
        location.href = 'https://my.vcu.edu/c/portal/logout';
        
        console.log(new Date().toTimeString() + ": away");

        //tab - new tab
        if(modifier == "tab"){
        	//go to new tab
        }
        //window - new window
        else if(modifier == "window"){
        	//go to new window
        }
        //update - same tab
        else if(modifier == "update"){
        	//update tab
        }
    }

    function setTimer(){
        console.log("setTime: " + idleTime);
        //var x = false;
        t = setTimeout(logout, idleTime);
        if(idleTime >= 10000)
        {
            timeoutVariable = setTimeout(function()
            {
                if(confirm('Are you still there?') == true)
                {
                    console.log("timer was reset");
                    resetTimer();
                }
            }, idleTime - 5000);
        }
        console.log(new Date().toTimeString() + ": timer set to " + idleTime);
    }

    function resetTimer() {
        //var x = false;
        console.log("resetTimer: " + idleTime);
        clearTimeout(t);
        window.clearTimeout(timeoutVariable)
        t = setTimeout(logout, idleTime);
        if(idleTime > 10000)
        {
            timeoutVariable = setTimeout(function()
            {
                if(confirm('Are you still there?') == true)
                {
                    console.log("timer was reset");
                    resetTimer();
                }
            }, idleTime - 5000);
        }
        // 1000 milisec = 1 sec
        console.log(new Date().toTimeString() + ": active");
    }
};

inactivityTime();