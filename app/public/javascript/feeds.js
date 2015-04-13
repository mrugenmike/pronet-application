/**
 * Created by varuna on 4/7/15.
 */
$(document).ready(function(){

    $("#posttext").hide();

    $("#postfeeds").click(function () {
        $("#posttext").show();
    });

    console.log(data1);
    console.log(data1.length);
    console.log(ID);

    for(i=0 ; i<data1.length ; i++)
    {
        var ahref;
        var namehref;
        if(data1[i].feed_role == 'C')
        {
            ahref = ' <a class="pull-left" href="/company/'+ data1[i].user_id+'">';
            namehref = '<a href="/company/'+ data1[i].user_id+'">';
        }
        else
        {
            ahref = ' <a class="pull-left" href="/user/'+ data1[i].user_id +'">';
            namehref = '<a href="/user/'+ data1[i].user_id+'">';
        }

        var del="";
        if(ID == data1[i].user_id)
        {
            del='<div>' +
            '<button  class="btn btn-xs btn-primary btn-action pull-right" id="deletebutton" type="submit"' +
            ' name="feedID" value ="' + data1[i].feed_id + '" id="' + data1[i].feed_id +'"><span class="glyphicon glyphicon-trash"></span></button></div>'
        }
        console.log(data1[i].feed_id);
        var divTag = '<div class="media block-update-card">' + ahref +
            '<img class="media-object update-card-MDimentions" src="'+ data1[i].user_img +'" alt="..."></a>' +
            '<div class="media-body update-card-body">'+ namehref +
            '<h4 class="media-heading">'+ data1[i].user_name+'</h4></a>' +
            '<h5 class="media-heading">'+ data1[i].feed_title+'</h5>' +
            '<p>'+ data1[i].feed_description+'</p> ' +
            '</div>' +
            '<div class="card-action-pellet btn-toolbar pull-right" role="toolbar"> '+del+
            '</div> </div> <div class="row"> </div> <br> <div> </div>';
        $("#postsfeeds").append(divTag);
    }
});