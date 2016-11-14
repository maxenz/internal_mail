(function(){

  angular
  .module('internalMail.services')
  .factory('settingsService', settingsService);

  settingsService.$inject = [
    'URLS',
    'utilsService',
    '$http',
    '$ionicPopup'
  ];

  function settingsService(
    URLS,
    utilsService,
    $http,
    $ionicPopup
  ) {

    var service = {
      generateUrl             : generateUrl,
      setUrl                  : setUrl,
      getUrl                  : getUrl
    };

    return service;

    function generateUrl(data) {

      var url = URLS.gestion + "android/getClientServerConnection?serial=" + data.license;
      return $http.get(url);

    }

    function setUrl(response) {

      window.localStorage.setItem("url", response.ConexionServidor);

    }

    function getUrl() {

      return window.localStorage.getItem("url");

    }

  }

}());
