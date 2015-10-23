
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

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
  console.log(a.FitScore)
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


Parse.Cloud.define("hello", function(request, response) {

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

  var evaluatorTagsString = request.params.tags;
  var evaluatorTags = separateTags(evaluatorTagsString);


  var bestFitScore = 0;

  mainQuery.each(function(startup){

    var name = startup.get("Name");
    var id = startup.get("ApplicationID");
    var biz = startup.get("Biz");
    var product = startup.get("Product");
    var tech = startup.get("Tech");
    var startupTags = startup.get("Tags");

    if(startupTags == null) {
      startupTags = "placeholder";
    }

    var startupTags = separateTags(startupTags); //startupTags is a comma separated string of tags, need to be converted to an array first
    var fitScore = getFitScore(startupTags, evaluatorTags);

    if (name == "Powize Team") {

      console.log(fitScore);
      console.log(startupTags);

    }

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
    "Name" : name,
    "Id" : id,
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

//  response.success("Hello world! " + request.params.name);
});
