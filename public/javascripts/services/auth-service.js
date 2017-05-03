(function() {

  'use strict';

  angular.module('star-wars')
  .service('AuthService', authService);

  function authService($rootScope, $http, $state) {
    var service = this;

    service.loggedIn = false;
    service.verify = verify;
    service.login = login;
    service.tokenCheck = tokenCheck;

    function verify() {
      return $http.get('/settings/verify')
      .then(function(res) {
        if(!res.data) {
          $state.go('Login');
        }
        return service.loggedIn = res.data;
      });
    }

    function login(user) {
      $http.post('/settings/login', user)
      .then(function(res) {
        verify();
        $state.go('Dashboard');
      }, function(err) {
        console.log(err);
      });
    }

    function tokenCheck(res) {
      if(res.data == 'Invalid JSON Web Token') {
        $state.go('Login');
      }
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if(toState.admin) {
        $http.get('/settings/decode')
        .then(function(res) {
          if(!res.data || res.data.data.username !== 'Admin') {
            $state.go('Login');
          }
        });
      }
    });
  }
})();
