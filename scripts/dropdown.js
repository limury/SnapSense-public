$(function() {
    $("#dropdown div a").click(function() {
        var clr = $(this).attr("clr");
        $("#btn1").text($(this).text());
        $("#btn1").attr("class", "btn dropdown-toggle " + clr)

    });

});