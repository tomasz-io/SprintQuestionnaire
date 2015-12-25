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

function getEqualWeights(arr) {

  var equalWeights = Array();
  var avgWeight = 1/arr.length;
  for (var k=0, length=arr.length; k < length; k++) {
    equalWeights.push(avgWeight);
  }
  console.log(equalWeights);
  return equalWeights;
}

function getMeanSquaredError(arr, mean) {
  var squaredError = 0;
  for (var i=0, len=arr.length; i < len; i++) {
      squaredError += Math.pow(mean - arr[i], 2);
  }
  return Math.sqrt(squaredError);
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
    console.log(results.length);
    for(var i=0, len=results.length; i < len; i++){

      var eval = results[i];
      var teamName = eval.get("Name");
      console.log("team : " + teamName);
      var criteria = ["Team", "Customer", "Market", "Industry", "Advantage"];
      var avgScores = Array();
      var meanErrors = Array();
//fuckfuck
      for (var j=0, length=criteria.length; j < length; j++) {
        var criteriaName = criteria[j];
        var scoreArray = eval.get("All" + criteriaName);
        var avgScore = utilities.averageArray(scoreArray);
        var meanError = getMeanSquaredError(scoreArray, avgScore);
        eval.set(criteriaName + "Error", meanError);
        avgScores.push(avgScore);
        meanErrors.push(meanError);

        if(scoreArray.length < reqEvaluators) {
          eval.set("notComplete", true);
        }
      }

      //Adjusted score


      //errors, aka deviations
      var weights = [weight_teamrating, weight_customerKnowledge, weight_opportunityMarket, weight_industryExperience, weight_competAdvantage];
      var numaScore = utilities.getWeightedAverage(weights, avgScores);
      var equalWeights = getEqualWeights(meanErrors);
      var numaError = utilities.getWeightedAverage(weights, meanErrors);
      var averageError = utilities.getWeightedAverage(equalWeights, meanErrors);

      eval.set("AdjustedScore", numaScore);
      eval.set("AdjustedError", numaError);
      eval.set("AverageError", averageError);
      console.log("numa score : " + numaScore);
      console.log("numa error : " + numaError);
      console.log("average error : " + averageError);


      allScores.push(eval);
    }

    console.log("all scores : " + allScores);

    return Parse.Object.saveAll(allScores);

  }).then(function() {
    status.success("calculateScores success");
  }, function(error) {
    status.error();
  });
});

// Parse.Cloud.job("calculateScores", function(request, status) {
//
//   var StartupScores = Parse.Object.extend("StartupScores");
//   var query = new Parse.Query(StartupScores);
//   query.limit(1000);
//
//   var promise = Parse.Promise.as();
//
//   getConfig().then(function(){
//     return query.find();
//   }).then(function(results) {
//
//     var allScores = Array();
//     for(var i=0, len=results.length; i < len; i++){
//
//       var eval = results[i];
//
//       var teamName = eval.get("Name");
//       var allTeam = eval.get("AllTeam");
//       var allCustomer = eval.get("AllCustomer");
//       var allMarket = eval.get("AllMarket");
//       var allIndustry = eval.get("AllIndustry");
//       var allAdvantage = eval.get("AllAdvantage");
//
//       var avgTeam = utilities.averageArray(allTeam);
//       var avgCustomer = utilities.averageArray(allCustomer);
//       var avgMarket = utilities.averageArray(allMarket);
//       var avgIndustry = utilities.averageArray(allIndustry);
//       var avgAdvantage = utilities.averageArray(allAdvantage);
//
//       //Adjusted score
//       var weights = [weight_teamrating, weight_customerKnowledge, weight_opportunityMarket, weight_industryExperience, weight_competAdvantage];
//       var values = [avgTeam, avgCustomer, avgMarket, avgIndustry, avgAdvantage];
//       var numaScore = utilities.getWeightedAverage(weights, values);
//       eval.set("AdjustedScore", numaScore);
//
//
//       if(eval.get("AdjustedScore")) {
//
//         if(allTeam.length != reqEvaluators || allCustomer.length != reqEvaluators
//           || allMarket.length != reqEvaluators || allIndustry.length != reqEvaluators
//           || allAdvantage.length != reqEvaluators) {
//
//           console.log(teamName + " : " + numaScore + "Averages : " + avgTeam + avgCustomer + avgMarket + avgIndustry + avgAdvantage +
//           " Weights : " + weight_teamrating + weight_customerKnowledge + weight_opportunityMarket + weight_industryExperience + weight_competAdvantage);
//         }
//
//         //Errors
//         var teamError = getMeanSquaredError(allTeam, avgTeam);
//         var customerError = getMeanSquaredError(allCustomer, avgCustomer);
//         var marketError = getMeanSquaredError(allMarket, avgMarket);
//         var industryError = getMeanSquaredError(allIndustry, avgIndustry);
//         var advantageError = getMeanSquaredError(allAdvantage, avgAdvantage);
//
//         var errors = [teamError, customerError, ]
//         var avgError = utilities.getWeightedAverage()
//
//
//         eval.set("teamError", teamError);
//         eval.set("customerError", customerError);
//         eval.set("marketError", marketError);
//         eval.set("industryError", industryError);
//         eval.set("advantageError", advantageError);
//
//
//         allScores.push(eval);
//       }
//     }
//
//     console.log(allScores);
//
//     return Parse.Object.saveAll(allScores);
//
//   }).then(function() {
//     status.success("calculateScores success");
//   }, function(error) {
//     status.error();
//   });
// });


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

      var name = eval.get("Name");
      var email = eval.get("Person1Email");

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
      startupScore.set("Email", email);
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
