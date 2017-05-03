(function() {

  'use strict';

  angular.module('star-wars')
  .controller('NavController', navController);

  function navController($state, $mdSidenav, AuthService) {
    var vm = this;

    vm.auth = AuthService;
    vm.go = go;
    vm.toggleNav = toggleNav;

    function go(state) {
      $state.go(state);
      toggleNav();
    }

    function toggleNav() {
      $mdSidenav('left').toggle();
    }
  }
})();