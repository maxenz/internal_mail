(function(){

  angular
  .module('internalMail.services')
  .factory('utilsService', utilsService);

  utilsService.$inject = [
    '$ionicPopup',
    '$ionicLoading',
    '$http',
    '$q'
  ];

  function utilsService(
    $ionicPopup,
    $ionicLoading,
    $http,
    $q
  ) {

    var service = {
      toCamel                 : toCamel,
      showAlert               : showAlert,
      showLoading             : showLoading,
      getPromise              : getPromise,
      executeMultipleRequests : executeMultipleRequests,
      xmlToJsonResponse       : xmlToJsonResponse,
      capitalizeFirstLetter   : capitalizeFirstLetter,
      uniqueArray             : uniqueArray,
      minutesToTime           : minutesToTime,
      setResponseAsArray      : setResponseAsArray
    };

    return service;

    function toCamel(o) {
      var build, key, destKey, value;

      if (o instanceof Array) {
        build = [];
        for (key in o) {
          value = o[key];

          if (typeof value === "object") {
            value = toCamel(value);
          }
          build.push(value);
        }
      } else {
        build = {};
        for (key in o) {
          if (o.hasOwnProperty(key)) {
            if (key !== 'ID') {
              destKey = (key.charAt(0).toLowerCase() + key.slice(1) || key).toString();
            } else {
              destKey = 'id';
            }
            value = o[key];
            if (value !== null && typeof value === "object") {
              value = toCamel(value);
            }

            build[destKey] = value;
          }
        }
      }
      return build;
    }

    function showAlert(title, message) {
      $ionicPopup.alert({
        title : title,
        template: message
      });
    }

    function showLoading(template) {
      $ionicLoading.show({
        template: template
      });
    }

    function getPromise(url) {
      return $http.get(url);
    }

    function executeMultipleRequests(promises) {

      var deferred = $q.defer();

      $q.all(promises)
      .then(function (results) {
        deferred.resolve(results);
      },
      function (errors) {
        deferred.reject(errors);
      });

      return deferred.promise;
    }

    function xmlToJsonResponse(response) {
      return toCamel($.xml2json(response)).body;
    }

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function uniqueArray(vec) {
      var arr = [];
      for(var i = 0; i < vec.length; i++) {
        if(!contains(vec[i], arr)) {
          arr.push(vec[i]);
        }
      }
      return arr;
    }

    function contains(v, vec) {
      for(var i = 0; i < vec.length; i++) {
        if(vec[i] === v) return true;
      }
      return false;
    }

    function minutesToTime(minutes) {
      minutes = parseInt(minutes);
      var hours = moment.duration(minutes,'minutes').asHours();
      var justHour = Math.floor(hours);
      var decimalPart = hours % 1;
      var justMinutes = parseInt(moment.duration(decimalPart, 'hours').asMinutes());

      var fmtMinutes = justMinutes < 10 ? '0' + justMinutes : justMinutes;
      var fmtHours   = justHour < 10 ? '0' + justHour : justHour;
      return fmtHours + ':' + fmtMinutes;
    }

    function setResponseAsArray(response) {
      if (Array.isArray(response)){
        return response;
      } else {
        return [response];
      }
    }

  }

}());
