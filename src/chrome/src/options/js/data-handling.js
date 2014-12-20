$(document).ready(function() {
  $("body").on("click", ".remove-item", function(){
    $(this).parent().parent().remove();
  });
  $(".add-item").click(function(){
    var panel = $("#template").children().first().clone();
    var formGroup = $("#template").children(":nth-child(2)").clone();
    panel.find(".panel-body").append(formGroup);
    $("form").append(panel);
  });
});
