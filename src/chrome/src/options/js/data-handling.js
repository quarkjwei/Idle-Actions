$(document).ready(function() {
  //Load Data
  chrome.storage.local.get("itemset", function(result){
    var itemset = result.itemset;
    if(itemset.length > 0)
      loadData(itemset);
  });
  //Buttons
  //Add Items
  $(".add-item").click(function(){
    var panel = $("#templates").children(":nth-child(1)").clone();
    var urlGroup = $("#templates").children(":nth-child(2)").clone();
    var actionGroup = $("#templates").children(":nth-child(3)").clone();
    panel.find(".url-container").html(urlGroup);
    panel.find(".action-container").html(actionGroup);
    panel.find(".index").html($(".index").length);
    panel.addClass('item');
    panel.hide();
    $("form").append(panel);
    actionGroup.find(".action-type").trigger('change');
    panel.slideDown();
  });
  //Remove Items
  $("body").on("click", ".remove-item", function(){
    $(this).parentsUntil("form").last().slideUp(function(){
      $(this).remove();
      $("span.index").html(function(index, oldhtml){
      return index + 1;
      });
    });
  });
  //Add URL Pattern
  $("body").on("click", ".add-url-pattern", function(){
    var urlGroup = $("#templates").children(":nth-child(2)").clone();
    urlGroup.find(".display-once").addClass("invisible");
    urlGroup.find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    urlGroup.find(".add-url-pattern").removeClass("add-url-pattern").addClass("remove-url-pattern");
    urlGroup.hide();
    $(this).parentsUntil(".panel-body").last().append(urlGroup);
    urlGroup.slideDown();
  });
  //Add Action
  $("body").on("click", ".add-action", function(){
    var actionGroup = $("#templates").children(":nth-child(3)").clone();
    actionGroup.find(".display-once").addClass("invisible");
    actionGroup.find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    actionGroup.find(".add-action").removeClass("add-action").addClass("remove-action");
    actionGroup.hide();
    $(this).parentsUntil(".panel-body").last().append(actionGroup);
    actionGroup.find(".action-type").trigger('change');
    actionGroup.slideDown();

  });
  //Remove URL Pattern
  $("body").on("click", ".remove-url-pattern", function(){
    var marked = $(this).parentsUntil(".url-container").last();
    marked.slideUp(function(){
      marked.remove();
    });
  });
  //Remove Action
  $("body").on("click", ".remove-action", function(){
    var marked = $(this).parentsUntil(".action-container").last();
    marked.slideUp(function(){
      marked.remove();
    });
  });
  //Changed Action
  $("body").on("change", ".action-type", function(){
    var value = $(this).val();
    $(this).parent().nextAll().remove();
    if(value == "Goto/Close") {
      var inputGroup = $("#action_templates").children(":nth-child(1)").html();
      $(this).parent().after(inputGroup);
    }
  });
  //Checkbox hider
  $("body").on("change", ".hider", function(){
    var hidee = $(this).closest('div').next('.hidee');
    if(hidee.css('display') == "none"){
      hidee.slideDown();
    }
    else{
      hidee.slideUp();
    }
  });
  //Fixers
  $("body").on("focusout", ".idle-time", function(){
    var value = $(this).val();
    if(value < 15) {
      $(this).val(15);
    }
    else {
      $(this).val(Math.round(value));
    }
  });
  $(".save-button").click(function(){
    var itemset = JSONifyData();
    chrome.storage.local.set({'itemset': itemset}, function(){
    });
  });
  //Import
  $(".import-button").click(function(){
    if($("#footer-popup").is(":visible")){
      var repeat = $('#footer-popup').hasClass('export');
      $("#footer-popup").slideUp(function(){
        $("#footer-popup").html('');
        $(".footer").css("height", "");
        $("#footer-popup").removeClass();
        if(repeat)
          $(".import-button").click();
      });
    }
    else{
      $(".footer").css("height", "auto");
      $("#footer-popup").addClass('import');
      $("#footer-popup").html('<p>Importing data will add to existing data. You must press the save button to save changes.</p>'
        +'<textarea class="code-box form-control"></textarea>');
      $("#footer-popup").append('<button type="button" class="btn btn-primary submit-import-button">'
        +'Submit'
      +'</button>');
      $("#footer-popup").slideDown();
    }
  });
  //Submit Import Button
  $("body").on("click", ".submit-import-button", function(){
    var data = $('.footer').find('.code-box').val();
    data = JSON.parse(data);
    loadData(data);
  });
  //Export
  $(".export-button").click(function(){
    if($("#footer-popup").is(":visible")){
      var repeat = $('#footer-popup').hasClass('import');
      $("#footer-popup").slideUp(function(){
        $("#footer-popup").html('');
        $(".footer").css("height", "");
        $("#footer-popup").removeClass();
        if(repeat)
          $(".export-button").click();
      });
    }
    else{
      $(".footer").css("height", "auto");
      var JSONString = JSON.stringify(JSONifyData(), null, "\t");
      $("#footer-popup").addClass('export');
      $("#footer-popup").html('<pre class="code-box">'+JSONString+'</pre>');
      $("#footer-popup").slideDown();
    }
  });

});
//Select all text for export codebox
$("body").on("focusin", ".code-box", function(){
  $(this).select();
});
function loadData(itemset){
  var existing = $(".item").length;
  for(var i = 0; i < itemset.length; i++){
    //Fill the url-pattern fields
    $(".add-item").click();
    var item = $(".item").eq(i + existing);
    for(var j = 0; j < itemset[i]["matchPatterns"].length; j++){
      if(j > 0)
        item.find(".add-url-pattern").click();
      item.find(".url-pattern").eq(j).val(itemset[i]["matchPatterns"][j]);
    }
    //Fill the idle time field
    item.find(".idle-time").val(itemset[i]["time"]);
    //Fill the action fields
    for(var j = 0; j < itemset[i]["actions"].length; j++){
      var action = itemset[i]["actions"][j];
      if(j > 0)
        item.find(".add-action").click();
      var actionForm = item.find(".action-container").find(".form-group").eq(j);
      if(action["target"]["url"]){
        try{
          actionForm.find(".target-checkbox").find("input").click();
        }
        finally{
        actionForm.find(".target-url").val(action["target"]["url"]);
        actionForm.find(".target-window").val(action["target"]["window"]);
        }
      }
      if(action["modifier"]["type"]){
        try{
          actionForm.find(".modifier-type").find("input").click();
        }
        finally{
        actionForm.find(".modifier-type").val(action["modifier"]["type"]);
        actionForm.find(".modifier-value").val(action["modifier"]["value"]);
        }
      }
    }
  }
}
function JSONifyData(){
  var itemset = [];
    $(".item").each(function(){
      var item = new Object();
      item["datastructure"] = "FFv1";
      item.matchPatterns = [];
      $(this).find('.url-pattern').each(function(){
        item["matchPatterns"].push($(this).val());
      });

      item["time"] = parseInt($(this).find('.idle-time').val());

      item["actions"] = [];
      $(this).find('.action-container').find('.form-group').each(function(){
        var action = new Object();
        action["target"] = new Object();
        action["modifier"] = new Object();
        action["type"] = $(this).find('.action-type').val();
        if($(this).find('.target-url').is(':visible')){
          action["target"]["url"] = $(this).find('.target-url').val();
          action["target"]["window"] = $(this).find('.target-window').val();
        }
        if($(this).find('.modifier-type').find("input").is(':checked')){
          action["modifier"]["type"] = $(this).find('.modifier-type').text();
          action["modifier"]["value"] = $(this).find('.modifier-value').val();
        }
        item["actions"].push(action);
      });
      itemset.push(item);
    });
  return itemset;
}
function clearData(){

}