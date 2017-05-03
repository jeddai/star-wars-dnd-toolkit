(function() {

  'use strict';

  angular.module('star-wars')
  .controller('LoginController', loginController);

  function loginController($http, $state) {
    var vm = this;

    vm.login = login;

    function login(pass) {
      $http.post('/settings/login', {password:pass})
      .then(function(res) {
        if(res.data) {
          $state.go('Settings');
        }
        else {

        }
      });
    }
  }

})();