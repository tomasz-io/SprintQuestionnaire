
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var moment = require('moment');

var separateTags = function(string) {
  //this returns an array of words that were previously separated by commas
  var arr = string.split(",");
  var arrayLength = arr.length;
  for (var i = 0; i < arrayLength; i++) {
    arr[i] = [arr[i].trim().toLowerCase()]; //remove leading and trailing whitespace
  }
  return arr
}

var isInArray = function(value, array) {
  return array.indexOf(value) > -1;
}

var compareScores = function(a,b) {
  if (a.FitScore < b.FitScore)
    return 1;
  if (a.FitScore > b.FitScore)
    return -1;
  return 0;
}

var compareDates = function(a,b) {
  if (a.UpdatedAt < b.UpdatedAt)
    return -1;
  if (a.UpdatedAt > b.UpdatedAt)
    return 1;
  return 0;
}

var checkIfEmailInString = function(text) {

  //this is a regex function for checking if the string contains an email address.
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(text);
}

var intersectArrays = function(arr1, arr2) {
    //console.log("first array : " + arr1);
    //console.log("second array : " + arr2);

    var r = [], o = {}, l = arr2.length, i, v;
    for (i = 0; i < l; i++) {
        o[arr2[i]] = true;
    }
    l = arr1.length;
    for (i = 0; i < l; i++) {
        v = arr1[i];
        if (v in o) {
            r.push(v);
        }
    }
    return r;
}

var getFitScore = function(startupTags, evaluatorTags) {
  var commonElements = intersectArrays(startupTags, evaluatorTags);
  //console.log("startup tags : " + startupTags);
  //console.log(commonElements);
  var fitScore = commonElements.length;
  //console.log(fitScore);
  return fitScore;
}

var sendEmail = function(email) {

  Parse.Cloud.httpRequest({
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      url: 'https://mandrillapp.com/api/1.0/messages/send-template.json',
      body:{
          "key": "yEPF9THiZOmKolJaiNMPog",
          "template_name": "<Insert Template Name>",
          "template_content": [{
              "name": "example name",
              "content": "example content" // Name and Content are required even though they are ignored
              }],
          "message": {
              "to": [
                  {
                      "email": email,
                   }
                    ]
      }},
      success: function(httpResponse) {
              console.log(httpResponse);
              },
          error: function(httpResponse) {
              console.error(httpResponse);
          }
      });
}

Parse.Cloud.job("getUniqueTags", function(request, status) {

  // Query for all upvotes
  //NOT FINISHED
  var Startups = Parse.Object.extend("Startups");
  var query = new Parse.Query(Startups);
  var allTags =[];

  query.each(function(startup) {
      var tagsString = startup.get("Tags");

      if(tagsString != null) {
        var tags = separateTags(tagsString);
      } else {
        var tags = [];
      }

      allTags = allTags.concat(tags);

  }).then(function() {
      console.log(allTags);
      allTags = uniq_fast(allTags);
      console.log(allTags);

  }).then(function() {
      status.success("getUniqueTags success");
  }, function(error) {
      status.error("getUniqueTags something went wrong.");
  });
});

Parse.Cloud.define("emailCheck", function(request, response) {

  var email = request.params.email;
  var Evaluators = Parse.Object.extend("Evaluators");
  var query = new Parse.Query(Evaluators);
  query.equalTo("Email", email);

  query.find().then(function(results) {

      var emailExists = false
      if (results.length > 0) {
          emailExists = true;
      }
      return emailExists;

  }).then(function(result) {
      console.log("email : " + result);
      response.success(result);
  }, function(error) {
      response.error('emailCheck error ' + error);
  });


});

