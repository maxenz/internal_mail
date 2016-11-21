(function(){

  angular
  .module('internalMail.services')
  .factory('ordersService', ordersService);

  ordersService.$inject = [
    'URLS',
    'utilsService',
    '$http',
    '$ionicPopup',
    '$ionicTabsDelegate'
  ];

  function ordersService(
    URLS,
    utilsService,
    $http,
    $ionicPopup,
    $ionicTabsDelegate
  ) {


    var service = {
      getOrders        : getOrders,
      setOrders        : setOrders,
      editOrder        : editOrder,
      generateNewOrder : generateNewOrder,
      orders           : []
    };

    return service;

    function getOrders(data) {

      var url = URLS.orders
      + 'soap_method=GetRecepcion'
      + '&pDes=' + moment(data.from).format('YYYYMMDD')
      + '&pHas=' + moment(data.to).format('YYYYMMDD')

      return $http.get(url).then(function(response) {
        return response.data;
      });

    }

    function setOrders(data) {

      var json   = utilsService.xmlToJsonResponse(data);
      var orders = json.getRecepcionResponse.getRecepcionResult.diffgram.defaultDataSet.sQL;
      if (orders) {
        formatOrders(orders);
      }

    }

    function formatOrders(orders) {

      orders = utilsService.setResponseAsArray(orders);

      orders.forEach(function(order){
        order.fecDesde = moment(order.fecDesde, 'YYYYMMDD');
        order.fecHasta = moment(order.fecHasta, 'YYYYMMDD');
        order.fecRecepcion = moment(order.fecRecepcion, 'YYYYMMDD');
      });

      service.orders = orders;

    }

    function editOrder(order) {

      $ionicTabsDelegate.select(0);
      service.selectedOrder = convertOrderToViewModel(order);

    }

    function convertOrderToViewModel(order) {

      var vm             = {};
      vm.mobile          = order.movilId;
      vm.date            = order.fecRecepcion;
      vm.dateFrom        = order.fecDesde;
      vm.dateTo          = order.fecHasta;
      vm.reportsQuantity = parseInt(order.cantidad);
      vm.id              = order.id;
      vm.title = vm.id ? "Edición de orden " + vm.id : "Nueva orden";
      return vm;

    }

    function generateNewOrder() {
      service.selectedOrder = convertOrderToViewModel({});
    }

  }

}());
