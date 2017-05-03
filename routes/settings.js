var express = require('express');
var jwt = require('./services/jwt-service');
var schema = require('./services/schema-service');
var Planet = schema.Planet;
var Scene = schema.Scene;
var Combatant = schema.Combatant;
var router = express.Router();

router.post('/login', function(req, res, next) {
  if(req.body.password === process.env.admin) {
    res.cookie('jwt', jwt.generate());
    return res.send(true);
  } else {
    return res.send(false);
  }
});

router.get('/decode', function(req, res, next) {
  if(!req.cookies['jwt']) return res.send({ data: { username: 'Invalid' } });
  res.cookie('jwt', jwt.verify(req.cookies['jwt']), {
    maxAge: 1800000
  });
  return res.send(jwt.decode(req.cookies['jwt']));
});

router.get('/verify', function(req, res, next) {
  var new_token = jwt.verify(req.cookies['jwt']);
  if (!!new_token.error) {
    return res.send(false);
  }
  res.cookie('jwt', new_token, {
    maxAge: 1800000
  });
  return res.send(!!new_token);
});

router.all('*', function (req, res, next) {
  var token = jwt.verify(req.cookies['jwt']);
  if (!!token.error) {
    return res.send('Invalid JSON Web Token'); // next({status: 500, message: 'Invalid Json Web Token', stack: JSON.stringify(jwt)});
  } else {
    var username = jwt.decode(token).data.username;
    if(username !== 'Admin') {
      return res.send('You are not an administrator.');
    }
    res.cookie('jwt', token, {
      maxAge: 1800000
    });
  }
  next();
});

/*
 * Planets
 */
router.get('/planets', function(req, res, next) {
  Planet.find({}, function(err, planets) {
    if(err) return res.status(500).send('Error Getting Planets');

    return res.send(planets);
  });
});

router.post('/add-planet-many', function(req, res, next) {
  if(req.body.pass !== schema.options.pass) return res.status(500).send('Not authorized');
  var planets = req.body.planets;
  Planet.collection.insert(planets, function(err, planets) {
    if(err) return res.status(500).send(err);
    return res.send('OK');
  });
});

router.post('/update-planet', function(req, res, next) {
  Planet.findOne({ "name":req.body.name }, function(err, p) {
    if(err) return res.status(500).send(err);
    if(!p) {
      var newPlanet = req.body;
      newPlanet.active = false;
      newPlanet = new Planet(newPlanet);
      newPlanet.save(function(err, p) {
        if(err) return res.status(500).send(err);
        return res.send(p);
      });
    }
    else  {
      Planet.findOneAndUpdate({ "name":req.body.name }, req.body, function(err, p) {
        if(err) return res.status(500).send(err);
        return res.send(req.body);
      });
    }
  });

});

router.post('/delete-planet', function(req, res, next) {
  Planet.findOneAndRemove({ "name":req.body.name }, function(err, p) {
    if(err) return res.status(500).send(err);
    return res.send(p);
  });
});

/*
 * Scenes
 */
router.get('/scenes', function(req, res, next) {
  Scene.find({}, function(err, scenes) {
    if(err) return res.status(500).send(err);
    return res.send(scenes);
  });
});

router.get('/scene/:scene', function(req, res, next) {
  Scene.findOne({ "name":req.params.scene }, function(err, scene) {
    if(err) return res.status(500).send(err);
    return res.send(scene);
  });
});

router.post('/update-scene', function(req, res, next) {
  Scene.findOne({ "name":req.body.name }, function(err, scene) {
    if(err) return res.status(500).send(err);
    if(!scene) {
      var newScene = new Scene(req.body);
      newScene.save(function(err, scene) {
        if(err) return res.status(500).send(err);
        return res.send(scene);
      })
    }
    else {
      Scene.findOneAndUpdate({ "name":req.body.name }, req.body, function(err, s) {
        if(err) return res.status(500).send(err);
        return res.send(req.body);
      });
    }
  });
});

router.post('/delete-scene', function(req, res, next) {
  Scene.findOneAndRemove({ "name":req.body.name }, function(err, s) {
    if(err) return res.status(500).send(err);
    return res.send(s);
  });
});

module.exports = router;
