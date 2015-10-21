
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

var getBestStartups = function(Startups, response) {


}


Parse.Cloud.define("hello", function(request, response) {

  var Startups = Parse.Object.extend("Startups");

  //Startups that need Business evaluator
  var needsBiz = new Parse.Query(Startups);
  needsBiz.equalTo("Biz", "test");

  //Startups that need Product evaluator
  var needsProduct = new Parse.Query(Startups);
  needsProduct.equalTo("Product", "test");

  //Startups that need Tech evaluator
  var needsTech = new Parse.Query(Startups);
  needsTech.doesNotExist("Tech");

  //Main query
  var mainQuery = Parse.Query.or(needsBiz, needsProduct, needsTech);
  //mainQuery.limit(100);

  var arr = [];

  mainQuery.each(function(startup){

    var name = startup.get("Name");
    var id = startup.get("ApplicationID");
    arr.push({
    "Name" : name,
    "Id" : id
    });

  }).then(function(results){

    response.success(arr.slice(0, 4));

  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

//  response.success("Hello world! " + request.params.name);
});
