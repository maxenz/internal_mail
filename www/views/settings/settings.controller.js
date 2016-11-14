(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = [
    '$ionicPopup',
    'ERRORS',
    'settingsService',
    'utilsService',
    'loginService',
    '$state'
  ];

  function SettingsCtrl(
    $ionicPopup,
    ERRORS,
    settingsService,
    utilsService,
    loginService,
    $state
  ) {

    // --> Declarations
    var vm                 = this;
    vm.data                = {};
    vm.data.messages       = ERRORS;
    vm.generateUrl         = generateUrl;
    vm.settingsService     = settingsService;

    activate();

    // --> Functions
    function activate() {
      if (!loginService.isAuthenticated()) {
        $state.go('login');
      }
    }

    function generateUrl() {

      if (!vm.data.license) {
        utilsService.showAlert('Error!',ERRORS.mustEnterLicense);
        return;
      }

      settingsService.generateUrl(vm.data)
      .success(function(response) {
        if (!response.Error) {
          settingsService.setUrl(response);
        } else {
          utilsService.showAlert('Error!', response.Message);
        }

      })
      .error(function(error){
        utilsService.showAlert('Error!', ERRORS.genericUrlProcess);
      });

    }


  }

})();
