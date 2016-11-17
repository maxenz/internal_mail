(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('OrdersCtrl', OrdersCtrl);

  OrdersCtrl.$inject = [
    'loginService',
    'utilsService',
    'ordersService',
    '$state',
    'ionicDatePicker',
    'ERRORS',
    '$ionicLoading'
  ];

  function OrdersCtrl(
    loginService,
    utilsService,
    ordersService,
    $state,
    ionicDatePicker,
    ERRORS,
    $ionicLoading
  ) {

    // --> Declarations

    var datepickerFrom, datepickerTo;
    var vm            = this;
    vm.data           = {};
    vm.data.filters   = {};
    vm.filterOrders   = filterOrders;
    vm.openDatePicker = openDatePicker;
    vm.ordersService  = ordersService;

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

      vm.data.filters.from = moment();

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

      vm.data.filters.to = moment();

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
      $ionicLoading.show({
        template: 'Cargando órdenes...'
      });
      ordersService
      .getOrders(vm.data.filters)
      .then(function(response){
        ordersService.setOrders(response);
        $ionicLoading.hide();
      });

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
