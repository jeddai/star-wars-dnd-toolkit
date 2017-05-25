(function(climates) {

  'use strict';

  angular.module('star-wars')
  .controller('SettingsController', settingsController);

  function settingsController($state, $http, $mdToast, $mdDialog) {
    var vm = this;

    vm.currentNavItem = window.location.hash.substr(window.location.hash.search('-') + 1);
    var planets = [];
    vm.planets = [];
    vm.selected = null;
    vm.climates = climates;
    vm.scenes = [];
    vm.scene = null;
    vm.activeCombatant = -1;
    vm.lowerHP = 0;
    vm.goTo = goTo;
    vm.edit = edit;
    vm.clearForm = clearForm;
    vm.next = next;
    vm.doDamage = doDamage;
    vm.pushEmpty = pushEmpty;

    vm.filterPlanets = filterPlanets;
    vm.updatePlanet = updatePlanet;
    vm.destroyPlanet = destroyPlanet;

    vm.getScene = getScene;
    vm.updateScene = updateScene;
    vm.destroyScene = destroyScene;
    vm.destroyCombatant = destroyCombatant;
    vm.newCombatant = newCombatant();

    getPlanets();
    getScenes();

    function goTo(place) {
      vm.selected = null;
      vm.scene = null;
      $state.go(place);
    }

    function toast(text) {
      $mdToast.show(
          $mdToast.simple()
          .textContent(text)
          .position('right top')
          .hideDelay(2000)
      );
    }

    function edit(val) {
      vm.selected = val;
    }

    function clearForm() {
      vm.selected = {};
    }

    function next() {
      vm.activeCombatant += 1;
      if(vm.activeCombatant >= vm.scene.combatants.length) vm.activeCombatant = 0;
    }

    function doDamage() {
      var lower = vm.lowerHP;
      var remaining = 0;
      if(vm.selected.sp > 0) {
        remaining = vm.selected.sp - lower;
        if(remaining < 0) {
          vm.selected.hp += remaining;
          vm.selected.sp = 0;
        } else {
          vm.selected.sp -= lower;
        }

      } else {
        vm.selected.hp -= lower;
      }
    }

    function pushEmpty(val) {
      if(typeof vm.selected[val] !== 'object') {
        vm.selected[val] = [];
      }
      vm.selected[val].push('');
    }

    function getPlanets() {
      $http.get('/settings/planets')
      .then(function(res) {
        planets = res.data;
        vm.planets = planets;
        vm.planets.sort(function(a, b) {
          if(a.name < b.name) return -1;
          if(a.name > b.name) return 1;
          return 0;
        });
      }, function(res) {});
    }

    function filterPlanets() {
      vm.planets = planets.filter(function(p) {
        return p.name.toLowerCase().search(vm.filter) != -1;
      });
    }

    function updatePlanet(planet) {
      $http.post('/settings/update-planet', planet)
      .then(function(res) {
        getPlanets();
        toast(planet.name + ' updated or inserted.');
      }, function(res) {
        toast('Error updating ' + planet.name);
      });
    }

    function destroyPlanet(planet) {
      confirmDelete(planet.name, function() {
        $http.post('/settings/delete-planet', planet)
        .then(function(res) {
          getPlanets();
          toast('Deleted ' + res.data.name);
        }, function(res) {
          var err = res.data;
          var message = err.message + ': ';
          for(var key in err.errors) {
            message += err.errors[key].message;
          }
          toast(message);
        });
      });
    }

    /*
     * Scenes
     */
    function getScenes() {
      $http.get('/settings/scenes')
      .then(function(res) {
        vm.scenes = res.data;
      }, function(res) {});
    }

    function getScene(name) {
      $http.get('/settings/scene/' + name)
      .then(function(res) {
        vm.scene = res.data;
        delete vm.scene._id;
        delete vm.scene.__v;
        vm.selected = null;
        vm.activeCombatant = -1;
      }, function(res) {});
    }

    function updateScene() {
      $http.post('/settings/update-scene', vm.scene)
      .then(function(res) {
        vm.scene = res.data;
        getScenes();
        toast('Updated or inserted scene');
      }, function(res) {});
    }

    function destroyScene(scene) {
      confirmDelete(scene.name, function() {
        $http.post('/settings/delete-scene', scene)
        .then(function(res) {
          vm.scene = null;
          getScenes();
          toast('Scene deleted');
        }, function(res) {});
      });
    }

    function destroyCombatant(combatant) {
      var index = 0;
      for(index = 0; index < vm.scene.combatants.length; index++) {
        if(vm.scene.combatants[index].name === combatant.name) break;
      }
      confirmDelete(vm.scene.combatants[index].name, function() {
        vm.scene.combatants.splice(index, 1);
        vm.selected = null;
      });
    }

    function newCombatant() {
      vm.scene.combatants.push({ initiative: 0 });
      vm.activeCombatant = vm.scene.combatants[vm.scene.combatants.length - 1];
    }

    function confirmDelete(obj, callback) {
      $mdDialog.show(
          $mdDialog.confirm()
          .title('Confirm Deletion')
          .textContent('Are you sure you want to delete ' + obj + '?')
          .ok('Yes')
          .cancel('No')
      ).then(callback, function(){});
    }
  }

})(climates);