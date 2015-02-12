function inIframe(){
    if(top != self){
         var contentHeight = $('#myIframeContent').height(); //Just this part I did with jQuery as I was sure that the document uses it
         postSize(contentHeight);
         }
    }

function postSize(height){
     var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);

    if(typeof target != "undefined" && document.body.scrollHeight){
        target.postMessage(height, "*");
        }
    }    

function receiveSize(e){
    if(e.origin === "http://www.mywebsite.net"){
        var newHeight = e.data + 35;
        document.getElementById("myIframeID").style.height = newHeight + "px";
        }
    }

window.addEventListener("message", receiveSize, false);    

var inactivityTime = function () {
    var t;
    idleTime = 30000;
    idleUnit = 1000;

    self.port.on("getIdleTime", function(time){
        //console.log("getIdleTime: " + time);
        idleTime = time;
        //console.log("idleTime: " + idleTime);
    })

    self.port.on("getIdleUnit", function(unit){
        //console.log("getIdleUnit: " + unit);
        idleTime = idleTime * (unit * 1000); //convert seconds to milliseconds
        //console.log("idleUnit: " + unit);
        document.onload = setTimer(idleTime);
    })

    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // catches touchscreen presses
    window.onclick = resetTimer;     // catches touchpad clicks
    window.onscroll = resetTimer;    // catches scrolling with arrow keys
    window.onkeypress = resetTimer;

    /*window.onblur = ;
    window.onfocus = ;*/

    function logout(modifier) {
        console.log("page is now idle");
        self.port.emit("script-response", "logout");
    }

    function setTimer(){
        console.log("setTime: " + idleTime);
        //var x = false;
        t = setTimeout(logout, idleTime);

        console.log(new Date().toTimeString() + ": timer set to " + idleTime);
    }

    function resetTimer() {
        clearTimeout(t); 
        console.log("resetTimer: " + idleTime);
        
        
        t = setTimeout(logout, idleTime);
        console.log(new Date().toTimeString() + ": active");
    }

    /*function onBlur() {
        if()
    }*/
};

inactivityTime();
