(function() {

  'use strict';

  angular.module('star-wars')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
      name: 'Map',
      templateUrl: '/partials/map',
      controller: 'MapController',
      controllerAs: 'map',
      url: '/map'
    })
    .state({
      name: 'PHB',
      templateUrl: '/partials/phb',
      controller: 'PHBController',
      controllerAs: 'phb',
      url: '/phb'
    })
    .state({
      name: 'Settings',
      templateUrl: '/partials/settings',
      controller: 'SettingsController',
      controllerAs: 'settings',
      url: '/settings',
      admin: true
    })
    .state({
      name: 'Settings.Planets',
      templateUrl: '/partials/settings-planets',
      admin: true,
      url: '/settings-planets'
    })
    .state({
      name: 'Settings.Combat',
      templateUrl: '/partials/settings-combat',
      admin: true,
      url: '/settings-combat'
    })
    .state({
      name: 'Login',
      templateUrl: '/partials/login',
      controller: 'LoginController',
      controllerAs: 'login',
      url: '/login'
    })
    .state({
      name: 'Carousing',
      templateUrl: '/partials/carousing',
      controller: 'CarousingController',
      controllerAs: 'carousing',
      url: '/carousing'
    });

    $urlRouterProvider.otherwise('/phb');
  });
})();
