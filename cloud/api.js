var moment = require('moment');
var utilities = require('cloud/utilityFunctions.js');
var matching = require('cloud/matching.js');


Parse.Cloud.define("getTagsList", function(request, response) {

    var Tags = Parse.Object.extend("Tags");
    var query = new Parse.Query(Tags);
    query.equalTo("name", "All Tags"); //the class only contains one object, called All Tags

    query.first().then(function(result){

      var outcome = [];
      var allTags = result.get("tagsArray");
      outcome.push({
      "tags" : allTags
      });

      allTags.sort();

      return allTags;
    }).then(function(result) {
        response.success(result);
    }, function(error) {
        response.error('getTagsList error ' + error);
    });
});

Parse.Cloud.define("completeEvaluator", function(request, response) {

  var email = request.params.email;
  var firstName = request.params.firstName;
  var lastName = request.params.lastName;
  var jobTitle = request.params.jobTitle;
  var basedIn = request.params.basedIn;
  var gender = request.params.gender;

  var skillProfile = request.params.skillProfile; //array
  var languages = request.params.languages; //comma separated string
  var languageArray = utilities.separateTags(languages);


  var organisation = request.params.organisation;
  var linkedIn = request.params.linkedIn;

  var People = Parse.Object.extend("People");
  var query = new Parse.Query(People);
  query.equalTo("email", email.trim().toLowerCase());

  query.find().then(function(results) {

      if (results.length > 0) {
        var person = results[0];
        var complete = person.get("isComplete");
        if(!complete){
          person.set("firstName", firstName);
          person.set("lastName", lastName);
          person.set("jobTitle", jobTitle);
          person.set("basedIn", basedIn);
          person.set("gender", gender);
          person.set("skillProfile", skillProfile);
          person.set("languages", languageArray);
          person.set("organisation", organisation);
          person.set("linkedIn", linkedIn);
          person.set("isComplete", true);
        }
      }

      return person.save();

  }).then(function(result) {
      console.log("email : " + result);
      response.success(result);
  }, function(error) {
      response.error('completeEvaluator error ' + error);
  });
});

Parse.Cloud.define("emailCheck", function(request, response) {

  var email = request.params.email;
  var People = Parse.Object.extend("People");
  var query = new Parse.Query(People);
  query.equalTo("email", email.trim().toLowerCase());

  var outcome = [];

  query.find().then(function(results) {

      var isValid = false
      var complete = false
      if (results.length > 0) {
          var person = results[0];
          complete = person.get("isComplete");
          if(person.get("canEvaluate") == true) {
            isValid = true;
          }
      }

      outcome.push({
        "isValid" : isValid,
        "isComplete" : complete
      });

      return outcome;

  }).then(function(result) {
      console.log("email : " + result);
      response.success(result);
  }, function(error) {
      response.error('emailCheck error ' + error);
  });
});


Parse.Cloud.define("getTagsAndIndustries", function(request, response) {

//This returns a list of tags associated with the evaluator and a boolean for each of "Product", "Tech" and "Biz" categories

  var email = request.params.email;
  var People = Parse.Object.extend("People");
  var query = new Parse.Query(People);
  query.equalTo("email", email.trim().toLowerCase());

  var outcome = [];

  query.find().then(function(results) {

      var emailExists = false
      if (results.length > 0) {
          emailExists = true;

          var person = results[0];
          var id = person.id;
          var firstName = person.get("firstName");
          var tags = person.get("tags");

          outcome.push({
          "id" : id,
          "firstName" : firstName,
          "tags" : tags
          });
      }

      return outcome;

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
    arr = arr.sort(utilities.compareDates);
    response.success(arr);
  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

});


Parse.Cloud.define("getStartups", function(request, response) {


  var evaluatorExpertise = request.params.expertise;

  console.log("expertise : " + evaluatorExpertise);

  var evaluatorIndustry = request.params.industry;
  console.log("industry: " + evaluatorIndustry);
  if(evaluatorIndustry == null){
    evaluatorIndustry = [];
  }
  var evaluatorTagsString = request.params.tags;
  var evaluatorTags = utilities.separateTags(evaluatorTagsString);
  evaluatorTags = evaluatorTags.concat(evaluatorIndustry); //we're using the industries like regular tags

  evaluatorTags = utilities.removeDuplicates(evaluatorTags);

  var Startups = Parse.Object.extend("Startups");
  var query = new Parse.Query(Startups);
  query.doesNotExist(evaluatorExpertise);

  var startups = [];

  query.each(function(startup){

    var id = startup.id;
    var name = startup.get("name");
    var tagline = startup.get("tagline");
    var startupTags = startup.get("tags");
    var tagsArray = startup.get("tagsArray");

    if (!tagsArray){
      tagsArray = utilities.separateTags(startupTags);
      tagsArray = utilities.removeDuplicates(tagsArray);
      startup.set("tagsArray", tagsArray);
      startup.save();
    }

    if(tagsArray == null) {
      tagsArray = [];
    }

    var fitScore = matching.getFitScore(tagsArray, evaluatorTags);

    startups.push({
    "Id" : id,
    "Name" : name,
    "Tagline" : tagline,
    "FitScore" : fitScore
  });

  }).then(function(){

    startups = startups.sort(matching.compareScores);
    response.success(startups);
    //response.success(arr.slice(0,10));

  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

});

Parse.Cloud.define("submit", function(request, response) {

  var Startups = Parse.Object.extend("Startups");
  var People = Parse.Object.extend("People");

  var email = request.params.email.trim().toLowerCase();
  var industries = request.params.industry;
  var tags = request.params.tags; //comma separated string
  var tagsArray = utilities.separateTags(tags);

  var selected = request.params.selected; //selected startups
  var expertise = request.params.expertise;
  var allNames = []; //where we store the names of all startups assigned to evaluator
  var evaluator;

  console.log("expertise : " + expertise);
  console.log("email : " + email);

  var evaluatorQuery = new Parse.Query(People);
  evaluatorQuery.equalTo("email", email);

  evaluatorQuery.find().then(function(results){

      if ( results.length == 0 ) {
        console.error("no such evaluator");
      } else if (results.length > 0) {

        //replace old industries and tags with the new
        evaluator = results[0];
        evaluator.set("industries", industries);
        evaluator.set("tags", tagsArray);
      }
      return evaluator.save();

  }).then(function(result){

    var startupQuery = new Parse.Query(Startups);
    startupQuery.containedIn("objectId", selected);
    return startupQuery.find();

  }).then(function(results){

    var allStartups = Array();

    for(var i=0, len=results.length; i < len; i++){
      var startup = results[i];
      var id = startup.id;
      name = startup.get("name");
      startup.set(expertise, evaluator);  //parse pointer
      allStartups.push(startup);
      // startup.save();
      allNames.push(name);
    }

    console.log("all startups : " + allStartups);

    return Parse.Object.saveAll(allStartups);

  }).then(function(){

      console.log("allNames: " + allNames);
      //Create new assignment
      var Assignments = Parse.Object.extend("Assignments");
      var assignment = new Assignments();
      assignment.set("evaluator", evaluator); //parse pointer
      assignment.set("startupNames", allNames); //array
      assignment.set("email", email); //string
      assignment.set("expertise", expertise); //parse pointer
      assignment.set("assigned", false);

    return assignment.save();
  }).then(function(result) {
      response.success("submit success");
  }, function(error) {
      response.error("submit something went wrong." + error.code + ": " + error.message);
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
