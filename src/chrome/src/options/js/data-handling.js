$(document).ready(function() {
  $("body").on("click", ".remove-item", function(){
    $(this).parent().parent().remove();
  });
  $(".add-item").click(function(){
    $("#template").children().first().clone().appendTo("form");
  });
});
