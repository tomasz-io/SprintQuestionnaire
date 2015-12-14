var _ = require('underscore');
var utilities = require('cloud/utilityFunctions.js');

Parse.Cloud.job("standardisePeople", function(request, status) {


  //This job was used to adapt the data from an excel sheet with all contacts.
  //For more details, refer to function 'standardisePerson'

  var PeopleRaw = Parse.Object.extend("PeopleRaw");
  var query = new Parse.Query(PeopleRaw);
  query.limit(1000); //normally it's capped on 100

  var promise = Parse.Promise.as();
  query.find().then(function(results) {
    // Create a trivial resolved promise as a base case.
    console.log(results.length);
    var promise = Parse.Promise.as();
    _.each(results, function(rawPerson) {
      // For each item, extend the promise with a function to save it.
      promise = promise.then(function() {
        // Return a promise that will be resolved when the save is finished.
        var person = standardisePerson(rawPerson);
        return person.save();
      });
    });
    return promise;

  }).then(function() {
      status.success("standardisePeople success");
  }, function(error) {
      status.error("standardisePeople something went wrong.");
  });
});



Parse.Cloud.job("deleteDuplicates", function(request, status) {

    console.log('accessed deleteDuplicates');
    var People = Parse.Object.extend("People");
    var query = new Parse.Query(People);
    query.limit(1000); //normally it's capped on 100


    var promise = Parse.Promise.as();
    query.find().then(function(results) {
      var promise = Parse.Promise.as();
      _.each(results, function(person) {
        promise = promise.then(findDuplicates);

        function findDuplicates() {
            // Return a promise that will be resolved when the save is finished.

            var duplicateQuery = new Parse.Query(People);
            var email = person.get("email");
            duplicateQuery.equalTo("email", email);

            return duplicateQuery.count().then(function(count) {
                if (count > 1) { //This person is a duplicate
                  console.log("to be destroyed");
                  return person.destroy();
                  //return startup.destroy();
                } else {
                  console.log("do not destroy");
                  return person.save();
                }
            });
          }
      });

      return promise;

    }).then(function() {
        status.success("importEvaluators success");
    }, function(error) {
        status.error("importEvaluators error : " + error.message);
    });

});


Parse.Cloud.job("importEvaluators", function(request, status) {

    console.log('accessed importEvaluators');
    var Evaluators = Parse.Object.extend("Evaluators");
    var query = new Parse.Query(Evaluators);
    query.limit(1000); //normally it's capped on 100


    var promise = Parse.Promise.as();
    query.find().then(function(results) {
      var promise = Parse.Promise.as();
      _.each(results, function(evaluator) {
        promise = promise.then(createEvaluator);

        function createEvaluator() {
            // Return a promise that will be resolved when the save is finished.

            var People = Parse.Object.extend("People");
            var peopleQuery = new Parse.Query(People);
            var email = evaluator.get("email");
            peopleQuery.equalTo("email", email);

            return peopleQuery.find().then(function(results) {

                var person;
                if (results.length == 1) { //This person exists in db
                  console.log("evaluator exists");
                  person = results[0];
                } else if (results.length == 0) { //need to create new person
                  person = new People();
                  person.set("email", email);
                } else {
                  console.log("duplicates : " + results.length);
                //  console.log("will delete duplicate : " + email);
                  //var duplicate = results[0];
                  //return duplicate.destroy();
                }
                person.set("canEvaluate", true);
                return person.save();
            });
          }
      });

      return promise;

    }).then(function() {
        status.success("importEvaluators success");
    }, function(error) {
        status.error("importEvaluators error : " + error.message);
    });

});


