
$(document).ready(function(){

    $("#companyName").hide();
    $("#firstName").show();
    $("#lastName").show();

    $("input:radio[name=role]").click(function (){

        var role = $('input:radio[name=role]:checked').val();
        console.log(role);

        if(role=="U")
        {
            $("#companyName").hide();
            $("#firstname").show();
            $("#lastname").show();
        }
        else
        {
            $("#companyName").show();
            $("#firstname").hide();
            $("#lastname").hide();
        }

    });
});
