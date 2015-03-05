var inactivityTime = function () {
    var t;
    idleTime = 30000;
    idleUnit = 1000;

    self.port.on("getIdleTime", function(time){
        idleTime = time;
    })

    self.port.on("getIdleUnit", function(unit){
        idleTime = idleTime * (unit * 1000); //convert seconds to milliseconds
        document.onload = setTimer(idleTime);
    })

    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // catches touchscreen presses
    window.onclick = resetTimer;     // catches touchpad clicks
    window.onscroll = resetTimer;    // catches scrolling with arrow keys
    window.onkeypress = resetTimer;

    function logout(modifier) {
        console.log("page is now idle");
        self.port.emit("script-response", "logout");
    }

    function setTimer(){
        t = setTimeout(logout, idleTime);
    }

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(logout, idleTime);
    }
};

inactivityTime();
