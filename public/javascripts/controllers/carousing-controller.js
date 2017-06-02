(function() {

  'use strict';

  angular.module('star-wars')
  .controller('CarousingController', carousingController);

  function carousingController(CarousingRolls) {
    var vm = this;

    vm.roll = roll;
    vm.updatePlayers = updatePlayers;

    vm.numPlayers = 1;
    vm.players = ["Player 1"];
    vm.res = [];

    function roll() {
      vm.res.push(getCarousingResult());
    }

    function getCarousingResult() {
      var randomNumber = Math.floor((Math.random() * CarousingRolls[vm.numPlayers].length));
      var result = CarousingRolls[vm.numPlayers][randomNumber];
      if(vm.numPlayers !== 1) {
        var arr = shuffle(angular.copy(vm.players));
        for(var i = 1; i <= vm.numPlayers; i++) {
          result = result.replaceAll("&" + i, arr[i - 1]);
        }
      }
      return {
        "result":result,
        "resultNumber":randomNumber,
        "maxNumber": CarousingRolls[vm.numPlayers].length,
        "timestamp": new Date()
      };
    }

    function updatePlayers() {
      if(vm.players.length < vm.numPlayers) {
        for(var i = vm.players.length + 1; i <= vm.numPlayers; i++) {
          vm.players.push("Player " + i);
        }
      } else if(vm.players.length > vm.numPlayers) {
        vm.players.splice(vm.numPlayers, vm.players.length);
      }
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  }
})();