(function() {
  angular.module('star-wars', ['ngMaterial', 'ngAria', 'ngAnimate', 'ui.router'])
  .config(function($mdThemingProvider, $compileProvider, $mdIconProvider){
    $mdThemingProvider.theme('default')
    .primaryPalette('red')
    .accentPalette('blue');

    $compileProvider.debugInfoEnabled(false);

    $mdIconProvider
    .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
    .iconSet('core', 'img/icons/sets/core-icons.svg', 24);
  });
})();
