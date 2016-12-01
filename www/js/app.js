// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('internalMail', [
  'ionic',
  'internalMail.controllers',
  'internalMail.services',
  'internalMail.directives',
  'ngCordova',
  'angularMoment',
  'chart.js',
  'ionic-datepicker',
  'ngMessages'
])

.run(function($ionicPlatform, loginService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  loginService.loadUserCredentials();

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, ionicDatePickerProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  var datePickerObj = {
    inputDate: new Date(),
    setLabel: 'Ok',
    todayLabel: 'Hoy',
    closeLabel: 'Cerrar',
    mondayFirst: false,
    weeksList: ["D", "L", "M", "M", "J", "V", "S"],
    monthsList: ["Ene", "Feb", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Ago", "Sept", "Oct", "Nov", "Dic"],
    templateType: 'popup',
    showTodayButton: true,
    to : new Date(),
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: false
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'views/tabs.html',
    controller: 'TabsCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.orders', {
    url: '/orders',
    views: {
      'orders': {
        templateUrl: 'views/orders/orders.template.html',
        controller: 'OrdersCtrl as ordersCtrl'
      }
    }
  })

  .state('tab.order', {
    url: '/order',
    views: {
      'order': {
        templateUrl: 'views/order/order.template.html',
        controller: 'OrderCtrl as orderCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'settings': {
        templateUrl: 'views/settings/settings.template.html',
        controller: 'SettingsCtrl as settingsCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'views/login/login.template.html',
    controller: 'LoginCtrl as loginCtrl'
  });

  // .state('tab.monitors-details', {
  //   url: '/monitors/:monitorId',
  //   views: {
  //     'monitors': {
  //       templateUrl: 'views/monitors/detail/monitor-detail.template.html',
  //       controller: 'MonitorDetailCtrl',
  //       controllerAs : 'monitorDetailCtrl',
  //       resolve: {
  //         _mobileTypes : function(monitorService) {
  //           return monitorService.getMobileTypes();
  //         }
  //       }
  //     }
  //   }
  // })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/orders');

});
