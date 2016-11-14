(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('OrderCtrl', OrderCtrl);

  OrderCtrl.$inject = [
    'loginService',
    '$state'
  ];

  function OrderCtrl(
    loginService,
    $state
  ) {

    // --> Declarations
    var vm = this;
    activate();

    // --> Functions
    function activate() {
      if (!loginService.isAuthenticated()) {
        $state.go('login');
      }
    }

  }

})();
