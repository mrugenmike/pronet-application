$(document).ready(

    function() {
        for(i=0 ; i<data1.length ; i++)
        {
            var ahref;
            if(data1[i].followeeRole == 'C')
                ahref = ' <a href="/viewcompany/'+ data1[i].followeeID+'">';
            else
                ahref = ' <a href="/user/'+ data1[i].followeeID+'">';


            var divTag = '<div class="col-lg-2 col-sm-5 text-center">' + ahref +
                '<img class="img-circle img-responsive img-center" style = "width: 100px; height:100px;" src="'+ data1[i].followeeImgURL + '" alt=""></a>' +
                '<h4> ' + data1[i].followeeName + '</h4>' +
                '</div>';

            if(data1[i].followeeRole == 'C')
                $("#addcompanyfollow").append(divTag);
            else
                $("#adduserfollow").append(divTag);
        }
   });
