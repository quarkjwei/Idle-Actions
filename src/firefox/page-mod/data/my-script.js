var inactivityTime = function () {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // catches touchscreen presses
    window.onclick = resetTimer;     // catches touchpad clicks
    window.onscroll = resetTimer;    // catches scrolling with arrow keys
    window.onkeypress = resetTimer;

    function logout(modifier) {
        //alert("You are now logged out.")

        //location.href = 'https://accounts.google.com/logout';
        location.href = 'https://my.vcu.edu/c/portal/logout';
        //console.log(new Date().toTimeString() + ": away");

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

    function resetTimer() {
        clearTimeout(t);
        t = setTimeout(logout, 3000)
        // 1000 milisec = 1 sec
        console.log(new Date().toTimeString() + ": active");
    }
};

inactivityTime();