var evaluatorsNumber = 50;

var weight_teamrating;
var weight_customerKnowledge;
var weight_opportunityMarket;
var weight_industryExperience;
var weight_competAdvantage;

Parse.Cloud.job("importScores", function(request, status) {

  //This job is used to create an object that contains all unique tags that startups have used
  //that object can be used for autosuggestion etc.

  console.log("started importScores");

  var TestEval = Parse.Object.extend("TestEval");
  var query = new Parse.Query(TestEval);
  query.limit(1000);

  query.find().then(function(results) {

    var allEvals = Array();
    for(var i=0, len=results.length; i < len; i++){

      var eval = results[i];

      var allTeam = Array();
      var allCustomer = Array();
      var allMarket = Array();
      var allIndustry = Array();
      var allAdvantage = Array();

      name = eval.get("Name");
      for(var j=0, len=results.length; j < len; j++){
        var teamrating = eval.get("Evaluator" + j + "Teamrating");
        var customerKnowledge = eval.get("Evaluator" + j + "CustomerKnowledgerating");
        var opportunityMarket = eval.get("Evaluator" + j + "OpportunityMarketrating");
        var industryExperience = eval.get("Evaluator" + j + "IndustryExperiencerating");
        var competAdvantage = eval.get("Evaluator" + j + "CompetAdvantagerating");

        if (eval.get("Evaluator" + j + "Teamrating") != "-" && eval.get("Evaluator" + j + "Teamrating") != null) {
          console.log(name + " team rating : " + teamrating);
          console.log(name + " customer knowledge : " + customerKnowledge);
          console.log(name + " market opportunity : " + opportunityMarket);
          console.log(name + " industry experience : " + industryExperience);
          console.log(name + " competitive advantage : " + competAdvantage);
          allTeam.push(teamrating);
          allCustomer.push(customerKnowledge);
          allMarket.push(opportunityMarket);
          allIndustry.push(industryExperience);
          allAdvantage.push(competAdvantage);
        }
      }
      eval.set("AllTeam", allTeam);
      eval.set("AllCustomer", allCustomer);
      eval.set("AllMarket", allMarket);
      eval.set("AllIndustry", allIndustry);
      eval.set("AllAdvantage", allAdvantage);
      allEvals.push(eval);
    }
    return Parse.Object.saveAll(allEvals);
  }).then(function() {
      console.log("calling success");
      status.success("importScores success");
  }, function(error) {
      status.error("importScores something went wrong : " + error);
  });
});
