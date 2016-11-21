(function(){

  angular
  .module('internalMail.services')
  .factory('orderService', orderService);

  orderService.$inject = [
    'URLS',
    'utilsService',
    '$http',
    '$ionicPopup',
    'ordersService'
  ];

  function orderService(
    URLS,
    utilsService,
    $http,
    $ionicPopup,
    ordersService
  ) {

    var service = {
      createOrder                : createOrder,
      parseOrderResult           : parseOrderResult,
      getReportsQuantity         : getReportsQuantity,
      parseReportsQuantityResult : parseReportsQuantityResult
    };

    return service;

    function createOrder() {

      var data = ordersService.selectedOrder;

      // Si es 0, es creacion. Si tiene id, es edicion.
      if (!data.id) data.id = 0;

      var url = URLS.orders
      + 'soap_method=SetRecepcion'
      + '&pMov=' + data.mobile
      + '&pFec=' + moment(data.date).format('YYYYMMDD')
      + '&pDes=' + moment(data.dateFrom).format('YYYYMMDD')
      + '&pHas=' + moment(data.dateTo).format('YYYYMMDD')
      + '&pCnt=' + data.reportsQuantity
      + '&pUsr=' + 3

      // --> [TODO]Cuando haga bien lo de login, cambiar pUsr

      return $http.post(url).then(function(response) {
        return response.data;
      });

    }

    function parseOrderResult(data) {
      var json                = utilsService.xmlToJsonResponse(data);
      var result              = json.setRecepcionResponse.setRecepcionResult.diffgram.defaultDataSet.sQL;
      return result;
    }

    function getOrder(data) {

      var url = URLS.orders
      + 'soap_method=GetRecepcion'
      + '&pDes=' + moment(data.from).format('YYYYMMDD')
      + '&pHas=' + moment(data.to).format('YYYYMMDD')

      return $http.get(url).then(function(response) {
        return response.data;
      });

    }

    function setOrder(data) {

      var json                = utilsService.xmlToJsonResponse(data);
      var orders              = json.getRecepcionResponse.getRecepcionResult.diffgram.defaultDataSet.sQL;
      formatOrders(orders);
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

    function getReportsQuantity(data) {
      var url = URLS.orders
      + 'soap_method=GetCantidad'
      + '&pMov=' + data.mobile
      + '&pDes=' + moment(data.dateFrom).format('YYYYMMDD')
      + '&pHas=' + moment(data.dateTo).format('YYYYMMDD')

      return $http.get(url).then(function(response) {
        return response.data;
      });
    }

    function parseReportsQuantityResult(data) {
      var json   = utilsService.xmlToJsonResponse(data);
      var result = json.getCantidadResponse.getCantidadResult.diffgram.defaultDataSet.sQL;
      return parseInt(result.cantidad);
    }


  }

}());