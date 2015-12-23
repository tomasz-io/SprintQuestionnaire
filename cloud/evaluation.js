var utilities = require('cloud/utilityFunctions.js');

var evaluatorsNumber = 50; //number of evaluators that evaluated startups
var reqEvaluators = 3; //Number of evaluators require per startup

var weight_teamrating;
var weight_customerKnowledge;
var weight_opportunityMarket;
var weight_industryExperience;
var weight_competAdvantage;


function getConfig() {

  var promise = new Parse.Promise();
  return Parse.Config.get().then(function(config){
    weight_teamrating = config.get("weight_teamrating");
    weight_customerKnowledge = config.get("weight_customerKnowledge");
    weight_opportunityMarket = config.get("weight_opportunityMarket");
    weight_industryExperience = config.get("weight_industryExperience");
    weight_competAdvantage = config.get("weight_competAdvantage");
    console.log("weight_competAdvantage : " + weight_competAdvantage);
    promise.resolve();
  });

  return promise;
}

Parse.Cloud.job("calculateScores", function(request, status) {

  var StartupScores = Parse.Object.extend("StartupScores");
  var query = new Parse.Query(StartupScores);
  query.limit(1000);

  var promise = Parse.Promise.as();

  getConfig().then(function(){
    return query.find();
  }).then(function(results) {

    var allScores = Array();
    for(var i=0, len=results.length; i < len; i++){

      var eval = results[i];

      var teamName = eval.get("Name");

      var allTeam = eval.get("AllTeam");
      var allCustomer = eval.get("AllCustomer");
      var allMarket = eval.get("AllMarket");
      var allIndustry = eval.get("AllIndustry");
      var allAdvantage = eval.get("AllAdvantage");

      var avgTeam = utilities.averageArray(allTeam);
      var avgCustomer = utilities.averageArray(allCustomer);
      var avgMarket = utilities.averageArray(allMarket);
      var avgIndustry = utilities.averageArray(allIndustry);
      var avgAdvantage = utilities.averageArray(allAdvantage);

      var numaScore = weight_teamrating*avgTeam + weight_customerKnowledge*avgCustomer + weight_opportunityMarket*avgMarket + avgIndustry*weight_industryExperience + avgAdvantage*weight_competAdvantage;

      eval.set("AdjustedScore", numaScore);

      // if (i % 10 == 0) {
      //   console.log(teamName + " : " + numaScore);
      //   console.log(eval.get("AdjustedScore"));
      // }

      if(eval.get("AdjustedScore")) {

        if(allTeam.length != reqEvaluators || allCustomer.length != reqEvaluators
          || allMarket.length != reqEvaluators || allIndustry.length != reqEvaluators
          || allAdvantage.length != reqEvaluators) {

          console.log(teamName + " : " + numaScore);
        }

        allScores.push(eval);
      }
    }

    console.log(allScores);

    return Parse.Object.saveAll(allScores);

  }).then(function() {
    status.success("calculateScores success");
  }, function(error) {
    status.error();
  });
});

Parse.Cloud.job("importScores", function(request, status) {

  //This job is used to create an object that contains all unique tags that startups have used
  //that object can be used for autosuggestion etc.

  console.log("started importScores");

  var TestEval = Parse.Object.extend("TestEval");
  var query = new Parse.Query(TestEval);
  query.limit(1000);

  query.find().then(function(results) {

    var allScores = Array();
    for(var i=0, len=results.length; i < len; i++){

      var eval = results[i];

      var allTeam = Array();
      var allCustomer = Array();
      var allMarket = Array();
      var allIndustry = Array();
      var allAdvantage = Array();

      name = eval.get("Name");
      for(var j=0, len=results.length; j < len; j++){
        var teamrating = parseInt(eval.get("Evaluator" + j + "Teamrating"));
        var customerKnowledge = parseInt(eval.get("Evaluator" + j + "CustomerKnowledgerating"));
        var opportunityMarket = parseInt(eval.get("Evaluator" + j + "OpportunityMarketrating"));
        var industryExperience = parseInt(eval.get("Evaluator" + j + "IndustryExperiencerating"));
        var competAdvantage = parseInt(eval.get("Evaluator" + j + "CompetAdvantagerating"));

        if (teamrating) {
          allTeam.push(parseInt(teamrating));
        }
        if (customerKnowledge) {
          allCustomer.push(parseInt(customerKnowledge));
        }
        if (industryExperience) {
          allIndustry.push(parseInt(industryExperience));
        }
        if (opportunityMarket) {
          allMarket.push(parseInt(opportunityMarket));
        }
        if (competAdvantage) {
          allAdvantage.push(parseInt(competAdvantage));
        }

        // if(name == "MySprezz") {
        //   if (teamrating) {
        //     allTeam.push(parseInt(teamrating));
        //   }
        //
        // }
        // console.log(name + " team rating : " + teamrating);
        // console.log(name + " customer knowledge : " + customerKnowledge);
        // console.log(name + " market opportunity : " + opportunityMarket);
        // console.log(name + " industry experience : " + industryExperience);
        // console.log(name + " competitive advantage : " + competAdvantage);

      }

      var StartupScores = Parse.Object.extend("StartupScores");
      var startupScore = new StartupScores();

      startupScore.set("Name", name);
      startupScore.set("AllTeam", allTeam);
      startupScore.set("AllCustomer", allCustomer);
      startupScore.set("AllMarket", allMarket);
      startupScore.set("AllIndustry", allIndustry);
      startupScore.set("AllAdvantage", allAdvantage);
      allScores.push(startupScore);
    }
    console.log(allScores);
    return Parse.Object.saveAll(allScores);
  }).then(function() {
      console.log("calling success");
      status.success("importScores success");
  }, function(error) {
      status.error("importScores something went wrong : " + error);
  });
});
