/**
 * Created by varuna on 4/2/15.
 */
$(document).ready(
function() {
    $("#foll").click(function () {
        var f;
        if($("#foll").text() == "Connect")
        {
            f = "Follow";
            $("#foll").text("Connected");
            var fc =parseInt($("#followerCount").val())+1;
            //console.log(fc);
            $("#followerCount").val(fc);
            //console.log(fc);
            $("#displayfc").text(fc+" connections");
        }
        else
        {
            f = "UnFollow";
            $("#foll").text("Connect");
            var fc =parseInt($("#followerCount").val())-1;
            //console.log(fc);
            $("#followerCount").val(fc);
            //console.log(fc);
            $("#displayfc").text(fc+" connections");
        }

        var val1 = $("#sampleID").val() + "|" + f;
        $("#thisID").val(val1);
    });
});
