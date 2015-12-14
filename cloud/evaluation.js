Parse.Cloud.job("filterStartups", function(request, status) {

    //This job filters out startups that are 'In progress' or 'Rejected' as well as duplicates of existing starutps


    console.log('accessed filterStartups');
    var Startups = Parse.Object.extend("Startups");
    var query = new Parse.Query(Startups);
    query.limit(1000); //normally it's capped on 100

});
