(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('OrderCtrl', OrderCtrl);

  OrderCtrl.$inject = [
    'loginService',
    'orderService',
    'utilsService',
    '$state',
    '$ionicLoading',
    'ionicDatePicker',
    'ERRORS'
  ];

  function OrderCtrl(
    loginService,
    orderService,
    utilsService,
    $state,
    $ionicLoading,
    ionicDatePicker,
    ERRORS
  ) {
    
    // --> Declarations
    var datepickerDate, datepickerFrom, datepickerTo;
    var vm            = this;
    vm.submit         = submit;
    vm.openDatePicker = openDatePicker;
    vm.data           = {};
    activate();

    // --> Functions
    function activate() {
      if (!loginService.isAuthenticated()) {
        $state.go('login');
      }

      initializeDatepickerDate();
      initializeDatepickerTo();
      initializeDatepickerFrom();
    }

    function submit() {

      $ionicLoading.show({
        template: 'Creando orden...'
      });
      orderService
      .createOrder(vm.data)
      .then(function(response){
        var result = orderService.parseOrderResult(response);
        $ionicLoading.hide();
        if (parseInt(result.resultado) === 1) {
          utilsService.showAlert('Operación exitosa!', 'La orden se creó correctamente.');
        } else {
          utilsService.showAlert('Error!', result.mensajeError);
        }
      });

    }

    function openDatePicker(dateType){

      switch (dateType) {
        case 0:
        ionicDatePicker.openDatePicker(datepickerDate);
        break;
        case 1:
        ionicDatePicker.openDatePicker(datepickerFrom);
        break;
        case 2:
        ionicDatePicker.openDatePicker(datepickerTo);
        break;
      }

    }

    function initializeDatepickerDate() {

      vm.data.date = moment();

      datepickerDate = {
        callback: function (val) {

          var date = moment(val);
          var dateFrom = moment(vm.data.dateFrom);
          var dateTo = moment(vm.data.dateTo);

          if (validateDates(date, dateFrom, dateTo)) {
            vm.data.date = date;
          }

        }
      };
    }

    function initializeDatepickerFrom() {

      vm.data.dateFrom = moment().add(-4, 'days');

      datepickerFrom = {
        callback: function (val) {

          var dateFrom = moment(val);
          var date = moment(vm.data.date);
          var dateTo = moment(vm.data.dateTo);

          if (validateDates(date, dateFrom, dateTo)) {
            vm.data.dateFrom = dateFrom;
          }

        }
      };
    }

    function initializeDatepickerTo() {

      vm.data.dateTo   = moment().add(-1, 'days');

      datepickerTo = {
        callback: function (val) {

          var dateTo = moment(val);
          var date = moment(vm.data.date);
          var dateFrom = moment(vm.data.dateFrom);

          if (validateDates(date, dateFrom, dateTo)) {
            vm.data.dateTo = dateTo;
          }

        }
      };
    }

    function validateDates(date, _from, to) {

      if (_from > to) {
        utilsService.showAlert('Error!', ERRORS.dateFromMustBeSmallerThanDateTo);
        return false;
      }

      if (_from > date || to > date) {
        utilsService.showAlert('Error!', ERRORS.receptionDateMustBeGreatherThan);
        return false;
      }

      return true;

    }

  }

})();