Parse.Cloud.job("filterStartups", function(request, status) {

    //This job filters out startups that are 'In progress' or 'Rejected' as well as duplicates of existing starutps


    console.log('accessed filterStartups');
    var Startups = Parse.Object.extend("Startups");
    var query = new Parse.Query(Startups);
    query.limit(1000); //normally it's capped on 100

    var promise = Parse.Promise.as();
    query.find().then(function(results) {
      var promise = Parse.Promise.as();
      _.each(results, function(startup) {
        promise = promise.then(validitiyCheck);

        function validitiyCheck() {
          // Return a promise that will be resolved when the save is finished.
          var status = startup.get("status");
          if (status == "In Progress" || status == "Rejected") { //This startup is in progress or rejected
            return startup.destroy();
          } else {
            var id = startup.get("applicationID");
            var secondQuery = new Parse.Query(Startups);
            secondQuery.equalTo("applicationID", id);

            var isAssigned = (startup.get("biz")!= null || startup.get("product") != null || startup.get("tech") != null);
            var startupName = startup.get("name");
            console.log("Startup: " + startupName + " isAssigned: " + isAssigned);

            return secondQuery.count().then(function(count) {
                if (count > 1 && !isAssigned) { //This startup is a duplicate
                  console.log("to be destroyed");
                  return startup.destroy();
                  //return startup.destroy();
                } else {
                  console.log("do not destroy");
                  return startup.save();
                }
            });
          }
        }
      });

      return promise;

    }).then(function() {
        status.success("filterStartups success");
    }, function(error) {
        status.error("filterStartups something went wrong.");
    });
});


Parse.Cloud.job("getUniqueTags", function(request, status) {

  //This job is used to create an object that contains all unique tags that startups have used
  //that object can be used for autosuggestion etc.

  var Tags = Parse.Object.extend("Tags");
  var tagQuery = new Parse.Query(Tags);
  tagQuery.equalTo("name", "All Tags"); //the class only contains one object, called All Tags

  var Startups = Parse.Object.extend("Startups");
  var query = new Parse.Query(Startups);

  var allTags =[]; //array with all tags (not unique)

  query.each(function(startup) {

      //Get tags from each startup and create array of tags
      var tagsString = startup.get("tags");
      if(tagsString != null) {
        var tags = utilities.separateTags(tagsString);
      } else {
        var tags = [];
      }
      allTags = allTags.concat(tags);

  }).then(function() {

      console.log("count 1 : " + allTags.length);
      allTags = allTags.filter(function(item, pos) {
        return allTags.indexOf(item) == pos;
      });
      console.log("count 2 : " + allTags.length);

      console.log("allTags : " + allTags);
      return tagQuery.first();

  }).then(function(tag) {

      tag.set("tagsArray", allTags);
      return tag.save();

  }).then(function() {
      console.log("calling success");
      status.success("getUniqueTags success");
  }, function(error) {
      status.error("getUniqueTags something went wrong.");
  });
});


Parse.Cloud.job("fixAssignments", function(request, status) {

  //this job was used to populate the startups with evaluator information when that information didn't save due to a bug

  var Assignments = Parse.Object.extend("Assignments");
  var Startups = Parse.Object.extend("Startups");
  var query = new Parse.Query(Assignments);
  var expertise;
  var evaluator;


  query.find().then(function(results) {

      var assignment = results[1];
      var startupNames = assignment.get("startupNames");
      expertise = assignment.get("expertise");
      evaluator = assignment.get("evaluator");
      console.log(expertise);
      console.log(startupNames);

      var startupQuery = new Parse.Query(Startups);
      startupQuery.containedIn("name", startupNames);
      return startupQuery.find();

  }).then(function(results){

    var allStartups = Array();

    for(var i=0, len=results.length; i < len; i++){
      var startup = results[i];
      var id = startup.id;
      name = startup.get("name");
      startup.set(expertise, evaluator);  //parse pointer
      allStartups.push(startup);
    }
    console.log("all startups : " + allStartups);
    return Parse.Object.saveAll(allStartups);
  })

  .then(function() {
      status.success("fixAssignments success");
  }, function(error) {
      status.error("fixAssignments something went wrong." + error.code + ": " + error.message);
  });
});
