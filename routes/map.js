var express = require('express');
var fs = require('fs');
var Schema = require('./services/schema-service');
var Planet = Schema.Planet;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('map', { title: 'Star Wars 5e Galaxy Map' });
});

router.post('/data', function(req, res, next) {
  var obj = {};
  Planet.find({ "active":true }).sort({"name":1}).exec(function(err, planets){
    if(err) return res.status(500).send(err);
    obj.nodes = planets;

    obj.links = [];
    obj.links = obj.links.concat(createLinks(obj.nodes));
    // console.log(obj);
    return res.send(obj);
  });
});

router.get('/planet/:name', function(req, res, next) {
  Planet.findOne({ "name":req.params.name }, function(err, p) {
    if(err) return res.send(err);
    return res.send(p);
  });
});

function createLinks(nodes) {
  var links = [];
  nodes.forEach(function(n) {
    findAllMatching(links, nodes, n)
    .forEach(function(nm) {
      links.push({
        "source": n.name,
        "target": nm.name,
        "distance": nm.distance,
        "id": n.name + ',' + nm.name
      });
    });
  });
  return links;
}

function findAllMatching(links, nodes, n) {
  var matching = [];
  n.hyperspace.forEach(function(hyp) {
    nodes.forEach(function(node) {
      if (node.name === hyp.planet &&
          n.name != node.name &&
          !containsDuplicate(links, n, node)) {
        node.distance = hyp.distance;
        matching.push(node);
      }
    });
  });
  return matching;
}

function containsDuplicate(links, n, node) {
  var val = false;
  links.some(function(link) {
    if ((link.source == n.name && link.target == node.name) ||
        (link.target == n.name && link.source == node.name)) {
      val = true;
      return true;
    }
  });
  return val;
}

module.exports = router;
