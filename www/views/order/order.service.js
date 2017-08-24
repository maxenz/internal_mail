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
      parseReportsQuantityResult : parseReportsQuantityResult,
      getOperationalBases        : getOperationalBases,
      parseOperationalBasesResult: parseOperationalBasesResult,
      operationalBasesTries      : 0
    };

    return service;

    function createOrder() {

      var data = ordersService.selectedOrder;

      // Si es 0, es creacion. Si tiene id, es edicion.
      if (!data.id) data.id = 0;

      var url = URLS.orders
      + 'soap_method=SetRecepcionV2'
      + '&pId='  + data.id
      + '&pMov=' + data.mobile
      + '&pFec=' + moment(data.date).format('YYYYMMDD')
      + '&pDes=' + moment(data.dateFrom).format('YYYYMMDD')
      + '&pHas=' + moment(data.dateTo).format('YYYYMMDD')
      + '&pCnt=' + data.reportsQuantity
      + '&pIcp=' + +data.incomplete
      + '&pSob=' + data.envelopeNumber
      + '&pBas=' + data.operationalBase
      + '&pUsr=' + window.localStorage.getItem("user");

      window.localStorage.setItem('favoriteOperationalBase', data.operationalBase);

      return $http.post(url).then(function(response) {
        return response.data;
      });

    }

    function parseOrderResult(data) {
      var json                = utilsService.xmlToJsonResponse(data);
      var result              = json.setRecepcionV2Response.setRecepcionV2Result.diffgram.defaultDataSet.sQL;
      return result;
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
      + '&pHas=' + moment(data.dateTo).format('YYYYMMDD');

      return $http.get(url).then(function(response) {
        return response.data;
      });
    }

    function parseReportsQuantityResult(data) {
      var json   = utilsService.xmlToJsonResponse(data);
      var result = json.getCantidadResponse.getCantidadResult.diffgram.defaultDataSet.sQL;
      return parseInt(result.cantidad);
    }

    function getOperationalBases(showMessage) {
      var url = URLS.orders
      + 'soap_method=GetBasesOperativas';

      $http
        .get(url)
        .then((response) => handlerOkGetOperationalBases(response,showMessage), handlerErrorGetOperationalBases);
    }

    function handlerOkGetOperationalBases(response, showMessage) {
      var operationalBases = parseOperationalBasesResult(response.data);
      window.localStorage.setObject('operationalBases', operationalBases);
      if (showMessage) {
        utilsService.showAlert("Actualización exitosa!", "Las bases operativas fueron actualizadas correctamente.");
      }
    }

    function handlerErrorGetOperationalBases(response) {
      service.operationalBasesTries++;
      if (service.operationalBasesTries > 2) {
        utilsService.showAlert('Error!', 'No se pudieron obtener las bases operativas. Reingrese a la aplicación.');
      } else {
        getOperationalBases();
      }

    }

    function parseOperationalBasesResult(data) {
      var json   = utilsService.xmlToJsonResponse(data);
      var result = json.getBasesOperativasResponse.getBasesOperativasResult.diffgram.defaultDataSet.sQL;
      return result;
    }

  }

}());
