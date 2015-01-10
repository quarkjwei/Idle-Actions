
//Targets are defined using match-patterns, for now.
var instruction1 = {
  matchPatterns: "none",
  time: 15
};

var instructions = [instruction1];
chrome.storage.local.get("itemset", function(result){
  instructions = result.itemset;
  if(instructions.length < 1)
    throw new Error("There are no instructions to follow!");
});
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

  //sort actions by time (ascending)
  instructions.sort(function(a, b){return a["time"]-b["time"]});

  var counter = 0;
  chrome.idle.setDetectionInterval(instructions[counter]["time"]);


  chrome.idle.onStateChanged.addListener(function(newState) {

    if(newState == "idle") {
      //Query tabs that match instructions[counter]
      applyInstructionToTabs(instructions[counter]);
      //If there are still actions remaining
      if(counter + 1 < instructions.length){
        counter++;
        if(instructions[counter]["time"] == instructions[counter-1]["time"]){
          applyInstructionToTabs(instructions[counter]);
        }
        else{
          chrome.idle.setDetectionInterval(instructions[counter]["time"]);
        }
      }
    }
    chrome.idle.queryState(15, function(newState){
      if(newState == "active")
        counter = 0;
    });

  });

function performAction(action, tabId){
  if(action.type == "Close"){
    chrome.tabs.remove(tabId);
  }
  else if(action.type == "Goto"){
    if(!action.modifier)
      action.modifier = "Matched Tabs";
    if(action.modifier == "Matched Tabs")
      chrome.tabs.update(tabId, {url: action.target});
    else if(action.modifier == "New Tab")
      chrome.tabs.create({url: action.target});
    else if(action.modifier == "New Window")
      chrome.windows.create({url: action.target})
  }
  else if(action.type == "Goto and Close"){
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
  chrome.tabs.query({url: instruction.matchPatterns}, function(tabs) {
    //For matched tabs carry out the actions
      if(tabs!=null){
      for(var i = 0; i < instruction.actions.length; i++){
        for(var j = 0; j < tabs.length; j++){
          performAction(instruction.actions[j], tabs[i].id);
        }
      }
    }
  });
}
