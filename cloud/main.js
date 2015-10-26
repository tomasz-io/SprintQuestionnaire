
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

var mandrill = require("mandrill");
mandrill.initialize("yEPF9THiZOmKolJaiNMPog");

var myMandrillFunction = function(email) {
  mandrill.sendEmail({
    message: {
      text: "Hello World!",
      subject: "Using Cloud Code and Mandrill is great!",
      from_email: "tomasz.s@numa.co",
      from_name: "Cloud Code",
      to: [
        {
          email: email,
          name: "Your Name"
        }
      ]
    },
    async: true
  });


  /*, {
    success: function(httpResponse) { response.success("Email sent!"); },
    error: function(httpResponse) { response.error("Uh oh, something went wrong"); }
  });*/
}

var separateTags = function(string) {
  //this returns an array of words that were previously separated by commas
  var arr = string.split(",");
  var arrayLength = arr.length;
  for (var i = 0; i < arrayLength; i++) {
    arr[i] = [arr[i].trim().toLowerCase()]; //remove leading and trailing whitespace
  }
  return arr
}

var compareScores = function(a,b) {
  if (a.FitScore < b.FitScore)
    return 1;
  if (a.FitScore > b.FitScore)
    return -1;
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

Parse.Cloud.define("getStartups", function(request, response) {

  var Startups = Parse.Object.extend("Startups");

  //Startups that need Business evaluator
  var needsBiz = new Parse.Query(Startups);
  needsBiz.doesNotExist("Biz");
  //needsBiz.equalTo("Biz", "test");

  //Startups that need Product evaluator
  var needsProduct = new Parse.Query(Startups);
  needsProduct.doesNotExist("Product");
  //needsProduct.equalTo("Product", "test");

  //Startups that need Tech evaluator
  var needsTech = new Parse.Query(Startups);
  needsTech.doesNotExist("Tech");
  //needsTech.equalTo("Tech", "test");


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
    var name = startup.get("Name");
    var biz = startup.get("Biz");
    var product = startup.get("Product");
    var tech = startup.get("Tech");
    var startupTags = startup.get("Tags");

    if(startupTags == null) {
      startupTags = "placeholder";
    }

    var startupTags = separateTags(startupTags); //startupTags is a comma separated string of tags, need to be converted to an array first
    var fitScore = getFitScore(startupTags, evaluatorTags);


    if(!checkIfEmailInString(biz)) {
      biz = 0;
    }
    if(!checkIfEmailInString(product)) {
      product = 0;
    }
    if(!checkIfEmailInString(tech)) {
      tech = 0;
    }

    arr.push({
    "Id" : id,
    "Name" : name,
    "Biz" : biz,
    "Product" : product,
    "Tech" : tech,
    "FitScore" : fitScore
    });

    arr = arr.sort(compareScores);


  }).then(function(results){

    response.success(arr.slice(0,10));

  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

});


Parse.Cloud.define("submit", function(request, response) {

  var Startups = Parse.Object.extend("Startups");

  var email = request.params.email;

  var biz = request.params.biz;
  var product = request.params.product;
  var tech = request.params.tech;

  console.log("biz : " + biz);
  console.log("prod : " + product);
  console.log("tech : " + tech);
  console.log("email : " + email);

  var bizQuery = new Parse.Query(Startups);
  var productQuery = new Parse.Query(Startups);
  var techQuery = new Parse.Query(Startups);

  bizQuery.containedIn("objectId", biz);
  productQuery.containedIn("objectId", product);
  techQuery.containedIn("objectId", tech);

  bizQuery.each(function(startup){
    var name = startup.get("Name");
    console.log("name : " + name);
    startup.set("Biz", email);
    startup.save();
  });

  productQuery.each(function(startup){
    //var name = startup.get("Name");
    startup.set("Product", email);
    startup.save();
  });

  techQuery.each(function(startup){
    //var name = startup.get("Name");
    startup.set("Tech", email);
    startup.save();
  });

  //myMandrillFunction(email);

});
