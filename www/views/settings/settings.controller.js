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
    '$state',
    '$scope',
    'ordersService',
    'orderService'
  ];

  function SettingsCtrl(
    $ionicPopup,
    ERRORS,
    settingsService,
    utilsService,
    loginService,
    $state,
    $scope,
    ordersService,
    orderService
  ) {

    // --> Declarations
    var vm = this;
    vm.data = {};
    vm.data.user = null;
    vm.data.messages = ERRORS;
    vm.generateUrl = generateUrl;
    vm.settingsService = settingsService;
    vm.logout = logout;
    vm.updateOperationalBases = updateOperationalBases;

    activate();

    $scope.$on('$ionicView.beforeEnter', function () {
      vm.data.user = window.localStorage.getItem('user');
    });

    // --> Functions
    function activate() {
      if (!loginService.isAuthenticated()) {
        $state.go('login');
      }
    }

    function generateUrl() {

      if (!vm.data.license) {
        utilsService.showAlert('Error!', ERRORS.mustEnterLicense);
        return;
      }

      settingsService.generateUrl(vm.data)
        .success(function (response) {
          if (!response.Error) {
            settingsService.setUrl(response);
          } else {
            utilsService.showAlert('Error!', response.Message);
          }

        })
        .error(function (error) {
          utilsService.showAlert('Error!', ERRORS.genericUrlProcess);
        });

    }

    function logout() {
      ordersService.orders = [];
      loginService.logout();
    }

    function updateOperationalBases() {
      orderService.getOperationalBases(true);
    }

  }

})();
