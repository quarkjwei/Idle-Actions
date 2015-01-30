/*require("sdk/ui/button/action").ActionButton({
  id: "list-tabs",
  label: "List Tabs",
  icon: "./icon-16.png",
  onClick: listTabs
});

//onClick
function listTabs() {
  var tabs = require("sdk/tabs");
  tabs.open("http://twitter.com");
  for (let tab of tabs)
  {
    runScript(tab);
    console.log(tab.url);
  }
}
 
function runScript(tab) {
  tab.attach({
    contentScript: "document.body.style.border = '5px solid red';"
  });
}*/

// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");

//use this to pull preferences from the simple-prefs sdk
var preferences = require("sdk/simple-prefs").prefs;
 
// Create a page mod
// It will run a script whenever a pattern is matched with the below array
// The script goes to a URL after an idling time
pageMod.PageMod({
  include: ["*.vcu.edu"],
  contentScriptFile: self.data.url("my-script.js"),

  onAttach: function(worker) {
    var time = preferences.idleTime;
    var unit = preferences.idleUnit;
    var list = preferences.urlList;

    var urlList = list.split(",");

    worker.port.emit("getIdleTime", time);
    worker.port.emit("getIdleUnit", unit);
    
    worker.port.on("script-response", function(response){
      for(var x = 0; x < urlList.length; x++)
      {
        tabs.open({
          url: urlList[x],
          inBackground: true,
          onLoad: function close(tab){
            tab.close();
          }
        });
      }  
      notifications.notify({
        text: "You were logged out",
      });
    });
  }
});

//*.vcu.*