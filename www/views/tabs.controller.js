(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('TabsCtrl', TabsCtrl);

  TabsCtrl.$inject = [
    'settingsService'
  ];

  function TabsCtrl(
    settingsService
  ) {

    // --> Declarations
    var vm                 = this;
    vm.settingsService     = settingsService;

  }

})();
