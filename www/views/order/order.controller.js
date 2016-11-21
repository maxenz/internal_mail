(function () {

  'use strict';

  angular.module('internalMail.controllers')

  .controller('OrderCtrl', OrderCtrl);

  OrderCtrl.$inject = [
    'loginService',
    'orderService',
    'utilsService',
    'ordersService',
    '$state',
    '$ionicLoading',
    'ionicDatePicker',
    'ERRORS'
  ];

  function OrderCtrl(
    loginService,
    orderService,
    utilsService,
    ordersService,
    $state,
    $ionicLoading,
    ionicDatePicker,
    ERRORS
  ) {

    // --> Declarations
    var datepickerDate, datepickerFrom, datepickerTo;
    var vm                   = this;
    vm.data                  = {};
    vm.submit                = submit;
    vm.openDatePicker        = openDatePicker;
    vm.cantCalculateQuantity = cantCalculateQuantity;
    vm.getReportsQuantity    = getReportsQuantity;
    vm.ordersService         = ordersService;
    vm.generateNewOrder      = generateNewOrder;
    activate();

    // --> Functions
    function activate() {
      if (!loginService.isAuthenticated()) {
        $state.go('login');
      }

      ordersService.generateNewOrder();
      initializeDatepickerDate();
      initializeDatepickerTo();
      initializeDatepickerFrom();

    }

    function submit() {

      $ionicLoading.show({
        template: 'Creando orden...'
      });
      orderService
      .createOrder()
      .then(function(response){
        var result = orderService.parseOrderResult(response);
        $ionicLoading.hide();
        if (parseInt(result.resultado) === 1) {
          var orderId = ordersService.selectedOrder.id;
          var mobile = ordersService.selectedOrder.mobile;
          if (orderId) {
            utilsService.showAlert('Operación exitosa!', 'La orden del móvil ' + mobile + ' se editó correctamente.');
          } else {
            utilsService.showAlert('Operación exitosa!', 'La orden se creó correctamente.');
          }

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

    function cantCalculateQuantity() {
      return !vm.ordersService.selectedOrder.dateFrom || !vm.ordersService.selectedOrder.dateTo || !vm.ordersService.selectedOrder.mobile;
    }

    function getReportsQuantity() {
      $ionicLoading.show({
        template: 'Consultando cantidad de reportes...'
      });
      orderService
      .getReportsQuantity(vm.ordersService.selectedOrder)
      .then(function(response){
        vm.ordersService.selectedOrder.reportsQuantity = orderService.parseReportsQuantityResult(response);
        $ionicLoading.hide();
      });

    }

    function generateNewOrder() {
      vm.ordersService.generateNewOrder();
      activate();
      vm.orderForm.$setUntouched();
    }

    function initializeDatepickerDate() {

      vm.ordersService.selectedOrder.date = moment();

      datepickerDate = {
        callback: function (val) {

          var date = moment(val);
          var dateFrom = moment(vm.ordersService.selectedOrder.dateFrom);
          var dateTo = moment(vm.ordersService.selectedOrder.dateTo);

          if (validateDates(date, dateFrom, dateTo)) {
            vm.ordersService.selectedOrder.date = date;
          }

        }
      };
    }

    function initializeDatepickerFrom() {

      vm.ordersService.selectedOrder.dateFrom = moment().add(-4, 'days');

      datepickerFrom = {
        callback: function (val) {

          var dateFrom = moment(val);
          var date = moment(vm.ordersService.selectedOrder.ate);
          var dateTo = moment(vm.ordersService.selectedOrder.dateTo);

          if (validateDates(date, dateFrom, dateTo)) {
            vm.ordersService.selectedOrder.dateFrom = dateFrom;
          }

        }
      };
    }

    function initializeDatepickerTo() {

      vm.ordersService.selectedOrder.dateTo   = moment().add(-1, 'days');

      datepickerTo = {
        callback: function (val) {

          var dateTo = moment(val);
          var date = moment(vm.ordersService.selectedOrder.date);
          var dateFrom = moment(vm.ordersService.selectedOrder.dateFrom);

          if (validateDates(date, dateFrom, dateTo)) {
            vm.ordersService.selectedOrder.dateTo = dateTo;
          }

        }
      };
    }

    function validateDates(receptionDate, _from, to) {

      if (_from.dayOfYear() > to.dayOfYear()) {
        utilsService.showAlert('Error!', ERRORS.dateFromMustBeSmallerThanDateTo);
        return false;
      }

      if (_from.dayOfYear() > receptionDate.dayOfYear() || to.dayOfYear() > receptionDate.dayOfYear()) {
        utilsService.showAlert('Error!', ERRORS.receptionDateMustBeGreatherThan);
        return false;
      }

      return true;

    }

  }

})();
