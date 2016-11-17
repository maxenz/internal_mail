(function(){

  angular
  .module('internalMail')
  .constant('URLS', {
    orders        : 'http://paramedicapps.com.ar:57772/csp/shaman/WebServices.IncOrdenesRecepcion.cls?',
    login         : 'http://paramedicapps.com.ar:57773/csp/shaman/WebServices.WebApps.cls?',
    gestion       : 'http://paramedicapps.com.ar:57771/'
  })
  .constant('ERRORS', {
    mustEnterLicense                : 'Debe ingresar la licencia.',
    genericUrlProcess               : 'Hubo un error en la generación de la url. Vuelva a intentarlo luego.',
    incorrectData                   : 'Los datos son incorrectos. Por favor, ingréselos nuevamente.',
    genericConnectionError          : 'Hubo un error en la conexión. Vuelva a intentarlo luego.',
    noUrl                           : 'La url de la aplicación no fue generada',
    mustEnterUserAndPassword        : 'Debe ingresar usuario y password.',
    dateFromMustBeSmallerThanDateTo : 'La fecha desde debe ser menor o igual a la fecha hasta.',
    mustCompleteDateFrom            : 'Debe completar la fecha desde',
    receptionDateMustBeGreatherThan : 'La fecha de recepción de la orden debe ser superior a las fechas desde/hasta'
  })

})();
