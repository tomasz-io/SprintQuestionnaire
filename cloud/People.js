Parse.Cloud.beforeSave("People", function(request, response) {

    console.log('accessed beforeSave People');

//REMOVE DUPLICATES & MAKE TAGS ARRAY
    arrayNames = ["tags", "languages", "industries", "skillProfile"];
    var allTags = [];
    for (var i = 0; i < arrayNames.length; i++) {
      var name = arrayNames[i];
      var array = request.object.get(name);
      console.log("array: " + array);
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

    person.add("skillProfile", "business");

    if (bizStrategy != null) {
      person.add("tags", bizStrategy);
    }
    if (legal != null) {
      person.add("tags", legal);
    }
    if (financialConsulting != null) {
      person.add("tags", financialConsulting);
    }
    if (gettingStarted != null) {
      person.add("tags", gettingStarted);
    }
    if (hr != null) {
      person.add("tags", hr);
    }
    if (businessDev != null) {
      person.add("tags", businessDev);
    }
    if (careerAdvice != null) {
      person.add("tags", careerAdvice);
    }
    if (internationalDev != null) {
      person.add("tags", internationalDev);
    }
    if (otherBiz != null) {
      var bizArray = separateTags(otherBiz);
      for(var i=0, len=bizArray.length; i < len; i++){
        var skill = bizArray[i];
        person.add("tags", skill);
      }
    }

  } else {
    //TODO flag as 'missing info'
  }


//PRODUCT AND DESIGN
  if (productDesign == 0) {
    // do nothing, it will be set to []
  } else if (productDesign == 1) {

    person.add("skillProfile", "product & design");

    if (ux != null) {
      person.add("tags", ux);
    }
    if (leanStartup != null) {
      person.add("tags", leanStartup);
    }
    if (productManagement != null) {
      person.add("tags", productManagement);
    }
    if (metricsAnalytics != null) {
      person.add("tags", metricsAnalytics);
    }
    if (prototyping != null) {
      person.add("tags", prototyping);
    }
    if (userResearch != null) {
      person.add("tags", userResearch);
    }
    if (graphicDesigner != null) {
      person.add("tags", graphicDesigner);
    }

    if (otherProduct != null) {
      var prodArray = separateTags(otherProduct);
      for(var i=0, len=prodArray.length; i < len; i++){
        var skill = prodArray[i];
        person.add("tags", skill);
      }
    }
  } else {
    //TODO flag as 'missing info'
  }

//SALES & MARKETING
  if (salesMarketing == 0) {
    // do nothing, it will be set to []
  } else if (salesMarketing == 1) {

    person.add("skillProfile", "sales & marketing");

    if (socialMedia != null) {
      person.add("tags", socialMedia);
    }
    if (seo != null) {
      person.add("tags", seo);
    }
    if (pr != null) {
      person.add("tags", pr);
    }
    if (branding != null) {
      person.add("tags", branding);
    }
    if (publishing != null) {
      person.add("tags", publishing);
    }
    if (inboundMarketing != null) {
      person.add("tags", inboundMarketing);
    }
    if (emailMarketing != null) {
      person.add("tags", emailMarketing);
    }
    if (copywriting != null) {
      person.add("tags", copywriting);
    }
    if (growthStrategy != null) {
      person.add("tags", growthStrategy);
    }
    if (sem != null) {
      person.add("tags", sem);
    }
    if (salesLead != null) {
      person.add("tags", salesLead);
    }
    if (advertising != null) {
      person.add("tags", advertising);
    }

    if (otherMarketing != null) {
      var marketingArray = separateTags(otherMarketing);
      for(var i=0, len=marketingArray.length; i < len; i++){
        var skill = marketingArray[i];
        person.add("tags", skill);
      }
    }
  } else {
    //TODO flag as 'missing info'
  }



//FUNDING
  if (funding == 0) {
    // do nothing, it will be set to []
  } else if (funding == 1) {

    person.add("skillProfile", "funding");

    if (crowdfunding != null) {
      person.add("tags", crowdfunding);
    }
    if (bizAngel != null) {
      person.add("tags", bizAngel);
    }
    if (vc != null) {
      person.add("tags", vc);
    }
    if (finance != null) {
      person.add("tags", finance);
    }
    if (bootstrapping != null) {
      person.add("tags", bootstrapping);
    }
    if (nonProfit != null) {
      person.add("tags", nonProfit);
    }
    if (publicSub != null) {
      person.add("tags", publicSub);
    }

    if (otherFunding != null) {
      var fundingArray = separateTags(otherFunding);
      for(var i=0, len=fundingArray.length; i < len; i++){
        var skill = fundingArray[i];
        person.add("tags", skill);
      }
    }
  } else {
    //TODO flag as 'missing info'
  }


//HUMAN SKILLS AND MANAGEMENT
if (humanSkills == 0) {
  // do nothing, it will be set to []
} else if (humanSkills == 1) {

  person.add("skillProfile", "human skills & management");

  if (productivityOrganisation != null) {
    person.add("tags", productivityOrganisation);
  }
  if (publicSpeaking != null) {
    person.add("tags", publicSpeaking);
  }
  if (leadership != null) {
    person.add("tags", leadership);
  }
  if (coaching != null) {
    person.add("tags", coaching);
  }
  if (teamManagement != null) {
    person.add("tags", teamManagement);
  }
  if (negotiation != null) {
    person.add("tags", "negotiation");
  }

  if (otherHuman != null) {
    var humanArray = separateTags(otherHuman);
    for(var i=0, len=humanArray.length; i < len; i++){
      var skill = humanArray[i];
      person.add("tags", skill);
    }
  }
} else {
  //TODO flag as 'missing info'
}

//TECH

if (tech == 0) {
  // do nothing, it will be set to []
} else if (tech == 1) {

  person.add("skillProfile", "technology");

  if (stack != null) {
    var stackArray = separateTags(stack);
    for(var i=0, len=stackArray.length; i < len; i++){
      var skill = stackArray[i];
      person.add("tags", skill);
    }
  }
  if (skill != null) {
    var skillArray = separateTags(skill);
    for(var i=0, len=skillArray.length; i < len; i++){
      var skill = skillArray[i];
      person.add("tags", skill);
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

  // if (numaPositive != null) {
  //   person.set("positiveFeedback", numaPositive);
  // }
  //
  // if (numaNegative != null) {
  //   person.set("negativeFeedback", numaNegative);
  // }

//PREFERRED FORMAT

  // if (oneToOne != null) {
  //   person.add("preferredCollaboration", oneToOne);
  // }
  // if (expertSessions != null) {
  //   person.add("preferredCollaboration", expertSessions);
  // }
  // if (personalStory != null) {
  //   person.add("preferredCollaboration", personalStory);
  // }
  // if (workshop != null) {
  //   person.add("preferredCollaboration", workshop);
  // }
  // if (officeHours != null) {
  //   person.add("preferredCollaboration", officeHours);
  // }
  // if (roundTable != null) {
  //   person.add("preferredCollaboration", roundTable);
  // }
  // if (expertTalk != null) {
  //   person.add("preferredCollaboration", expertTalk);
  // }
  // if (startupReview != null) {
  //   person.add("preferredCollaboration", startupReview);
  // }
  // if (otherHelp != null) {
  //   person.add("preferredCollaboration", otherHelp);
  // }

//AVAILABILITY SCALE 1-10 (1-Don't bother me, I'm a diva !, 10-I can be around several hours a week)
  // person.set("availabilty", available);

//OTHER

  // if(mentorExchange == 0) {
  //   person.set("mentorExchange", false);
  // }else if (mentorExchange == 1) {
  //   person.set("mentorExchange", true);
  // }

  if(proudProject != null) {
    person.set("proudProject", proudProject);
  }

  person.set("isComplete", true);

  return person;
}
