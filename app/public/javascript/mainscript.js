$(document).ready(

function() {

    $("button[type='submit']").hide();
    $("#imagesubmit").show();
    //$("#foll").show();
    // Edit button
    $("button[type='button']").click(function () {
        var parent = $(this).parent();
        var oldtext = $(parent).children(".ed").text();
        var titles = ["Name", "Role", "Region", "Education", "Work Experience", "Summary", "Education Details", "Skills", "Certification"];
        var oldname = "";

        $(parent).children(".ed").each(function () {
            $.each(this.attributes, function () {
                // this.attributes is not a plain object, but an array
                // of attribute nodes, which contain both the name and value
                if (this.specified) {
                    if (this.name == 'name')
                        oldname = this.value;
                }
            });
        });

        console.log("Hi " + oldname + " "+oldtext);
        //$("#editedText").remove();
        if ($(parent).children("textarea").length == 0) {
            var newsum = document.createElement("textarea");
            $(newsum).attr("style", "width:70%;");
            $(newsum).insertBefore(this);
            $(newsum).attr("name", oldname);
            $(newsum).attr("value", oldtext);
            $(newsum).text(oldtext);

            if ($.inArray(oldtext, titles) != -1) {
                $(newsum).text("");
                //$(newsum).text(oldtext);
            }

        }
        else {
            var textbox = $(parent).children("textarea");
            $(textbox).attr("name", oldname);
            console.log(titles.indexOf(oldtext));
            //if(titles.indexOf(oldtext) == -1)
            if ($.inArray(oldtext, titles) == -1)
                $(textbox).text(oldtext);
            else
                $(textbox).text("");
            $(textbox).show();
        }

        $(parent).children(".ed").hide();
        //$(this).("Save");
        $(this).hide();
        $(parent).children("button[type='submit']").show();
    });

    $("button[type='submit']").click(function () {
        var parent = $(this).parent();
        var textbox = $(parent).children("textarea, input:file");
        //console.log("hi"+parent);
        console.log(textbox.text());
        console.log(textbox.val());
        var oldtext = $(textbox).val();
        //$("#editedText").remove();
        $(textbox).hide();
        $(parent).children(".ed").text(oldtext);
        $(parent).children(".ed").show();
        $(this).hide();
        $("#imagesubmit").show();
        $(parent).children("button[type='button']").show();
    });

    $("#changeimage").change(function() {

        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#userpic').attr('src', e.target.result);
            };
            console.log(typeof (this.files[0]));
            reader.readAsDataURL(this.files[0]);
        }
    });

    //$("input:file").change(function(){
    //    $('form').submit();
    //})
});