var utilities = require('cloud/utilityFunctions.js');


module.exports = {

  compareScores: function(a,b) {
    if (a.FitScore < b.FitScore)
      return 1;
    if (a.FitScore > b.FitScore)
      return -1;
    return 0;
  },


  getFitScore: function(startupTags, evaluatorTags) {
    var commonElements = utilities.intersectArrays(startupTags, evaluatorTags);
    //console.log("startup tags : " + startupTags);
    //console.log(commonElements);
    var fitScore = commonElements.length;
    //console.log(fitScore);
    return fitScore;
  }


}
