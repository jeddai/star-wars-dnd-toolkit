(function () {

  angular.module('star-wars')
  .controller('MapController', MapController);

  function MapController($scope, $http, $mdToast) {
    var vm = this;

    var main = document.getElementById('main'),
        svg = d3.select('svg'),
        width = parseInt(svg.attr('width')),
        height = parseInt(svg.attr('height')),
        aspect = width / height,
        transform = d3.zoomIdentity;

    vm.data = null;
    vm.groupings = ['hyperspace'];
    vm.groupBy = 'climate';
    vm.alignment = 'Republic';
    vm.safe = 'false';
    vm.getNewData = getNewData;
    vm.reloadGraph = forceDirectedGraph;
    vm.getDirections = getDirections;
    vm.getNodes = getNodes;

    getNewData();

    function getNewData() {
      $http.post('/map/data', {
        'groupings': vm.groupings
      })
      .then(function (res) {
        var data = res.data;
        data.nodes = data.nodes.filter(function(p) {
          return !p.known;
        });
        vm.data = data;
        forceDirectedGraph(data);
      });
    }

    function getNodes(query) {
      return vm.data.nodes.filter(function(p) {
        return p.name.toLowerCase().includes(query);
      });
    }

    function showToast(text) {
      $mdToast.show(
          $mdToast.simple()
          .textContent(text)
          .position('right top')
          .hideDelay(3000)
      );
    }

    var baseLineColor = '#aaa',
        highlightLineColor = '#777',
        mapLineColor = '#e00';

    function forceDirectedGraph(data) {

      var legend = d3.select("#legend")
      .html(legendHtml());

      if (!data) {
        return false;
      }
      svg.html('');
      var simulation = d3.forceSimulation()
      .force('link', d3.forceLink()
      .id(function (d) {
        return d.name;
      }).distance(function(p) {
        if(p.distance) return p.distance;
        else return 50;
      }))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

      var link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2)
      .attr('stroke', baseLineColor);

      var selectedLines = null;

      svg.on("click", function(p) {
        d3.selectAll("line")
        .attr('stroke-width', 2)
        .attr('stroke', baseLineColor);

        legend.html(legendHtml());
      });

      var node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', 7)
      .attr('fill', function (p) {
        move(p);
        if(vm.groupBy === 'climate') {
          return climateColors[p.climate];
        } else if(vm.groupBy === 'alignment') {
          if(typeof p.alignment !== 'object') return alignmentColors['None'];
          var mainAlignment = p.alignment[0];
          if(mainAlignment)
            return alignmentColors[mainAlignment];
          else
            return alignmentColors['None'];
        } else if(vm.groupBy === 'region') {
          return regionColors[p.region];
        }
      })
      .on('mouseover', highlight)
      .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

      function highlight(p) {
        $scope.$apply(function () {
          vm.highlighted = p;
        });

        if(selectedLines){
          selectedLines
          .attr('stroke-width', 2)
          .attr('stroke', baseLineColor);
        }

        var currCircle = this;
        selectedLines = d3.selectAll("line")
        .filter(function(line) {
          return getAttachedLinks(currCircle, line);
        })
        .attr('stroke-width', 3)
        .attr('stroke', highlightLineColor);

        legend.html(legendHtml(p));
      }

      function move(p) {
        p.x = getCoords(p.coordinates, 'x');
        p.y = getCoords(p.coordinates, 'y');
      }

      function getCoords(mapCoord, axis) {
        if(axis === 'x') return (mapCoord.charCodeAt(0) - 64) * 75;
        else if(axis === 'y') return (parseInt(mapCoord.slice(mapCoord.search('-')+1, 4))) * 75;
      }

      function getAttachedLinks(currCircle, line) {
        return (isClose(currCircle.cx.baseVal.value, line.target.x) && isClose(currCircle.cy.baseVal.value, line.target.y))
            || (isClose(currCircle.cx.baseVal.value, line.source.x) && isClose(currCircle.cy.baseVal.value, line.source.y));
      }

      function isClose(a, b) {
        return a + 5 > b && a - 5 < b;
      }

      svg.call(d3.zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", zoomed));

      node.append('title')
      .text(function (d) {
        return d.name;
      });

      simulation
      .nodes(data.nodes)
      .on('tick', ticked);

      simulation.force('link')
      .links(data.links);

      function ticked() {
        link
        .attr('x1', function (d) {
          return d.source.x;
        })
        .attr('y1', function (d) {
          return d.source.y;
        })
        .attr('x2', function (d) {
          return d.target.x;
        })
        .attr('y2', function (d) {
          return d.target.y;
        });

        node
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });
      }

      function zoomed() {
        link.attr('transform', d3.event.transform);
        node.attr('transform', d3.event.transform);
      }

      function dragstarted(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.3)
          .restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }

      function getPlanetTooltip(p) {
        var html = '';

        if(!!p.name) html += '<b>' + p.name + '</b><br/>';
        if(!!p.region) html += 'Region: ' + p.region;
        if(!!p.sector) html += '<br/>Sector: ' + p.sector;
        if(!!p.system) html += '<br/>System: ' + p.system;
        if(!!p.capital) html += '<br/>Capital: ' + p.capital;
        if(!!p.climate) html += '<br/>Climate: ' + p.climate;
        if(!!p.inhabitants) {
          html += '<br/>Inhabitants: ';
          p.inhabitants.forEach(function(inhab, i) {
            html += inhab;
            if(i != p.inhabitants.length - 1) html += ', ';
          });
        }
        if(!!p.coordinates) html += '<br/>Coordinates: ' + p.coordinates;

        return html;
      }

      function legendHtml(p) {
        var html = '';
        if(vm.groupBy === 'climate') {
          html += '<h5>Climates:</h5><ul>';
          for (var key in climateColors) {
            html += '<li style="color:' + climateColors[key] + ';">' + key
                + '</li>';
          }
          html += '</ul>';
        }
        if(vm.groupBy === 'alignment') {
          html += '<h5>Alignments:</h5><ul>';
          for (var key in alignmentColors) {
            html += '<li style="color:' + alignmentColors[key] + ';">' + key
                + '</li>';
          }
          html += '</ul>';
        }
        if(p) {
          html += '<h5>Highlighted Planet:</h5>';
          html += '<div style="text-align:center;">';
          html += '<div>';
          html += getPlanetTooltip(p);
          html += '</div>';
          html += '<i><small>Click anywhere on the map to deselect</small></i>';
          html += '</div>';
        }
        return html;
      }

      function redraw(){

        if(main.clientHeight < main.clientWidth)
          svg.attr("width", main.clientWidth)
          .attr("height", main.clientWidth);
        else
          svg.attr("width", main.clientHeight)
          .attr("height", main.clientHeight);
      }

      // Draw for the first time to initialize.
      redraw();

      // Redraw based on the new size whenever the browser window is resized.
      window.addEventListener("resize", redraw);
    }

    function getDirections(p1, p2) {
      var sp = new ShortestPathCalculator(vm.data.nodes, vm.data.links, vm.safe === 'true', vm.alignment);
      if(!p1 || !p2) {
        showToast('Please enter valid planet names');
        return;
      }
      d3.selectAll("line").attr('stroke-width', 2)
      .attr('stroke', baseLineColor);
      path = sp.findRoute(p1, p2);
      path.distance = findDistance(path.path);
      if(path.mesg === 'OK') {
        vm.path = path;
        path = path.path;
        vm.error = '';
      } else {
        vm.path = {};
        showToast(path.mesg);
      }
      d3.selectAll("line")
      .filter(function(line) {
        for(var i = 0; i < path.length; i++) {
          if(line.id.includes(path[i].source) && line.id.includes(path[i].target))
            return true;
        }
        return false;
        // return line.source.name === p1 || line.target.name === p1 || line.source.name === p2 || line.target.name === p2;
      })
      .attr('stroke', mapLineColor);
    }

    function findDistance(path) {
      var dist = 0;
      if(typeof path === 'object' && !!path)
        path.forEach(function(p) {
          var arr = angular.copy(vm.data.links);
          arr = arr.filter(function(link) {
            return link.id.includes(p.source) && link.id.includes(p.target);
          });
          dist += arr[0].distance;
        });
      return dist;
    }
  }
})();
