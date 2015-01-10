$(document).ready(function() {
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
    if(value == "Goto") {
      var inputGroup = $("#action_templates").children(":nth-child(1)").html();
      $(this).parent().after(inputGroup);
    }
    else if (value == "Goto and Close") {
      var inputGroup = $("#action_templates").children(":nth-child(2)").html();
      $(this).parent().after(inputGroup);
    }
  });
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
    var itemset = [];
    $(".item").each(function(){
      var item = new Object();

      item.matchPatterns = [];
      $(this).find('.url-pattern').each(function(){
        item["matchPatterns"].push($(this).val());
      });

      item["time"] = $(this).find('.idle-time').val();

      item["actions"] = [];
      $(this).find('.action-container').find('.form-group').each(function(){
        var action = new Object();
        action["type"] = $(this).find('.action-type').val();
        if(action["type"] != "close"){
          action["target"] = $(this).find('.target').val();
          action["modifier"] = $(this).find('.modifier').val();
        }
        item["actions"].push(action);
      });
      itemset.push(item);
    });
    chrome.storage.local.set({'itemset': itemset}, function(){
    });
  });
});