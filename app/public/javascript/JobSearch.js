$(document).ready(function(){
$("#searchButton").click(searchJobListings);
});
/*
*
* "positionTitle": "Software Engineer",
 "jobId": "job1",
 "companyName": "Ebay",
 "companyLogoUrl": "ebay.com/jpg",
 "positionLocation": "San Francisco"
* */
function renderJobListings(jobListings,searchTerm) {
    if(jobListings){
    var jobListingContainer = jQuery("#jobListingsContainer");
    jobListingContainer.css("display","");
    jobListingContainer.empty(); // remove the existing jobs
    var searchTemplate = jQuery("#listingcount");
    searchTemplate.children("h4").text("Found "+20+" for search term");
    jobListings.forEach(function(listing){
    var div = '<div class="row" name="listing" class="listingTemplate">' +
        '<div class="blockquote-box blockquote-primary clearfix col-md-offset-2"> ' +
        '<div class="square pull-left" name="company-img-div"> ' +
        '<img src='+listing.companyLogoUrl+' class="img-thumbnail"/> </div> ' +
        '<h4 name="position-title">'+listing.positionTitle+'</h4> ' +
        '<p name="description">'+listing.description+'</p> </div> ' +
        '</div>';
    jobListingContainer.append(div);
    });
    }
}
function searchJobListings(event){
    var searchTerm = $("#searchBox").val();
    if(searchTerm){
        var ajax = $.ajax({
            dataType: "json",
            url: "/jobs/listings/" + searchTerm
        });
        ajax.success(function (joblistings) {
            renderJobListings(joblistings,searchTerm);
        })
    }else{
        $("#searchBox").val("Please enter a search term").addClass("alert-danger");
    }
}



