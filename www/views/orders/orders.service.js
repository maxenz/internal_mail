(function () {

  angular
    .module('internalMail.services')
    .factory('ordersService', ordersService);

  ordersService.$inject = [
    'URLS',
    'utilsService',
    '$http',
    '$ionicPopup',
    '$ionicTabsDelegate',
    '$ionicLoading'
  ];

  function ordersService(URLS,
                         utilsService,
                         $http,
                         $ionicPopup,
                         $ionicTabsDelegate,
                         $ionicLoading) {


    var service = {
      getOrders: getOrders,
      setOrders: setOrders,
      editOrder: editOrder,
      generateNewOrder: generateNewOrder,
      filterOrders: filterOrders,
      selectedOrder: convertOrderToViewModel({}),
      orders: [],
      doctors: [],
      data: {
        filters: {
          from: moment(),
          to: moment()
        }
      },
      getDoctors: getDoctors
    };

    return service;

    function filterOrders() {

      $ionicLoading.show({
        template: 'Cargando órdenes...'
      });

      service
        .getOrders(service.data.filters)
        .then(function (response) {
          service.setOrders(response);
        }, function (error) {
          utilsService.showAlert('Error!', 'No se pudieron obtener las órdenes');
        })
        .finally(function () {
          $ionicLoading.hide();
        });

    }

    function getOrders(data) {

      var url = URLS.orders
        + 'soap_method=GetRecepcion'
        + '&pDes=' + moment(data.from).format('YYYYMMDD')
        + '&pHas=' + moment(data.to).format('YYYYMMDD')
        + '&pUsr=' + window.localStorage.getItem('user');

      return $http.get(url).then(function (response) {
        return response.data;
      });

    }

    function setOrders(data) {

      var json = utilsService.xmlToJsonResponse(data);
      var orders = json.getRecepcionResponse.getRecepcionResult.diffgram.defaultDataSet.sQL;
      if (orders) {
        formatOrders(orders);
      }

    }

    function formatOrders(orders) {

      orders = utilsService.setResponseAsArray(orders);

      orders.forEach(function (order) {
        order.fecDesde = moment(order.fecDesde, 'YYYYMMDD');
        order.fecHasta = moment(order.fecHasta, 'YYYYMMDD');
        order.fecRecepcion = moment(order.fecRecepcion, 'YYYYMMDD');
        order.incomplete = parseInt(order.flgIncompleto);
        order.envelopeNumber = order.nroSobre;
      });

      service.orders = orders;

    }

    function editOrder(order) {
      service.selectedOrder = convertOrderToViewModel(order);
      $ionicTabsDelegate.select(0);
      service.getDoctors();
    }

    function convertOrderToViewModel(order) {

      var vm = {};
      vm.mobile = order.movilId;
      vm.date = order.id ? order.fecRecepcion : moment();
      vm.dateFrom = order.id ? order.fecDesde : moment().add(-4, 'days');
      vm.dateTo = order.id ? order.fecHasta : moment().add(-1, 'days');
      vm.reportsQuantity = parseInt(order.cantidad);
      vm.id = order.id;
      vm.title = vm.id ? "Edición de orden " + vm.id : "Nueva orden";
      vm.incomplete = order.flgIncompleto === "1";
      vm.envelopeNumber = parseInt(order.nroSobre);
      var favOperationalBase = window.localStorage.getItem('favoriteOperationalBase');
      vm.operationalBase = favOperationalBase || null;
      vm.doctor = order.personalId;
      return vm;

    }

    function generateNewOrder() {
      service.selectedOrder = convertOrderToViewModel({});
    }

    function getDoctors() {
      var url = URLS.orders
        + 'soap_method=GetPersonalMedico'
        + '&pMov=' + service.selectedOrder.mobile
        + '&pDes=' + moment(service.selectedOrder.dateFrom).format('YYYYMMDD')
        + '&pHas=' + moment(service.selectedOrder.dateTo).format('YYYYMMDD');

      $ionicLoading.show({
        template: 'Consultando médicos...'
      });

      $http.get(url).then(function (response) {
        parseGetDoctorsResult(response.data);
      })
        .finally(function () {
          $ionicLoading.hide();
        });
    }

    function parseGetDoctorsResult(data) {
      var json = utilsService.xmlToJsonResponse(data);
      var result = json.getPersonalMedicoResponse.getPersonalMedicoResult.diffgram.defaultDataSet.sQL;
      service.doctors = [];
      if (result) {
        result.forEach(function (doctor) {
          service.doctors.push({id: doctor.personalId, name: doctor.personalNombre});
        });
      }
    }

  }

}());
