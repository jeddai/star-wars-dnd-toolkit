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
      var i = 0;
      var randomNumber = Math.floor((Math.random() * CarousingRolls[vm.numPlayers].length));
      var result = CarousingRolls[vm.numPlayers][randomNumber];
      if(vm.numPlayers !== 1) {
        var arr = shuffle(angular.copy(vm.players));
        for(i = 1; i <= vm.numPlayers; i++) {
          result = result.replaceAll("&" + i, arr[i - 1]);
        }
      }
      if(result.search("{") !== -1) {
        var matches = result.match(/{[^}]*}/);
        for(i = 0; i < matches.length; i++) {
          var val = matches[i].substr(1,matches[i].length-2);
          if(val.search("return") !== -1) {
            var func = new Function(val);
            result = result.replace(matches[i], func());
          }
          else {
            result = result.replace(matches[i], eval(val));
          }
        }
      }
      if(result.search("~") !== -1) {
        var die = result.match(/~(.*?)~/);
        var numberOfDice = parseInt(die[1].match(/^(.*?)d/)[1]);
        var maxNumber = parseInt(die[1].match(/d(.*)/)[1]);
        result = result.replace(/~(.*?)~/, rollDice(numberOfDice, maxNumber));
      }
      return {
        "result":result,
        "resultNumber": randomNumber + 1,
        "maxNumber": CarousingRolls[vm.numPlayers].length,
        "timestamp": new Date()
      };
    }

    function rollDice(dice, number) {
      var total = 0;
      if(dice <= 10) {
        for(var i = 0; i < dice; i++) {
          total += Math.floor((Math.random() * number) + 1);
        }
      }
      else {
        total = Math.floor(((Math.random() * number) + 1) * dice);
      }
      return total;
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