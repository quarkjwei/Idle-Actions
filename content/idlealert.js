var IdleAlert = {
	prefs: null,
	idletime: 0,
	action: "",

	//initialize the extension
	startup: function(){
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("idlealert.");
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

		//when event occurs on preferences, observe() method is called
		this.prefs.addObserver("", this, false);

		this.refreshInformation();
		this.updateList();
		window.setInterval(this.refreshInformation, 10*60*1000);
	},

	//shut down, save prefs and turn off the observer
	shutdown: function(){
		this.prefs.removeObserver("", this);
	},

	//when an event occurs on the preferences
	observe: function(subject, topic, data){
		if(topic != "nsPref:change"){
			return;
		}

		switch(data){
			case "action":
      	  this.tickerSymbol = this.prefs.getCharPref("action");
      	  this.refreshInformation();
         	break;
      case "idletime":
      		this.idletime = this.prefs.getCharPref("idletime");
      		this.refreshInformation();
      		break;
      case "list":
      		this.updateList();
      		this.refreshInformation();
      		break;
		}
	},

	updateList: function(){
		var list = document.getElementById("urlList");
		while(list.firstChild){
			list.removeChild(list.firstChild);
		}

		var newList = IdleAlert.getList();
		newList.forEach(function(entry){
			let row = document.createElement("listitem");
			row.setAttribute(entry, entry);
			list.appendItem(row);
			//document.getElementById('urlList').appendItem(url, url);
			//document.getElementById('urlList').appendItem(entry, entry);
		});
	},


	getList: function() {
    var list = this.prefs.getCharPref("list");
    if (!list) {
      return [];
    }
    return list.split(";");
  },

  setList: function(list) {
    IdleAlert.mPrefs.setCharPref("extensions.idlealert.list",
                                   list.join(";"));
  },

  listEntrySelected: function(){
  	var removeButton = document.getElementById("listRemove");
  	var list = document.getElementById("urlList");
  	if(list.selectedItems.length) {
  		removeButton.setAttribute("disabled", "false")
  	} else{
  		removeButton.setAttribute("disabled", "true");
  	}
  },


	removeListEntry: function(){
		var list = document.getElementById("urlList");
		var newList = IdleAlert.getList();
		var self = this;
		list.selectedItems.forEach(function(item){
			var entry = item.getAttribute("label");
			var index = list.indexOf(entry);
			if(index == -1){
				return;
			}
			list.splice(index, 1);
		});
		IdleAlert.setList(newList);
	},


}
window.addEventListener("load", function(e) { IdleAlert.startup(); }, false);
window.addEventListener("unload", function(e) { IdleAlert.shutdown(); }, false);