(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('OrdersCtrl', OrdersCtrl);

  OrdersCtrl.$inject = [
    'loginService',
    '$state',
    'ionicDatePicker',
    'utilsService',
    'ERRORS'
  ];

  function OrdersCtrl(
    loginService,
    $state,
    ionicDatePicker,
    utilsService,
    ERRORS
  ) {

    // --> Declarations

    var datepickerFrom, datepickerTo;
    var vm            = this;
    vm.data           = {};
    vm.data.filters   = {};
    vm.filterOrders   = filterOrders;
    vm.openDatePicker = openDatePicker;

    activate();

    // --> Functions
    function activate() {

      if (!loginService.isAuthenticated()) {
        $state.go('login');
      }

      initializeDatepickerFrom();
      initializeDatepickerTo();

    }

    function initializeDatepickerFrom() {
      datepickerFrom = {
        callback: function (val) {
          var dateFrom = moment(val);
          if (vm.data.filters.to) {
            var dateTo = moment(vm.data.filters.to);
            if (dateFrom > dateTo) {
              utilsService.showAlert('Error!', ERRORS.dateFromMustBeSmallerThanDateTo);
              return;
            }
          }

          vm.data.filters.from = dateFrom;
        }
      };
    }

    function initializeDatepickerTo() {
      datepickerTo = {
        callback: function (val) {

          var dateTo = moment(val);

          var dateFrom = moment(vm.data.filters.from);
          if (dateFrom > dateTo) {
            utilsService.showAlert('Error!', ERRORS.dateFromMustBeSmallerThanDateTo);
            return;
          }

          vm.data.filters.to = dateTo;

        }
      };
    }

    function filterOrders() {

    }

    function openDatePicker(from){

      if (!from && !vm.data.filters.from) {
        utilsService.showAlert('Error!', ERRORS.mustCompleteDateFrom);
        return;
      }

      if (from) {
        if (vm.data.filters.from) {
          datepickerFrom.inputDate = vm.data.filters.from.toDate();
        }
        ionicDatePicker.openDatePicker(datepickerFrom);
      } else {
        if (vm.data.filters.to) {
          datepickerTo.inputDate = vm.data.filters.to.toDate();
        }
        ionicDatePicker.openDatePicker(datepickerTo);
      }

    }

  }

})();
