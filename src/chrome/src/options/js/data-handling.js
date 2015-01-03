$(document).ready(function() {
  //Buttons
  //Add Items
  $(".add-item").click(function(){
    var panel = $("#templates").children(":nth-child(1)").clone();
    var urlGroup = $("#templates").children(":nth-child(2)").clone();
    var actionGroup = $("#templates").children(":nth-child(3)").clone();
    panel.find(".url-container").html(urlGroup);
    panel.find(".action-container").html(actionGroup);
    panel.hide();
    $("form").append(panel);
    panel.slideDown();
  });
  //Remove Items
  $("body").on("click", ".remove-item", function(){
    $(this).parentsUntil("form").last().slideUp(function(){
      $(this).parentsUntil("form").last().remove();
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
  //
  $("body").on("change", ".form-control", function(){
    alert();
  });
});