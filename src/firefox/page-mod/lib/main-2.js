require("sdk/ui/button/action").ActionButton({
  id: "list-tabs",
  label: "List Tabs",
  icon: "./icon-16.png",
  onClick: listTabs
});

//onClick
function listTabs() {
  var tabs = require("sdk/tabs");
  //tabs.open("http://twitter.com");
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
}

// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
//var tabs = require("sdk/tabs");

//use this to pull preferences from the simple-prefs sdk
var preferences = require("sdk/simple-prefs").prefs;

console.log(preferences.idleUnit);
console.log(preferences.urlList);
 
var tabs = require("sdk/tabs");

var worker = tabs.activeTab.attach({
    contentScriptFile: self.data.url("my-script.js")
  });
worker.port.emit("getIdleTime", preferences.idleTime);
worker.port.emit("getIdleUnit", preferences.idleUnit);

/*tabs.on('activate', function(tab){
  tab.attach({
    contentScriptFile: self.data.url("my-script.js"),
    
  })
})

tabs.on('open', function(tab){
  tab.attach({
    contentScriptFile: self.data.url("my-script.js"),
  })
})

tabs.on('deactivate', function(tab){
  tab.attach({
    contentScriptFile: self.data.url("my-script.js"),
    worker.port.emit("deactivate", "deactivate");
  })
})*/

function onOpen(tab) {
  console.log(tab.url + " is open");
  tab.on("pageshow", logShow);
  tab.on("activate", logActivate);
  tab.on("deactivate", logDeactivate);
  tab.on("close", logClose);
}

function logShow(tab) {
  console.log(tab.url + " is loaded");
}

function logActivate(tab) {
  console.log(tab.url + " is activated");
  tab.attach({
    contentScriptFile: self.data.url("my-script.js"),
  });
}

function logDeactivate(tab) {
  console.log(tab.url + " is deactivated");
  tab.attach({
    contentScriptFile: self.data.url("my-script.js"),
  });
  worker.port.emit("deactivate", "deactivate");
}

function logClose(tab) {
  console.log(tab.url + " is closed");
}

tabs.on('open', onOpen);