Parse.Cloud.define("getAssignments", function(request, response) {

  console.log("getting assignments");

  var Assignments = Parse.Object.extend("Assignments");
  var query = new Parse.Query(Assignments);

  //query.equalTo("assigned", false);

  var arr = [];

  query.each(function(assignment){

    var id = assignment.id;
    var email = assignment.get("email");
    var startups = assignment.get("startupNames");
    var assigned = assignment.get("assigned");
    var updatedAt = assignment.updatedAt;

    var date = moment(updatedAt);
    prettyDate = date.format("DD/MM/YYYY, h:mm a"); // "Sunday, February 14th 2010, 3:25:50 pm"
    //a.format("ddd, hA");                       // "Sun, 3PM"

    console.log(prettyDate);

    arr.push({
    "Id" : id,
    "Email" : email,
    "Startups" : startups.toString().split(",").join(", "), //this is formatting. Transforming array to string and replacing all "," with ", "
    "Assigned" : assigned,
    "UpdatedAt" : updatedAt,
    "PrettyDate" : prettyDate
    });
    console.log("assigned : " + assigned);

  }).then(function(results){
    console.log("assignments : " + arr);
    arr = arr.sort(compareDates);
    response.success(arr);
  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

});


Parse.Cloud.define("getStartups", function(request, response) {

  var Startups = Parse.Object.extend("Startups");

  //Startups that need Business evaluator
  var needsBiz = new Parse.Query(Startups);
  needsBiz.doesNotExist("biz");

  //Startups that need Product evaluator
  var needsProduct = new Parse.Query(Startups);
  needsProduct.doesNotExist("product");

  //Startups that need Tech evaluator
  var needsTech = new Parse.Query(Startups);
  needsTech.doesNotExist("tech");


  //Main query
  var mainQuery = Parse.Query.or(needsBiz, needsProduct, needsTech);

  var arr = [];

  var evaluatorIndustry = request.params.industry;
  //console.log("industry" + evaluatorIndustry);
  var evaluatorTagsString = request.params.tags;
  var evaluatorTags = separateTags(evaluatorTagsString);
  console.log(evaluatorTags);
  evaluatorTags = evaluatorTags.concat(evaluatorIndustry); //we're using the industries as just regular tags
  console.log(evaluatorTags);
  console.log(evaluatorTags[0]);

  var bestFitScore = 0;

  mainQuery.each(function(startup){

    var id = startup.id;
    var name = startup.get("name");
    var biz = startup.get("biz");
    var product = startup.get("product");
    var tech = startup.get("tech");
    var tagline = startup.get("tagline");
    var startupTags = startup.get("tags");

    if(startupTags == null) {
      startupTags = "placeholder";
    }

    var startupTags = separateTags(startupTags); //startupTags is a comma separated string of tags, need to be converted to an array first
    var fitScore = getFitScore(startupTags, evaluatorTags);


//javascript ternary operator
     biz = (biz) ? 'has business evaluator' : 0;
     product = (product) ? 'has product evaluator' : 0;
     tech = (tech) ? 'has tech evaluator' : 0;

    arr.push({
    "Id" : id,
    "Name" : name,
    "Biz" : biz,
    "Product" : product,
    "Tech" : tech,
    "Tagline" : tagline,
    "FitScore" : fitScore
    });

  }).then(function(results){

    arr = arr.sort(compareScores);
    response.success(arr.slice(0,10));

  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

});


Parse.Cloud.define("submit", function(request, response) {

  var Startups = Parse.Object.extend("Startups");
  var Evaluators = Parse.Object.extend("Evaluators");

  var email = request.params.email;

  var biz = request.params.biz;
  var product = request.params.product;
  var tech = request.params.tech;
  var allChoices = biz.concat(product, tech);
  var allNames = [];
  var evaluator;

  console.log("biz : " + biz);
  console.log("prod : " + product);
  console.log("tech : " + tech);
  console.log("email : " + email);

  var evaluatorQuery = new Parse.Query(Evaluators);
  evaluatorQuery.equalTo("Email", email);

  evaluatorQuery.find().then(function(results){

    if ( results.length == 0 ) {
      console.error("no such evaluator");
    } else if (results.length > 0) {
      evaluator = results[0];
    }

    var query = new Parse.Query(Startups);
    query.containedIn("objectId", allChoices);
    return query.find();
  }).then(function(results){

    for(var i=0, len=results.length; i < len; i++){
      var startup = results[i];
      var id = startup.id;
      name = startup.get("name");

//Check if it's a biz, product or tech evaluator
      if(isInArray(id, biz)){
        startup.set("biz", evaluator);  //pointer
      } else if(isInArray(id, product)){
        startup.set("product", evaluator); //pointer
      }else if(isInArray(id, tech)){
        startup.set("tech", evaluator);  //pointer
      } else {
        console.error("startup is in none of the arrays");
      }
      startup.save();
      allNames.push(name);
    }

  }).then(function(){

    console.log("allNames: " + allNames);
    //Create new assignment
    var Assignments = Parse.Object.extend("Assignments");
    var assignment = new Assignments();
    assignment.set("evaluator", evaluator); //pointer
    assignment.set("startupNames", allNames); //array
    assignment.set("email", email); //string
    assignment.set("assigned", false);

    return assignment.save();
  }).then(function(result) {
      response.success("submit success");
  }, function(error) {
      response.error("submit something went wrong.");
  });

});

Parse.Cloud.define("submitAssignments", function(request, response) {

  var Assignments = Parse.Object.extend("Assignments");
  var assignments = request.params.assignments;
  console.log("assignments : " + assignments);

  var query = new Parse.Query(Assignments);
  query.containedIn("objectId", assignments);

  query.each(function(assignment) {
    assignment.set("assigned", true);
    return assignment.save();
  }).then(function(result) {
      response.success("submit success");
  }, function(error) {
      console.error("Error submitAssignments " + error.code + ": " + error.message);
      response.error("submitAssignments something went wrong.");
  });

});
