$(document).ready(function() {
  $("body").on("click", ".remove-item", function(){
    $(this).parentsUntil("form").remove();
  });
  $(".add-item").click(function(){
    var panel = $("#template").children(":nth-child(1)").clone();
    var formGroup = $("#template").children(":nth-child(2)").clone();
    panel.find(".panel-body").append(formGroup);
    $("form").append(panel);
  });
  $("body").on("click", ".add-url-pattern", function(){
    addNewFormGroup.call(this, "url-pattern");
  });
  $("body").on("click", ".add-action", function(){
    addNewFormGroup.call(this, "action");
  });
  $("body").on("click", ".remove-url-pattern", function(){
    //If need to remove formGroup
    removeFormGroup.call(this, "url-pattern");
    //If need to make url-pattern span invisible
  });
  $("body").on("click", ".remove-action", function(){
    //If need to remove formGroup
    removeFormGroup.call(this, "action");
    //If need to make action span invisible
  });
});
function addNewFormGroup(type){
  var invisibleUrlPatterns = $(".remove-url-pattern").parentsUntil(".form-group", ".invisible");
  var invisibleActions = $(".remove-action").parentsUntil(".form-group", ".invisible");
  if(type == "url-pattern" && invisibleUrlPatterns.length){
    invisibleUrlPatterns.last().removeClass("invisible");
    return;
  } else if(type == "action" && invisibleActions.length){
    invisibleActions.last().removeClass("invisible");
    return;
  }
  var formGroup = $("#template").children(":nth-child(2)").clone();
  formGroup.find(".display-once").addClass("invisible");
  formGroup.find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
  formGroup.find(".add-action").removeClass("add-action").addClass("remove-action");
  formGroup.find(".add-url-pattern").removeClass("add-url-pattern").addClass("remove-url-pattern");

  if(type == "url-pattern"){
    formGroup.find(".remove-action").parentsUntil(".form-group", ".input-group").addClass("invisible");
  } else if(type == "action") {
    formGroup.find(".remove-url-pattern").parentsUntil(".form-group", ".input-group").addClass("invisible");
  }

  $(this).parent().parent().parent().parent().append(formGroup);
}
function removeFormGroup(type){
  var invisibleUrlPatterns = $(".remove-url-pattern").parentsUntil(".form-group", ".invisible");
  var invisibleActions = $(".remove-action").parentsUntil(".form-group", ".invisible");
  if(type == "url-pattern" && invisibleUrlPatterns.length){
    $(this).parentsUntil(".form-group", ".input-group").addClass("invisible");
    return;
  } else if(type == "action" && invisibleActions.length){
    $(this).parentsUntil(".form-group", ".input-group").addClass("invisible");
    return;
  }
}
