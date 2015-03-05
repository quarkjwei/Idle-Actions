// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var tabs = require("sdk/tabs");
var notifications = require("sdk/notifications");

//use this to pull preferences from the simple-prefs sdk
var preferences = require("sdk/simple-prefs").prefs;

var time = preferences.idleTime;
var unit = preferences.idleUnit;
var list = preferences.urlList;
var notificationPref = preferences.notification;

require("sdk/simple-prefs").on("", changePreference);

var urlList = list.split(",");

tabs.on('load', function(tab) {
  attachScript(tab);
});

/*tabs.on('deactivate', function(tab) {
  tab.worker.destroy();
  console.log("Worker destroyed");
});*/

tabs.on('activate', function(tab) {
  attachScript(tab);
})

function attachScript(tab) {
  console.log("Worker created for " + tab.title)
  var worker = tab.attach({
    contentScriptFile: self.data.url("my-script.js")
  });

  tab.on('deactivate', function(tab){
    worker.destroy();
    console.log("Worker destroyed for " + tab.title);
  })

  worker.port.on("script-response", function(response) {
    for(var x = 0; x < urlList.length; x++)
    {
      tabs.open({
        url: urlList[x],
        inBackground: true,
        onLoad: function closeTab(tab){
          tab.close();
        }
      });
    }  
    if(notificationPref == 1)
    {
      notifications.notify({
        text: "You are now idle.",
      });
    }
    worker.destroy();
  })

  worker.port.emit("getIdleTime", time);
  worker.port.emit("getIdleUnit", unit);
}

function changePreference(prefName) {
  console.log(prefName + " has changed value");

  time = preferences.idleTime;
  unit = preferences.idleUnit;
  list = preferences.urlList;
  notificationPref = preferences.notification;
}