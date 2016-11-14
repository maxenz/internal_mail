(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = [
    'loginService',
    '$state',
    '$ionicPopup',
    'utilsService',
    'ERRORS'
  ]

  function LoginCtrl(
    loginService,
    $state,
    $ionicPopup,
    utilsService,
    ERRORS
  ) {

    var vm = this;
    vm.login = login;
    vm.data = {};

    function login() {

      if (validate()) {

        // --> [START_SOAP_MISSING]
        window.localStorage.setItem("r4c1ng", 2 + "&r4c1ng");
        loginService.data.isAuthenticated = true;
        //loginService.data.isAuthenticated = true;
        //loginService.data.authData = result;
        $state.go('tab.settings');
        return;
        // --> [END_SOAP_MISSING]

        loginService.login(vm.data).success(function(response) {

          var json                = utilsService.xmlToJsonResponse(response);
          var result              = json.loginMobileGerencialResponse.loginMobileGerencialResult.diffgram.defaultDataSet.sQL;

          if (result) {

            window.localStorage.setItem("r4c1ng", result.id + "&r4c1ng");
            loginService.data.isAuthenticated = true;
            loginService.data.authData = result;
            $state.go('tab.monitors');

          } else {

            utilsService.showAlert('Error!',ERRORS.incorrectData);
            vm.data.password = '';

          }

        }).error(function(data) {

          utilsService.showAlert('Error!',ERRORS.incorrectData);

        });

      }

    }

    function validate() {
      if (!vm.data.userName || !vm.data.password) {
        utilsService.showAlert('Error!', ERRORS.mustEnterUserAndPassword);
        return false;
      }

      return true;

    }


  }

})();
