var items, counter;
chrome.storage.local.get("itemset", function(result){
    items = result.itemset;
    items.sort(function(a, b){return a["time"]-b["time"]});
    counter = 0;
    chrome.idle.setDetectionInterval(items[counter]["time"]);
});

//Chrome idle listener
chrome.idle.onStateChanged.addListener(function(newState) {
  if(newState == "idle") {
    //Query tabs that match items[counter]
    applyInstructionToTabs(items[counter]);
    //We just executed the first action so set up the next action for the chrome idle listener.
    if(counter + 1 < items.length){
      counter++;
      if(items[counter]["time"] == items[counter-1]["time"]){
        applyInstructionToTabs(items[counter]);
      }
      else{
        chrome.idle.setDetectionInterval(items[counter]["time"]);
      }
    }
  }
  chrome.idle.queryState(15, function(newState){
    if(newState == "active")
      counter = 0;
  });

});

function performAction(action, tabId, first){
  if(action["type"] == "Goto/Close"){

    if(action["target"]["window"] == "Matched Tabs"){
      chrome.tabs.update(tabId, {url: action["target"]["url"]}, function(tab){
        if(action["modifier"]["type"] == "Close")
          closeTab(tab.id, action["modifier"]["value"]);
      });
    }
    else if(first){
      console.log(action["target"]["window"])
      if(action["target"]["window"] == "New Tab"){
        chrome.tabs.create({url: action["target"]["url"]}, function(tab){
          if(action["modifier"]["type"] == "Close")
            closeTab(tab.id, action["modifier"]["value"]);
        });
      }
      if(action["target"]["window"] == "New Window"){
        chrome.windows.create({url: action["target"]["url"]}, function(awindow){
          if(action["modifier"]["type"] == "Close")
            closeTab(awindow.tabs[0].id, action["modifier"]["value"]);
        })
      }
    }
  }
}

function applyInstructionToTabs(item){
  chrome.tabs.query({url: item["matchPatterns"]}, function(tabs) {
    //For matched tabs carry out the actions
      if(tabs!=null){
      var first;
      for(var i = 0; i < item["actions"].length; i++){
        first = true;
        for(var j = 0; j < tabs.length; j++){
          performAction(item["actions"][i], tabs[j].id, first);
          first = false;
        }
      }
    }
  });
}
function closeTab(tabId, delay){
  var tab = tabId;
  chrome.tabs.onUpdated.addListener(function(tab, changeInfo){
    if(changeInfo.status == "complete"){
      setTimeout(function(){chrome.tabs.remove(tabId);}, delay);
    }
  });
}
