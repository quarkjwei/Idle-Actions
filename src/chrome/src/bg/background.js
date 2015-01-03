// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//close actions should happen per page. But goto (except for current) should only occur once.

var close= {type: "close"}
//goto takes a modifier w/ enum of "tab", "window",and "matched"
//tab opens specified url in a new tab
//window opens specified url in a new window
//matched opens specified url in the matched tab(s)
var logoutGoogle = {type: "goto", target: "https://accounts.google.com/logout", modifier: "tab"};
var homeGithub = {type: "goto", target: "http://github.com/", modifier: "matched"};
var routerPage = {type: "goto", target: "http://192.168.1.1/"};
//modifier is delay in ms. Window closes once url is loaded, plus delay.
var github = {type: "gotoandclose", target: "http://github.com/", modifier: "1000"};

//Targets are defined using match-patterns, for now.
var instruction1 = {
  target: "*://mail.google.com/*",
  time: 15,
  actions: [logoutGoogle]
};
var instruction2 = {
  target: "*://github.com/*",
  time: 15,
  actions: [github]
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
  else if(action.type == "goto"){
    if(!action.modifier)
      action.modifier = "matched";
    if(action.modifier == "matched")
      chrome.tabs.update(tabId, {url: action.target});
    else if(action.modifier == "tab")
      chrome.tabs.create({url: action.target});
    else if(action.modifier == "window")
      chrome.windows.create({url: action.target})
  }
  else if(action.type == "gotoandclose"){
    if(!action.modifier)
      action.modifier = 0;
    chrome.tabs.create({url: action.target}, function(tab){
      var tabid = tab.id;
      chrome.tabs.onUpdated.addListener(function(tabid, changeInfo){
        if(changeInfo.status == "complete"){
          setTimeout(function(){chrome.tabs.remove(tab.id);}, action.modifier);
        }
      });
    });
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
