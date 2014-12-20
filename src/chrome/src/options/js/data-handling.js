$(document).ready(function() {
  $("body").on("click", ".remove-item", function(){
    $(this).parent().parent().remove();
  });
  $(".add-item").click(function(){
    var panel = $("#template").children(":nth-child(1)").clone();
    var formGroup = $("#template").children(":nth-child(2)").clone();
    panel.find(".panel-body").append(formGroup);
    $("form").append(panel);
  });
  $("body").on("click", ".add-url-pattern", function(){
    //If need to add new formGroup
    addNewFormGroup.call(this, "url-pattern");
    //If need to make url-pattern span visible
  });
  $("body").on("click", ".add-action", function(){
    //If need to add new formGroup
    addNewFormGroup.call(this, "action");
    //If need to make action span visible
  });
  $("body").on("click", ".remove-url-pattern", function(){
    //If need to remove formGroup

    //If need to make url-pattern span invisible
  });
  $("body").on("click", ".remove-action", function(){
    //If need to remove formGroup

    //If need to make action span invisible
  });
});
function addNewFormGroup(type){
  var formGroup = $("#template").children(":nth-child(2)").clone();
  formGroup.find(".display-once").addClass("invisible");
  formGroup.find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
  formGroup.find(".add-action").removeClass("add-action").addClass("remove-action");
  formGroup.find(".add-url-pattern").removeClass("add-url-pattern").addClass("remove-url-pattern");
  if(type == "url-pattern"){
    formGroup.find(".remove-action").parent().parent().addClass("invisible");
  } else if(type == "action") {
    formGroup.find(".remove-url-pattern").parent().parent().addClass("invisible");
  }
  $(this).parent().parent().parent().parent().append(formGroup);
}
