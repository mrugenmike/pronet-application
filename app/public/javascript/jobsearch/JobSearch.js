var paginator;
var listingsPerPage = 3;

$(document).ready(function(){
$("#searchButton").click(handleSearch);

});
/*
*
* "positionTitle": "Software Engineer",
 "jobId": "job1",
 "companyName": "Ebay",
 "companyLogoUrl": "ebay.com/jpg",
 "positionLocation": "San Francisco"
* */
function handleSearch(){
    var searchTerm = $("#searchBox").val();
    if(searchTerm){
        searchJobListings(searchTerm,0,listingsPerPage).then(function (joblistings) {
            if(joblistings){
                enablePagination(joblistings.totalTerms)
                renderJobListings(joblistings.listings,searchTerm,joblistings.totalTerms);
            }
        });

    }else{
        $("#searchBox").val("Please enter a search term").addClass("alert-danger");
    }
}

function renderJobListings(jobListings,searchTerm,totalTerms) {
    if(jobListings){
        var searchTemplate = jQuery("#listingcount");
        var jobListingContainer = jQuery("#jobListingsContainer");
        jobListingContainer.empty(); // remove the existing jobs
        jobListingContainer.css("display","");
        searchTemplate.children("h4").html("Found "+totalTerms+" results for <i>"+searchTerm+"</i>");
        jobListingContainer.append(searchTemplate);
        jobListings.forEach(function(listing){
    var div = '<div class="row" name="listing" class="listingTemplate"><div class="blockquote-box blockquote-primary clearfix col-md-offset-2"> <div class="square pull-left" name="company-img-div"> <img src='+listing.companyLogoUrl+' class="img-thumbnail"/> </div> <h4 name="position-title">'+listing.positionTitle+'</h4> <p name="description">'+listing.description+'</p> </div> </div>';
    jobListingContainer.append(div);
    });
    }
}
// return promise- this is an async return type
function searchJobListings(searchTerm,skip,limit){
    if(searchTerm){
        return $.ajax({
            dataType: "json",
            cache:false,
            url: "/jobs/listings/" + searchTerm+"/"+skip+"/"+limit
        });
    }
}

function enablePagination(totalResults){
    var totalPages = ((totalResults-1)/listingsPerPage)+1;

    var options = {
        currentPage: 1,
        pages: totalPages,
        onPageClicked: function(element,callback){
            var page = parseInt($(element).text());
            var skip =(page-1)*listingsPerPage ;
            var limit =listingsPerPage-1 ;
            var searchBox = $("#searchBox");
            var url="/jobs/listings/" + searchBox.val()+"/"+skip+"/"+limit;
            $.ajax({
                dataType: "json",
                cache:false,
                url: url
            }).done(function(jobListings){
                if(jobListings){
                    console.log(jobListings);
                    renderJobListings(jobListings.listings,searchBox.val(),jobListings.totalTerms);
                }
            });
        }
    }

    var paginationElem = $(".pagination");
    paginationElem.empty();

    paginator = new pagination.BootStrap(paginationElem,options);
    paginator.paginate();
};






