var paginator;
var listingsPerPage = 3;
var jobContainer = $("#jobListingsContainer");
var userContainer = $("#userListingsContainer");
var companyContainer = $("#companiesListingsContainer");

$(document).ready(function(){
$("#searchButton").click(handleSearch);
    $(".search-actions").click(function(event){
        var el = event.target;
        $("#categoryBtn").html(el.text+"        <span class='caret'></span>");
        $("#alert").hide();
    });

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
    var category = $("#categoryBtn").html();
    if(category.indexOf("Category")==-1){
        $("#alert").css("display","none");
        var searchTerm = $("#searchBox").val();
        if(searchTerm && category.indexOf("Jobs")!=-1){
            $("#searchBox").val("Please enter a search term").removeClass("alert-danger")
            searchJobListings(searchTerm,0,listingsPerPage).then(function (joblistings) {
                if(joblistings){
                    enablePagination(joblistings.totalTerms)
                    renderJobListings(joblistings.listings,searchTerm,joblistings.totalTerms);
                }
            });

        }else if(searchTerm && category.indexOf("Companies")!=-1){
            $("#searchBox").val("Please enter a search term").removeClass("alert-danger");
            searchCompaniesListing(searchTerm,0,listingsPerPage).then(function (companiesListings) {
                if(companiesListings){
                    enablePagination(companiesListings.totalEntries)
                    renderCompaniesListing(companiesListings.companyListings,searchTerm,companiesListings.totalEntries);
                }
            });
        }else if(searchTerm && category.indexOf("Users")!=-1){
            $("#searchBox").val("Please enter a search term").removeClass("alert-danger");
            searchUserListings(searchTerm,0,listingsPerPage).then(function (userListings) {
                if(userListings){
                    enablePagination(userListings.totalEntries)
                    renderUserListings(userListings.userListings,searchTerm,userListings.totalEntries);
                }
            });
        }
        else{
            $("#searchBox").val("Please enter a search term").addClass("alert-danger");
        }
    } else{
        $("#alert").show();
    }
}

function renderJobListings(jobListings,searchTerm,totalTerms) {
    if(jobListings){
        userContainer.hide();
        companyContainer.hide();
        var jobListingContainer = jQuery("#jobListingsContainer");
        var searchTemplate = jQuery("#listingcount");
        jobListingContainer.empty(); // remove the existing jobs
        jobListingContainer.css("display","");
        searchTemplate.children("h4").html("Found "+totalTerms+" results for <i>"+searchTerm+"</i>");
        jobListingContainer.append(searchTemplate);
        jobListings.forEach(function(listing){
    var div = '<div class="row" name="listing" class="listingTemplate"><div class="blockquote-box blockquote-primary clearfix col-md-offset-2"> <div class="square pull-left" name="company-img-div"> <img src='+listing.companyLogoUrl+' class="img-thumbnail"/> </div> <h4 name="position-title"><a href="/jobs/'+listing.jobId+'">'+listing.positionTitle+'</a></h4> <p name="description">'+listing.description+'</p> </div> </div>';
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
    var totalPages = (totalResults-1)/listingsPerPage+1;

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

    if($("#categoryBtn").html().indexOf("Users")!=-1){
        options = {
            currentPage: 1,
            pages: totalPages,
            onPageClicked: function(element,callback){
                var page = parseInt($(element).text());
                var skip =(page-1)*listingsPerPage ;
                var limit =listingsPerPage-1 ;
                var searchBox = $("#searchBox");
                var url="/users/listings/" + searchBox.val()+"/"+skip+"/"+limit;
                $.ajax({
                    dataType: "json",
                    cache:false,
                    url: url
                }).done(function(userListings){
                    if(userListings){
                        console.log(userListings);
                        renderUserListings(userListings.userListings,searchBox.val(),userListings.totalEntries);
                    }
                });
            }
        }
    }else{
        if($("#categoryBtn").html().indexOf("Companies")!=-1){
            options = {
                currentPage: 1,
                pages: totalPages,
                onPageClicked: function(element,callback){
                    var page = parseInt($(element).text());
                    var skip =(page-1)*listingsPerPage ;
                    var limit =listingsPerPage-1 ;
                    var searchBox = $("#searchBox");
                    var url="/companies/listings/" + searchBox.val()+"/"+skip+"/"+limit;
                    $.ajax({
                        dataType: "json",
                        cache:false,
                        url: url
                    }).done(function(companiesListings){
                        if(companiesListings){
                            console.log(companiesListings);
                            renderCompaniesListing(companiesListings.companyListings,searchBox.val(),companiesListings.totalEntries);
                        }
                    });
                }
            }
        }
    }
    var paginationElem = $(".pagination");
    paginationElem.empty();

    paginator = new pagination.BootStrap(paginationElem,options);
    paginator.paginate();
};

function renderUserListings(userListings,searchTerm,totalTerms) {
    if(userListings){
        jobContainer.hide();
        companyContainer.hide();
        var searchTemplate = jQuery("#userListingcount");
        var userListingContainer = jQuery("#userListingsContainer");
        userListingContainer.empty(); // remove the existing jobs
        userListingContainer.css("display","");
        searchTemplate.children("h4").html("Found "+totalTerms+" results for <i>"+searchTerm+"</i>");
        userListingContainer.append(searchTemplate);
        userListings.forEach(function(listing){
            var div = '<div class="row" name="listing" class="listingTemplate"><div class="blockquote-box blockquote-primary clearfix col-md-offset-2"> <div class="square pull-left" name="company-img-div"> <img src='+listing.logo+' class="img-thumbnail"/> </div> <h4 name="position-title"><a href="/users/'+listing.id+'">'+listing.name+'</a></h4> <p name="region">'+listing.region+'</p> </div> </div>';
            userListingContainer.append(div);
        });
    }
}

function renderCompaniesListing(companiesListing,searchTerm,totalTerms) {
    if(companiesListing){
        userContainer.hide();
        jobContainer.hide();
        var searchTemplate = jQuery("#companiesListingcount");
        var companiesListingContainer = jQuery("#companiesListingsContainer");
        companiesListingContainer.empty(); // remove the existing jobs
        companiesListingContainer.css("display","");
        searchTemplate.children("h4").html("Found "+totalTerms+" results for <i>"+searchTerm+"</i>");
        companiesListingContainer.append(searchTemplate);
        companiesListing.forEach(function(listing){
            var div = '<div class="row" name="listing" class="listingTemplate"><div class="blockquote-box blockquote-primary clearfix col-md-offset-2"> <div class="square pull-left" name="company-img-div"> <img src='+listing.logo+' class="img-thumbnail"/> </div> <h4 name="position-title"><a href="/companies/'+listing.id+'">'+listing.companyName+'</a></h4> <p name="description">'+listing.description+'</p> </div> </div>';
            companiesListingContainer.append(div);
        });
    }
}

function searchCompaniesListing(searchTerm,skip,limit){
    if(searchTerm){
        return $.ajax({
            dataType: "json",
            cache:false,
            url: "/companies/listings/" + searchTerm+"/"+skip+"/"+limit
        });
    }
}

function searchUserListings(searchTerm,skip,limit){
    if(searchTerm){
        return $.ajax({
            dataType: "json",
            cache:false,
            url: "/users/listings/" + searchTerm+"/"+skip+"/"+limit
        });
    }
}


