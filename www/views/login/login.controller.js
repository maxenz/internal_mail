(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = [
    'loginService',
    '$state',
    '$ionicPopup',
    'utilsService',
    'ERRORS',
    '$ionicLoading'
  ]

  function LoginCtrl(
    loginService,
    $state,
    $ionicPopup,
    utilsService,
    ERRORS,
    $ionicLoading
  ) {

    var vm = this;
    vm.login = login;
    vm.data = {};

    function login() {

      if (validate()) {

        $ionicLoading.show({
          template: 'Iniciando sesión...'
        });
        loginService.login(vm.data)
        .then(function(response) {

          var result = loginService.parseLoginResponse(response);

          if (result) {
            window.localStorage.setItem("r4c1ng", result.id + "&r4c1ng");
            window.localStorage.setItem("user", result.identificacion);
            window.localStorage.setItem("userId", parseInt(result.id));
            loginService.data.isAuthenticated = true;
            loginService.data.authData = result;
            $state.go('tab.orders');

          } else {

            utilsService.showAlert('Error!',ERRORS.incorrectData);
            vm.data.password = '';

          }


        }).catch(function(data) {

          utilsService.showAlert('Error!',ERRORS.incorrectData);

        }).finally(function(){
          $ionicLoading.hide();
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
