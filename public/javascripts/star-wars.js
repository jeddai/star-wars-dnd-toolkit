String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

function random(number) {
  return Math.floor(Math.random() * number);
}

function randomChance(chance) {
  return Math.random() < chance;
}

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
