(function(){

  angular
  .module('internalMail.services')
  .factory('ordersService', ordersService);

  ordersService.$inject = [
    'URLS',
    'utilsService',
    '$http',
    '$ionicPopup'
  ];

  function ordersService(
    URLS,
    utilsService,
    $http,
    $ionicPopup
  ) {

    var service = {
      getOrders : getOrders,
      setOrders : setOrders,
      orders    : []
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


  }

}());
