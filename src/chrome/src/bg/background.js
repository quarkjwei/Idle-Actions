// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//close actions should happen per page. But goto (except for current) should only occur once.

var close= {type: "close"}
//goto takes a modifier w/ enum of "tab", "window",and "matched"
//tab opens specified url in a new tab
//window opens specified url in a new window
//active opens specified url in the active tab
//matched opens specified url in the matched tab(s)
var logoutGoogle = {type: "goto", target: "https://accounts.google.com/logout", modifier: "tab"}
var homeGithub = {type: "goto", target: "http://github.com/", modifier: "matched"}


//Targets are defined using match-patterns, for now.
var instruction1 = {
  target: "*://mail.google.com/*",
  time: 20,
  actions: [close, logoutGoogle]
};
var instruction2 = {
  target: "*://github.com/*",
  time: 15,
  actions: [homeGithub]
};

var instructions = [
  instruction1,
  instruction2
];

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

  //sort actions by time (ascending)
  instructions.sort(function(a, b){return a.time-b.time});

  var counter = 0;
  chrome.idle.setDetectionInterval(instructions[counter].time);


  chrome.idle.onStateChanged.addListener(function(newState) {

    if(newState == "idle") {
      //Query tabs that match instructions[counter]
      applyInstructionToTabs(instructions[counter]);
      //If there are still actions remaining
      if(counter + 1 < instructions.length){
        counter++;
        if(instructions[counter].time == instructions[counter-1].time){
          applyInstructionToTabs(instructions[counter]);
        }
        else{
          chrome.idle.setDetectionInterval(instructions[counter].time);
        }
      }
    }
    chrome.idle.queryState(15, function(newState){
      if(newState == "active")
        counter = 0;
    });

  });

function performAction(action, tabId){
  if(action.type == "close"){
    chrome.tabs.remove(tabId);
  }
  else if(action.type=="goto"){
    if(action.modifier == "tab")
      chrome.tabs.create({url: action.target});
    if(action.modifier == "window")
      chrome.windows.create({url: action.target})
    if(action.modifier == "matched")
      chrome.tabs.update(tabId, {url: action.target});
  }
}

function applyInstructionToTabs(instruction){
  chrome.tabs.query({url: instruction.target}, function(tabs) {
    //For matched tabs carry out the actions
      if(tabs!=null){
      for(var i = 0; i < tabs.length; i++){
        for(var j = 0; j < instruction.actions.length; j++){
          performAction(instruction.actions[j], tabs[i].id);
        }
      }
    }
  });
}
