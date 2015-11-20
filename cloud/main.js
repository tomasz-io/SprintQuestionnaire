
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
var moment = require('moment');
var _ = require('underscore');

var separateTags = function(string) {
  //this returns an array of words that were previously separated by commas
  var arr = [];

  if(string.indexOf("\n") != -1)
  {
    // console.log("new line found");
    arr = string.split("\n");
  } else if (string.indexOf(",") != -1){
    arr = string.split(",");
  } else if (string.indexOf("/") != -1){
    // console.log(" / symbol found");
    arr = string.split("/");
  }

  return arr
}

var toLowerCase = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].trim().toLowerCase(); //remove leading and trailing whitespace
  }
  return arr
}

var removeDuplicates = function(array) {

  array = toLowerCase(array);
  var filteredArray = array.filter(function(item, pos) {
    return array.indexOf(item) == pos;
  });

  return filteredArray;
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

var standardisePerson = function(rawPerson) {

  var email = rawPerson.get("email");
  var firstName = rawPerson.get("firstName");
  var lastName = rawPerson.get("lastName");
  var alumni = rawPerson.get("alumni");
  var program = rawPerson.get("program");
  var gender = rawPerson.get("gender");
  var english = rawPerson.get("english");
  var french = rawPerson.get("french");
  var italian = rawPerson.get("italian");
  var german = rawPerson.get("german");
  var portuguese = rawPerson.get("portuguese");
  var spanish = rawPerson.get("spanish");
  var arabic = rawPerson.get("arabic");
  var russian = rawPerson.get("russian");
  var otherLanguage = rawPerson.get("otherLanguage");
  var organisation = rawPerson.get("organisation");
  var basedIn = rawPerson.get("basedIn");
  var jobTitle = rawPerson.get("jobTitle");
  var biz = rawPerson.get("biz");
  var bizStrategy = rawPerson.get("bizStrategy");
  var legal = rawPerson.get("legal");
  var financialConsulting = rawPerson.get("financialConsulting");
  var gettingStarted = rawPerson.get("gettingStarted");
  var hr = rawPerson.get("hr");
  var businessDev = rawPerson.get("businessDev");
  var careerAdvice = rawPerson.get("careerAdvice");
  var internationalDev = rawPerson.get("internationalDev");
  var otherBiz = rawPerson.get("otherBiz");
  var productDesign = rawPerson.get("productDesign");
  var ux = rawPerson.get("ux");
  var leanStartup = rawPerson.get("leanStartup");
  var productManagement = rawPerson.get("productManagement");
  var metricsAnalytics = rawPerson.get("metricsAnalytics");
  var prototyping = rawPerson.get("prototyping");
  var userResearch = rawPerson.get("userResearch");
  var graphicDesigner = rawPerson.get("graphicDesigner");
  var otherProduct = rawPerson.get("otherProduct");
  var salesMarketing = rawPerson.get("salesMarketing");
  var socialMedia = rawPerson.get("socialMedia");
  var seo = rawPerson.get("seo");
  var pr = rawPerson.get("pr");
  var branding = rawPerson.get("branding");
  var publishing = rawPerson.get("publishing");
  var inboundMarketing = rawPerson.get("inboundMarketing");
  var emailMarketing = rawPerson.get("emailMarketing");
  var copywriting = rawPerson.get("copywriting");
  var growthStrategy = rawPerson.get("growthStrategy");
  var sem = rawPerson.get("sem");
  var salesLead = rawPerson.get("salesLead");
  var advertising = rawPerson.get("advertising");
  var otherMarketing = rawPerson.get("otherMarketing");
  var funding = rawPerson.get("funding");
  var crowdfunding = rawPerson.get("crowdfunding");
  var bizAngel = rawPerson.get("bizAngel");
  var vc = rawPerson.get("vc");
  var finance = rawPerson.get("finance");
  var bootstrapping = rawPerson.get("bootstrapping");
  var nonProfit = rawPerson.get("nonProfit");
  var publicSub = rawPerson.get("publicSub");
  var otherFunding = rawPerson.get("otherFunding");
  var humanSkills = rawPerson.get("humanSkills");
  var productivityOrganisation = rawPerson.get("productivityOrganisation");
  var publicSpeaking = rawPerson.get("publicSpeaking");
  var leadership = rawPerson.get("leadership");
  var coaching = rawPerson.get("coaching");
  var teamManagement = rawPerson.get("teamManagement");
  var negotiation = rawPerson.get("negotiation");
  var otherHuman = rawPerson.get("otherHuman");
  var tech = rawPerson.get("tech");
  var stack = rawPerson.get("stack");
  var skill = rawPerson.get("skill");
  var industries = rawPerson.get("industries");
  var artDesign = rawPerson.get("artDesign");
  var architecture = rawPerson.get("architecture");
  var charity = rawPerson.get("charity");
  var collabEcon = rawPerson.get("collabEcon");
  var consumerGoods = rawPerson.get("consumerGoods");
  var education = rawPerson.get("education");
  var energy = rawPerson.get("energy");
  var familyHomecare = rawPerson.get("familyHomecare");
  var fashionTextile = rawPerson.get("fashionTextile");
  var financialServices = rawPerson.get("financialServices");
  var foodTobacco = rawPerson.get("foodTobacco");
  var healthcare = rawPerson.get("healthcare");
  var lifestyle = rawPerson.get("lifestyle");
  var marketingCommunication = rawPerson.get("marketingCommunication");
  var mediaEntertainment = rawPerson.get("mediaEntertainment");
  var musical = rawPerson.get("musical");
  var political = rawPerson.get("political");
  var professionalServices = rawPerson.get("professionalServices");
  var security = rawPerson.get("security");
  var semiconductors = rawPerson.get("semiconductors");
  var softwareServices = rawPerson.get("softwareServices");
  var techHardware = rawPerson.get("techHardware");
  var telecom = rawPerson.get("telecom");
  var transportLogistics = rawPerson.get("transportLogistics");
  var travelTourism = rawPerson.get("travelTourism");
  var otherIndustry = rawPerson.get("otherIndustry");
  var passionWork = rawPerson.get("passionWork");
  var passionEntrep = rawPerson.get("passionEntrep");
  var skillTransmission = rawPerson.get("skillTransmission");
  var networking = rawPerson.get("networking");
  var startupTrends = rawPerson.get("startupTrends");
  var bizOpportunity = rawPerson.get("bizOpportunity");
  var invOpportunity = rawPerson.get("invOpportunity");
  var otherPassion = rawPerson.get("otherPassion");
  var numaPositive = rawPerson.get("numaPositive");
  var numaNegative = rawPerson.get("numaNegative");
  var recentCollaboration = rawPerson.get("recentCollaboration");
  var leCamping = rawPerson.get("leCamping");
  var experiment = rawPerson.get("experiment");
  var events = rawPerson.get("events");
  var rise = rawPerson.get("rise");
  var oneToOne = rawPerson.get("oneToOne");
  var expertSessions = rawPerson.get("expertSessions");
  var personalStory = rawPerson.get("personalStory");
  var workshop = rawPerson.get("workshop");
  var officeHours = rawPerson.get("officeHours");
  var roundTable = rawPerson.get("roundTable");
  var expertTalk = rawPerson.get("expertTalk");
  var startupReview = rawPerson.get("startupReview");
  var otherHelp = rawPerson.get("otherHelp");
  var available = rawPerson.get("available");
  var proudProject = rawPerson.get("proudProject");
  var mentorExchange = rawPerson.get("mentorExchange");
  var linkedIn = rawPerson.get("linkedIn");
  var mentorRecommend = rawPerson.get("mentorRecommend");
  var mentorName = rawPerson.get("mentorName");
  var mentorEmail = rawPerson.get("mentorEmail");
  var mentorDescription = rawPerson.get("mentorDescription");
  var canConnect = rawPerson.get("canConnect");
  var otherMentor = rawPerson.get("otherMentor");
  var otherMentorName = rawPerson.get("otherMentorName");
  var otherMentorEmail = rawPerson.get("otherMentorEmail");
  var otherMentorDescription = rawPerson.get("otherMentorDescription");
  var otherMentorConnect = rawPerson.get("otherMentorConnect");
  var startDate = rawPerson.get("startDate");
  var submitDate = rawPerson.get("submitDate");
  var networkId = rawPerson.get("networkId");


//BASIC INFO
  var People = Parse.Object.extend("People");
  var person = new People();
  person.set("email", email); //string
  person.set("firstName", firstName); //string
  person.set("lastName", lastName); //string

  if(linkedIn != null) {
    person.set("linkedInUrl", linkedIn);
  }

  if (alumni == 0) {
    person.set("alumni", false);
  } else if (alumni == 1) {
    person.set("alumni", true);
  } else {
    // do nothing, it will display as 'undefined'
  }
  person.set("gender", gender); //string

//LANGUAGES
  if (english != null) {
    person.add("languages", "english");
  }
  if (french != null) {
    person.add("languages", "french");
  }
  if (italian != null) {
    person.add("languages", "italian");
  }
  if (german != null) {
    person.add("languages", "german");
  }
  if (portuguese != null) {
    person.add("languages", "portuguese");
  }
  if (spanish != null) {
    person.add("languages", "spanish");
  }
  if (arabic != null) {
    person.add("languages", "arabic");
  }
  if (russian != null) {
    person.add("languages", "russian");
  }
  if (otherLanguage != null) {
    // person.add("languages", otherLanguage);
    var languagesArray = separateTags(otherLanguage);
    for(var i=0, len=languagesArray.length; i < len; i++){
      var skill = languagesArray[i];
      person.add("languages", skill);
    }
  }

//JOb & SKILLS
  person.set("organisation", organisation); //string
  person.set("basedIn", basedIn); //string
  person.set("jobTitle", jobTitle); //string


//BUSINESS
  if (biz == 0) {
    // do nothing, it will be set to []
  } else if (biz == 1) {

    if (bizStrategy != null) {
      person.add("biz", bizStrategy);
    }
    if (legal != null) {
      person.add("biz", legal);
    }
    if (financialConsulting != null) {
      person.add("biz", financialConsulting);
    }
    if (gettingStarted != null) {
      person.add("biz", gettingStarted);
    }
    if (hr != null) {
      person.add("biz", hr);
    }
    if (businessDev != null) {
      person.add("biz", businessDev);
    }
    if (careerAdvice != null) {
      person.add("biz", careerAdvice);
    }
    if (internationalDev != null) {
      person.add("biz", internationalDev);
    }
    if (otherBiz != null) {
      var bizArray = separateTags(otherBiz);
      for(var i=0, len=bizArray.length; i < len; i++){
        var skill = bizArray[i];
        person.add("biz", "stuff");
      }
    }

  } else {
    //TODO flag as 'missing info'
  }


//PRODUCT AND DESIGN
  if (productDesign == 0) {
    // do nothing, it will be set to []
  } else if (productDesign == 1) {

    if (ux != null) {
      person.add("productDesign", ux);
    }
    if (leanStartup != null) {
      person.add("productDesign", leanStartup);
    }
    if (productManagement != null) {
      person.add("productDesign", productManagement);
    }
    if (metricsAnalytics != null) {
      person.add("productDesign", metricsAnalytics);
    }
    if (prototyping != null) {
      person.add("productDesign", prototyping);
    }
    if (userResearch != null) {
      person.add("productDesign", userResearch);
    }
    if (graphicDesigner != null) {
      person.add("productDesign", graphicDesigner);
    }

    if (otherProduct != null) {
      var prodArray = separateTags(otherProduct);
      for(var i=0, len=prodArray.length; i < len; i++){
        var skill = prodArray[i];
        person.add("productDesign", skill);
      }
    }
  } else {
    //TODO flag as 'missing info'
  }

//SALES & MARKETING
  if (salesMarketing == 0) {
    // do nothing, it will be set to []
  } else if (salesMarketing == 1) {

    if (socialMedia != null) {
      person.add("salesMarketing", socialMedia);
    }
    if (seo != null) {
      person.add("salesMarketing", seo);
    }
    if (pr != null) {
      person.add("salesMarketing", pr);
    }
    if (branding != null) {
      person.add("salesMarketing", branding);
    }
    if (publishing != null) {
      person.add("salesMarketing", publishing);
    }
    if (inboundMarketing != null) {
      person.add("salesMarketing", inboundMarketing);
    }
    if (emailMarketing != null) {
      person.add("salesMarketing", emailMarketing);
    }
    if (copywriting != null) {
      person.add("salesMarketing", copywriting);
    }
    if (growthStrategy != null) {
      person.add("salesMarketing", growthStrategy);
    }
    if (sem != null) {
      person.add("salesMarketing", sem);
    }
    if (salesLead != null) {
      person.add("salesMarketing", salesLead);
    }
    if (advertising != null) {
      person.add("salesMarketing", advertising);
    }

    if (otherMarketing != null) {
      var marketingArray = separateTags(otherMarketing);
      for(var i=0, len=marketingArray.length; i < len; i++){
        var skill = marketingArray[i];
        person.add("salesMarketing", skill);
      }
    }
  } else {
    //TODO flag as 'missing info'
  }



//FUNDING
  if (funding == 0) {
    // do nothing, it will be set to []
  } else if (funding == 1) {

    if (crowdfunding != null) {
      person.add("funding", crowdfunding);
    }
    if (bizAngel != null) {
      person.add("funding", bizAngel);
    }
    if (vc != null) {
      person.add("funding", vc);
    }
    if (finance != null) {
      person.add("funding", finance);
    }
    if (bootstrapping != null) {
      person.add("funding", bootstrapping);
    }
    if (nonProfit != null) {
      person.add("funding", nonProfit);
    }
    if (publicSub != null) {
      person.add("funding", publicSub);
    }

    if (otherFunding != null) {
      var fundingArray = separateTags(otherFunding);
      for(var i=0, len=fundingArray.length; i < len; i++){
        var skill = fundingArray[i];
        person.add("funding", skill);
      }
    }
  } else {
    //TODO flag as 'missing info'
  }


//HUMAN SKILLS AND MANAGEMENT
if (humanSkills == 0) {
  // do nothing, it will be set to []
} else if (humanSkills == 1) {

  if (productivityOrganisation != null) {
    person.add("humanSkills", productivityOrganisation);
  }
  if (publicSpeaking != null) {
    person.add("humanSkills", publicSpeaking);
  }
  if (leadership != null) {
    person.add("humanSkills", leadership);
  }
  if (coaching != null) {
    person.add("humanSkills", coaching);
  }
  if (teamManagement != null) {
    person.add("humanSkills", teamManagement);
  }
  if (negotiation != null) {
    person.add("humanSkills", "negotiation");
  }

  if (otherHuman != null) {
    var humanArray = separateTags(otherHuman);
    for(var i=0, len=humanArray.length; i < len; i++){
      var skill = humanArray[i];
      person.add("humanSkills", skill);
    }
  }
} else {
  //TODO flag as 'missing info'
}

//TECH

if (tech == 0) {
  // do nothing, it will be set to []
} else if (tech == 1) {

  if (stack != null) {
    var stackArray = separateTags(stack);
    for(var i=0, len=stackArray.length; i < len; i++){
      var skill = stackArray[i];
      person.add("tech", skill);
    }
  }
  if (skill != null) {
    var skillArray = separateTags(skill);
    for(var i=0, len=skillArray.length; i < len; i++){
      var skill = skillArray[i];
      person.add("tech", skill);
    }
  }
} else {
  //TODO flag as 'missing info'
}


//INDUSTRIES

if (industries == 0) {
  // do nothing, it will be set to []
} else if (industries == 1) {

  if (artDesign != null) {
    person.add("industries", artDesign);
  }
  if (architecture != null) {
    person.add("industries", architecture);
  }
  if (charity != null) {
    person.add("industries", charity);
  }
  if (collabEcon != null) {
    person.add("industries", collabEcon);
  }
  if (consumerGoods != null) {
    person.add("industries", consumerGoods);
  }
  if (education != null) {
    person.add("industries", education);
  }
  if (energy != null) {
    person.add("industries", energy);
  }
  if (familyHomecare != null) {
    person.add("industries", familyHomecare);
  }
  if (fashionTextile != null) {
    person.add("industries", fashionTextile);
  }
  if (financialServices != null) {
    person.add("industries", financialServices);
  }
  if (foodTobacco != null) {
    person.add("industries", "food/beverages/tobacco");
  }
  if (healthcare != null) {
    person.add("industries", healthcare);
  }
  if (lifestyle != null) {
    person.add("industries", lifestyle);
  }
  if (marketingCommunication != null) {
    person.add("industries", marketingCommunication);
  }
  if (mediaEntertainment != null) {
    person.add("industries", mediaEntertainment);
  }
  if (musical != null) {
    person.add("industries", musical);
  }
  if (political != null) {
    person.add("industries", political);
  }
  if (professionalServices != null) {
    person.add("industries", professionalServices);
  }
  if (security != null) {
    person.add("industries", security);
  }
  if (semiconductors != null) {
    person.add("industries", semiconductors);
  }
  if (softwareServices != null) {
    person.add("industries", "software");
  }
  if (techHardware != null) {
    person.add("industries", techHardware);
  }

  if (telecom != null) {
    person.add("industries", "telecommunications");
  }

  if (transportLogistics != null) {
    person.add("industries", transportLogistics);
  }

  if (travelTourism != null) {
    person.add("industries", travelTourism);
  }


  if (otherIndustry != null) {
    var industryArray = separateTags(otherIndustry);
    for(var i=0, len=industryArray.length; i < len; i++){
      var skill = industryArray[i];
      person.add("industries", skill);
    }
  }
} else {
  //TODO flag as 'missing info'
}

//MOTIVATION


  if (passionWork != null) {
    person.add("motivation", passionWork);
  }
  if (passionEntrep != null) {
    person.add("motivation", passionEntrep);
  }
  if (skillTransmission != null) {
    person.add("motivation", skillTransmission);
  }
  if (networking != null) {
    person.add("motivation", networking);
  }
  if (startupTrends != null) {
    person.add("motivation", startupTrends);
  }
  if (bizOpportunity != null) {
    person.add("motivation", bizOpportunity);
  }
  if (invOpportunity != null) {
    person.add("motivation", invOpportunity);
  }
  if (otherPassion != null) {
    person.add("motivation", otherPassion);
  }

//FEEDBACK AND OPINION

  if (numaPositive != null) {
    person.set("positiveFeedback", numaPositive);
  }

  if (numaNegative != null) {
    person.set("negativeFeedback", numaNegative);
  }

//PREFERRED FORMAT

  if (oneToOne != null) {
    person.add("preferredCollaboration", oneToOne);
  }
  if (expertSessions != null) {
    person.add("preferredCollaboration", expertSessions);
  }
  if (personalStory != null) {
    person.add("preferredCollaboration", personalStory);
  }
  if (workshop != null) {
    person.add("preferredCollaboration", workshop);
  }
  if (officeHours != null) {
    person.add("preferredCollaboration", officeHours);
  }
  if (roundTable != null) {
    person.add("preferredCollaboration", roundTable);
  }
  if (expertTalk != null) {
    person.add("preferredCollaboration", expertTalk);
  }
  if (startupReview != null) {
    person.add("preferredCollaboration", startupReview);
  }
  if (otherHelp != null) {
    person.add("preferredCollaboration", otherHelp);
  }

//AVAILABILITY SCALE 1-10 (1-Don't bother me, I'm a diva !, 10-I can be around several hours a week)
  person.set("availabilty", available);

//OTHER

  if(mentorExchange == 0) {
    person.set("mentorExchange", false);
  }else if (mentorExchange == 1) {
    person.set("mentorExchange", true);
  }

  if(proudProject != null) {
    person.set("proudProject", proudProject);
  }

  return person;
}

Parse.Cloud.job("standardisePeople", function(request, status) {

  // Query for all upvotes
  //NOT FINISHED
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


Parse.Cloud.beforeSave("People", function(request, response) {

    console.log('accessed beforeSave People');

//REMOVE DUPLICATES & MAKE TAGS ARRAY
    arrayNames = ["biz", "humanSkills", "salesMarketing", "funding", "productDesign", "tech", "languages", "industries"];
    var allTags = [];
    for (var i = 0; i < arrayNames.length; i++) {
      var name = arrayNames[i];
      var array = request.object.get(name);
      if (array != null) {
        array = removeDuplicates(array);
        request.object.set(name, array);
        allTags = allTags.concat(array);
      }
    }

    if(allTags)
    allTags = removeDuplicates(allTags);
    console.log(request.object.get("lastName"));
    console.log(allTags);
    request.object.set("tags", allTags);

    response.success();

});


Parse.Cloud.job("makeTagsArrays", function(request, status) {

  // Query for all upvotes
  //NOT FINISHED
  var Tags = Parse.Object.extend("Tags");
  var tagQuery = new Parse.Query(Tags);
  tagQuery.equalTo("name", "All Tags"); //the class only contains one object, called All Tags

  var Startups = Parse.Object.extend("Startups");
  var query = new Parse.Query(Startups);

  var allTags =[]; //array with all tags (not unique)

  query.each(function(startup) {

      //Get tags from each startup and create array of tags
      var tagsString = startup.get("tags");
      var name = startup.get("name");
      if(tagsString != null) {
        var tagsArray = separateTags(tagsString);
      } else {
        var tagsArray = [];
      }

      tagsArray = tagsArray.filter(function(item, pos) {
        return tagsArray.indexOf(item) == pos;
      });
      startup.set("tagsArray", tagsArray);
      startup.save();

  }).then(function() {
      status.success("makeTagsArrays success");
  }, function(error) {
      status.error("makeTagsArrays something went wrong.");
  });
});

Parse.Cloud.job("getUniqueTags", function(request, status) {

  // Query for all upvotes
  //NOT FINISHED
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
        var tags = separateTags(tagsString);
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


Parse.Cloud.define("getTagsAndIndustries", function(request, response) {

//This returns a list of tags associated with the evaluator and a boolean for each of "Product", "Tech" and "Biz" categories

  var email = request.params.email;
  var People = Parse.Object.extend("People");
  var query = new Parse.Query(People);
  query.equalTo("email", email);

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

      outcome.push({
        "valid" : emailExists
      });


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
    arr = arr.sort(compareDates);
    response.success(arr);
  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

});


Parse.Cloud.define("getStartups", function(request, response) {


  var evaluatorExpertise = request.params.expertise;

  console.log("expertise : " + evaluatorExpertise);

  var evaluatorIndustry = request.params.industry;
  var evaluatorTagsString = request.params.tags;
  var evaluatorTags = separateTags(evaluatorTagsString);
  evaluatorTags = evaluatorTags.concat(evaluatorIndustry); //we're using the industries as just regular tags

  //filter out the duplicates
  // evaluatorTags = evaluatorTags.filter(function(item, pos) {
  //   return evaluatorTags.indexOf(item) == pos;
  // });

  evaluatorTags = removeDuplicates(evaluatorTags);

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
      tagsArray = separateTags(startupTags);
      // tagsArray = tagsArray.filter(function(item, pos) {
      //   return tagsArray.indexOf(item) == pos;
      // });
      tagsArray = removeDuplicates(tagsArray);
      startup.set("tagsArray", tagsArray);
      startup.save();
    }

    if(tagsArray == null) {
      tagsArray = [];
    }

    //var startupTags = separateTags(startupTags); //startupTags is a comma separated string of tags, need to be converted to an array first
    var fitScore = getFitScore(tagsArray, evaluatorTags);

    // if(startupTags == null) {
    //   startupTags = "placeholder";
    // }

    startups.push({
    "Id" : id,
    "Name" : name,
    "Tagline" : tagline,
    "FitScore" : fitScore
    });

  }).then(function(results){

    startups = startups.sort(compareScores);
    response.success(startups);
    //response.success(arr.slice(0,10));

  }, function(error) {
    response.error(error.code + " : " + error.message);
  });

});


Parse.Cloud.define("submit", function(request, response) {

  var Startups = Parse.Object.extend("Startups");
  var Evaluators = Parse.Object.extend("Evaluators");

  var email = request.params.email;

  var selected = request.params.selected;
  var expertise = request.params.expertise;
  var allNames = []; //where we store the names of all startups assigned to evaluator
  var evaluator;

  console.log("expertise : " + expertise);
  console.log("email : " + email);

  var evaluatorQuery = new Parse.Query(Evaluators);
  evaluatorQuery.equalTo("Email", email);

  evaluatorQuery.find().then(function(results){

      if ( results.length == 0 ) {
        console.error("no such evaluator");
      } else if (results.length > 0) {
        evaluator = results[0];
      }

      var startupQuery = new Parse.Query(Startups);
      startupQuery.containedIn("objectId", selected);
      return startupQuery.find();

  }).then(function(results){

    for(var i=0, len=results.length; i < len; i++){
      var startup = results[i];
      var id = startup.id;
      name = startup.get("name");
      startup.set(expertise, evaluator);  //pointer
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
      assignment.set("expertise", expertise); //pointer
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
