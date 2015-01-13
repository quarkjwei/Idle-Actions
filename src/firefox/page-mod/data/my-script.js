
//var preferences = require("sdk/simple-prefs").prefs;
//var idleTime = preferences.idleTime * 1000;
//console.log(idleTime);




var inactivityTime = function () {
    var t;
    //var idleTime = 6000; 
    idleTime = 0;

    self.port.on("getIdleTime", function(time){
        console.log("getIdleTime: " + time);
        idleTime = time * 1000;
        //idlingTime = time * 1000;
        console.log("idleTime: " + idleTime);
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
        t = setTimeout(logout, idleTime);
        console.log(new Date().toTimeString() + ": timer set to " + idleTime);
    }

    function resetTimer() {
        console.log("resetTimer: " + idleTime);
        clearTimeout(t);
        t = setTimeout(logout, idleTime);
        // 1000 milisec = 1 sec
        console.log(new Date().toTimeString() + ": active");
    }
};

inactivityTime();