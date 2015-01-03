require("sdk/ui/button/action").ActionButton({
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
}

// Import the page-mod API
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
 
// Create a page mod
// It will run a script whenever a pattern is matched with the below array
// The script goes to a URL after an idling time
pageMod.PageMod({
  include: ["*.org", "http://mail.google.com/*", "https://mail.google.com/*", "http://vcu.edu/*", "*.vcu.edu"],
  contentScriptFile: self.data.url("my-script.js"),
  //contentScript: 'document.body.innerHTML = ' +
  //               ' "<h1>Page matches ruleset</h1>";'
});