(function(){

  angular
  .module('internalMail.services')
  .factory('loginService', loginService);

  loginService.$inject = [
    'URLS',
    'utilsService',
    '$http',
    '$state'
  ];

  function loginService(
    URLS,
    utilsService,
    $http,
    $state
  ) {

    var service = {
      login               : login,
      parseLoginResponse  : parseLoginResponse,
      data                : {},
      loadUserCredentials : loadUserCredentials,
      isAuthenticated     : isAuthenticated,
      logout              : logout
    };

    return service;

    function login (userData) {

      var url = URLS.login +
       'soap_method=LoginMobileGerencial' +
       '&pIde=' + userData.userName +
       '&pPsw=' + userData.password;

      return $http.post(url).then(function(response) {
        return response.data;
      });
    }

    function parseLoginResponse(data) {
      var json      = utilsService.xmlToJsonResponse(data);
      var loginData = json.loginMobileGerencialResponse.loginMobileGerencialResult.diffgram.defaultDataSet.sQL;
      return loginData;
    }

    function loadUserCredentials() {
      var token = window.localStorage.getItem('r4c1ng');
      if (token) {
        service.data.isAuthenticated = true;
      }
    }

    function isAuthenticated() {
      return service.data.isAuthenticated;
    }

    function logout() {
      service.data.isAuthenticated = false;
      delete window.localStorage.user;
      delete window.localStorage.userId;
      delete window.localStorage.r4c1ng;
      $state.go('login');
    }

  }

}());
