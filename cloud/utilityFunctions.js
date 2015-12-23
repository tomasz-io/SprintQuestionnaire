module.exports = {
  separateTags: function(string) {
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
    } else {
      arr = [string];
    }

    return arr
  },


  toLowerCase: function(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim().toLowerCase(); //remove leading and trailing whitespace
    }
    return arr
  },

  removeDuplicates: function(array) {

    array = this.toLowerCase(array);
    var filteredArray = array.filter(function(item, pos) {
      return array.indexOf(item) == pos;
    });

    return filteredArray;
  },

  isInArray: function(value, array) {
    return array.indexOf(value) > -1;
  },

  compareDates: function(a,b) {
    if (a.UpdatedAt < b.UpdatedAt)
      return -1;
    if (a.UpdatedAt > b.UpdatedAt)
      return 1;
    return 0;
  },

  checkIfEmailInString: function(text) {

    //this is a regex function for checking if the string contains an email address.
      var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
      return re.test(text);
  },

  intersectArrays: function(arr1, arr2) {
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
  },

  averageArray: function(arr) {
    var total = 0;
    for(var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    var avg = total / arr.length;
    return avg;
  }

}
